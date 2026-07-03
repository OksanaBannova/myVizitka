const { useState, useEffect } = React;

const SUPABASE_URL = "https://eskauqttcvfxrbnvljyu.supabase.co";
const SUPABASE_KEY =
  "sb_publishable_l0krKw0Ct33vQ0qKVznytw_YTFRiH_T";

const supabase = window.supabase.createClient(
  SUPABASE_URL,
  SUPABASE_KEY
);

/* ================= LEADS ================= */

async function saveLead(data) {
  try {
    const { data: result, error } = await supabase
      .from("leads")
      .insert([data])
      .select();

    if (error) {
      console.error(error);
      alert("Ошибка: " + error.message);
      return false;
    }

    console.log("Saved:", result);
    return true;
  } catch (err) {
    console.error(err);
    alert("JS error: " + err.message);
    return false;
  }
}

/* ================= DATA ================= */

const portfolioItems = [
  {
    id: "neiro",
    tag: "Нейрофото",
    name: "AI-портреты",
    desc: "Художественные нейрофото с обработкой"
  },
  {
    id: "site",
    tag: "AI-сайты",
    name: "Лендинги",
    desc: "Современные продающие сайты"
  },
  {
    id: "bot",
    tag: "MAX-боты",
    name: "Автоматизация заявок",
    desc: "Разработка MAX-ботов для бизнеса (в работе)"
  },
  {
    id: "market",
    tag: "Маркетплейсы",
    name: "Карточки товаров",
    desc: "Ozon / Wildberries инфографика"
  }
];

/* ================= MODAL ================= */

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
          color: "white"
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

/* ================= CAROUSEL ================= */

function CarouselModal({ isOpen, onClose }) {
  const [index, setIndex] = useState(0);
  const total = 22;

  if (!isOpen) return null;

  return React.createElement(
    "div",
    { className: "modal active", onClick: onClose },

    React.createElement(
      "button",
      {
        className: "carousel-btn carousel-prev",
        onClick: e => {
          e.stopPropagation();
          setIndex(i => Math.max(0, i - 1));
        }
      },
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
        style: { maxWidth: "100%" }
      })
    ),

    React.createElement(
      "button",
      {
        className: "carousel-btn carousel-next",
        onClick: e => {
          e.stopPropagation();
          setIndex(i => Math.min(total - 1, i + 1));
        }
      },
      "›"
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
      style: {
        width: "100%",
        height: "100%",
        objectFit: "cover"
      }
    })
  );
}

/* ================= CHAT ================= */

function ChatWidget() {
  const [open, setOpen] = useState(false);

  const [messages, setMessages] = useState([
    { sender: "bot", text: "Привет 👋 Как вас зовут?" }
  ]);

  const [input, setInput] = useState("");
  const [step, setStep] = useState(0);

  const [lead, setLead] = useState({
    name: "",
    service: "",
    budget: "",
    contact: ""
  });

  const messagesEndRef = React.useRef(null);

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
      setMessages(prev => [
        ...prev,
        { sender: "bot", text: "Что вам нужно?" }
      ]);
      setStep(1);
      return;
    }

    if (step === 1) {
      setLead(l => ({ ...l, service: text }));
      setMessages(prev => [
        ...prev,
        { sender: "bot", text: "Бюджет?" }
      ]);
      setStep(2);
      return;
    }

    if (step === 2) {
      setLead(l => ({ ...l, budget: text }));
      setMessages(prev => [
        ...prev,
        { sender: "bot", text: "Контакт (телефон / email / MAX)" }
      ]);
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
      "AI Помощник",
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
  const [modal, setModal] = useState(null);
  const [carousel, setCarousel] = useState(false);

  const contacts = {
    phone: "89133149801",
    email: "oksanchik2170@yandex.ru"
  };

  const handleCardClick = (id) => {
    if (id === "neiro") setCarousel(true);
    else setModal("Кейсы отправлю по телефону или email");
  };

  return React.createElement(
    "div",
    null,

    React.createElement(
      "section",
      { className: "hero" },
      React.createElement("h1", null, "Оксана Баннова"),

      React.createElement(
        "p",
        null,
        "📱 MAX: " + contacts.phone
      ),

      React.createElement(
        "p",
        null,
        "📧 Email: " + contacts.email
      ),

      React.createElement(ProfilePhoto)
    ),

    React.createElement(
      "section",
      { className: "portfolio" },
      portfolioItems.map(item =>
        React.createElement(
          "div",
          {
            key: item.id,
            onClick: () => handleCardClick(item.id)
          },
          item.name
        )
      )
    ),

    React.createElement(CarouselModal, {
      isOpen: carousel,
      onClose: () => setCarousel(false)
    }),

    React.createElement(MessageModal, {
      message: modal,
      onClose: () => setModal(null)
    }),

    React.createElement(ChatWidget)
  );
}

ReactDOM.createRoot(document.getElementById("root"))
  .render(React.createElement(App));