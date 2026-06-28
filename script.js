const { useState, useEffect } = React;

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
    } else {
      console.log("SUCCESS:", result.data);
      alert("Заявка сохранена!");
    }
  } catch (err) {
    console.error("JS ERROR:", err);
    alert("JS error: " + err.message);
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
    tag: "Telegram-боты",
    name: "Автоматизация заявок",
    desc: "Боты, которые отвечают клиентам и собирают лиды."
  },
  {
    id: "market",
    tag: "Маркетплейсы",
    name: "Карточки товаров",
    desc: "Карточки для Wildberries / Ozon с AI-фонами и инфографикой."
  }
];

const chipsData = [
  { type: "neiro", text: "Нейрофото" },
  { type: "site", text: "AI-сайты" },
  { type: "bot", text: "Telegram-боты" },
  { type: "market", text: "Маркетплейсы" }
];

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

function CarouselModal({ isOpen, onClose }) {
  const [index, setIndex] = useState(0);
  const [touchStart, setTouchStart] = useState(null);
  const total = 22;

  useEffect(() => {
    const handler = (e) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };

    if (isOpen) {
      document.addEventListener("keydown", handler);
      return () => document.removeEventListener("keydown", handler);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const next = () => {
    if (index < total - 1) setIndex(index + 1);
  };

  const prev = () => {
    if (index > 0) setIndex(index - 1);
  };

  return React.createElement(
    "div",
    { className: "modal active", onClick: onClose },
    React.createElement("span", { className: "modal-close", onClick: onClose }, "×"),
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
        src: `img/${index + 1}.jpg`,
        alt: `Фото ${index + 1}`,
        loading: "lazy"
      })
    ),
    React.createElement(
      "div",
      { className: "carousel-counter" },
      `${index + 1} / ${total}`
    )
  );
}

function ProfilePhoto() {
  const [error, setError] = useState(false);

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

function ChatWidget() {
  const [open, setOpen] = useState(false);

  const [messages, setMessages] = useState([
    {
      sender: "bot",
      text: "Привет 👋 Я AI-помощник Оксаны. Давайте оформим заявку. Как вас зовут?"
    }
  ]);

  const [input, setInput] = useState("");
  const [step, setStep] = useState(0);

  const [lead, setLead] = useState({
    name: "",
    service: "",
    budget: "",
    contact: ""
  });

  const sendMessage = () => {
    if (!input.trim()) return;

    const userText = input.trim();

    setMessages(prev => [
      ...prev,
      {
        sender: "user",
        text: userText
      }
    ]);

    if (step === 0) {
      setLead(prev => ({ ...prev, name: userText }));

      setTimeout(() => {
        setMessages(prev => [
          ...prev,
          {
            sender: "bot",
            text: "Что вам нужно? (нейрофото / сайт / бот / карточки)"
          }
        ]);
      }, 500);

      setStep(1);
    }

    else if (step === 1) {
      setLead(prev => ({ ...prev, service: userText }));

      setTimeout(() => {
        setMessages(prev => [
          ...prev,
          {
            sender: "bot",
            text: "Какой у вас бюджет?"
          }
        ]);
      }, 500);

      setStep(2);
    }

    else if (step === 2) {
      setLead(prev => ({ ...prev, budget: userText }));

      setTimeout(() => {
        setMessages(prev => [
          ...prev,
          {
            sender: "bot",
            text: "Оставьте контакт (Telegram / телефон / email)"
          }
        ]);
      }, 500);

      setStep(3);
    }

    else if (step === 3) {
  const finalLead = {
    ...lead,
    contact: userText
  };

  saveLead({
    name: finalLead.name,
    service: finalLead.service,
    budget: Number(finalLead.budget) || 0,
    contact: finalLead.contact,
    status: "new"
  });

  console.log("Новая заявка:", finalLead);

  setLead(finalLead);

  setTimeout(() => {
    setMessages(prev => [
      ...prev,
      {
        sender: "bot",
        text: "Спасибо ❤️ Заявка сохранена. Оксана скоро свяжется с вами."
      }
    ]);
  }, 500);

  setStep(4);
}


    setInput("");
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
          msg.text
        )
      )
    ),

    React.createElement(
      "div",
      { className: "chat-input-wrap" },

      React.createElement("input", {
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
          onClick: sendMessage
        },
        "➤"
      )
    )
  );
}

function App() {
  const [carouselOpen, setCarouselOpen] = useState(false);
  const [message, setMessage] = useState(null);

  const handleCardClick = (type) => {
    if (type === "neiro") {
      setCarouselOpen(true);
      return;
    }

    setMessage(
      "Примеры по этому направлению покажу лично в Telegram. Напишите мне — отправлю кейсы."
    );
  };

  const scrollToPortfolio = () => {
    document.getElementById("portfolio")?.scrollIntoView({
      behavior: "smooth"
    });
  };

  return React.createElement(
    "div",
    null,

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
            "button",
            {
              className: "btn btn-primary",
              onClick: () => window.open("https://t.me/OksBann", "_blank")
            },
            "Обсудить проект"
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
          React.createElement(ProfilePhoto)
        ),

        React.createElement(
          "div",
          { className: "badge" },
          React.createElement(
            "div",
            { className: "badge-inner" },
            React.createElement("span", { className: "status-dot" }),
            "Открыта к новым проектам"
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
          "Telegram: ",
          React.createElement(
            "a",
            { href: "https://t.me/OksBann", target: "_blank" },
            "@OksBann"
          )
        )
      )
    ),

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

    React.createElement(
      "section",
      { className: "contact-section" },
      React.createElement(
        "div",
        { className: "contact-inner" },
        React.createElement(
          "div",
          { className: "contact-text" },
          "Есть проект? Напишите мне, обсудим задачу и найдём решение."
        ),
        React.createElement(
          "div",
          { className: "contact-buttons" },
          React.createElement(
            "a",
            {
              href: "https://t.me/OksBann",
              target: "_blank",
              className: "contact-btn"
            },
            "✈ Telegram"
          )
        )
      )
    ),

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
        )
      )
    ),

    React.createElement(CarouselModal, {
      isOpen: carouselOpen,
      onClose: () => setCarouselOpen(false)
    }),

    React.createElement(MessageModal, {
      message,
      onClose: () => setMessage(null)
    }),
  
  React.createElement(ChatWidget)
);
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(React.createElement(App));