var http = require("http");
var fs = require("fs");
var path = require("path");

var download = function(url, dest, cb) {
  var file = fs.createWriteStream(path.resolve(__dirname, dest));
  http
    .get(url, function(response) {
      response.pipe(file);
      file.on("finish", function() {
        file.close(cb); // close() is async, call cb after close completes.
      });
    })
    .on("error", function(err) {
      console.log(err);
      fs.unlink(dest); // Delete the file async. (But we don't check the result)
      if (cb) cb(err.message);
    });
};

download("http://localhost/unoconv/pdf", "maria.pdf", err => {
  console.log(err);
});
