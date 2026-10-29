// Раздаёт статику и пересылает бронь в Telegram. Секреты читаются из .env
const http = require("http");
const fs = require("fs");
const path = require("path");

const { BOT_TOKEN, CHAT_ID, PORT = 3000 } = process.env;
if (!BOT_TOKEN || !CHAT_ID) {
  console.error("Задай BOT_TOKEN и CHAT_ID в .env");
  process.exit(1);
}

const STATIC = { "/": "index.html", "/index.html": "index.html", "/app.js": "app.js" };
const TYPES = { ".html": "text/html; charset=utf-8", ".js": "text/javascript; charset=utf-8" };

http.createServer(async (req, res) => {
  if (req.method === "POST" && req.url === "/api/book") {
    let body = "";
    for await (const chunk of req) {
      body += chunk;
      if (body.length > 1024) return res.writeHead(413).end();
    }
    let phone;
    try { phone = String(JSON.parse(body).phone || "").trim().slice(0, 30); } catch {}
    if (!phone) return res.writeHead(400).end();
    const url = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;
    const r = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: CHAT_ID, text: `Бронь: ${phone}` }),
    }).catch(() => null);
    return res.writeHead(r && r.ok ? 200 : 502).end();
  }
  const file = STATIC[req.url];
  if (!file) return res.writeHead(404).end();
  res.writeHead(200, { "Content-Type": TYPES[path.extname(file)] });
  fs.createReadStream(path.join(__dirname, file)).pipe(res);
}).listen(PORT, () => console.log(`http://localhost:${PORT}`));
