const { exec } = require("child_process");

exec(
  "unoconv -f pdf uploads/a7bfd4d56b02d810a2909869f2a5cefe.pptx",
  (error, stdout, stderr) => {
    if (error) {
      console.log(`error: ${error.message}`);
      return;
    }
    if (stderr) {
      console.log(`stderr: ${stderr}`);
      return;
    }
    console.log(`stdout: ${stdout}`);
  }
);
