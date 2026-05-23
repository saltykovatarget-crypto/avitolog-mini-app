import { useState, useEffect } from "react";

const BRAND = "#8B5CF6";
const DARK = "#F4F2FB";
const CARD = "#FFFFFF";
const BORDER = "#E4E0F4";
const MUTED = "#9B92C8";
const TEXT = "#1C1830";
const ACCENT = "#7C3AED";
const ERROR = "#EF4444";

const MONTHLY_THEMES = [
  {
    week: 1, theme: "Почему нет заявок",
    topics: {
      1: ["Клиент потратил 15к на продвижение — заявок не было. Разобрались за 10 минут.", "Юридические услуги, Москва: 3 заявки → 18 за 10 дней", "Мебель на заказ: платили за продвижение, CTR 0.8%. Нашли проблему."],
      2: ["Одна ошибка в заголовке которая убивает CTR — и как исправить", "Почему объявление не работает даже с продвижением", "Что такое поведенческие сигналы Авито и почему это важнее денег"],
      4: ["Что изменилось в алгоритме Авито в 2025 — что авитологи ещё не учитывают", "Куда идёт рынок Авито — видно из данных сотен клиентов", "Почему 80% бюджета на Авито сливается впустую"],
      5: ["Почему я перестала объяснять клиентам «подождите» и начала показывать цифры", "Самый частый вопрос от клиентов — и честный ответ", "Что я поняла за год работы с заявками на Авито"],
    }
  },
  {
    week: 2, theme: "AI vs ручная работа",
    topics: {
      1: ["2 часа руками vs 2 минуты AI: один кейс, два подхода", "Как я автоматизировала разбор объявлений — и что это дало клиентам", "AI нашёл проблему в объявлении за 30 секунд. Я бы искала час."],
      2: ["Как AI помогает поднять CTR без изменения бюджета", "Что умеет AI Авитолог PRO — и чего не умеет (честно)", "Автоматизация Авито: что реально работает в 2025"],
      4: ["AI на Авито: не хайп, а инструмент. Показываю на цифрах.", "Как изменился рынок авитологов с приходом AI", "Почему авитологи которые не используют AI уже проигрывают"],
      5: ["Почему я построила AI вместо того чтобы нанять команду", "Месяц как соло-фаундер с AI: что работает, что нет", "Как выглядит мой рабочий день сейчас против года назад"],
    }
  },
  {
    week: 3, theme: "CTR и первое фото",
    topics: {
      1: ["Ремонт квартир в Москве: CTR был 1.8%, подняли до 7.2% одной правкой фото", "Клиент поменял первое фото — заявки выросли в 3 раза за неделю", "CTR 0.9% → 6.4%: что мы изменили и сколько это стоило"],
      2: ["Одна ошибка в первом фото которая убивает CTR — и как её исправить", "Как сделать первое фото для Авито за 10 минут на телефон", "5 правил первого фото которые работают в любой нише"],
      4: ["Что данные 500+ объявлений говорят о первом фото", "Почему CTR важнее бюджета на продвижение — с цифрами", "Тренды визуала на Авито в 2025: что кликают, что нет"],
      5: ["Как я перестала советовать клиентам «сделай красиво» и начала давать конкретику", "Самый частый визуальный просчёт который я вижу каждую неделю", "Что я изменила бы в своих первых кейсах по CTR"],
    }
  },
  {
    week: 4, theme: "Личное / итоги",
    topics: {
      1: ["Кейс который изменил мой подход к работе с клиентами", "Самый сложный клиент за год — и что я из этого вынесла", "Кейс: клиент не верил в AI. Через месяц продлил на год."],
      2: ["Что я узнала об алгоритме Авито за год — то чего нет в гайдах", "Лайфхак который экономит 2 часа в неделю каждому авитологу", "Что я проверяю в первую очередь когда беру новый аккаунт"],
      4: ["Год как авитолог-фаундер: цифры, выводы, планы", "Что изменилось в нише авитологов за последние 12 месяцев", "Почему я выбрала нишу Авито — и не жалею"],
      5: ["Что значит строить продукт в одиночку — без прикрас", "Соло-фаундер: 3 ошибки которые я больше не повторяю", "Итоги месяца: что получилось, что нет, что дальше"],
    }
  },
];

function getWeekOfMonth() {
  const now = new Date();
  const day = now.getDate();
  return Math.min(Math.ceil(day / 7), 4);
}

const WEEK_PLAN = [
  {
    day: 1, label: "ПН", emoji: "📊",
    rubric: "Кейс недели",
    goal: "Доверие через цифры",
    topics: [
      "Мини-кейс с поля: ремонт квартир, CTR 1.2% → 6.8% за 4 дня",
      "Паттерн: что объединяет аккаунты с CPL ниже 200₽",
      "Полный кейс ниши X — 10 шагов системы FORMULA",
    ],
    cta: "Хочешь так же — загрузи объявление в AI Авитолог PRO",
  },
  {
    day: 2, label: "ВТ", emoji: "🔍",
    rubric: "Разбор живого",
    goal: "Демо сервиса в действии",
    interactive: true,
    topics: [
      "Прогнала случайное объявление юриста через AI Авитолог PRO — вот что нашёл",
      "Разбор объявления ремонтной компании: 3 ошибки за 30 секунд",
      "Что показал сервис на объявлении из топа в нише отопления",
    ],
    cta: "Загрузи своё объявление — 3 запроса бесплатно",
  },
  {
    day: 3, label: "СР", emoji: "🎯",
    rubric: "Интерактив",
    goal: "Вовлечение и охват",
    topics: [
      "Опрос: какой CTR у ваших объявлений сейчас? 2% / 5% / 8% / не смотрю",
      "Спорное: платное продвижение не нужно если заголовок правильный — согласны?",
      "Угадайте: на этом скриншоте 3 ошибки — какие?",
    ],
    cta: "Напишите свой ответ ⬇️",
  },
  {
    day: 4, label: "ЧТ", emoji: "💬",
    rubric: "Мне часто пишут",
    goal: "Экспертиза + сервис как ответ",
    topics: [
      "Мне часто пишут: почему 1000 просмотров и 0 заявок",
      "Мне часто пишут: как работает Ranker 3 на Авито в 2026",
      "Мне часто пишут: стоит ли поднимать ставку продвижения",
    ],
    cta: "На такие вопросы AI Авитолог PRO отвечает автоматически",
  },
  {
    day: 5, label: "ПТ", emoji: "💜",
    rubric: "Закулисье",
    goal: "Человечность + процесс",
    topics: [
      "Что AI Авитолог PRO проверил на этой неделе — общие паттерны",
      "Личное наблюдение: как изменилась работа авитолога с AI",
      "Закулисье: как я выбираю что улучшить в сервисе",
    ],
    cta: "Хочешь увидеть свой аккаунт глазами AI",
  },
];

const DAY_KEYS = { 1: "monday", 2: "tuesday", 3: "wednesday", 4: "thursday", 5: "friday" };

function loadSavedPlan() {
  try { return JSON.parse(localStorage.getItem("weekPlan") || "{}"); } catch { return {}; }
}

function getTopicsForDay(dayNum) {
  const saved = loadSavedPlan();
  const key = DAY_KEYS[dayNum];
  const day = WEEK_PLAN.find(d => d.day === dayNum) || WEEK_PLAN[0];
  const defaults = day.topics;
  if (saved[key]) return [saved[key], ...defaults];
  return defaults;
}

const PLANNING_SYSTEM = `Ты — контент-директор Валерии Салтыковой (авитолог, AI Авитолог PRO).
Предложи темы для постов на неделю — конкретные, из практики авитолога.
Каждая тема — это хук: конкретная ситуация, не тезис.
Формат ответа — только JSON без пояснений:
{"monday":["тема1","тема2"],"tuesday":["тема1","тема2"],"wednesday":["тема1","тема2"],"thursday":["тема1","тема2"],"friday":["тема1","тема2"]}`;

const WEEK_AI_SYSTEM = `Ты — контент-директор Валерии Салтыковой (AI Авитолог PRO, @traffic_agency_formula).
Составь план на 5 дней. Фокус: продвижение AI Авитолог PRO через пользу.
Форматы по дням:
ПН: мини-кейс с поля / демо сервиса / паттерн из практики
ВТ: разбор ошибки в объявлении
СР: опрос или спорное утверждение (развлекательный)
ЧТ: «Мне часто пишут:» — ответ на частый вопрос с CTA на сервис
ПТ: личное или скриншот из кабинета Авито Pro

Верни ТОЛЬКО JSON без пояснений:
{"monday":{"format":"ПН-2 / Мини-кейс","topic":"конкретная тема-хук","hook":"первая строка поста","cmd":"напиши пост: "},"tuesday":{"format":"ВТ / Разбор ошибки","topic":"...","hook":"...","cmd":"разбор объявления: "},"wednesday":{"format":"СР / Опрос","topic":"...","hook":"...","cmd":"напиши пост: "},"thursday":{"format":"ЧТ / Мне часто пишут","topic":"...","hook":"...","cmd":"мне часто пишут: "},"friday":{"format":"ПТ / Личное","topic":"...","hook":"...","cmd":"напиши личный пост: "}}`;

const DAY_LABELS = {
  monday: "ПН", tuesday: "ВТ", wednesday: "СР", thursday: "ЧТ", friday: "ПТ"
};
const DAY_COLORS = {
  monday: "#8B5CF6", tuesday: "#2AABEE", wednesday: "#F59E0B",
  thursday: "#10B981", friday: "#EF4444"
};

const PLATFORMS = [
  { id: "tg", name: "Telegram", color: "#8B5CF6", format: "1280×720px (горизонтальный)", prompt: "" },
];

const VISUAL_SYSTEM = `Ты — визуальный продюсер Валерии Салтыковой (AI Авитолог PRO). Брендбук: фиолетовый #8B5CF6, тёмно-синий фон #0D0D14, белый текст. Стиль: современный, минималистичный, технологичный. Логотип: «AI Авитолог PRO». Персонаж: молодая женщина-эксперт, деловой стиль, уверенная. На основе поста сгенерируй ДВА блока без вступлений:

БЛОК 1 — ПРОМПТ ДЛЯ GPT/DALL-E:
Напиши на английском детальный промпт для генерации баннера. Включи: визуальную сцену, стиль, цвета, композицию, настроение. Не включай текст на картинке.

БЛОК 2 — ТЗ ДЛЯ ДИЗАЙНЕРА:
Формат: [формат]
Что изображено: [конкретная сцена/визуал]
Текст на баннере: [заголовок / подзаголовок]
Шрифт: жирный, белый на тёмном или тёмный на светлом
Логотип: AI Авитолог PRO (правый нижний угол)
Цвета: фиолетовый #8B5CF6, фон тёмно-синий #0D0D14
Настроение: [1-2 прилагательных]
Доп. элементы: [иконки, графики, декор если нужны]`;

const REELS_PLAN = {
  1: { format: "Кейс", label: "🎬 Кейс", hint: "Реальная история клиента — было/стало на камеру" },
  2: { format: "Ловушка", label: "⚠️ Ловушка", hint: "Ошибка которую все делают — и как её избежать" },
  3: { format: "A vs B", label: "⚡️ A vs B", hint: "Ручная работа vs AI — показать экран" },
  4: { format: "Туториал", label: "📋 Туториал", hint: "Один конкретный шаг — покажи как" },
  5: { format: "Путь героя", label: "💜 Путь героя", hint: "Личная трансформация — как всё изменилось" },
};

const REELS_SYSTEM = `Ты — сценарист коротких видео для Reels Валерии Салтыковой (авитолог, AI Авитолог PRO).
Структура: 0-3 сек хук → 3-15 сек контекст → 15-45 сек мясо с цифрами → 45-60 сек вывод + CTA.
Пиши разговорным русским. Добавляй [КАДР], [ТЕКСТ НА ЭКРАНЕ], [ГОЛОС].
CTA в конце: «Загрузи объявление в AI Авитолог PRO — покажет что изменить. 3 запроса бесплатно».
Напиши готовый сценарий без вступлений.`;

const BASE_SYSTEM = `Ты — SMM-менеджер Валерии Салтыковой. Контекст: она авитолог, основатель AI Авитолог PRO (aiavitologpro.ru) и агентства FORMULA. Работает соло. Позиционирование: «Я авитолог которая устала делать всё вручную — и построила AI который делает это за меня». Воронка: пост → CTA: «Загрузи объявление — покажет что изменить. 3 запроса бесплатно» → подписка 1590 ₽/мес. Пиши от первого лица: практик, не учитель. Конкретные детали, кейсы, цифры. Хук — конкретная ситуация, не тезис. Фирменные фразы: «По факту:», «Логика простая:», «Ошибка большинства:». Напиши готовый пост без вступлений.`;

const GEN_STEPS = ["Пишу пост для Telegram..."];

function parseVisual(raw) {
  const gptMatch = raw.match(/БЛОК 1[^\n]*\n([\s\S]*?)(?=БЛОК 2|$)/);
  const tzMatch = raw.match(/БЛОК 2[^\n]*\n([\s\S]*?)$/);
  return {
    gpt: gptMatch?.[1]?.trim() || raw,
    tz: tzMatch?.[1]?.trim() || "",
  };
}

const SYNC_API = "/api/sync";

async function syncGet(userId, key) {
  try {
    const r = await fetch(`${SYNC_API}?userId=${userId}&key=${key}`);
    return await r.json();
  } catch { return []; }
}

async function syncPost(userId, key, data) {
  try {
    await fetch(SYNC_API, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, key, data }),
    });
  } catch {}
}

async function callClaude(system, userMsg) {
  try {
    const res = await fetch("/api/claude", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ system, messages: [{ role: "user", content: userMsg }], max_tokens: 1000 }),
    });
    const data = await res.json();
    if (data.type === "error") return null;
    return data.content?.find((b) => b.type === "text")?.text || null;
  } catch {
    return null;
  }
}

if (!document.getElementById("mcoach-styles")) {
  const st = document.createElement("style");
  st.id = "mcoach-styles";
  st.innerHTML = `@keyframes spin{to{transform:rotate(360deg)}} @keyframes fadeUp{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}`;
  document.head.appendChild(st);
}

function CopyButton({ text, color }) {
  const [copied, setCopied] = useState(false);
  function handleCopy() {
    navigator.clipboard?.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }
  return (
    <button onClick={handleCopy} style={{padding:"11px 13px",background:copied?"#1E4D2B":"transparent",color:copied?"#4ADE80":MUTED,border:`1px solid ${copied?"#4ADE80":BORDER}`,borderRadius:9,cursor:"pointer",fontSize:12,transition:"all 0.2s"}}>
      {copied ? "✓" : "⎘"}
    </button>
  );
}

export default function App() {
  const today = new Date();
  const dow = today.getDay();
  const weekNum = getWeekOfMonth();
  const currentTheme = MONTHLY_THEMES.find((t) => t.week === weekNum) || MONTHLY_THEMES[0];
  const plan = WEEK_PLAN.find((d) => d.day === dow) || WEEK_PLAN[0];
  const dayName = today.toLocaleDateString("ru-RU", { weekday: "long", day: "numeric", month: "long" });
  const [view, setView] = useState("today");
  const [step, setStep] = useState("brief");
  const [selTopic, setSelTopic] = useState(null);
  const [customTopic, setCustomTopic] = useState("");
  const [drafts, setDrafts] = useState({});
  const [draftErrors, setDraftErrors] = useState({});
  const [genStep, setGenStep] = useState(0);
  const [activeTab, setActiveTab] = useState("tg");
  const [published, setPublished] = useState([]);
  const [doneDays, setDoneDays] = useState([]);
  const [visuals, setVisuals] = useState({});
  const [visualLoading, setVisualLoading] = useState(false);
  const [visualTab, setVisualTab] = useState("tg");
  const [tgUserId, setTgUserId] = useState(null);
  const [sending, setSending] = useState({});
  const [reelsScript, setReelsScript] = useState(null);
  const [reelsLoading, setReelsLoading] = useState(false);
  const [reelsFilmed, setReelsFilmed] = useState(false);
  const [reelsSending, setReelsSending] = useState(false);
  const [reelsSent, setReelsSent] = useState(false);
  const [planInputs, setPlanInputs] = useState(() => {
    const s = loadSavedPlan();
    return { monday: s.monday||"", tuesday: s.tuesday||"", wednesday: s.wednesday||"", thursday: s.thursday||"", friday: s.friday||"" };
  });
  const [planSugs, setPlanSugs] = useState({});
  const [planLoading, setPlanLoading] = useState(false);
  const [planSaved, setPlanSaved] = useState(false);
  const [aiWeekPlan, setAiWeekPlan] = useState(null);
  const [aiPlanLoading, setAiPlanLoading] = useState(false);
  const topic = customTopic || selTopic;

  // Открываем бота с темой
  function openBotWithTopic(cmd, topic) {
    const msg = encodeURIComponent(cmd + topic);
    if (window.Telegram?.WebApp) {
      window.Telegram.WebApp.openTelegramLink(`https://t.me/avitolog_coach_bot?start=plan`);
    }
  }

  async function generateAiWeekPlan() {
    setAiPlanLoading(true);
    setAiWeekPlan(null);
    try {
      const weekNum = Math.ceil(new Date().getDate() / 7);
      const isOdd = weekNum % 2 !== 0;
      const prompt = `Неделя ${weekNum} месяца. Среда: ${isOdd ? "опрос" : "спорное утверждение"}. Пятница: ${isOdd ? "личный пост" : "скриншот цифр"}. Составь план.`;
      const raw = await callClaude(WEEK_AI_SYSTEM, prompt);
      const json = raw.match(/\{[\s\S]*\}/)?.[0];
      if (json) {
        const plan = JSON.parse(json);
        setAiWeekPlan(plan);
        // Сохраняем в Redis → бот и Mini App видят один план
        if (tgUserId) {
          const topics = {};
          const dayNums = {monday:1,tuesday:2,wednesday:3,thursday:4,friday:5};
          Object.entries(plan).forEach(([day, v]) => { topics[day] = v.topic; });
          await syncPost(tgUserId, "weekPlan", topics);
          // Также обновляем planInputs
          setPlanInputs(prev => ({...prev, ...topics}));
        }
      }
    } catch(e) { console.error(e); }
    setAiPlanLoading(false);
  }

  const [botIdeas, setBotIdeas] = useState([]);
  const [syncStatus, setSyncStatus] = useState("");

  // ─── Загружаем всё из Redis при старте ───────────────────────────────────────
  useEffect(() => {
    const id = window.Telegram?.WebApp?.initDataUnsafe?.user?.id;
    if (id) {
      setTgUserId(id);
      // Идеи из бота
      syncGet(id, "ideas").then(data => {
        if (Array.isArray(data) && data.length > 0) setBotIdeas(data);
      });
      // План недели из бота/прошлой сессии
      syncGet(id, "weekPlan").then(data => {
        if (data && typeof data === "object" && !Array.isArray(data)) {
          setPlanInputs(prev => ({
            monday:    data.monday    || prev.monday    || "",
            tuesday:   data.tuesday   || prev.tuesday   || "",
            wednesday: data.wednesday || prev.wednesday || "",
            thursday:  data.thursday  || prev.thursday  || "",
            friday:    data.friday    || prev.friday    || "",
          }));
        }
      });
    }
    if (dow === 0) setView("plan");
  }, []);

  async function generate() {
    setStep("generating");
    setGenStep(0);
    setDraftErrors({});
    // Один пост для Telegram — без адаптации под платформы
    const tgSystem = `${BASE_SYSTEM}\n\nРубрика: ${plan.rubric} — ${plan.goal}\nЭмодзи маркеры: 📌 ➡️ ⚡️ 💜. Жирный для цифр. Подпись: 💜 AI Авитолог | Валерия Салтыкова. Хэштеги #авито #авитолог в конце.`;
    setGenStep(1);
    const post = await callClaude(tgSystem, `Тема: ${topic}\n\nНапиши готовый пост для Telegram.`);
    if (!post) { setStep("topic"); return; }
    setDrafts({ tg: post });
    setStep("drafts");
  }

  async function regen() {
    setDraftErrors((e) => ({ ...e, tg: false }));
    const tgSystem = `${BASE_SYSTEM}\n\nРубрика: ${plan.rubric} — ${plan.goal}\nЭмодзи маркеры: 📌 ➡️ ⚡️ 💜. Жирный для цифр. Подпись: 💜 AI Авитолог | Валерия Салтыкова. Хэштеги #авито #авитолог в конце.`;
    const text = await callClaude(tgSystem, `Тема: ${topic}\n\nНапиши готовый пост для Telegram. Сделай по-другому, чем в прошлый раз.`);
    if (text) {
      setDrafts({ tg: text });
    } else {
      setDraftErrors((e) => ({ ...e, tg: true }));
    }
  }

  async function generateVisuals() {
    setVisualLoading(true);
    const postText = drafts.tg || "";
    const raw = await callClaude(
      VISUAL_SYSTEM.replace("[формат]", "1280×720px (горизонтальный, Telegram)"),
      `Вот пост для Telegram:\n\n${postText}\n\nСгенерируй промпт и ТЗ для баннера.`
    );
    setVisuals({ tg: raw ? parseVisual(raw) : null });
    setVisualLoading(false);
  }

  async function sendToTelegram(platformId) {
    if (!tgUserId || !drafts[platformId]) return;
    setSending((s) => ({ ...s, [platformId]: true }));
    await fetch("/api/send-tg", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: tgUserId, text: drafts[platformId], platform: platformId }),
    });
    setSending((s) => ({ ...s, [platformId]: false }));
    togglePub(platformId);
  }

  async function sendReelsToTelegram() {
    if (!tgUserId || !reelsScript) return;
    setReelsSending(true);
    await fetch("/api/send-tg", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: tgUserId, text: `🎬 СЦЕНАРИЙ REELS\n\n${reelsScript}` }),
    });
    setReelsSending(false);
    setReelsSent(true);
  }

  // Чистим markdown для отображения в превью (** → bold-like, * → курсив, без сырых звёздочек)
  function cleanMd(text) {
    return String(text || "")
      .replace(/\*\*(.+?)\*\*/g, "$1")        // **bold** → bold
      .replace(/(?<!\*)\*(?!\*)([^\*\n]+?)\*(?!\*)/g, "$1")  // *italic* → italic
      .replace(/^#{1,6}\s+/gm, "")            // # heading → heading
      .replace(/^\s*[-*]\s*$/gm, "")          // одинокие --- разделители
      .replace(/\n{3,}/g, "\n\n");            // лишние пустые строки
  }

  async function suggestPlanTopics() {
    setPlanLoading(true);
    const raw = await callClaude(PLANNING_SYSTEM, `Неделя ${getWeekOfMonth()}, тема: ${currentTheme.theme}. Предложи конкретные темы.`);
    try {
      const json = JSON.parse(raw.match(/\{[\s\S]*\}/)?.[0] || "{}");
      setPlanSugs(json);
    } catch { /* ignore parse errors */ }
    setPlanLoading(false);
  }

  async function savePlan() {
    localStorage.setItem("weekPlan", JSON.stringify(planInputs));
    // Синхронизируем в Redis → бот увидит план
    if (tgUserId) {
      setSyncStatus("Сохраняю...");
      await syncPost(tgUserId, "weekPlan", planInputs);
      setSyncStatus("✅ Синхронизировано с ботом");
      setTimeout(() => setSyncStatus(""), 2000);
    }
    setPlanSaved(true);
  }

  function resetPlan() { setPlanSaved(false); }

  async function generateReelsScript() {
    const reels = REELS_PLAN[dow] || REELS_PLAN[1];
    const weekTheme = currentTheme.theme;
    setReelsLoading(true);
    const script = await callClaude(
      REELS_SYSTEM,
      `Формат: ${reels.format}\nТема недели: ${weekTheme}\nТема дня: ${topic || plan.format}\n\nНапиши сценарий Reels на 30-60 секунд.`
    );
    setReelsScript(script);
    setReelsLoading(false);
  }

  function togglePub(id) { setPublished((p) => p.includes(id) ? p.filter((x) => x !== id) : [...p, id]); }
  function finish() { if (!doneDays.includes(dow)) setDoneDays([...doneDays, dow]); setStep("done"); }
  function restart() { setStep("brief"); setSelTopic(null); setCustomTopic(""); setDrafts({}); setDraftErrors({}); setPublished([]); setGenStep(0); setActiveTab("tg"); setVisuals({}); setVisualLoading(false); }

  const allPub = published.includes("tg");

  return (
    <div style={{minHeight:"100vh",background:DARK,padding:"22px 16px",fontFamily:"'Golos Text','Segoe UI',sans-serif",color:TEXT,maxWidth:520,margin:"0 auto"}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:14}}>
        <div>
          <div style={{fontSize:10,letterSpacing:2,color:MUTED,fontWeight:700,marginBottom:3}}>МАРКЕТИНГ-ДИРЕКТОР</div>
          <div style={{fontSize:21,fontWeight:700,letterSpacing:-0.5}}>Утренний брифинг</div>
        </div>
        <div style={{fontSize:11,color:MUTED,background:CARD,border:`1px solid ${BORDER}`,borderRadius:8,padding:"5px 11px"}}>{dayName}</div>
      </div>
      {/* Tabs — белая карточка с активной фиолетовой вкладкой */}
      <div style={{display:"flex",gap:2,marginBottom:16,background:CARD,padding:4,borderRadius:14,boxShadow:"0 2px 12px rgba(17,12,48,0.08)"}}>
        {[{id:"today",label:"Сегодня"},{id:"week",label:"Вся неделя"},{id:"plan",label:"📅 План"}].map((v) => (
          <button key={v.id} onClick={() => { setView(v.id); setPlanSaved(false); }} style={{flex:1,padding:"8px 4px",background:view===v.id?BRAND:"transparent",color:view===v.id?"white":MUTED,border:"none",borderRadius:10,fontSize:12,fontWeight:700,cursor:"pointer",transition:"all 0.2s",boxShadow:view===v.id?"0 4px 12px rgba(139,92,246,0.35)":"none"}}>
            {v.label}
          </button>
        ))}
      </div>

      {/* Day tabs — крупнее, активный с свечением */}
      <div style={{display:"flex",gap:8,marginBottom:18}}>
        {WEEK_PLAN.map((d) => {
          const isToday = d.day === dow;
          const isDone = doneDays.includes(d.day);
          return (
            <div key={d.day} style={{flex:1,padding:"10px 4px",borderRadius:14,display:"flex",flexDirection:"column",alignItems:"center",gap:4,
              background:isToday?BRAND:CARD,
              boxShadow:isToday?"0 4px 14px rgba(139,92,246,0.4)":"0 2px 8px rgba(17,12,48,0.06)",
              opacity:d.day<dow&&!isDone&&!isToday?0.5:1,
              transition:"all 0.2s"}}>
              <span style={{fontSize:13,fontWeight:700,color:isToday?"white":isDone?"#22C55E":MUTED}}>{d.label}</span>
              {isDone && !isToday && <span style={{fontSize:11,color:"#22C55E",fontWeight:700}}>✓</span>}
              {isToday && <div style={{width:5,height:5,borderRadius:"50%",background:"rgba(255,255,255,0.8)"}} />}
              {!isDone && !isToday && <div style={{width:5,height:5}} />}
            </div>
          );
        })}
      </div>

      {view === "week" && (
        <div style={{animation:"fadeUp 0.3s ease"}}>
          {WEEK_PLAN.map((d) => (
            <div key={d.day} style={{background:CARD,border:`1px solid ${d.day===dow?BRAND:BORDER}`,borderRadius:14,padding:16,marginBottom:10}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
                <div style={{display:"flex",alignItems:"center",gap:8}}>
                  <span style={{fontSize:11,fontWeight:700,padding:"2px 8px",borderRadius:5,background:d.day===dow?BRAND:DARK,color:d.day===dow?"white":MUTED}}>{d.label}</span>
                  <span style={{fontSize:13,fontWeight:700,color:TEXT}}>{d.format}</span>
                </div>
                {doneDays.includes(d.day) && <span style={{fontSize:11,color:"#22C55E",fontWeight:700}}>✓ готово</span>}
              </div>
              {getTopicsForDay(d.day).map((t, i) => (
                <div key={i} style={{fontSize:12,color:MUTED,lineHeight:1.5,padding:"4px 0",borderBottom:i<2?`1px solid ${BORDER}`:"none",display:"flex",gap:8}}>
                  <span style={{color:BRAND,minWidth:14,fontWeight:700}}>{i+1}</span>
                  <span>{t}</span>
                </div>
              ))}
              {d.day === dow && step === "brief" && (
                <button onClick={() => { setView("today"); setStep("topic"); }} style={{width:"100%",marginTop:12,padding:"10px",background:BRAND,color:"white",border:"none",borderRadius:9,fontSize:13,fontWeight:700,cursor:"pointer"}}>
                  Написать сегодня →
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {view === "plan" && (
        <div style={{animation:"fadeUp 0.3s ease"}}>
          {planSaved ? (
            <div style={{background:CARD,border:`1px solid ${BRAND}`,borderRadius:16,padding:24,textAlign:"center"}}>
              <div style={{fontSize:36,marginBottom:10}}>✅</div>
              <div style={{fontSize:18,fontWeight:700,marginBottom:6}}>Неделя запланирована!</div>
              <div style={{fontSize:13,color:MUTED,marginBottom:20}}>Темы сохранены и будут подставлены в ежедневный брифинг</div>
              <div style={{textAlign:"left",marginBottom:20}}>
                {WEEK_PLAN.map((d) => {
                  const key = DAY_KEYS[d.day];
                  const t = planInputs[key];
                  return t ? (
                    <div key={d.day} style={{display:"flex",gap:10,padding:"8px 0",borderBottom:`1px solid ${BORDER}`}}>
                      <span style={{fontSize:11,fontWeight:700,color:BRAND,minWidth:24}}>{d.label}</span>
                      <span style={{fontSize:13,color:TEXT,lineHeight:1.4}}>{t}</span>
                    </div>
                  ) : null;
                })}
              </div>
              <button onClick={() => { setView("today"); resetPlan(); }} style={{width:"100%",padding:"13px",background:BRAND,color:"white",border:"none",borderRadius:10,fontSize:14,fontWeight:700,cursor:"pointer"}}>
                Начать неделю →
              </button>
            </div>
          ) : (
            <div style={{background:CARD,border:`1px solid ${BORDER}`,borderRadius:16,padding:20}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:4}}>
                <div style={{fontSize:10,letterSpacing:2,color:MUTED,fontWeight:700}}>КОНТЕНТ-ДИРЕКТОР</div>
                {syncStatus && <div style={{fontSize:11,color:BRAND,fontWeight:600}}>{syncStatus}</div>}
                {tgUserId && <button onClick={async()=>{
                  setSyncStatus("Обновляю...");
                  const data = await syncGet(tgUserId, "weekPlan");
                  if (data && typeof data === "object" && !Array.isArray(data)) {
                    setPlanInputs(prev=>({...prev,...data}));
                    setSyncStatus("✅ Обновлено из бота");
                  } else setSyncStatus("Нет данных");
                  setTimeout(()=>setSyncStatus(""),2000);
                }} style={{fontSize:11,color:MUTED,background:"transparent",border:`1px solid ${BORDER}`,borderRadius:6,padding:"3px 8px",cursor:"pointer"}}>
                  🔄
                </button>}
              </div>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
                <div style={{fontSize:17,fontWeight:700}}>План на неделю</div>
                <button onClick={generateAiWeekPlan} disabled={aiPlanLoading}
                  style={{padding:"8px 14px",background:BRAND,color:"white",border:"none",borderRadius:8,fontSize:12,fontWeight:700,cursor:aiPlanLoading?"default":"pointer",opacity:aiPlanLoading?0.6:1}}>
                  {aiPlanLoading ? "⏳ Генерирую..." : "🤖 AI-план"}
                </button>
              </div>

              {aiWeekPlan && (
                <div style={{marginBottom:20}}>
                  <div style={{fontSize:10,letterSpacing:2,color:BRAND,fontWeight:700,marginBottom:10}}>AI СГЕНЕРИРОВАЛ — НАЖМИ «НАПИСАТЬ» ЧТОБЫ ОТКРЫТЬ БОТА</div>
                  {Object.entries(aiWeekPlan).map(([day, v]) => (
                    <div key={day} style={{border:`1px solid ${BORDER}`,borderRadius:12,padding:14,marginBottom:8,borderLeft:`3px solid ${DAY_COLORS[day]||BRAND}`}}>
                      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:6}}>
                        <div>
                          <span style={{fontSize:11,fontWeight:700,color:DAY_COLORS[day]||BRAND,marginRight:8}}>{DAY_LABELS[day]}</span>
                          <span style={{fontSize:11,color:MUTED}}>{v.format}</span>
                        </div>
                        <a href={`https://t.me/avitolog_coach_bot`} target="_blank" rel="noreferrer"
                          style={{fontSize:11,padding:"4px 10px",background:BRAND,color:"white",borderRadius:6,textDecoration:"none",fontWeight:700,whiteSpace:"nowrap"}}>
                          Написать →
                        </a>
                      </div>
                      <div style={{fontSize:13,color:TEXT,fontWeight:600,marginBottom:3}}>{v.topic}</div>
                      <div style={{fontSize:12,color:MUTED,fontStyle:"italic"}}>"{v.hook}"</div>
                    </div>
                  ))}
                  <div style={{fontSize:11,color:MUTED,textAlign:"center",marginTop:8}}>
                    ✅ Темы сохранены — бот знает план
                  </div>
                </div>
              )}


              {WEEK_PLAN.map((d) => {
                const key = DAY_KEYS[d.day];
                const sugs = planSugs[key] || [];
                return (
                  <div key={d.day} style={{marginBottom:14}}>
                    <div style={{display:"flex",alignItems:"baseline",gap:8,marginBottom:6}}>
                      <span style={{fontSize:11,fontWeight:700,color:BRAND}}>{d.label}</span>
                      <span style={{fontSize:12,color:MUTED}}>{d.format}</span>
                    </div>
                    <input
                      value={planInputs[key]}
                      onChange={(e) => setPlanInputs((p) => ({ ...p, [key]: e.target.value }))}
                      placeholder="Введи тему или выбери предложение ниже..."
                      style={{width:"100%",padding:"10px 12px",background:DARK,border:`1px solid ${planInputs[key]?BRAND:BORDER}`,borderRadius:9,fontSize:13,color:TEXT,outline:"none",fontFamily:"inherit",boxSizing:"border-box"}}
                    />
                    {sugs.length > 0 && (
                      <div style={{display:"flex",flexDirection:"column",gap:4,marginTop:5}}>
                        {sugs.map((s, i) => (
                          <button key={i} onClick={() => setPlanInputs((p) => ({ ...p, [key]: s }))}
                            style={{textAlign:"left",padding:"7px 10px",background:planInputs[key]===s?"#EDE9FD":DARK,border:`1px solid ${planInputs[key]===s?BRAND:BORDER}`,borderRadius:7,fontSize:12,color:planInputs[key]===s?ACCENT:MUTED,cursor:"pointer",lineHeight:1.4}}>
                            ✦ {s}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}

              <div style={{height:1,background:BORDER,margin:"6px 0 14px"}} />
              <div style={{display:"flex",gap:8}}>
                <button onClick={suggestPlanTopics} disabled={planLoading} style={{flex:1,padding:"12px",background:"transparent",color:planLoading?MUTED:BRAND,border:`1px solid ${BRAND}`,borderRadius:10,fontSize:13,fontWeight:700,cursor:planLoading?"default":"pointer"}}>
                  {planLoading ? "Генерирую..." : "✦ Предложи темы"}
                </button>
                <button onClick={savePlan} style={{flex:1,padding:"12px",background:BRAND,color:"white",border:"none",borderRadius:10,fontSize:13,fontWeight:700,cursor:"pointer"}}>
                  Сохранить план
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {view === "today" && <div style={{background:CARD,borderRadius:20,padding:20,boxShadow:"0 2px 16px rgba(17,12,48,0.08)"}}>
        <div style={{marginBottom:16}}>
          <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:6}}>
            <span style={{fontSize:24}}>{plan.emoji}</span>
            <div>
              <div style={{fontSize:18,fontWeight:700,color:TEXT}}>{plan.rubric}</div>
              <div style={{fontSize:11,color:MUTED,fontWeight:500}}>{plan.goal}</div>
            </div>
          </div>
          {plan.interactive && (
            <div style={{display:"flex",alignItems:"center",gap:6,padding:"8px 12px",background:"linear-gradient(135deg, #FEF3C7 0%, #FED7AA 100%)",borderRadius:10,marginTop:10}}>
              <span style={{fontSize:14}}>⚡</span>
              <span style={{fontSize:11,fontWeight:700,color:"#92400E"}}>ИНТЕРАКТИВНЫЙ ДЕНЬ — прогоняй реальное объявление через сервис</span>
            </div>
          )}
        </div>
        <div style={{height:1,background:BORDER,margin:"14px 0"}} />

        {step === "brief" && (
          <div style={{animation:"fadeUp 0.3s ease"}}>
            {/* Подсказка темы сегодня */}
            <div style={{padding:"14px 16px",background:DARK,borderRadius:14,marginBottom:16}}>
              <div style={{fontSize:10,letterSpacing:1.5,color:MUTED,fontWeight:700,marginBottom:6}}>ИДЕЯ НА СЕГОДНЯ</div>
              <div style={{fontSize:14,color:TEXT,lineHeight:1.5}}>{plan.topics[0]}</div>
            </div>

            {/* Главная кнопка */}
            <button
              onClick={() => { setCustomTopic(plan.topics[0]); setSelTopic(null); setStep("generating"); }}
              style={{width:"100%",padding:"18px",background:"linear-gradient(135deg, #9C6FFC 0%, #7433E2 100%)",color:"white",border:"none",borderRadius:16,fontSize:16,fontWeight:700,cursor:"pointer",boxShadow:"0 8px 20px rgba(139,92,246,0.4)",marginBottom:12}}>
              ✨ Написать пост
            </button>

            {/* Вторичная — другие темы */}
            <button onClick={() => setStep("topic")} style={{width:"100%",padding:"12px",background:"transparent",color:MUTED,border:`1px solid ${BORDER}`,borderRadius:12,fontSize:13,fontWeight:600,cursor:"pointer"}}>
              Другая тема →
            </button>
          </div>
        )}

        {step === "topic" && (
          <div style={{animation:"fadeUp 0.3s ease"}}>
            <div style={{fontSize:10,letterSpacing:2,color:MUTED,fontWeight:700,marginBottom:10}}>ВЫБЕРИ ТЕМУ</div>
            {getTopicsForDay(plan.day).map((t, i) => (
              <button key={i} onClick={() => { setSelTopic(t); setCustomTopic(""); }}
                style={{width:"100%",display:"flex",alignItems:"flex-start",gap:10,padding:"11px 13px",background:selTopic===t?"#EDE9FD":"transparent",border:`1px solid ${selTopic===t?BRAND:BORDER}`,borderRadius:10,cursor:"pointer",marginBottom:6,textAlign:"left"}}>
                <span style={{fontSize:11,color:MUTED,minWidth:14}}>{i+1}</span>
                <span style={{fontSize:13,color:TEXT,lineHeight:1.5}}>{t}</span>
              </button>
            ))}
            {botIdeas.length > 0 && (
              <>
                <div style={{height:1,background:BORDER,margin:"14px 0"}} />
                <div style={{fontSize:10,letterSpacing:2,color:BRAND,fontWeight:700,marginBottom:8}}>💡 ИДЕИ ИЗ БОТА</div>
                {botIdeas.slice(0,3).map((idea, i) => (
                  <button key={i} onClick={() => { setCustomTopic(idea.text); setSelTopic(null); }}
                    style={{width:"100%",display:"flex",alignItems:"flex-start",gap:10,padding:"10px 13px",background:customTopic===idea.text?"#EDE9FD":"transparent",border:`1px solid ${customTopic===idea.text?BRAND:BORDER}`,borderRadius:10,cursor:"pointer",marginBottom:6,textAlign:"left"}}>
                    <span style={{fontSize:11,color:BRAND,minWidth:16}}>💡</span>
                    <span style={{fontSize:13,color:TEXT,lineHeight:1.5}}>{idea.text}</span>
                  </button>
                ))}
              </>
            )}
            <div style={{height:1,background:BORDER,margin:"14px 0"}} />
            <div style={{fontSize:10,letterSpacing:2,color:MUTED,fontWeight:700,marginBottom:8}}>ИЛИ СВОЯ ТЕМА</div>
            <textarea style={{width:"100%",minHeight:68,background:DARK,border:`1px solid ${customTopic?BRAND:BORDER}`,borderRadius:10,padding:"10px 12px",color:TEXT,fontSize:13,lineHeight:1.5,resize:"vertical",outline:"none",fontFamily:"inherit",boxSizing:"border-box"}} placeholder="Опиши кейс, ситуацию, идею..." value={customTopic} onChange={(e) => { setCustomTopic(e.target.value); if (e.target.value) setSelTopic(null); }} />
            <div style={{display:"flex",gap:8,marginTop:14}}>
              <button style={{flex:1,padding:"13px",background:BRAND,color:"white",border:"none",borderRadius:10,fontSize:14,fontWeight:700,cursor:"pointer",opacity:topic?1:0.4}} disabled={!topic} onClick={generate}>✨ Написать пост →</button>
              <button style={{padding:"13px 14px",background:"transparent",color:MUTED,border:`1px solid ${BORDER}`,borderRadius:10,cursor:"pointer"}} onClick={() => setStep("brief")}>←</button>
            </div>
          </div>
        )}

        {step === "generating" && (
          <div style={{display:"flex",flexDirection:"column",alignItems:"center",padding:"36px 0"}}>
            <div style={{width:32,height:32,border:`3px solid ${BORDER}`,borderTop:`3px solid ${BRAND}`,borderRadius:"50%",animation:"spin 0.8s linear infinite",marginBottom:14}} />
            <div style={{fontSize:14,fontWeight:700,color:TEXT,marginBottom:8}}>{GEN_STEPS[genStep]}</div>
            <div style={{fontSize:12,color:MUTED,marginBottom:16}}>{genStep + 1} из {GEN_STEPS.length}</div>
            <div style={{width:"100%",height:3,background:BORDER,borderRadius:2,overflow:"hidden"}}>
              <div style={{height:"100%",background:BRAND,borderRadius:2,width:`${((genStep+1)/GEN_STEPS.length)*100}%`,transition:"width 0.4s ease"}} />
            </div>
          </div>
        )}

        {step === "drafts" && (
          <div style={{animation:"fadeUp 0.3s ease"}}>
            <div style={{fontSize:10,letterSpacing:2,color:MUTED,fontWeight:700,marginBottom:12}}>ПОСТ ГОТОВ</div>
            {draftErrors.tg ? (
              <div style={{background:"#FFF5F5",border:`1px solid ${ERROR}44`,borderRadius:10,padding:20,textAlign:"center"}}>
                <div style={{fontSize:13,color:ERROR,marginBottom:4}}>Не удалось сгенерировать</div>
                <div style={{fontSize:12,color:MUTED,marginBottom:14}}>Проблема с API — нажми чтобы повторить</div>
                <button style={{padding:"10px 20px",background:BRAND,color:"white",border:"none",borderRadius:9,fontSize:13,fontWeight:700,cursor:"pointer"}} onClick={() => regen("tg")}>
                  Повторить генерацию
                </button>
              </div>
            ) : (
              <>
                <div style={{background:DARK,border:`1px solid ${BORDER}`,borderRadius:12,padding:16,maxHeight:320,overflowY:"auto"}}>
                  <pre style={{fontSize:13,color:TEXT,lineHeight:1.75,whiteSpace:"pre-wrap",margin:0,fontFamily:"inherit"}}>{cleanMd(drafts.tg)}</pre>
                </div>
                <div style={{display:"flex",gap:7,marginTop:12}}>
                  <button
                    style={{flex:1,padding:"13px",background:published.includes("tg")?"#166534":sending.tg?"#374151":"linear-gradient(135deg, #9C6FFC 0%, #7433E2 100%)",color:"white",border:"none",borderRadius:10,fontSize:14,fontWeight:700,cursor:sending.tg?"default":"pointer",opacity:sending.tg?0.7:1,boxShadow:published.includes("tg")?"none":"0 4px 12px rgba(139,92,246,0.3)"}}
                    disabled={sending.tg}
                    onClick={() => tgUserId ? sendToTelegram("tg") : togglePub("tg")}
                  >
                    {published.includes("tg") ? "✅ Отправлено в чат" : sending.tg ? "Отправляю..." : tgUserId ? "📨 Отправить в Telegram" : "✓ Отметить готовым"}
                  </button>
                  <CopyButton text={drafts.tg || ""} color={BRAND} />
                  <button style={{padding:"13px 14px",background:"transparent",color:MUTED,border:`1px solid ${BORDER}`,borderRadius:10,cursor:"pointer",fontSize:15}} onClick={() => regen("tg")}>↻</button>
                </div>
              </>
            )}

            <div style={{height:1,background:BORDER,margin:"16px 0"}} />

            {/* Визуал — упрощённый, без табов */}
            <div style={{marginBottom:14}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
                <span style={{fontSize:12,fontWeight:700,color:TEXT}}>🎨 Визуал к посту</span>
                {!visualLoading && !visuals.tg && (
                  <button onClick={generateVisuals} style={{padding:"7px 14px",background:BRAND,color:"white",border:"none",borderRadius:8,fontSize:12,fontWeight:700,cursor:"pointer"}}>
                    Сгенерировать →
                  </button>
                )}
                {visualLoading && <span style={{fontSize:11,color:MUTED}}>Создаю...</span>}
              </div>

              {visualLoading && (
                <div style={{display:"flex",justifyContent:"center",padding:"20px 0"}}>
                  <div style={{width:24,height:24,border:`3px solid ${BORDER}`,borderTop:`3px solid ${BRAND}`,borderRadius:"50%",animation:"spin 0.8s linear infinite"}} />
                </div>
              )}

              {visuals.tg && (
                <div>
                  <div style={{marginBottom:10}}>
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:5}}>
                      <span style={{fontSize:10,fontWeight:700,letterSpacing:1,color:MUTED}}>ПРОМПТ ДЛЯ GPT / DALL-E</span>
                      <CopyButton text={visuals.tg.gpt} color={BRAND} />
                    </div>
                    <div style={{background:DARK,border:`1px solid ${BORDER}`,borderRadius:9,padding:12,fontSize:12,color:TEXT,lineHeight:1.6}}>
                      {visuals.tg.gpt}
                    </div>
                  </div>
                  <div>
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:5}}>
                      <span style={{fontSize:10,fontWeight:700,letterSpacing:1,color:MUTED}}>ТЗ ДЛЯ ДИЗАЙНЕРА</span>
                      <CopyButton text={visuals.tg.tz} color={BRAND} />
                    </div>
                    <div style={{background:DARK,border:`1px solid ${BORDER}`,borderRadius:9,padding:12,fontSize:12,color:TEXT,lineHeight:1.8,whiteSpace:"pre-wrap"}}>
                      {visuals.tg.tz}
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div style={{height:1,background:BORDER,margin:"14px 0"}} />
            <div style={{display:"flex",gap:7}}>
              <button style={{flex:1,padding:"12px",background:published.includes("tg")?BRAND:"transparent",color:published.includes("tg")?"white":MUTED,border:`1px solid ${published.includes("tg")?BRAND:BORDER}`,borderRadius:10,fontSize:13,fontWeight:700,cursor:"pointer"}} onClick={finish}>
                {published.includes("tg") ? "🎯 Закрыть день" : "Сначала отправь пост"}
              </button>
              <button style={{padding:"12px 14px",background:"transparent",color:MUTED,border:`1px solid ${BORDER}`,borderRadius:10,cursor:"pointer"}} onClick={restart}>←</button>
            </div>
          </div>
        )}

        {step === "done" && (
          <div style={{display:"flex",flexDirection:"column",alignItems:"center",padding:"28px 0"}}>
            <div style={{fontSize:42,marginBottom:10}}>🎯</div>
            <div style={{fontSize:19,fontWeight:700,marginBottom:5}}>День закрыт!</div>
            <div style={{fontSize:13,color:MUTED,marginBottom:14}}>{doneDays.length} из 5 задач на этой неделе</div>
            <div style={{width:"100%",height:4,background:BORDER,borderRadius:2,overflow:"hidden",marginBottom:16}}>
              <div style={{height:"100%",background:BRAND,borderRadius:2,width:`${(doneDays.length/5)*100}%`,transition:"width 0.5s"}} />
            </div>
            <div style={{display:"flex",gap:6,flexWrap:"wrap",justifyContent:"center",marginBottom:18}}>
              <span style={{fontSize:12,padding:"5px 14px",borderRadius:20,background:"#EDE9FD",color:BRAND,border:`1px solid ${BRAND}44`,fontWeight:600}}>✅ Пост опубликован</span>
            </div>
            <button style={{width:"100%",padding:"13px",background:BRAND,color:"white",border:"none",borderRadius:10,fontSize:14,fontWeight:700,cursor:"pointer"}} onClick={restart}>Ещё одна задача</button>
          </div>
        )}
      </div>}
      {view === "today" && step==="brief" && <div style={{textAlign:"center",fontSize:12,color:MUTED,marginTop:14}}>💜 Один сильный пост лучше трёх средних</div>}

      {/* 💡 Ideas from bot */}
      {view === "today" && step==="brief" && botIdeas.length > 0 && (
        <div style={{background:CARD,borderRadius:20,padding:18,marginTop:12,boxShadow:"0 2px 12px rgba(17,12,48,0.07)"}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
            <div style={{fontSize:10,letterSpacing:2,color:MUTED,fontWeight:700}}>💡 ИДЕИ ИЗ БОТА</div>
            <span style={{fontSize:11,color:MUTED}}>{botIdeas.length} идей</span>
          </div>
          {botIdeas.slice(0,3).map((idea, i) => (
            <div key={i} style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"10px 0",borderBottom:i<Math.min(botIdeas.length,3)-1?`1px solid ${BORDER}`:"none"}}>
              <span style={{fontSize:13,color:TEXT,lineHeight:1.4,flex:1,marginRight:10}}>{idea.text}</span>
              <button onClick={() => { setCustomTopic(idea.text); setSelTopic(null); setStep("generating"); }}
                style={{padding:"5px 12px",background:BRAND,color:"white",border:"none",borderRadius:8,fontSize:11,fontWeight:700,cursor:"pointer",whiteSpace:"nowrap",flexShrink:0}}>
                Писать
              </button>
            </div>
          ))}
          {botIdeas.length > 3 && (
            <div style={{fontSize:12,color:MUTED,textAlign:"center",marginTop:10}}>+ ещё {botIdeas.length - 3} идей в боте (/ideas)</div>
          )}
        </div>
      )}

      {view === "today" && (() => {
        const reels = REELS_PLAN[dow] || REELS_PLAN[1];
        return (
          <div style={{background:CARD,border:`1px solid ${reelsFilmed?BRAND:BORDER}`,borderRadius:16,padding:20,marginTop:12,animation:"fadeUp 0.3s ease"}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:4}}>
              <div style={{fontSize:10,letterSpacing:2,color:MUTED,fontWeight:700}}>ИДЕЯ ДЛЯ REELS СЕГОДНЯ</div>
              {reelsFilmed && <span style={{fontSize:11,color:BRAND,fontWeight:700}}>✓ Снято</span>}
            </div>
            <div style={{fontSize:16,fontWeight:700,color:TEXT,marginBottom:4}}>{reels.label} · {reels.format}</div>
            <div style={{fontSize:13,color:MUTED,lineHeight:1.5,marginBottom:14}}>{reels.hint}</div>

            {!reelsScript && !reelsLoading && (
              <div style={{display:"flex",gap:8}}>
                <button onClick={generateReelsScript} style={{flex:1,padding:"12px",background:BRAND,color:"white",border:"none",borderRadius:10,fontSize:13,fontWeight:700,cursor:"pointer"}}>
                  Написать сценарий →
                </button>
                <button onClick={() => setReelsFilmed((f) => !f)} style={{padding:"12px 14px",background:reelsFilmed?"#EDE9FD":"transparent",color:reelsFilmed?BRAND:MUTED,border:`1px solid ${reelsFilmed?BRAND:BORDER}`,borderRadius:10,fontSize:12,fontWeight:700,cursor:"pointer"}}>
                  {reelsFilmed ? "✓ Снято" : "Снято"}
                </button>
              </div>
            )}

            {reelsLoading && (
              <div style={{display:"flex",alignItems:"center",gap:10,padding:"12px 0"}}>
                <div style={{width:20,height:20,border:`2px solid ${BORDER}`,borderTop:`2px solid ${BRAND}`,borderRadius:"50%",animation:"spin 0.8s linear infinite"}} />
                <span style={{fontSize:13,color:MUTED}}>Пишу сценарий...</span>
              </div>
            )}

            {reelsScript && (
              <div style={{animation:"fadeUp 0.3s ease"}}>
                <div style={{background:DARK,border:`1px solid ${BORDER}`,borderRadius:10,padding:14,maxHeight:300,overflowY:"auto",marginBottom:10}}>
                  <pre style={{fontSize:12.5,color:TEXT,lineHeight:1.8,whiteSpace:"pre-wrap",margin:0,fontFamily:"inherit"}}>{cleanMd(reelsScript)}</pre>
                </div>
                <div style={{display:"flex",gap:7,marginBottom:7}}>
                  <button
                    onClick={() => tgUserId ? sendReelsToTelegram() : setReelsFilmed(true)}
                    disabled={reelsSending}
                    style={{flex:1,padding:"12px",background:reelsSent?"#166534":reelsSending?"#374151":"linear-gradient(135deg, #9C6FFC 0%, #7433E2 100%)",color:"white",border:"none",borderRadius:10,fontSize:13,fontWeight:700,cursor:reelsSending?"default":"pointer",opacity:reelsSending?0.7:1,boxShadow:reelsSent?"none":"0 4px 12px rgba(139,92,246,0.3)"}}
                  >
                    {reelsSent ? "✅ Отправлено в чат" : reelsSending ? "Отправляю..." : tgUserId ? "📨 Отправить в Telegram" : "✓ Отметить снято"}
                  </button>
                  <CopyButton text={reelsScript} color={BRAND} />
                  <button onClick={() => { setReelsScript(null); setReelsSent(false); generateReelsScript(); }} style={{padding:"12px 14px",background:"transparent",color:MUTED,border:`1px solid ${BORDER}`,borderRadius:10,cursor:"pointer",fontSize:15}}>↻</button>
                </div>
                <button onClick={() => setReelsFilmed((f) => !f)} style={{width:"100%",padding:"9px",background:reelsFilmed?"#EDE9FD":"transparent",color:reelsFilmed?BRAND:MUTED,border:`1px solid ${reelsFilmed?BRAND:BORDER}`,borderRadius:10,fontSize:12,fontWeight:600,cursor:"pointer"}}>
                  {reelsFilmed ? "✅ Снято" : "Отметить как снятое"}
                </button>
              </div>
            )}
          </div>
        );
      })()}
    </div>
  );
}
