export default async function handler(req, res) {
  const { sentence, target = "pt-BR" } = req.query;

  if (!sentence) {
    return res.status(400).json({ error: "Sentence ontbreekt" });
  }

  try {
    const apiKey = process.env.GEMINI_API_KEY;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateText?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: {
            text: `
Vertaal deze zin naar ${target}.
Geef ALLEEN de vertaling terug, geen uitleg.

Zin:
${sentence}
            `
          }
        })
      }
    );

    const data = await response.json();

    // Debug: toon wat Gemini echt terugstuurt
    console.log("Gemini response:", JSON.stringify(data, null, 2));

    const text =
      data?.candidates?.[0]?.output ||
      data?.candidates?.[0]?.content ||
      data?.output ||
      "";

    res.status(200).json({ translation: text.trim() });
  } catch (err) {
    console.error("Vertaalfout:", err);
    res.status(500).json({ error: "Vertaalfout" });
  }
}
