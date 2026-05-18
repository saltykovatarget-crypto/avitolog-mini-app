const { getStore } = require("@netlify/blobs");

// Общий API для синхронизации данных между ботом и Mini App
// GET  /.netlify/functions/sync?key=ideas&userId=123
// POST /.netlify/functions/sync  { key, userId, data }
// DELETE /.netlify/functions/sync?key=ideas&userId=123

export const handler = async (event) => {
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Content-Type": "application/json",
  };

  if (event.httpMethod === "OPTIONS") return { statusCode: 200, headers, body: "" };

  const store = getStore({ name: "sync", consistency: "strong" });
  const params = new URLSearchParams(event.queryStringParameters || {});

  try {
    if (event.httpMethod === "GET") {
      const key   = params.get("key");
      const userId= params.get("userId");
      if (!key || !userId) return { statusCode: 400, headers, body: JSON.stringify({ error: "key and userId required" }) };
      const val = await store.get(`${userId}:${key}`);
      return { statusCode: 200, headers, body: val || JSON.stringify([]) };
    }

    if (event.httpMethod === "POST") {
      const { key, userId, data } = JSON.parse(event.body || "{}");
      if (!key || !userId) return { statusCode: 400, headers, body: JSON.stringify({ error: "key and userId required" }) };
      await store.set(`${userId}:${key}`, JSON.stringify(data));
      return { statusCode: 200, headers, body: JSON.stringify({ ok: true }) };
    }

    if (event.httpMethod === "DELETE") {
      const key   = params.get("key");
      const userId= params.get("userId");
      if (!key || !userId) return { statusCode: 400, headers, body: JSON.stringify({ error: "key and userId required" }) };
      await store.delete(`${userId}:${key}`);
      return { statusCode: 200, headers, body: JSON.stringify({ ok: true }) };
    }

    return { statusCode: 405, headers, body: "Method not allowed" };
  } catch (e) {
    return { statusCode: 500, headers, body: JSON.stringify({ error: e.message }) };
  }
};
