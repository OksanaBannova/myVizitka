const { useState, useEffect } = React;

const SUPABASE_URL = "https://eskauqttcvfxrbnvljyu.supabase.co";
const SUPABASE_KEY = "sb_publishable_l0krKw0Ct33vQ0qKVznytw_YTFRiH_T";

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

const portfolioItems = [
  {
    id: "neiro",
    tag: "Нейрофото",
    name: "Семейные AI-портреты",
    desc: "Нейрофото с художественной обработкой и ретушью."
  },
  {
    id: "site",
    tag: "AI-сайты",
    name: "Лендинги под ключ",
    desc: "Продающие сайты с современным UI."
  },
  {
    id: "bot",
    tag: "MAX-боты",
    name: "Автоматизация заявок",
    desc: "AI-боты и автоматизация бизнеса."
  },
  {
    id: "market",
    tag: "Маркетплейсы",
    name: "Карточки товаров",
    desc: "Карточки для Wildberries / Ozon."
  }
];

const chipsData = [
  { type: "neiro", text: "Нейрофото" },
  { type: "site", text: "AI-сайты" },
  { type: "bot", text: "Боты" },
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
        onClick: e => e.stopPropagation()
      },
      React.createElement("h3", null, "Информация"),
      React.createElement("p", null, message),
      React.createElement(
        "button",
        { className: "btn", onClick: onClose },
        "Закрыть"
      )
    )
  );
}

function CarouselModal({ isOpen, onClose }) {
  const [index, setIndex] = useState(0);
  const total = 22;

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
    React.createElement(
      "button",
      {
        className: "carousel-btn",
        onClick: e => {
          e.stopPropagation();
          prev();
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
        className: "carousel-btn",
        onClick: e => {
          e.stopPropagation();
          next();
        }
      },
      "›"
    )
  );
}

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

function ChatWidget() {
  const [open, setOpen] = useState(false);

  const [messages, setMessages] = useState([
    {
      sender: "bot",
      text: "Привет 👋 Я AI-помощник Оксаны. Как вас зовут?"
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

  const messagesEndRef = React.useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth"
    });
  }, [messages]);

  async function sendMessage() {
    if (!input.trim()) return;
    if (step === 4) return;

    const userText = input.trim();

    setMessages(prev => [
      ...prev,
      { sender: "user", text: userText }
    ]);

    setInput("");

    if (step === 0) {
      setLead(prev => ({ ...prev, name: userText }));
      setMessages(prev => [
        ...prev,
        { sender: "bot", text: "Что вам нужно?" }
      ]);
      setStep(1);
      return;
    }

    if (step === 1) {
      setLead(prev => ({ ...prev, service: userText }));
      setMessages(prev => [
        ...prev,
        { sender: "bot", text: "Какой бюджет?" }
      ]);
      setStep(2);
      return;
    }

    if (step === 2) {
      setLead(prev => ({ ...prev, budget: userText }));
      setMessages(prev => [
        ...prev,
        { sender: "bot", text: "Оставьте контакт" }
      ]);
      setStep(3);
      return;
    }

    if (step === 3) {
      const finalLead = {
        ...lead,
        contact: userText
      };

      const ok = await saveLead({
        name: finalLead.name,
        service: finalLead.service,
        budget: Number(finalLead.budget) || 0,
        contact: finalLead.contact,
        status: "new"
      });

      setMessages(prev => [
        ...prev,
        {
          sender: "bot",
          text: ok
            ? "Спасибо ❤️ Заявка сохранена."
            : "Не удалось сохранить заявку."
        }
      ]);

      setStep(4);
    }
  }

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
          onClick: () => setOpen(false)
        },
        "×"
      )
    ),

    React.createElement(
      "div",
      { className: "chat-messages" },
      ...messages.map((msg, i) =>
        React.createElement(
          "div",
          {
            key: i,
            className: `chat-message ${msg.sender}`
          },
          msg.text
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
        onKeyDown: e => {
          if (e.key === "Enter") sendMessage();
        }
      }),
      React.createElement(
        "button",
        { onClick: sendMessage },
        "➤"
      )
    )
  );
}

function App() {
  const [carouselOpen, setCarouselOpen] = useState(false);
  const [message, setMessage] = useState(null);

  const handleCardClick = type => {
    if (type === "neiro") {
      setCarouselOpen(true);
      return;
    }
    setMessage("Кейсы покажу лично.");
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