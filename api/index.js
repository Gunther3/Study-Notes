const express = require("express");
const Anthropic = require("@anthropic-ai/sdk");
const app = express();
app.use(express.json());

const HTML = `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8" name="viewport" content="width=device-width, initial-scale=1">
<title>Study Notes</title>
<style>
 body{font-family:system-ui;max-width:700px;margin:20px auto;padding:0 10px}
 #chat{border:1px solid #ccc;border-radius:10px;height:60vh;overflow-y:auto;padding:10px;background:#fafafa}
 .u{color:#036;margin:8px 0}
 .c{background:#eef;padding:8px;border-radius:8px;margin:8px 0}
 textarea{width:100%;height:60px;margin-top:8px}
 button{padding:8px 20px;margin-top:5px}
</style>
</head>
<body>
<h2>📚 Study Notes</h2>
<div id="chat"></div>
<textarea id="prompt" placeholder="Question..."></textarea>
<br><button onclick="send()">Send</button>
<script>
let msgs = [];
async function send() {
 const p = document.getElementById("prompt").value;
 if (!p) return;
 document.getElementById("prompt").value = "";
 const chat = document.getElementById("chat");
 chat.innerHTML += \`<div class="u"><b>You:</b> \${p}</div>\`;
 msgs.push({ role: "user", content: p });
 chat.innerHTML += \`<div class="c" id="t"><i>typing...</i></div>\`;
 chat.scrollTop = chat.scrollHeight;
 const r = await fetch("/chat", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ messages: msgs }),
 });
 const data = await r.json();
 document.getElementById("t").remove();
 const reply = data.reply || "Error: " + data.error;
 msgs.push({ role: "assistant", content: reply });
 chat.innerHTML += \`<div class="c"><b>Claude:</b> \${reply}</div>\`;
 chat.scrollTop = chat.scrollHeight;
}
</script>
</body>
</html>`;

app.get("/", (req, res) => res.send(HTML));

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

app.post("/chat", async (req, res) => {
  try {
    const msg = await client.messages.create({
      model: "claude-sonnet-4-5",
      max_tokens: 1024,
      messages: req.body.messages,
    });
    res.json({ reply: msg.content[0].text });
  } catch (e) {
    res.json({ error: e.message });
  }
});

module.exports = app;
