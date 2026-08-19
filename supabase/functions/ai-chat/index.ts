// supabase/functions/ai-chat/index.ts

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, apikey',
};

Deno.serve(async (req) => {
  // Обработка preflight (OPTIONS) запроса
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

    // Получаем последнее сообщение пользователя
    const userMessages = messages.filter(m => m.role === 'user');
    const userText = userMessages.length > 0 ? userMessages[userMessages.length - 1].content : '';

    // Локальные ответы (без OpenAI)
    const reply = getLocalResponse(userText, messages);

    return new Response(
      JSON.stringify({ reply }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});

// --- Локальные ответы (работают без OpenAI) ---
function getLocalResponse(userText, history) {
  const text = userText.toLowerCase();
  
  // Проверяем всю историю, чтобы понять контекст
  const fullHistory = history.map(m => m.content.toLowerCase()).join(' ');

  // Нейрофото
  if (text.includes('нейрофото') || text.includes('фото') || text.includes('портрет') || fullHistory.includes('нейрофото')) {
    return "📸 Нейрофото — это художественные AI-портреты с глубокой проработкой деталей.\n\nЯ создаю:\n• Семейные портреты\n• Фото для соцсетей\n• Художественные коллажи\n• Обработку с ретушью\n\nСтоимость от 600 ₽. Хотите попробовать? Напишите мне на почту oksanchik2170@yandex.ru!";
  }

  // Сайты
  if (text.includes('сайт') || text.includes('лендинг') || text.includes('страница') || fullHistory.includes('сайт')) {
    return "💻 Я создаю продающие AI-сайты и лендинги под ключ:\n\n• Современный дизайн\n• Анимации и эффекты\n• Формы заявок\n• Адаптив под телефоны\n• Интеграция с мессенджерами\n\nСтоимость от 29 900 ₽. Расскажите о вашем проекте — я предложу лучшее решение!";
  }

  // Боты
  if (text.includes('бот') || text.includes('макс') || text.includes('автоматизация') || fullHistory.includes('бот')) {
    return "🤖 Макс боты — это моя новая разработка!\n\nУмные боты для:\n• Автоматизации заявок\n• Ответов на вопросы клиентов\n• Сбора лидов\n• Консультаций в мессенджерах\n\nСтоимость от 39 900 ₽. Чтобы не пропустить запуск — подпишитесь на обновления!";
  }

  // Маркетплейсы
  if (text.includes('карточк') || text.includes('маркетплейс') || text.includes('wildberries') || text.includes('ozon') || text.includes('вб') || fullHistory.includes('карточк')) {
    return "🛍️ Я создаю карточки для маркетплейсов:\n\n• AI-фоны и атмосфера\n• Инфографика\n• Акцент на выгодах\n• Стиль под ваш бренд\n\nСтоимость от 3 500 ₽ за карточку. Расскажите о вашем товаре — сделаем крутой визуал!";
  }

  // Цены
  if (text.includes('цена') || text.includes('стоимость') || text.includes('сколько') || text.includes('прайс') || fullHistory.includes('цена')) {
    return "💰 Цены на услуги:\n\n📸 Нейрофото — от 600 ₽\n💻 AI-сайты — от 29 900 ₽\n🛍️ Карточки — от 3 500 ₽\n🤖 Макс боты — от 39 900 ₽\n\nТочная стоимость зависит от задачи. Напишите мне на почту oksanchik2170@yandex.ru — обсудим детали!";
  }

  // Приветствие
  if (text.includes('привет') || text.includes('здравств') || text.includes('добрый') || text.includes('hi') || text.includes('hello')) {
    return "Привет! 👋 Рада вас видеть!\n\nЧем могу помочь? Я отвечу на вопросы о:\n• Нейрофото 📸\n• AI-сайтах 💻\n• Макс ботах 🤖\n• Карточках 🛍️\n\nИли просто расскажу о себе и проектах!";
  }

  // Если ничего не подошло
  return "Спасибо за ваш вопрос! 🙏\n\nМогу предложить:\n• Посмотреть мои работы в портфолио\n• Заказать нейрофото, сайт или карточки\n• Узнать больше о предстоящих проектах\n\nЕсли не нашли ответ — напишите мне лично на почту oksanchik2170@yandex.ru, я обязательно отвечу!";
}