import express from "express";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import { createRequire } from "module";
import { readFileSync, existsSync } from "fs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();
app.use(express.json());

// ─── Office status (читаем state.json от tg-agent-team) ───────────────────────
const STATE_FILE = join(__dirname, "tg-agent-team", "state.json");
app.get("/api/status", (req, res) => {
  res.setHeader("Cache-Control", "no-store");
  if (!existsSync(STATE_FILE)) return res.json([]);
  try {
    res.json(JSON.parse(readFileSync(STATE_FILE, "utf8")));
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

const ANTHROPIC_KEY = process.env.ANTHROPIC_API_KEY;
const REDIS_URL     = process.env.UPSTASH_REDIS_REST_URL;
const REDIS_TOKEN   = process.env.UPSTASH_REDIS_REST_TOKEN;

// Конвертация Markdown → Telegram формат
function toTgMarkdown(text) {
  return String(text)
    .replace(/^\|.*\|$/gm, row => {
      if (/^[\s|:-]+$/.test(row)) return "";
      return row.split("|").map(c => c.trim()).filter(c => c && !/^[-:]+$/.test(c)).join("  ·  ");
    })
    .replace(/\*\*(.+?)\*\*/g, "*$1*")
    .replace(/^#{1,2}\s+(.+)$/gm, "\n*$1*")
    .replace(/^#{3,6}\s+(.+)$/gm, "$1")
    .replace(/^---+$/gm, "")
    .replace(/__(.+?)__/g, "_$1_")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

// ─── Claude API proxy ─────────────────────────────────────────────────────────
app.post("/api/claude", async (req, res) => {
  try {
    const { system, messages, max_tokens } = req.body;
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": ANTHROPIC_KEY,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-6",
        max_tokens: max_tokens || 1000,
        system,
        messages,
      }),
    });
    const data = await response.json();
    res.status(response.status).json(data);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// ─── Sync API (Mini App ↔ Bot через Redis) ────────────────────────────────────
async function redisGet(key) {
  if (!REDIS_URL) return null;
  const r = await fetch(`${REDIS_URL}/GET/${encodeURIComponent(key)}`, {
    headers: { Authorization: `Bearer ${REDIS_TOKEN}` },
  });
  const { result } = await r.json();
  return result ? JSON.parse(result) : null;
}

async function redisSet(key, value) {
  if (!REDIS_URL) return;
  await fetch(`${REDIS_URL}/SET/${encodeURIComponent(key)}/${encodeURIComponent(JSON.stringify(value))}`, {
    headers: { Authorization: `Bearer ${REDIS_TOKEN}` },
  });
}

app.get("/api/sync", async (req, res) => {
  const { userId, key } = req.query;
  if (!userId || !key) return res.status(400).json({ error: "userId and key required" });
  const data = await redisGet(`${userId}:${key}`);
  res.json(data || []);
});

app.post("/api/sync", async (req, res) => {
  const { userId, key, data } = req.body;
  if (!userId || !key) return res.status(400).json({ error: "userId and key required" });
  await redisSet(`${userId}:${key}`, data);
  res.json({ ok: true });
});

// ─── Pin agent для чата (вызывается из Mini App кнопкой Агент) ───────────────
// Без deep-link старт-кнопки: пишем в Redis pinned:<chatId> + шлём приветствие.
const AGENT_META = {
  "smm":              { emoji: "✍️", name: "SMM" },
  "editor":           { emoji: "📝", name: "Редактор" },
  "reels-pro":        { emoji: "🎬", name: "Reels Pro" },
  "case-writer":      { emoji: "📋", name: "Кейс-писатель" },
  "scriptwriter":     { emoji: "🎥", name: "Сценарист" },
  "product-marketer": { emoji: "🚀", name: "Продукт-маркетолог" },
  "sales":            { emoji: "💰", name: "Продажник" },
  "lead-magnet":      { emoji: "🧲", name: "Лид-магниты" },
  "onboarding":       { emoji: "🎯", name: "Онбординг" },
  "visual":           { emoji: "🎨", name: "Визуал" },
  "seo":              { emoji: "🔍", name: "SEO" },
  "analyst":          { emoji: "📊", name: "Аналитик" },
  "content-director": { emoji: "🗓",  name: "Контент-директор" },
  "competitor":       { emoji: "🕵️", name: "Разведчик" },
  "ideas":            { emoji: "💡", name: "Заметки" },
  "community":        { emoji: "💬", name: "Комьюнити" },
  "office-hours":     { emoji: "🎓", name: "Office Hours" },
  "chesky":           { emoji: "⭐️", name: "Chesky" },
  "adversarial":      { emoji: "🔨", name: "QA-разбор" },
  "paranoid":         { emoji: "🔎", name: "Paranoid" },
};

// Redis SET с явным TTL (отличается от redisSet — нужен для pinned)
async function redisSetEx(key, value, ttlSec) {
  if (!REDIS_URL) return;
  const v = encodeURIComponent(JSON.stringify(value));
  await fetch(`${REDIS_URL}/SET/${encodeURIComponent(key)}/${v}/EX/${ttlSec}`, {
    headers: { Authorization: `Bearer ${REDIS_TOKEN}` },
  });
}

app.post("/api/pin-agent", async (req, res) => {
  try {
    const { chatId, agentId } = req.body;
    if (!chatId || !agentId) return res.status(400).json({ error: "chatId and agentId required" });
    const meta = AGENT_META[agentId];
    if (!meta) return res.status(400).json({ error: `Unknown agent: ${agentId}` });

    // Пишем в Redis под ключом который читает бот (pinned:<chatId>) с TTL 7 дней
    await redisSetEx(`pinned:${chatId}`, agentId, 86400 * 7);

    // Шлём приветствие через Bot API чтобы юзер увидел подтверждение в чате
    const message = `${meta.emoji} *${meta.name}* подключён\n\nПиши задачу — отвечаю как ${meta.name}.\nСменить агента — открой Mini App.\nОтключить — /unpin или /new.`;
    await fetch(
      `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chat_id: chatId, text: message, parse_mode: "Markdown" }),
      }
    ).catch(() => {});

    res.json({ ok: true, agent: meta.name });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// ─── Telegram send-tg ────────────────────────────────────────────────────────
app.post("/api/send-tg", async (req, res) => {
  try {
    const { chat_id, text } = req.body;
    const cleanText = toTgMarkdown(text);
    const message = `📋 Готовый пост\n\n${cleanText}`;
    const r = await fetch(
      `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chat_id, text: message, parse_mode: "Markdown" }),
      }
    );
    res.json(await r.json());
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// ─── Serve React SPA ──────────────────────────────────────────────────────────
app.use(express.static(join(__dirname, "dist")));
app.get("*", (req, res) => {
  res.sendFile(join(__dirname, "dist", "index.html"));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`✅ Mini App running on port ${PORT}`));
