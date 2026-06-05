#!/bin/bash
# Запускает: бот (tg-agent-team) + express (отдаёт office.html и /api/status)
# Открывает офис в браузере. Ctrl+C — глушит оба процесса.

set -e
cd "$(dirname "$0")"

echo "🏗  Сборка фронта..."
npm run build --silent

echo "🤖 Запускаю бот..."
( cd tg-agent-team && node index.js ) &
BOT_PID=$!

echo "🌐 Запускаю сервер офиса..."
PORT=3000 node server.js &
SRV_PID=$!

cleanup() {
  echo ""
  echo "⏹  Останавливаю..."
  kill "$BOT_PID" "$SRV_PID" 2>/dev/null || true
  exit 0
}
trap cleanup INT TERM

sleep 2
echo ""
echo "✅ Готово!"
echo "   👥 Офис:  http://localhost:3000/office.html"
echo "   🤖 Бот:   пиши в Telegram"
echo ""
echo "   Ctrl+C — остановить оба"
echo ""

# Открыть офис в браузере (macOS)
open "http://localhost:3000/office.html" 2>/dev/null || true

# Ждём, пока оба процесса живы
wait
