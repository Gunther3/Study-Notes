const express = require("express");
const Anthropic = require("@anthropic-ai/sdk");
const app = express();
app.use(express.json());
app.use(express.static("public"));

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
