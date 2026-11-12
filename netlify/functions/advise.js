
export default async (req) => {
  if (req.method !== "POST") {
    return new Response(
      JSON.stringify({ error: "POST method required" }),
      { status: 405 }
    );
  }

  try {
    const { question } = await req.json();

    if (
      typeof question !== "string" ||
      !question.trim()
    ) {
      return new Response(
        JSON.stringify({ error: "ጥያቄ አስገባ።" }),
        { status: 400 }
      );
    }

    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey || !apiKey.trim()) {
      throw new Error("GEMINI_API_KEY አልተገኘም።");
    }

    const response = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/interactions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": apiKey.trim()
        },
        body: JSON.stringify({
          model: "gemini-3.8-flash",
          input:
            "You are ETHIO BIZ AI, an Ethiopian business adviser. " +
            "Answer in clear Amharic. Give realistic, practical " +
            "business advice for Ethiopia. Explain costs, customers, " +
            "risks and possible profit. Never invent verified market facts.\n\n" +
            "User question: " + question.trim()
        })
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.error?.message || "Gemini API error"
      );
    }

    const answer = (data.steps || [])
      .filter(step => step.type === "model_output")
      .flatMap(step => step.content || [])
      .filter(item => item.type === "text")
      .map(item => item.text || "")
      .join("");

    if (!answer) {
      throw new Error("AI ምላሽ አልተገኘም።");
    }

    return new Response(
      JSON.stringify({ answer }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json"
        }
      }
    );

  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json"
        }
      }
    );
  }
};

