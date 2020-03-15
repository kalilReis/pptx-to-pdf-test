const http = require("http");
const FormData = require("form-data");
var fs = require("fs");
var path = require("path");

const form = new FormData();
form.append("file", fs.createReadStream(path.join(__dirname, "input.pptx")));

var request = http.request({
  method: "post",
  path: "/unoconv/pdf",
  headers: form.getHeaders()
});

form.pipe(request);

var file = fs.createWriteStream(path.resolve(__dirname, "oi.pdf"));

request.on("response", function(response) {
  response.pipe(file);
  file.on("finish", function() {
    file.close(cb); // close() is async, call cb after close completes.
  });
});
