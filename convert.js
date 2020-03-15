const axios = require("axios");

const FormData = require("form-data");
var fs = require("fs");
var path = require("path");

function main() {
  try {
    const form_data = new FormData();
    form_data.append(
      "file",
      fs.createReadStream(path.join(__dirname, "input.pptx"))
    );

    const request_config = {
      headers: {
        ...form_data.getHeaders()
      }
    };

    const ws = fs.createWriteStream(path.resolve(__dirname, "hello.pdf"));

    axios
      .get("http://localhost:8080/file", form_data, request_config)
      .then(resp => {
        console.log(resp);
        ws.write(resp.data);
      });
  } catch (e) {
    console.log(e);
  }
}

main();
