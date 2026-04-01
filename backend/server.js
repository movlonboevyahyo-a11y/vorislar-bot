import express from "express";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(express.json());

// API KEY borligini tekshiradi
if (!process.env.OPENAI_API_KEY) {
  console.log("❌ API KEY yo‘q! .env qo‘sh");
  process.exit(1);
}

// Chat endpoint (AI ustoz)
app.post("/chat", async (req, res) => {
  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ error: "Message yozilmagan" });
  }

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: `
Sen ona tili va adabiyot fanidan professional ustozsan.

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

    if (data.error) {
      console.log(data.error);
      return res.status(500).json({ error: "OpenAI xatolik" });
    }

    res.json({
      reply: data.choices[0].message.content
    });

  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Server xatosi" });
  }
});

// test route
app.get("/", (req, res) => {
  res.send("AI ustoz ishlayapti 🚀");
});

app.listen(3000, () => {
  console.log("Server: http://localhost:3000");
});
