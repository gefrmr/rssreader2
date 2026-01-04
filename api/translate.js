export default async function handler(req, res) {
  const { sentence, target = "nl" } = req.query;

  if (!sentence) {
    return res.status(400).json({ error: "Sentence ontbreekt" });
  }

  try {
    const apiKey = process.env.GEMINI_API_KEY;

    const response = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=" + apiKey,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{
            parts: [{ text: `Vertaal naar ${target}. Geef alleen de vertaling terug:\n\n"${sentence}"` }]
          }]
        })
      }
    );

    const data = await response.json();
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text || "";

    res.status(200).json({ translation: text.trim() });
  } catch (err) {
    console.error("Vertaalfout:", err);
    res.status(500).json({ error: "Vertaalfout" });
  }
}
