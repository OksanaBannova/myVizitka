const { useState, useEffect } = React;

/* ================= SUPABASE ================= */

const SUPABASE_URL = "https://eskauqttcvfxrbnvljyu.supabase.co";
const SUPABASE_KEY =
  "sb_publishable_l0krKw0Ct33vQ0qKVznytw_YTFRiH_T";

const supabase = window.supabase.createClient(
  SUPABASE_URL,
  SUPABASE_KEY
);

async function saveLead(data) {
  try {
    const { data: result, error } = await supabase
      .from("leads")
      .insert([data])
      .select();

    if (error) {
      console.error(error);
      alert("Ошибка Supabase: " + error.message);
      return false;
    }

    console.log("Lead saved:", result);
    return true;
  } catch (err) {
    console.error(err);
    alert("JS Error: " + err.message);
    return false;
  }
}

/* ================= DATA ================= */

const portfolioItems = [
  {
    id: "neiro",
    tag: "Нейрофото",
    name: "Семейные AI-портреты",
    desc: "AI-портреты с художественной обработкой."
  },
  {
    id: "site",
    tag: "AI-сайты",
    name: "Лендинги под ключ",
    desc: "Современные продающие сайты."
  },
  {
    id: "bot",
    tag: "Боты",
    name: "Автоматизация заявок",
    desc: "AI-боты и бизнес-автоматизация."
  },
  {
    id: "market",
    tag: "Маркетплейсы",
    name: "Карточки товаров",
    desc: "Ozon / Wildberries инфографика."
  }
];

const chipsData = [
  { type: "neiro", text: "Нейрофото" },
  { type: "site", text: "AI-сайты" },
  { type: "bot", text: "Боты" },
  { type: "market", text: "Маркетплейсы" }
];

/* ================= MODALS ================= */

function MessageModal({ message, onClose }) {
  if (!message) return null;

  return React.createElement(
    "div",
    { className: "modal active", onClick: onClose },
    React.createElement(
      "div",
      {
        className: "modal-content",
        onClick: e => e.stopPropagation(),
        style: {
          background: "#111827",
          padding: "24px",
          borderRadius: "16px",
          color: "#fff",
          maxWidth: "420px"
        }
      },
      React.createElement("h3", null, "Информация"),
      React.createElement("p", null, message),
      React.createElement(
        "button",
        { className: "btn btn-primary", onClick: onClose },
        "Закрыть"
      )
    )
  );
}

function CarouselModal({ isOpen, onClose }) {
  const [index, setIndex] = useState(0);
  const total = 22;

  const next = () => {
    setIndex(i => (i < total - 1 ? i + 1 : i));
  };

  const prev = () => {
    setIndex(i => (i > 0 ? i - 1 : i));
  };

  useEffect(() => {
    if (!isOpen) return;

    const handler = (e) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
    };

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [isOpen]);

  if (!isOpen) return null;

  return React.createElement(
    "div",
    { className: "modal active", onClick: onClose },
    React.createElement(
      "span",
      { className: "modal-close", onClick: onClose },
      "×"
    ),
    React.createElement(
      "button",
      { className: "carousel-btn carousel-prev", onClick: prev },
      "‹"
    ),
    React.createElement(
      "div",
      {
        className: "modal-content",
        onClick: e => e.stopPropagation()
      },
      React.createElement("img", {
        src: `img/${index + 1}.jpg`,
        alt: "slide"
      })
    ),
    React.createElement(
      "button",
      { className: "carousel-btn carousel-next", onClick: next },
      "›"
    ),
    React.createElement(
      "div",
      { className: "carousel-counter" },
      `${index + 1} / ${total}`
    )
  );
}

/* ================= PROFILE ================= */

function ProfilePhoto() {
  return React.createElement(
    "div",
    { className: "photo-inner" },
    React.createElement("img", {
      src: "oksana.jpg",
      alt: "photo",
      style: { width: "100%", height: "100%", objectFit: "cover" }
    })
  );
}

/* ================= CHAT ================= */

function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      sender: "bot",
      text: "Привет 👋 Как вас зовут?"
    }
  ]);

  const [input, setInput] = useState("");
  const [step, setStep] = useState(0);
  const messagesEndRef = React.useRef(null);

  const [lead, setLead] = useState({
    name: "",
    service: "",
    budget: "",
    contact: ""
  });

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function sendMessage() {
    if (!input.trim()) return;

    const text = input.trim();

    setMessages(prev => [...prev, { sender: "user", text }]);
    setInput("");

    if (step === 0) {
      setLead(l => ({ ...l, name: text }));
      setMessages(prev => [...prev, { sender: "bot", text: "Что нужно?" }]);
      setStep(1);
      return;
    }

    if (step === 1) {
      setLead(l => ({ ...l, service: text }));
      setMessages(prev => [...prev, { sender: "bot", text: "Бюджет?" }]);
      setStep(2);
      return;
    }

    if (step === 2) {
      setLead(l => ({ ...l, budget: text }));
      setMessages(prev => [...prev, { sender: "bot", text: "Контакт?" }]);
      setStep(3);
      return;
    }

    if (step === 3) {
      const ok = await saveLead({
        ...lead,
        contact: text,
        budget: Number(lead.budget) || 0,
        status: "new"
      });

      setMessages(prev => [
        ...prev,
        {
          sender: "bot",
          text: ok
            ? "Спасибо ❤️ Заявка отправлена"
            : "Ошибка отправки"
        }
      ]);

      setStep(4);
    }
  }

  if (!open) {
    return React.createElement(
      "button",
      { className: "chat-open-btn", onClick: () => setOpen(true) },
      "💬"
    );
  }

  return React.createElement(
    "div",
    { className: "chat-widget" },

    React.createElement(
      "div",
      { className: "chat-header" },
      "AI помощник",
      React.createElement(
        "button",
        { onClick: () => setOpen(false) },
        "×"
      )
    ),

    React.createElement(
      "div",
      { className: "chat-messages" },
      messages.map((m, i) =>
        React.createElement(
          "div",
          {
            key: i,
            className: `chat-message ${m.sender}`
          },
          m.text
        )
      ),
      React.createElement("div", { ref: messagesEndRef })
    ),

    React.createElement(
      "div",
      { className: "chat-input-wrap" },
      React.createElement("input", {
        value: input,
        onChange: e => setInput(e.target.value),
        onKeyDown: e => e.key === "Enter" && sendMessage()
      }),
      React.createElement(
        "button",
        { onClick: sendMessage },
        "➤"
      )
    )
  );
}

/* ================= APP ================= */

function App() {
  const [carouselOpen, setCarouselOpen] = useState(false);
  const [message, setMessage] = useState(null);

  const handleCardClick = (id) => {
    if (id === "neiro") setCarouselOpen(true);
    else setMessage("Кейсы отправлю в Telegram.");
  };

  return React.createElement(
    "div",
    null,

    React.createElement(
      "section",
      { className: "hero" },
      React.createElement("h1", null, "Оксана Баннова"),
      React.createElement(ProfilePhoto)
    ),

    React.createElement(
      "section",
      { className: "portfolio" },
      portfolioItems.map(i =>
        React.createElement(
          "div",
          {
            key: i.id,
            onClick: () => handleCardClick(i.id)
          },
          i.name
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

/* ================= RENDER ================= */

const root = ReactDOM.createRoot(
  document.getElementById("root")
);

root.render(React.createElement(App));