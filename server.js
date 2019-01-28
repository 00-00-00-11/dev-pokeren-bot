// server.js
const http = require("http");
const app = require("./app.js");
const dotenv = require("dotenv").config();

const port = process.env.PORT || 3000;

const server = http.createServer(app);

server.listen(port);
server.on("listening", function() {
  console.log("Express server listening at http://localhost:" + port);
});
