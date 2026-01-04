export default async function handler(req, res) {
  const { sentence, target = "pt-BR" } = req.query;

  if (!sentence) {
    return res.status(400).json({ error: "Sentence ontbreekt" });
  }

  try {
    const apiKey = process.env.DEEPSEEK_API_KEY;

    const response = await fetch("https://api.deepseek.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: "deepseek-chat",
        messages: [
          {
            role: "system",
            content: `Vertaal de volgende zin naar ${target}. Geef ALLEEN de vertaling terug, zonder uitleg.`
          },
          {
            role: "user",
            content: sentence
          }
        ]
      })
    });

    const data = await response.json();

    console.log("DeepSeek response:", JSON.stringify(data, null, 2));

    const text = data?.choices?.[0]?.message?.content || "";

    res.status(200).json({ translation: text.trim() });

  } catch (err) {
    console.error("Vertaalfout:", err);
    res.status(500).json({ error: "Vertaalfout" });
  }
}
