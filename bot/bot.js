import TelegramBot from "node-telegram-bot-api";

const TOKEN = process.env.TOKEN;

if (!TOKEN) {
  console.error("❌ TOKEN topilmadi!");
  process.exit(1);
}

const bot = new TelegramBot(TOKEN, { polling: true });


// 🔹 START (AI ustoz tanishtirish)
bot.onText(/\/start/, (msg) => {
  bot.sendMessage(
    msg.chat.id,
`Salom! Men ona tili va adabiyot AI ustozman 📚

🤖 Nimalar qila olaman:
• Qoidalarni tushuntiraman
• So‘zlarning ma’nosini aytaman
• Misollar bilan o‘rgataman
• Test va savollar tuzaman
• Esseni tekshiraman

🌐 Web App imkoniyatlari:
• Test ishlash
• Esse yozish
• So‘z ma’nolarini topish
• Interaktiv mashqlar

✍️ Savolingni yoz — boshlaymiz!`
  );
});


// 🔹 Asosiy chat (AI bilan gaplashish)
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

    if (!data.reply) {
      bot.sendMessage(chatId, "Xatolik ❌");
      return;
    }

    bot.sendMessage(chatId, data.reply);

  } catch (err) {
    console.error(err);
    bot.sendMessage(chatId, "Server bilan bog‘lanishda xatolik ❌");
  }
});
