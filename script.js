const SUPABASE_URL = "https://eskauqttcvfxrbnvljyu.supabase.co";
const SUPABASE_KEY = "sb_publishable_l0krKw0Ct33vQ0qKVznytw_YTFRiH_T";

const supabase = window.supabase.createClient(
  SUPABASE_URL,
  SUPABASE_KEY
);

async function saveLead(data) {
  console.log("Отправляем в Supabase:", data);

  try {
    const result = await supabase
      .from("leads")
      .insert([data])
      .select();

    console.log("FULL RESPONSE:", result);

    if (result.error) {
      console.error("SUPABASE ERROR MESSAGE:", result.error.message);
      console.error("SUPABASE ERROR FULL:", result.error);
      alert("Ошибка Supabase: " + result.error.message);
      return false;
    } else {
      console.log("SUCCESS:", result.data);
      alert("✅ Заявка сохранена!");
      return true;
    }
  } catch (err) {
    console.error("JS ERROR:", err);
    alert("❌ Ошибка: " + err.message);
    return false;
  }
}

const portfolioItems = [
  {
    id: "neiro",
    tag: "Нейрофото",
    name: "Семейные AI-портреты",
    desc: "Нейрофото с художественной обработкой и ретушью. Нажмите, чтобы открыть галерею."
  },
  {
    id: "site",
    tag: "AI-сайты",
    name: "Лендинги под ключ",
    desc: "Продающие сайты с формами заявок, анимацией и современным UI."
  },
  {
    id: "bot",
    tag: "Макс боты",
    name: "Автоматизация будущего",
    desc: "Скоро здесь появятся умные боты для бизнеса. Следите за обновлениями! 🚀"
  },
  {
    id: "market",
    tag: "Маркетплейсы",
    name: "Карточки товаров",
    desc: "Карточки для Wildberries / Ozon с AI-фонами и инфографикой. Нажмите, чтобы открыть галерею."
  }
];

const chipsData = [
  { type: "neiro", text: "Нейрофото" },
  { type: "site", text: "AI-сайты" },
  { type: "bot", text: "Макс боты" },
  { type: "market", text: "Маркетплейсы" }
];

// Компонент MessageModal
function MessageModal({ message, onClose }) {
  if (!message) return null;

  return React.createElement(
    "div",
    { className: "modal active", onClick: onClose },
    React.createElement(
      "div",
      {
        className: "modal-content",
        onClick: (e) => e.stopPropagation(),
        style: {
          background: "#111827",
          padding: "30px",
          borderRadius: "20px",
          color: "white",
          maxWidth: "420px",
          textAlign: "center"
        }
      },
      React.createElement("h3", { style: { marginBottom: "16px" } }, "Информация"),
      React.createElement("p", { style: { lineHeight: 1.6 } }, message),
      React.createElement(
        "button",
        {
          className: "btn btn-primary",
          style: { marginTop: "20px", marginInline: "auto" },
          onClick: onClose
        },
        "Закрыть"
      )
    )
  );
}

// Компонент галереи (сетка + карусель)
function GalleryModal({ isOpen, onClose, photos, title }) {
  const [currentIndex, setCurrentIndex] = React.useState(0);
  const [viewMode, setViewMode] = React.useState('grid'); // 'grid' или 'carousel'
  const [touchStart, setTouchStart] = React.useState(null);
  const total = photos.length;

  React.useEffect(() => {
    const handler = (e) => {
      if (e.key === "Escape") {
        if (viewMode === 'carousel') {
          setViewMode('grid');
        } else {
          onClose();
        }
      }
      if (e.key === "ArrowLeft" && viewMode === 'carousel') {
        setCurrentIndex(prev => prev > 0 ? prev - 1 : prev);
      }
      if (e.key === "ArrowRight" && viewMode === 'carousel') {
        setCurrentIndex(prev => prev < total - 1 ? prev + 1 : prev);
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handler);
      return () => document.removeEventListener("keydown", handler);
    }
  }, [isOpen, viewMode, total, onClose]);

  if (!isOpen) return null;

  const openCarousel = (index) => {
    setCurrentIndex(index);
    setViewMode('carousel');
  };

  const next = () => {
    if (currentIndex < total - 1) setCurrentIndex(currentIndex + 1);
  };

  const prev = () => {
    if (currentIndex > 0) setCurrentIndex(currentIndex - 1);
  };

  const closeGallery = () => {
    if (viewMode === 'carousel') {
      setViewMode('grid');
    } else {
      onClose();
    }
  };

  return React.createElement(
    "div",
    { className: "modal active", onClick: closeGallery },
    React.createElement("span", { className: "modal-close", onClick: closeGallery }, "×"),
    
    // Режим сетки
    viewMode === 'grid' && React.createElement(
      "div",
      {
        className: "modal-content",
        onClick: (e) => e.stopPropagation(),
        style: {
          maxWidth: '90vw',
          maxHeight: '90vh',
          overflowY: 'auto',
          padding: '20px'
        }
      },
      React.createElement(
        "h3",
        {
          style: {
            color: 'white',
            marginBottom: '20px',
            textAlign: 'center',
            fontSize: '24px'
          }
        },
        title
      ),
      React.createElement(
        "div",
        {
          style: {
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
            gap: '12px',
            maxWidth: '900px',
            margin: '0 auto'
          }
        },
        photos.map((photo, index) =>
          React.createElement(
            "div",
            {
              key: index,
              style: {
                aspectRatio: '1/1',
                borderRadius: '12px',
                overflow: 'hidden',
                cursor: 'pointer',
                border: '2px solid rgba(255,255,255,0.1)',
                transition: 'all 0.3s ease'
              },
              onMouseEnter: (e) => {
                e.currentTarget.style.borderColor = '#21d4fd';
                e.currentTarget.style.transform = 'scale(1.05)';
              },
              onMouseLeave: (e) => {
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)';
                e.currentTarget.style.transform = 'scale(1)';
              },
              onClick: () => openCarousel(index)
            },
            React.createElement("img", {
              src: photo,
              alt: `${title} ${index + 1}`,
              style: {
                width: '100%',
                height: '100%',
                objectFit: 'cover'
              },
              loading: "lazy",
              onError: (e) => {
                e.target.style.display = 'none';
                e.target.parentElement.style.background = '#1a1a2e';
                e.target.parentElement.innerHTML = `
                  <div style="display:flex;align-items:center;justify-content:center;height:100%;color:#666;font-size:14px;">📷</div>
                `;
              }
            })
          )
        )
      )
    ),

    // Режим карусели
    viewMode === 'carousel' && React.createElement(
      React.Fragment,
      null,
      React.createElement(
        "button",
        {
          className: "carousel-btn carousel-prev",
          onClick: (e) => {
            e.stopPropagation();
            prev();
          }
        },
        "‹"
      ),
      React.createElement(
        "button",
        {
          className: "carousel-btn carousel-next",
          onClick: (e) => {
            e.stopPropagation();
            next();
          }
        },
        "›"
      ),
      React.createElement(
        "div",
        {
          className: "modal-content",
          onClick: (e) => e.stopPropagation(),
          onTouchStart: (e) => setTouchStart(e.touches[0].clientX),
          onTouchEnd: (e) => {
            const end = e.changedTouches[0].clientX;
            const diff = touchStart - end;
            if (diff > 50) next();
            if (diff < -50) prev();
          }
        },
        React.createElement("img", {
          src: photos[currentIndex],
          alt: `${title} ${currentIndex + 1}`,
          loading: "lazy",
          onError: (e) => {
            e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" fill="%23333" viewBox="0 0 24 24"%3E%3Cpath d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" stroke="%23666"/%3E%3C/svg%3E';
            e.target.style.background = '#1a1a2e';
            e.target.style.padding = '20%';
          }
        })
      ),
      React.createElement(
        "div",
        { className: "carousel-counter" },
        `${currentIndex + 1} / ${total}`
      ),
      React.createElement(
        "button",
        {
          style: {
            position: 'absolute',
            bottom: '70px',
            left: '50%',
            transform: 'translateX(-50%)',
            background: 'rgba(255,255,255,0.1)',
            color: 'white',
            border: '1px solid rgba(255,255,255,0.2)',
            borderRadius: '999px',
            padding: '8px 20px',
            cursor: 'pointer',
            fontSize: '14px',
            zIndex: '1001',
            backdropFilter: 'blur(8px)'
          },
          onClick: (e) => {
            e.stopPropagation();
            setViewMode('grid');
          }
        },
        "← Вернуться к сетке"
      )
    )
  );
}

// Компонент ProfilePhoto
function ProfilePhoto() {
  const [error, setError] = React.useState(false);

  if (error) {
    return React.createElement(
      "div",
      {
        className: "photo-inner",
        style: {
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          background: "linear-gradient(135deg,#667eea,#764ba2)",
          color: "white",
          fontSize: "20px"
        }
      },
      "📸 Оксана"
    );
  }

  return React.createElement(
    "div",
    { className: "photo-inner" },
    React.createElement("img", {
      src: "oksana.jpg",
      alt: "Оксана Баннова",
      style: {
        width: "100%",
        height: "100%",
        objectFit: "cover"
      },
      onError: () => setError(true)
    }),
    React.createElement("div", { className: "photo-glow" })
  );
}

// Компонент ChatWidget (улучшенный)
function ChatWidget() {
  const [open, setOpen] = React.useState(false);
  const [messages, setMessages] = React.useState([
    {
      sender: "bot",
      text: "Привет 👋 Я AI-помощник Оксаны. Чем могу помочь?\n\nЗадайте мне любой вопрос о:\n• Нейрофото 📸\n• AI-сайтах 💻\n• Макс ботах 🤖\n• Карточках для маркетплейсов 🛍️"
    }
  ]);
  const [input, setInput] = React.useState("");
  const [isProcessing, setIsProcessing] = React.useState(false);
  const messagesEndRef = React.useRef(null);
  const inputRef = React.useRef(null);

  // Автопрокрутка к последнему сообщению
  React.useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }
  }, [messages]);

  // Фокус на поле ввода при открытии
  React.useEffect(() => {
    if (open && inputRef.current) {
      setTimeout(() => {
        inputRef.current.focus();
      }, 100);
    }
  }, [open]);

  const getAIResponse = (userMessage) => {
    const msg = userMessage.toLowerCase();
    
    // Ответы про нейрофото
    if (msg.includes('нейрофото') || msg.includes('фото') || msg.includes('портрет')) {
      return "📸 Нейрофото — это художественные AI-портреты с глубокой проработкой деталей.\n\nЯ создаю:\n• Семейные портреты\n• Фото для соцсетей\n• Художественные коллажи\n• Обработку с ретушью\n\nСтоимость от 2000₽ за одну работу. Хотите попробовать? Напишите мне на почту oksanchik2170@yandex.ru!";
    }
    
    // Ответы про сайты
    if (msg.includes('сайт') || msg.includes('лендинг') || msg.includes('страница')) {
      return "💻 Я создаю продающие AI-сайты и лендинги под ключ:\n\n• Современный дизайн\n• Анимации и эффекты\n• Формы заявок\n• Адаптив под телефоны\n• Интеграция с мессенджерами\n\nСтоимость от 15 000₽. Расскажите о вашем проекте — я предложу лучшее решение!";
    }
    
    // Ответы про ботов
    if (msg.includes('бот') || msg.includes('макс бот') || msg.includes('автоматизация')) {
      return "🤖 Макс боты — это моя новая разработка!\n\nСкоро здесь появятся умные боты для:\n• Автоматизации заявок\n• Ответов на вопросы клиентов\n• Сбора лидов\n• Консультаций в мессенджерах\n\nЯ активно работаю над этим проектом. Чтобы не пропустить запуск — подпишитесь на обновления!";
    }
    
    // Ответы про маркетплейсы
    if (msg.includes('карточк') || msg.includes('маркетплейс') || msg.includes('wildberries') || msg.includes('ozon') || msg.includes('вб')) {
      return "🛍️ Я создаю карточки для маркетплейсов:\n\n• AI-фоны и атмосфера\n• Инфографика\n• Акцент на выгодах\n• Стиль под ваш бренд\n\nСтоимость от 3000₽ за карточку. Расскажите о вашем товаре — сделаем крутой визуал!";
    }
    
    // Ответы про цены
    if (msg.includes('цена') || msg.includes('стоимость') || msg.includes('сколько') || msg.includes('скока') || msg.includes('прайс')) {
      return "💰 Цены на услуги:\n\n📸 Нейрофото — от 2000₽\n💻 AI-сайты — от 15 000₽\n🛍️ Карточки — от 3000₽\n🤖 Макс боты — в разработке\n\nТочная стоимость зависит от задачи. Напишите мне на почту oksanchik2170@yandex.ru — обсудим детали!";
    }
    
    // Ответы про сроки
    if (msg.includes('срок') || msg.includes('сколько времени') || msg.includes('когда')) {
      return "⏱️ Средние сроки:\n\n• Нейрофото — 1-3 дня\n• AI-сайт — 5-10 дней\n• Карточки — 2-4 дня\n• Макс боты — скоро!\n\nВсё зависит от сложности проекта. Присылайте задачу — скажу точные сроки!";
    }
    
    // Приветствия
    if (msg.includes('привет') || msg.includes('здравств') || msg.includes('добрый')) {
      return "Привет! 👋 Рада вас видеть!\n\nЧем могу помочь? Я отвечу на вопросы о:\n• Нейрофото 📸\n• AI-сайтах 💻\n• Макс ботах 🤖\n• Карточках 🛍️\n\nИли просто расскажу о себе и проектах!";
    }
    
    // Если ничего не подошло
    return "Спасибо за ваш вопрос! 🙏\n\nМогу предложить:\n• Посмотреть мои работы в портфолио\n• Заказать нейрофото, сайт или карточки\n• Узнать больше о предстоящих проектах\n\nЕсли не нашли ответ — напишите мне лично на почту oksanchik2170@yandex.ru, я обязательно отвечу!";
  };

  const sendMessage = () => {
    if (!input.trim() || isProcessing) return;

    const userText = input.trim();
    
    setMessages(prev => [...prev, { sender: "user", text: userText }]);
    setInput("");
    setIsProcessing(true);

    setTimeout(() => {
      const botResponse = getAIResponse(userText);
      setMessages(prev => [...prev, { sender: "bot", text: botResponse }]);
      setIsProcessing(false);
    }, 500 + Math.random() * 400);
  };

  if (!open) {
    return React.createElement(
      "button",
      {
        className: "chat-open-btn",
        onClick: () => setOpen(true)
      },
      "💬"
    );
  }

  return React.createElement(
    "div",
    { className: "chat-widget" },
    React.createElement(
      "div",
      { className: "chat-header" },
      "AI Помощник",
      React.createElement(
        "button",
        {
          className: "chat-close",
          onClick: () => setOpen(false)
        },
        "×"
      )
    ),
    React.createElement(
      "div",
      { className: "chat-messages" },
      messages.map((msg, i) =>
        React.createElement(
          "div",
          {
            key: i,
            className: `chat-message ${msg.sender}`
          },
          msg.text.split('\n').map((line, j) =>
            React.createElement("div", { key: j, style: { marginBottom: j < msg.text.split('\n').length - 1 ? '4px' : '0' } }, line)
          )
        )
      ),
      isProcessing && React.createElement(
        "div",
        { className: "chat-message bot", style: { opacity: 0.6 } },
        "✍️ Печатает..."
      ),
      React.createElement("div", { ref: messagesEndRef })
    ),
    React.createElement(
      "div",
      { className: "chat-input-wrap" },
      React.createElement("input", {
        ref: inputRef,
        className: "chat-input",
        value: input,
        placeholder: "Введите сообщение...",
        onChange: e => setInput(e.target.value),
        onKeyDown: e => {
          if (e.key === "Enter") sendMessage();
        }
      }),
      React.createElement(
        "button",
        {
          className: "chat-send",
          onClick: sendMessage,
          disabled: isProcessing
        },
        "➤"
      )
    )
  );
}

// Компонент App
function App() {
  const [galleryConfig, setGalleryConfig] = React.useState(null);
  const [message, setMessage] = React.useState(null);

  const handleCardClick = (type) => {
    if (type === "neiro") {
  const photos = [];
  for (let i = 1; i <= 55; i++) {
    photos.push(`img/${i}.jpg`);
  }
  setGalleryConfig({ photos, title: "Нейрофото — галерея работ" });
  return;
}

    if (type === "market") {
      const photos = [];
      for (let i = 1; i <= 10; i++) {
        photos.push(`img/maket${i}.jpg`);
      }
      setGalleryConfig({ photos, title: "Карточки для маркетплейсов" });
      return;
    }

    if (type === "bot") {
      setMessage(
        "🚀 Макс боты — это мой новый проект, который я активно разрабатываю. \n\nСкоро здесь появятся умные боты для автоматизации вашего бизнеса. \n\nА пока вы можете заказать сайт, нейрофото или карточки для маркетплейсов. \n\nНапишите мне на почту oksanchik2170@yandex.ru — обсудим ваш проект!"
      );
      return;
    }

    setMessage(
      "Примеры по этому направлению покажу лично. Напишите мне на почту oksanchik2170@yandex.ru"
    );
  };

  const scrollToPortfolio = () => {
    document.getElementById("portfolio")?.scrollIntoView({
      behavior: "smooth"
    });
  };

  return React.createElement(
    React.Fragment,
    null,
    // Hero секция
    React.createElement(
      "section",
      { className: "hero" },
      React.createElement(
        "div",
        { className: "hero-text" },
        React.createElement(
          "div",
          { className: "tagline" },
          React.createElement("span", { className: "tagline-dot" }),
          "AI решения для бизнеса"
        ),
        React.createElement("div", { className: "hello" }, "Оксана Баннова"),
        React.createElement(
          "h1",
          null,
          "Создаю ",
          React.createElement("span", null, "сайты, ботов и нейрофото"),
          " для роста продаж"
        ),
        React.createElement(
          "p",
          { className: "subtitle" },
          "Помогаю бизнесу автоматизировать заявки, усиливать визуал и получать больше клиентов."
        ),
        React.createElement(
          "div",
          { className: "chips" },
          chipsData.map((chip) =>
            React.createElement(
              "div",
              {
                key: chip.type,
                className: "chip",
                onClick: () => handleCardClick(chip.type)
              },
              React.createElement("span", { className: "chip-dot" }),
              chip.text
            )
          )
        ),
        React.createElement(
          "div",
          { className: "edu-wrap" },
          React.createElement("div", { className: "section-title" }, "Образование"),
          React.createElement("p", { className: "edu-item" }, "Прикладная математика и информатика"),
          React.createElement("p", { className: "edu-item" }, "JavaScript-разработчик")
        ),
        React.createElement(
          "div",
          { className: "btn-row" },
          React.createElement(
            "a",
            {
              className: "btn btn-primary",
              href: "mailto:oksanchik2170@yandex.ru",
              target: "_blank"
            },
            "📧 Написать на почту"
          ),
          React.createElement(
            "button",
            {
              className: "btn btn-ghost",
              onClick: scrollToPortfolio
            },
            "Портфолио"
          )
        )
      ),
      React.createElement(
        "aside",
        { className: "hero-media" },
        React.createElement(
          "div",
          { className: "photo-wrap" },
          React.createElement(ProfilePhoto, null),
          React.createElement(
            "div",
            { className: "badge" },
            React.createElement(
              "div",
              { className: "badge-inner" },
              React.createElement("span", { className: "status-dot" }),
              "Открыта к новым проектам"
            )
          )
        ),
        React.createElement(
          "div",
          { className: "accent-pill" },
          React.createElement("strong", null, "AI под ключ"),
          React.createElement(
            "span",
            null,
            "Сайт + бот + автоматизация"
          )
        ),
        React.createElement(
          "div",
          { className: "contacts" },
          "📧 ",
          React.createElement(
            "a",
            { href: "mailto:oksanchik2170@yandex.ru" },
            "oksanchik2170@yandex.ru"
          )
        )
      )
    ),
    // Портфолио
    React.createElement(
      "section",
      {
        className: "portfolio",
        id: "portfolio"
      },
      React.createElement(
        "div",
        { className: "portfolio-inner" },
        React.createElement(
          "div",
          { className: "portfolio-header" },
          React.createElement(
            "div",
            null,
            React.createElement("div", { className: "section-title" }, "Портфолио"),
            React.createElement("div", { className: "portfolio-title" }, "Мои услуги")
          ),
          React.createElement(
            "div",
            { className: "portfolio-sub" },
            "Нажмите на карточку"
          )
        ),
        React.createElement(
          "div",
          { className: "portfolio-grid" },
          portfolioItems.map((item) =>
            React.createElement(
              "div",
              {
                key: item.id,
                className: "portfolio-item",
                onClick: () => handleCardClick(item.id)
              },
              React.createElement("div", { className: "portfolio-tag" }, item.tag),
              React.createElement("div", { className: "portfolio-name" }, item.name),
              React.createElement("p", { className: "portfolio-desc" }, item.desc)
            )
          )
        )
      )
    ),
    // Контакты
    React.createElement(
      "section",
      { className: "contact-section" },
      React.createElement(
        "div",
        { className: "contact-inner" },
        React.createElement(
          "div",
          { className: "contact-text" },
          "Есть проект? Напишите мне на почту, обсудим задачу и найдём решение."
        ),
        React.createElement(
          "div",
          { className: "contact-buttons" },
          React.createElement(
            "a",
            {
              href: "mailto:oksanchik2170@yandex.ru",
              target: "_blank",
              className: "contact-btn"
            },
            "📧 Написать на почту"
          )
        )
      )
    ),
    // Футер
    React.createElement(
      "footer",
      { className: "site-footer" },
      React.createElement(
        "div",
        { className: "site-footer-inner" },
        React.createElement(
          "div",
          null,
          "© ",
          new Date().getFullYear(),
          " Оксана Баннова"
        ),
        React.createElement(
          "div",
          null,
          "📧 ",
          React.createElement(
            "a",
            { href: "mailto:oksanchik2170@yandex.ru" },
            "oksanchik2170@yandex.ru"
          )
        )
      )
    ),
    // Галерея
    galleryConfig && React.createElement(GalleryModal, {
      isOpen: !!galleryConfig,
      onClose: () => setGalleryConfig(null),
      photos: galleryConfig.photos,
      title: galleryConfig.title
    }),
    // Сообщение
    React.createElement(MessageModal, {
      message: message,
      onClose: () => setMessage(null)
    }),
    // Чат
    React.createElement(ChatWidget, null)
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(React.createElement(App));