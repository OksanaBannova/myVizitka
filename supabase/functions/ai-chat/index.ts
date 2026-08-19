// supabase/functions/ai-chat/index.ts

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, apikey',
};

const DEEPSEEK_API_URL = 'https://api.deepseek.com/v1/chat/completions';

// ============================================================
//  ПОЛНЫЙ ПРАЙС-ЛИСТ
// ============================================================

const PRICES = {
  // --- ТАРИФ «ДЛЯ СЕБЯ» ---
  personal: [
    { name: 'НейроФото', price: 'от 600 ₽' },
    { name: 'Портрет поколений', price: 'от 600 ₽' },
    { name: 'Индивидуальная фотосессия', price: 'от 100 ₽' },
    { name: 'Трендовое фото', price: 'от 150 ₽' },
    { name: 'Детская фотосессия', price: 'от 100 ₽' },
    { name: 'Семейное фото', price: 'от 450 ₽' },
    { name: 'Парная фотосессия', price: 'от 250 ₽' },
    { name: 'Парная трендовая фотосессия', price: 'от 300 ₽' },
    { name: 'Замена фона', price: 'от 50 ₽' },
    { name: 'Фото по вашему запросу', price: 'от 150 ₽' },
    { name: 'Сертификат на фотосессию', price: 'от 1 500 ₽' },
    { name: 'Сертификат на нейрофото', price: 'от 2 000 ₽' },
  ],
  // --- ТАРИФ «ДЛЯ БИЗНЕСА» ---
  business: [
    { name: 'AI Фото товара', price: 'от 2 900 ₽', desc: 'До 10 изображений, любой фон, для маркетплейсов' },
    { name: 'AI Фото для личного бренда', price: '5 900 ₽', desc: '30 фото, до 10 образов, высокое качество' },
    { name: 'AI Фото команды компании', price: 'от 9 900 ₽', desc: 'Единый стиль для руководителей и сотрудников' },
    { name: 'Карточка товара Premium', price: '3 500 ₽', desc: 'Инфографика, SEO-текст, дизайн' },
    { name: 'Комплект карточек (до 5)', price: '14 900 ₽', desc: 'До 5 товаров' },
    { name: 'Landing Page', price: '29 900 ₽', desc: 'Современный дизайн, адаптация, форма заявок, SEO' },
    { name: 'Корпоративный сайт', price: '59 900 ₽', desc: 'До 10 страниц, CMS, анимация, форма заявок' },
    { name: 'SaaS / CRM', price: 'от 120 000 ₽', desc: 'Авторизация, личный кабинет, БД, админ-панель' },
    { name: 'AI Консультант на сайт', price: '24 900 ₽', desc: 'Обучение на данных компании, ответы 24/7' },
    { name: 'Telegram / WhatsApp bot', price: 'от 39 900 ₽', desc: 'Приём заявок, FAQ, запись клиентов' },
    { name: 'AI Отдел продаж', price: 'от 69 900 ₽', desc: 'Квалификация, CRM, аналитика' },
    { name: 'Логотип', price: '4 900 ₽' },
    { name: 'Фирменный стиль', price: '9 900 ₽' },
    { name: 'Баннеры (за шт)', price: '990 ₽' },
    { name: 'Рекламные креативы (за шт)', price: '1 500 ₽' },
    { name: 'START BUSINESS', price: '39 900 ₽', desc: 'Лендинг + AI-консультант + форма заявок' },
    { name: 'BUSINESS PRO', price: '79 900 ₽', desc: 'Корпоративный сайт + AI-консультант + 10 карточек' },
    { name: 'DIGITAL BUSINESS', price: '149 900 ₽', desc: 'SaaS/CRM + AI-консультант + AI-фотосессия + фирмстиль' },
  ]
};

// ============================================================
//  ЛОКАЛЬНЫЕ ОТВЕТЫ С ПРАЙСОМ
// ============================================================

function getLocalResponse(userText, history) {
  const text = userText.toLowerCase();
  const fullHistory = history.map(m => m.content.toLowerCase()).join(' ');

  // --- ПРИВЕТСТВИЕ ---
  if (text.includes('привет') || text.includes('здравств') || text.includes('добрый') || text.includes('hi') || text.includes('hello')) {
    return "👋 Привет! Я AI-помощник Оксаны.\n\nЯ могу рассказать о:\n• 📸 Нейрофото и фотосессиях\n• 💻 AI-сайтах и лендингах\n• 🤖 Макс ботах и автоматизации\n• 🛍️ Карточках для маркетплейсов\n• 💰 Ценах на все услуги\n\nПросто спросите меня о любой услуге!";
  }

  // --- ЦЕНЫ (все услуги) ---
  if (text.includes('цена') || text.includes('стоимость') || text.includes('сколько') || text.includes('прайс') || text.includes('все услуги') || fullHistory.includes('цена')) {
    let reply = "💰 *Полный прайс-лист:*\n\n";
    reply += "📸 *Для себя:*\n";
    PRICES.personal.forEach(item => {
      reply += `• ${item.name} — ${item.price}\n`;
    });
    reply += "\n🏢 *Для бизнеса:*\n";
    PRICES.business.forEach(item => {
      reply += `• ${item.name} — ${item.price}`;
      if (item.desc) reply += ` (${item.desc})`;
      reply += '\n';
    });
    reply += "\n📌 Точная стоимость зависит от задачи. Напишите на почту oksanchik2170@yandex.ru для индивидуального расчёта!";
    return reply;
  }

  // --- НЕЙРОФОТО ---
  if (text.includes('нейрофото') || text.includes('портрет') || text.includes('ретушь')) {
    return "📸 *НейроФото* — это художественные AI-портреты с глубокой проработкой деталей.\n\nЯ создаю:\n• Семейные портреты\n• Фото для соцсетей\n• Художественные коллажи\n• Обработку с ретушью\n\n💰 *Стоимость:*\n• НейроФото — от 600 ₽\n• Портрет поколений — от 600 ₽\n• Индивидуальная фотосессия — от 100 ₽\n• Трендовое фото — от 150 ₽\n• Замена фона — от 50 ₽\n\nХотите попробовать? Напишите на почту oksanchik2170@yandex.ru!";
  }

  // --- ФОТОСЕССИИ ---
  if (text.includes('фотосесси') || text.includes('семейное фото') || text.includes('детское фото') || text.includes('парное фото') || text.includes('love story')) {
    let reply = "📸 *Фотосессии:*\n\n";
    const photoServices = PRICES.personal.filter(item => 
      item.name.includes('фото') || item.name.includes('портрет') || item.name.includes('съемк')
    );
    photoServices.forEach(item => {
      reply += `• ${item.name} — ${item.price}\n`;
    });
    reply += "\n🎁 Также есть подарочные сертификаты:\n";
    reply += "• Сертификат на фотосессию — от 1 500 ₽\n";
    reply += "• Сертификат на нейрофото — от 2 000 ₽\n\n📌 Подберу идеальный формат под ваш запрос! Пишите на oksanchik2170@yandex.ru";
    return reply;
  }

  // --- САЙТЫ ---
  if (text.includes('сайт') || text.includes('лендинг') || text.includes('landing') || text.includes('корпоративный сайт') || text.includes('страница')) {
    return "💻 *AI-сайты и лендинги под ключ:*\n\n• Landing Page — 29 900 ₽\n  Современный дизайн, адаптация, форма заявок, SEO\n• Корпоративный сайт — 59 900 ₽\n  До 10 страниц, CMS, анимация, форма заявок\n• SaaS / CRM — от 120 000 ₽\n  Авторизация, личный кабинет, БД, админ-панель\n\n✨ Все сайты адаптируются под телефоны и имеют современный UI.\n\n📌 Расскажите о вашем проекте — я предложу лучшее решение!";
  }

  // --- БОТЫ ---
  if (text.includes('бот') || text.includes('макс') || text.includes('автоматизация') || text.includes('консультант') || text.includes('телеграм') || text.includes('whatsapp')) {
    return "🤖 *AI-автоматизация:*\n\n• AI Консультант на сайт — 24 900 ₽\n  Обучение на данных компании, ответы 24/7\n• Telegram / WhatsApp bot — от 39 900 ₽\n  Приём заявок, FAQ, запись клиентов\n• AI Отдел продаж — от 69 900 ₽\n  Квалификация, CRM, аналитика\n\n🚀 Это моя новая разработка! Умные боты для автоматизации заявок и сбора лидов.\n\nХотите попробовать? Пишите на oksanchik2170@yandex.ru!";
  }

  // --- МАРКЕТПЛЕЙСЫ ---
  if (text.includes('карточк') || text.includes('маркетплейс') || text.includes('wildberries') || text.includes('ozon') || text.includes('вб') || text.includes('инфографик')) {
    return "🛍️ *Карточки для маркетплейсов:*\n\n• Карточка товара Premium — 3 500 ₽\n  Инфографика, SEO-текст, дизайн\n• Комплект карточек (до 5) — 14 900 ₽\n\n• AI Фото товара — от 2 900 ₽\n  До 10 изображений, любой фон, для маркетплейсов\n• AI Фото для личного бренда — 5 900 ₽\n  30 фото, до 10 образов, высокое качество\n• AI Фото команды компании — от 9 900 ₽\n  Единый стиль для руководителей и сотрудников\n\n📌 Всё под ваш бренд — сделаем крутой визуал!";
  }

  // --- ЛОГОТИП И ФИРМСТИЛЬ ---
  if (text.includes('логотип') || text.includes('фирменный стиль') || text.includes('бренд') || text.includes('айдентика')) {
    return "🎨 *Фирменный стиль:*\n\n• Логотип — 4 900 ₽\n• Фирменный стиль — 9 900 ₽\n• Баннеры — 990 ₽ / шт\n• Рекламные креативы — 1 500 ₽ / шт\n\n📌 Создам уникальный образ для вашего бизнеса!";
  }

  // --- ГОТОВЫЕ ПАКЕТЫ ---
  if (text.includes('пакет') || text.includes('готовый') || text.includes('комплекс') || text.includes('под ключ')) {
    return "🚀 *Готовые пакеты для бизнеса:*\n\n• START BUSINESS — 39 900 ₽\n  Лендинг + AI-консультант + форма заявок\n\n• BUSINESS PRO — 79 900 ₽\n  Корпоративный сайт + AI-консультант + 10 карточек\n\n• DIGITAL BUSINESS — 149 900 ₽\n  SaaS/CRM + AI-консультант + AI-фотосессия + фирмстиль\n\n📌 Все пакеты собираются под ключ и включают полную настройку!";
  }

  // --- КОНТАКТЫ ---
  if (text.includes('связаться') || text.includes('контакт') || text.includes('почта') || text.includes('написать') || text.includes('телефон')) {
    return "📬 *Связаться со мной:*\n\n📧 Email: oksanchik2170@yandex.ru\n\nНапишите на почту — обсудим ваш проект, я отвечу в течение нескольких часов!";
  }

  // --- О КОМПАНИИ ---
  if (text.includes('кто ты') || text.includes('кто вы') || text.includes('о себе') || text.includes('оксана') || text.includes('баннова')) {
    return "👩‍💻 *Привет! Я Оксана Баннова.*\n\nЯ самозанятая специалистка с образованием по специальности «Прикладная математика и информатика» (КемГУ, 2018) и дополнительным образованием «JavaScript-разработчик» (Нетология, 2025).\n\nЯ создаю нейрофото, сайты, ботов и карточки для маркетплейсов. Мой подход — сочетание математического склада ума и современных нейросетей.\n\n📌 Сайт: https://oksanabannova.github.io/myVizitka/\n📧 Почта: oksanchik2170@yandex.ru";
  }

  // --- ДЕФОЛТНЫЙ ОТВЕТ ---
  return "🙏 *Спасибо за ваш вопрос!*\n\nЯ могу помочь с:\n• 📸 Нейрофото и фотосессиями\n• 💻 AI-сайтами и лендингами\n• 🤖 Макс ботами и автоматизацией\n• 🛍️ Карточками для маркетплейсов\n• 🎨 Фирменным стилем и логотипами\n• 🚀 Готовыми пакетами\n\nИли просто спросите меня о ценах, я покажу полный прайс-лист!\n\n📌 Если не нашли ответ — напишите мне на почту oksanchik2170@yandex.ru, я обязательно отвечу!";
}

// ============================================================
//  ОСНОВНАЯ ФУНКЦИЯ
// ============================================================

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { messages } = await req.json();

    if (!messages || !Array.isArray(messages)) {
      return new Response(
        JSON.stringify({ error: 'Неверный формат запроса' }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    const deepseekApiKey = Deno.env.get('DEEPSEEK_API_KEY');

    // Если есть ключ DeepSeek — пробуем использовать его
    if (deepseekApiKey) {
      try {
        const response = await fetch(DEEPSEEK_API_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${deepseekApiKey}`,
          },
          body: JSON.stringify({
            model: 'deepseek-chat',
            messages: [
              {
                role: 'system',
                content: `Ты — AI-помощник Оксаны Банновой. 
Ты помогаешь клиентам с вопросами о нейрофото, сайтах, ботах и карточках для маркетплейсов. 
Отвечай вежливо, кратко и по делу. 
Если не знаешь ответа — предложи написать на почту oksanchik2170@yandex.ru.
Вот полный прайс-лист: ${JSON.stringify(PRICES, null, 2)}`
              },
              ...messages
            ],
            max_tokens: 500,
            temperature: 0.7,
            stream: false,
          }),
        });

        const data = await response.json();

        if (response.ok && data.choices?.[0]?.message?.content) {
          const reply = data.choices[0].message.content;
          return new Response(
            JSON.stringify({ reply }),
            {
              headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            }
          );
        }
      } catch (error) {
        console.error('DeepSeek Error:', error);
      }
    }

    // Если DeepSeek не доступен — используем локальные ответы
    const userMessages = messages.filter(m => m.role === 'user');
    const userText = userMessages.length > 0 ? userMessages[userMessages.length - 1].content : '';
    const reply = getLocalResponse(userText, messages);

    return new Response(
      JSON.stringify({ reply }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Ошибка:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});