
export default async (req) => {
  if (req.method !== "POST") {
    return new Response(
      JSON.stringify({ error: "Method not allowed" }),
      { status: 405, headers: { "Content-Type": "application/json" } }
    );
  }

  try {
    const { question } = await req.json();

    if (!question || typeof question !== "string") {
      return new Response(
        JSON.stringify({ error: "ጥያቄ አስገባ።" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const apiKey = process.env.OPENAI_API_KEY;

    if (!apiKey) {
      return new Response(
        JSON.stringify({ error: "API key not configured" }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }

    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: "gpt-4.1-mini",
        instructions: "You are ETHIO BIZ AI, an assistant for Ethiopian small businesses and job seekers. Answer in Amharic unless asked otherwise. Give realistic, practical and concise advice. Never invent current job vacancies.",
        input: question
      })
    });

    const data = await response.json();

    if (!response.ok) {
      return new Response(
        JSON.stringify({ error: data.error?.message || "AI request failed" }),
        { status: response.status, headers: { "Content-Type": "application/json" } }
      );
    }

    const answer = (data.output || [])
      .flatMap(item => item.content || [])
      .filter(part => part.type === "output_text")
      .map(part => part.text)
      .join("\n");

    return new Response(
      JSON.stringify({ answer: answer || "ምላሽ ማግኘት አልተቻለም።" }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );

  } catch (error) {
    return new Response(
      JSON.stringify({ error: "የማያያዣ ስህተት ተፈጥሯል።" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
};
