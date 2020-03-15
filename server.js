const express = require("express");
var multer = require("multer");
var upload = multer({ dest: "uploads/" });
var fs = require("fs");
var path = require("path");

const app = express();

app.get("/file", function(req, res) {
  res.sendFile(
    "/home/jacksparow/Desktop/workspace/docx-pdf/uploads/a7bfd4d56b02d810a2909869f2a5cefe.pdf"
  );
});

app.listen(8080, () => {
  console.log("server up");
});
