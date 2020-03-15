var PizZip = require("pizzip");
var Docxtemplater = require("docxtemplater");
const FormData = require("form-data");
const http = require("http");

var fs = require("fs");
var path = require("path");

// The error object contains additional information when logged with JSON.stringify (it contains a properties object containing all suberrors).
function replaceErrors(key, value) {
  if (value instanceof Error) {
    return Object.getOwnPropertyNames(value).reduce(function(error, key) {
      error[key] = value[key];
      return error;
    }, {});
  }
  return value;
}

function errorHandler(error) {
  console.log(JSON.stringify({ error: error }, replaceErrors));

  if (error.properties && error.properties.errors instanceof Array) {
    const errorMessages = error.properties.errors
      .map(function(error) {
        return error.properties.explanation;
      })
      .join("\n");
    console.log("errorMessages", errorMessages);
    // errorMessages is a humanly readable message looking like this :
    // 'The tag beginning with "foobar" is unopened'
  }
  throw error;
}

//Load the docx file as a binary
var content = fs.readFileSync(path.resolve(__dirname, "input.pptx"), "binary");

var zip = new PizZip(content);
var doc;
try {
  doc = new Docxtemplater(zip);
} catch (error) {
  // Catch compilation errors (errors caused by the compilation of the template : misplaced tags)
  errorHandler(error);
}

//set the templateVariables
doc.setData({
  msg: "Hello world"
});

try {
  // render the document (replace all occurences of {first_name} by John, {last_name} by Doe, ...)
  doc.render();
} catch (error) {
  // Catch rendering errors (errors relating to the rendering of the template : angularParser throws an error)
  errorHandler(error);
}

var buf = doc.getZip().generate({ type: "nodebuffer" });

fs.writeFileSync(path.join(__dirname, "out.pptx"), buf);

const form = new FormData();

form.append("file", fs.createReadStream(path.join(__dirname, "out.pptx")));

var request = http.request({
  method: "post",
  path: "/unoconv/pdf",
  headers: form.getHeaders()
});

form.pipe(request);

//OUT!
var file = fs.createWriteStream(path.resolve(__dirname, "out.pdf"));

request.on("response", function(response) {
  console.log(response);
  response.pipe(file);
  file.on("finish", function() {
    file.close(() => {
      console.log("done");
    }); // close() is async, call cb after close completes.
  });
});
