const fetch = require('node-fetch');

exports.handler = async function(event, context) {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  try {
    const { fantasy, tone, perspective, length } = JSON.parse(event.body);

    const prompt = `Schreibe eine erotische Geschichte in der ${perspective}-Perspektive mit dem Tonfall "${tone}". Die Fantasie basiert auf folgenden Stichworten: ${fantasy}. Die Geschichte soll ${length} sein.`;

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-4",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.9
      })
    });

    const data = await response.json();
    const story = data.choices?.[0]?.message?.content || "Fehler beim Abrufen der Geschichte.";

    return {
      statusCode: 200,
      body: JSON.stringify({ story })
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message })
    };
  }
};
