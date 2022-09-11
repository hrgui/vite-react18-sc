import * as fs from "fs";
import * as path from "path";
import * as url from "url";
import express from "express";

const __dirname = url.fileURLToPath(new URL(".", import.meta.url));

const port = process.env.PORT || 3000;
const template = fs.readFileSync(path.resolve(path.join(__dirname, "../index.html")), "utf-8");

async function createServer() {
  const app = express();
  app.use(express.static(path.join(__dirname, "../client")));

  app.use("*", async (req, res) => {
    const render = (await import("./entry-server.mjs")).render;
    return render(req, res, template);
  });

  app.listen(port, () => {
    console.log(`server started at port ${port}`);
  });
}

createServer();
