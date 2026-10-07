import http from "node:http";
import { readFile, stat } from "node:fs/promises";
import path from "node:path";
const root = path.resolve("out");
const types = {
  ".html": "text/html; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json",
  ".txt": "text/plain; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".woff2": "font/woff2",
  ".ico": "image/x-icon",
};
http
  .createServer(async (req, res) => {
    try {
      let pathname = decodeURIComponent(
        new URL(req.url, "http://localhost").pathname,
      );
      if (pathname === "/") {
        res.writeHead(302, { Location: "/VitaPath/" });
        res.end();
        return;
      }
      if (pathname === "/VitaPath") pathname = "/VitaPath/";
      if (!pathname.startsWith("/VitaPath/")) throw new Error("Not found");
      pathname = pathname.slice("/VitaPath".length);
      let file = path.resolve(root, "." + pathname);
      if (file !== root && !file.startsWith(root + path.sep))
        throw new Error("Not found");
      if ((await stat(file)).isDirectory())
        file = path.join(file, "index.html");
      const body = await readFile(file);
      res.writeHead(200, {
        "Content-Type": types[path.extname(file)] || "application/octet-stream",
      });
      res.end(body);
    } catch {
      res.writeHead(404, { "Content-Type": "text/plain" });
      res.end("Not found");
    }
  })
  .listen(
    Number(process.argv[2] || process.env.PORT || 4173),
    "127.0.0.1",
    () =>
      console.log(
        "VitaPath preview: http://127.0.0.1:" +
          (process.argv[2] || process.env.PORT || 4173) +
          "/VitaPath/",
      ),
  );
