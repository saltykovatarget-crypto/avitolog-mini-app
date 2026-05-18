export const handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method not allowed" };
  }

  const { chat_id, text, platform } = JSON.parse(event.body);

  const label = { tg: "Telegram", vk: "ВКонтакте", tenchat: "TenChat" }[platform] || platform;
  const message = `📋 *Пост для ${label}*\n\n${text}`;

  const response = await fetch(
    `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id,
        text: message,
        parse_mode: "Markdown",
      }),
    }
  );

  const data = await response.json();
  return { statusCode: response.status, body: JSON.stringify(data) };
};
