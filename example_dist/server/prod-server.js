const fs = require("fs");
const path = require("path");
const express = require("express");

const template = fs.readFileSync(path.resolve("../index.html"), "utf-8");

async function createServer() {
  const app = express();

  console.log(path.join(__dirname, "../client"));
  app.use(express.static(path.join(__dirname, "../client")));

  app.use("*", async (req, res) => {
    const render = (await import("./entry-server.js")).render;
    return render(req, res, template);
  });

  app.listen(3000);
}

createServer();
