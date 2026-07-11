import { createReadStream } from "node:fs";
import { stat, writeFile } from "node:fs/promises";
import { createServer } from "node:http";
import path from "node:path";
import { fileURLToPath } from "node:url";


const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const port = Number(process.env.PORT || 4173);
const mimeTypes = {
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".jpg": "image/jpeg",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".mind": "application/octet-stream",
  ".png": "image/png",
  ".yaml": "text/yaml; charset=utf-8",
};


const server = createServer(async (request, response) => {
  const url = new URL(request.url || "/", `http://${request.headers.host}`);

  if (request.method === "POST" && url.pathname === "/save-targets") {
    const chunks = [];
    let size = 0;
    for await (const chunk of request) {
      size += chunk.length;
      if (size > 20 * 1024 * 1024) {
        response.writeHead(413).end("Target file is too large.");
        return;
      }
      chunks.push(chunk);
    }
    const output = path.join(root, "assets", "targets.mind");
    await writeFile(output, Buffer.concat(chunks));
    response.writeHead(200, { "content-type": "application/json" });
    response.end(JSON.stringify({ ok: true, bytes: size }));
    return;
  }

  if (request.method !== "GET" && request.method !== "HEAD") {
    response.writeHead(405).end("Method not allowed.");
    return;
  }

  const pathname = decodeURIComponent(url.pathname === "/" ? "/index.html" : url.pathname);
  const filePath = path.resolve(root, `.${pathname}`);
  if (!filePath.startsWith(root)) {
    response.writeHead(403).end("Forbidden.");
    return;
  }

  try {
    const info = await stat(filePath);
    if (!info.isFile()) throw new Error("Not a file");
    response.writeHead(200, {
      "cache-control": "no-store",
      "content-length": info.size,
      "content-type": mimeTypes[path.extname(filePath).toLowerCase()] || "application/octet-stream",
    });
    if (request.method === "HEAD") response.end();
    else createReadStream(filePath).pipe(response);
  } catch {
    response.writeHead(404).end("Not found.");
  }
});

server.listen(port, "127.0.0.1", () => {
  process.stdout.write(`AR preview server: http://127.0.0.1:${port}\n`);
});
