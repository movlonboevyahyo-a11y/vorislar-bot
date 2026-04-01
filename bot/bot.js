import TelegramBot from "node-telegram-bot-api";
import fetch from "node-fetch";

const TOKEN = "8518989867:AAG6Y2t8ehI6v8EDwVxecuFrCKNxq5WtSdM"; // ← BotFather dan olgan token

const bot = new TelegramBot(TOKEN, { polling: true });

// start komandasi
bot.onText(/\/start/, (msg) => {
  bot.sendMessage(
    msg.chat.id,
    "Salom! Men ona tili va adabiyot AI ustozman 📚\nSavolingni yoz!"
  );
});

// asosiy chat
bot.on("message", async (msg) => {
  if (msg.text === "/start") return;

  const chatId = msg.chat.id;
  const text = msg.text;

  try {
    const res = await fetch("https://vorislar-bot.onrender.com/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        message: text
      })
    });

    const data = await res.json();

    bot.sendMessage(chatId, data.reply);

  } catch (err) {
    bot.sendMessage(chatId, "Xatolik ❌");
  }
});
