// process.stdin.pipe(process.stdout)

const fs = require("fs");
const path = require("path");
const http = require("http");

const targetFileName = path.resolve(__dirname, "test.txt");

const readStream = fs.createReadStream(targetFileName);

const server = http.createServer((req, res) => {
  if (req.method === "POST") {
    req.pipe(res);
  }

  if (req.method === "GET") {
    readStream.pipe(res);
  }
});

server.listen(8000, () => {
  console.log("server start");
});
