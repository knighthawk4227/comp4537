import http from "node:http";       // ✓ default import: the whole module
// need config to allow it to set variables
import "dotenv/config";   // loads .env as a side effect, no function call needed
import { Utils } from "./modules/utils.js";
import { MESSAGES } from "./lang/messages/en/user.js";
import fs from 'node:fs/promises';
import path from "node:path";

class Server {
  constructor(port, containerHost) {
    this.port = port;
    this.containerHost = containerHost;
    // get dir for userInput
    this.dir = path.join(import.meta.dirname, "userInput");

  }

  handleRequest(req, res) {
    // Compines path with main url and then allows us to parse it
    const url = new URL(req.url, `http://${req.headers.host}`);

    // only get requests allowed. Even for the setting of file data which is lowkey a post IMO but hey man
    if (req.method !== "GET") {
      // 405 is forbidden
      this.send(res, 405 ,"text/plain", "There is only get here RAAAA");
      return;
    }

    if (url.pathname === "/getDate" || url.pathname === "/getDate/") {
      this.handleGetDate(url, res);

    } else if (url.pathname === "/writeFile" || url.pathname === "/writeFile/") {
      this.handleWriteFile(url, res);
      console.log("file writer called")

      // needs a file after second/ so only /
      // since no ? needs to check
    } else if (url.pathname.startsWith("/readFile/")) {
      this.handleReadFile(url, res);
      console.log("reading file")

    } else if (url.pathname === "/") {
      this.send(res, 200, "text/plain", `${MESSAGES.FIX}`);

    } else {
      this.send(res, 404, "text/plain", MESSAGES.BAD);
    }
  }

  async handleReadFile(url, res) {
    let file;

    try {
      // slice after second /
      file = decodeURIComponent(url.pathname.slice('/readFile/'.length));
    } catch {
      this.send(res, 400, "text/plain", "Invalid filename");
      return;
    }

    if (!file || file === '..' || path.basename(file) !== file) {
      this.send(res, 400, "text/plain", "Invalid Filename");
      return;
    }

    try {
      const data = await fs.readFile(path.join(this.dir, file), { encoding: 'utf-8' });
      this.send(res, 200, "text/plain", data);
    } catch (err) {
      if (err.code === "ENOENT") {
        this.send(res, 404, "text/plain", MESSAGES.UNABLE.replace('%1', file));
      } else {
        console.error(err)
        this.send(res, 500, "text/plain", MESSAGES.BAD);
      }
    }
  }

  async handleWriteFile(url, res) {
    const text = url.searchParams.get("text");

    if (!text) {
      this.send(res, 400, "text/plain", "Missing 'text' param");
      return;
    }

    try {
      await fs.mkdir(this.dir, { recursive: true });
      await fs.appendFile(path.join(this.dir, "file.txt"), text + '\n');
      this.send(res, 200, "text/plain", MESSAGES.WRITE);
    } catch (err) {
      this.send(res, 500, "text/plain", MESSAGES.BAD);
      console.log(err)
    }
  }

  handleGetDate(url, res) {
    const name = url.searchParams.get("name");

    if (!name) {
      this.send(res, 400, "text/plain", MESSAGES.MISSING);
      return;
    }

    const safeName = Utils.escapeHtml(name);
    const greeting = MESSAGES.GREETING.replace("%1", safeName);
    const dateMessage = MESSAGES.DATE;
    const date = Utils.getDate();
    const html = `<p style="color: blue">${greeting} ${dateMessage} ${date}</p>`;

    this.send(res, 200, "text/html", html);
  }

  send(res, status, type, body) {
    res.writeHead(status, { "Content-Type": `${type}; charset=utf-8` })
    res.end(body);
  }

  start() {
    const server = http.createServer((req, res) => {
      this.handleRequest(req, res);
    });
    server.listen(this.port, this.containerHost, () => {
      console.log(`Server started on ${this.port}`);
    });
  }
}

const PORT = process.env.PORT || 8000;
const HOST = process.env.CONTAINER_HOST || "127.0.0.1";

const app = new Server(PORT, HOST);
app.start();
