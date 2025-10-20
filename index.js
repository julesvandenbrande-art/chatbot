import express from "express";
import fetch from "node-fetch";
const app = express();
app.use(express.json());

app.post("/chat", async (req, res) => {
  const { message, context } = req.body;

  // --- OpenAI API call ---
  const openaiRes = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `Je bent een chatbot voor een website. De gebruiker bevindt zich op ${context.url}.`
        },
        { role: "user", content: message }
      ]
    })
  });

  const data = await openaiRes.json();
  const aiReply = data.choices?.[0]?.message?.content || "Sorry, ik begrijp het niet.";

  res.json({ reply: aiReply });
});

app.listen(process.env.PORT || 3000, () => {
  console.log("Chatbot-server draait 🚀");
});
