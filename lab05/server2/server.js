// Claude (Claude Code, https://claude.com/claude-code) was used to help write and debug
// solutions presented in this assignment (server2: server.js, modules/db.js,
// modules/validator.js, docker-compose.yaml, nginx config).

import http from "node:http";
import "dotenv/config";
import { Database } from "./modules/db.js";
import { Validator } from "./modules/validator.js";
import { MESSAGES } from "./lang/messages/en/user.js";

// Public URL is comp4537.mitchellschoolwork.net/lab05/api/v1/sql/... but nginx's
// `location /lab05/ { proxy_pass http://127.0.0.1:3005/; }` strips the /lab05/ prefix
// before it reaches this process - so what this server actually sees is /api/v1/sql/...
// GET  /api/v1/sql/<url-encoded select statement>  -> read
// POST /api/v1/sql                                  -> insert fixed rows
const API_PREFIX = "/api/v1/sql";

// server1 (client) origins allowed to call this API. CORS checks scheme+host+port
// exactly, so this has to be the literal origin the browser sends, no trailing path.
const ALLOWED_ORIGINS = [
  "https://labs.useluss.dev",
];

class Server {
  constructor(port, host) {
    this.port = port;
    this.host = host;
    this.db = new Database();
  }

  handleRequest(req, res) {
    // CORS: server1 (client) and server2 (this) are different origins, so every
    // response needs this header, and a JSON POST triggers a browser OPTIONS
    // preflight that must be answered before the real request is even sent.
    // Only echo back the Origin header if it's on the allowlist - otherwise the
    // browser gets no Access-Control-Allow-Origin at all and blocks the request.
    const origin = req.headers.origin;
    if (ALLOWED_ORIGINS.includes(origin)) {
      res.setHeader("Access-Control-Allow-Origin", origin);
    }
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");

    if (req.method === "OPTIONS") {
      res.writeHead(204);
      res.end();
      return;
    }

    const url = new URL(req.url, `http://${req.headers.host}`);

    if (url.pathname === API_PREFIX || url.pathname === API_PREFIX + "/") {
      if (req.method === "POST") {
        this.handleInsert(req, res);
      } else {
        this.send(res, 405, "text/plain", MESSAGES.METHOD_NOT_ALLOWED);
      }
      return;
    }

    if (url.pathname.startsWith(API_PREFIX + "/")) {
      if (req.method === "GET") {
        this.handleSelect(url, res);
      } else {
        this.send(res, 405, "text/plain", MESSAGES.METHOD_NOT_ALLOWED);
      }
      return;
    }

    this.send(res, 404, "text/plain", MESSAGES.NOT_FOUND);
  }

  // POST /lab05/api/v1/sql
  async handleInsert(req, res) {
    try {
      const rows = await this.db.insertPatients();
      this.send(res, 200, "application/json", JSON.stringify(rows));
    } catch (err) {
      console.error(err);
      this.send(res, 500, "text/plain", MESSAGES.BAD);
    }
  }

  // GET /lab05/api/v1/sql/<url-encoded query>
  async handleSelect(url, res) {
    let sql;
    try {
      sql = decodeURIComponent(url.pathname.slice((API_PREFIX + "/").length));
    } catch {
      this.send(res, 400, "text/plain", MESSAGES.BAD);
      return;
    }

    if (!sql) {
      this.send(res, 400, "text/plain", MESSAGES.MISSING_QUERY);
      return;
    }

    if (!Validator.isSelectOnly(sql)) {
      this.send(res, 400, "text/plain", MESSAGES.QUERY_REJECTED);
      return;
    }

    try {
      const rows = await this.db.runReadQuery(sql);
      this.send(res, 200, "application/json", JSON.stringify(rows));
    } catch (err) {
      console.error(err);
      this.send(res, 500, "text/plain", MESSAGES.BAD);
    }
  }

  send(res, status, type, body) {
    res.writeHead(status, { "Content-Type": `${type}; charset=utf-8` });
    res.end(body);
  }

  start() {
    const server = http.createServer((req, res) => {
      this.handleRequest(req, res);
    });
    server.listen(this.port, this.host, () => {
      console.log(`Server2 (lab5 api) listening on ${this.host}:${this.port}`);
    });
  }
}

const PORT = process.env.PORT || 8000;
const HOST = process.env.CONTAINER_HOST || "127.0.0.1";

const app = new Server(PORT, HOST);
app.start();
