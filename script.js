const SUPABASE_URL = "https://eskauqttcvfxrbnvljyu.supabase.co";
const SUPABASE_KEY = "sb_publishable_l0krKw0Ct33vQ0qKVznytw_YTFRiH_T";
const AI_CHAT_URL = "https://eskauqttcvfxrbnvljyu.supabase.co/functions/v1/ai-chat";

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

// ============================================================
//  ДАННЫЕ ДЛЯ ПРАЙС-ЛИСТОВ
// ============================================================

const personalPriceData = {
  title: "📸 Тариф «Для себя»",
  categories: [
    {
      name: "Нейрофотосессии",
      items: [
        { name: "НейроФото", price: "от 600 ₽" },
        { name: "Портрет поколений", price: "от 600 ₽" },
        { name: "Индивидуальная фотосессия", price: "от 100 ₽" },
        { name: "Трендовое фото", price: "от 150 ₽" }
      ]
    },
    {
      name: "Семейные и детские",
      items: [
        { name: "Детская фотосессия", price: "от 100 ₽" },
        { name: "Семейное фото", price: "от 450 ₽" }
      ]
    },
    {
      name: "Парные и Love Story",
      items: [
        { name: "Парная фотосессия", price: "от 250 ₽" },
        { name: "Парная трендовая фотосессия", price: "от 300 ₽" }
      ]
    },
    {
      name: "Дополнительные услуги",
      items: [
        { name: "Замена фона", price: "от 50 ₽" },
        { name: "Фото по вашему запросу", price: "от 150 ₽" }
      ]
    },
    {
      name: "🎁 Подарочные сертификаты",
      items: [
        { name: "Сертификат на фотосессию", price: "от 1 500 ₽" },
        { name: "Сертификат на нейрофото", price: "от 2 000 ₽" }
      ]
    }
  ]
};

const businessPriceData = {
  title: "🏢 Тариф «Для бизнеса»",
  categories: [
    {
      name: "AI КОНТЕНТ",
      items: [
        { name: "AI Фото товара", price: "от 2 900 ₽", desc: "До 10 изображений, любой фон, для маркетплейсов" },
        { name: "AI Фото для личного бренда", price: "5 900 ₽", desc: "30 фото, до 10 образов, высокое качество" },
        { name: "AI Фото команды компании", price: "от 9 900 ₽", desc: "Единый стиль для руководителей и сотрудников" },
        { name: "Карточка товара Premium", price: "3 500 ₽", desc: "Инфографика, SEO-текст, дизайн" },
        { name: "Комплект карточек", price: "14 900 ₽", desc: "До 5 товаров" }
      ]
    },
    {
      name: "AI САЙТЫ",
      items: [
        { name: "Landing Page", price: "29 900 ₽", desc: "Современный дизайн, адаптация, форма заявок, SEO" },
        { name: "Корпоративный сайт", price: "59 900 ₽", desc: "До 10 страниц, CMS, анимация, форма заявок" },
        { name: "SaaS / CRM", price: "от 120 000 ₽", desc: "Авторизация, личный кабинет, БД, админ-панель" }
      ]
    },
    {
      name: "AI АВТОМАТИЗАЦИЯ",
      items: [
        { name: "AI Консультант на сайт", price: "24 900 ₽", desc: "Обучение на данных компании, ответы 24/7" },
        { name: "Telegram / WhatsApp bot", price: "от 39 900 ₽", desc: "Приём заявок, FAQ, запись клиентов" },
        { name: "AI Отдел продаж", price: "от 69 900 ₽", desc: "Квалификация, CRM, аналитика" }
      ]
    },
    {
      name: "ДОПОЛНИТЕЛЬНЫЕ УСЛУГИ",
      items: [
        { name: "Логотип", price: "4 900 ₽" },
        { name: "Фирменный стиль", price: "9 900 ₽" },
        { name: "Баннеры", price: "990 ₽ / шт" },
        { name: "Рекламные креативы", price: "1 500 ₽ / шт" }
      ]
    },
    {
      name: "🚀 ГОТОВЫЕ ПАКЕТЫ",
      items: [
        { name: "START BUSINESS", price: "39 900 ₽", desc: "Лендинг + AI-консультант + форма заявок" },
        { name: "BUSINESS PRO", price: "79 900 ₽", desc: "Корпоративный сайт + AI-консультант + 10 карточек" },
        { name: "DIGITAL BUSINESS", price: "149 900 ₽", desc: "SaaS/CRM + AI-консультант + AI-фотосессия + фирмстиль" }
      ]
    }
  ]
};

// ============================================================
//  КОМПОНЕНТ ПРАЙС-МОДАЛКИ
// ============================================================

function PriceModal({ isOpen, onClose }) {
  const [view, setView] = React.useState('selector');
  const [direction, setDirection] = React.useState('');

  if (!isOpen) return null;

  const handleSelect = (type) => {
    setDirection('slide-in');
    setTimeout(() => {
      setView(type);
    }, 50);
  };

  const handleBack = () => {
    setDirection('slide-out');
    setTimeout(() => {
      setView('selector');
      setDirection('');
    }, 300);
  };

  const renderPriceList = (data) => {
    return React.createElement(
      "div",
      { className: `price-slide active ${direction}` },
      React.createElement(
        "div",
        { className: "price-header" },
        React.createElement(
          "button",
          { className: "back-btn", onClick: handleBack },
          "← Назад"
        ),
        React.createElement("h2", null, data.title)
      ),
      data.categories.map((cat, idx) =>
        React.createElement(
          "div",
          { className: "price-category", key: idx },
          React.createElement("h3", null, cat.name),
          React.createElement(
            "div",
            { className: "price-grid" },
            cat.items.map((item, i) =>
              React.createElement(
                "div",
                { className: "price-card", key: i },
                React.createElement("div", { className: "name" }, item.name),
                React.createElement("div", { className: "price-tag" }, item.price),
                item.desc && React.createElement("div", { className: "price-desc" }, item.desc)
              )
            )
          )
        )
      )
    );
  };

  return React.createElement(
    "div",
    { className: "price-modal-overlay active", onClick: (e) => {
      if (e.target === e.currentTarget) onClose();
    }},
    React.createElement(
      "div",
      { className: "price-modal" },
      React.createElement(
        "button",
        { className: "modal-close-btn", onClick: onClose },
        "✕"
      ),
      React.createElement(
        "div",
        { className: "price-modal-content" },
        React.createElement(
          "div",
          { className: "price-slider" },
          view === 'selector' && React.createElement(
            "div",
            { className: "price-selector" },
            React.createElement("h2", null, "💰 Прайс-лист"),
            React.createElement("p", null, "Выберите интересующее направление"),
            React.createElement(
              "div",
              { className: "selector-grid" },
              React.createElement(
                "div",
                { className: "selector-card", onClick: () => handleSelect('personal') },
                React.createElement("span", { className: "emoji" }, "👤"),
                React.createElement("h3", null, "Для себя"),
                React.createElement("p", null, "Нейрофотосессии, портреты, подарки"),
                React.createElement("span", { className: "arrow" }, "→ Выбрать")
              ),
              React.createElement(
                "div",
                { className: "selector-card", onClick: () => handleSelect('business') },
                React.createElement("span", { className: "emoji" }, "🏢"),
                React.createElement("h3", null, "Для бизнеса"),
                React.createElement("p", null, "AI, сайты, автоматизация"),
                React.createElement("span", { className: "arrow" }, "→ Выбрать")
              )
            )
          ),
          view === 'personal' && renderPriceList(personalPriceData),
          view === 'business' && renderPriceList(businessPriceData)
        )
      )
    )
  );
}

// ============================================================
//  ОСТАЛЬНЫЕ КОМПОНЕНТЫ
// ============================================================

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

// Компонент галереи
function GalleryModal({ isOpen, onClose, photos, title }) {
  const [currentIndex, setCurrentIndex] = React.useState(0);
  const [viewMode, setViewMode] = React.useState('grid');
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

// Компонент ChatWidget
function ChatWidget() {
  const [open, setOpen] = React.useState(false);
  const [messages, setMessages] = React.useState([
    {
      sender: "bot",
      text: "Привет 👋 Я AI-помощник Оксаны — отвечу на вопросы о нейрофото, сайтах, карточках и ботах. Могу сразу принять заявку! 😊"
    }
  ]);
  const [input, setInput] = React.useState("");
  const [isProcessing, setIsProcessing] = React.useState(false);
  const messagesEndRef = React.useRef(null);
  const inputRef = React.useRef(null);

  React.useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }
  }, [messages]);

  React.useEffect(() => {
    if (open && inputRef.current) {
      setTimeout(() => {
        inputRef.current.focus();
      }, 100);
    }
  }, [open]);

  

  const callAI = async (userText, history) => {
    try {
      const res = await fetch(AI_CHAT_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: userText, history }),
      });
      const data = await res.json();
      if (data.error) {
        return "😔 Что-то пошло не так. Попробуйте ещё раз или напишите на почту oksanchik2170@yandex.ru";
      }
      return data.reply;
    } catch (err) {
      return "😔 Не удалось связаться с помощником. Напишите на почту oksanchik2170@yandex.ru";
    }
  };

  const sendMessage = async () => {
    if (!input.trim() || isProcessing) return;

    const userText = input.trim();
    const newMessages = [...messages, { sender: "user", text: userText }];
    setMessages(newMessages);
    setInput("");
    setIsProcessing(true);

    // Передаём историю (без системных сообщений)
    const history = newMessages
      .filter((m) => m.text && m.text.trim())
      .slice(-10)
      .map((m) => ({ sender: m.sender, text: m.text }));

    const botResponse = await callAI(userText, history);
    setMessages((prev) => [...prev, { sender: "bot", text: botResponse }]);
    setIsProcessing(false);
  };
}

// ============================================================
//  ГЛАВНЫЙ КОМПОНЕНТ APP
// ============================================================

function App() {
  const [galleryConfig, setGalleryConfig] = React.useState(null);
  const [message, setMessage] = React.useState(null);
  const [isPriceOpen, setIsPriceOpen] = React.useState(false);

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
          ),
          React.createElement(
            "button",
            {
              className: "btn btn-primary",
              onClick: () => setIsPriceOpen(true),
              style: { background: "linear-gradient(120deg, #ff5c97, #ff9a5e)" }
            },
            "💰 Прайс-лист"
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
    // Прайс-лист
    React.createElement(PriceModal, {
      isOpen: isPriceOpen,
      onClose: () => setIsPriceOpen(false)
    }),
    // Чат
    React.createElement(ChatWidget, null)
  );
}

// ============================================================
//  ЗАПУСК
// ============================================================

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(React.createElement(App));