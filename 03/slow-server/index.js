const http = require("node:http");

const server = new http.Server();

server.on("request", (req, res) => {
  setTimeout(() => res.end("Hello from slow server"), 5_000);
});

server.listen(8080);
