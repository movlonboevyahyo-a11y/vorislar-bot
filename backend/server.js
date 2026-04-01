import express from "express";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(express.json());

// tekshiruv: API key bor-yo‘qligini
if (!process.env.OPENAI_API_KEY) {
  console.error("❌ API KEY topilmadi! .env faylni tekshir");
  process.exit(1);
}

app.post("/chat", async (req, res) => {
  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ error: "Message yo‘q" });
  }

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`, // 🔐 xavfsiz
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: `
Sen ONA TILI VA ADABIYOT fanidan professional ustozsan.

Qoidalar:
- Sodda tushuntir
- Misol ber
- Bosqichma-bosqich tushuntir
- Oxirida savol yoki mashq ber

Faqat javob berma — o‘rgat!
`
          },
          {
            role: "user",
            content: message
          }
        ]
      })
    });

    const data = await response.json();

    // agar API xato qaytarsa
    if (data.error) {
      console.error("OpenAI error:", data.error);
      return res.status(500).json({ error: "AI xatolik" });
    }

    res.json({
      reply: data.choices[0].message.content
    });

  } catch (err) {
    console.error("Server error:", err);
    res.status(500).json({ error: "Server xatosi" });
  }
});

// test uchun oddiy route
app.get("/", (req, res) => {
  res.send("AI ustoz server ishlayapti 🚀");
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`✅ Server ishga tushdi: http://localhost:${PORT}`);
});
