const express = require("express");
const cors = require("cors");
const axios = require("axios");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

app.post("/lead", async (req, res) => {
  const { name, service, budget, contact } = req.body;

  const text = `
🔥 НОВАЯ ЗАЯВКА

👤 Имя: ${name}
🛠 Услуга: ${service}
💰 Бюджет: ${budget}
📞 Контакт: ${contact}
`;

  try {
    await axios.post(
      `https://api.telegram.org/bot${process.env.TELEGRAM_TOKEN}/sendMessage`,
      {
        chat_id: process.env.CHAT_ID, // <-- ID ГРУППЫ
        text,
        parse_mode: "HTML"
      }
    );

    res.json({ success: true });
  } catch (err) {
    console.log(err.response?.data || err.message);
    res.status(500).json({ success: false });
  }
});

app.listen(3000, () => console.log("Backend running"));