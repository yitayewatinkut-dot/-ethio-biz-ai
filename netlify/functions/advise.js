
export default async (req) => {
  if (req.method !== "POST") {
    return new Response(
      JSON.stringify({ error: "POST method required" }),
      { status: 405 }
    );
  }

  try {
    const { question, history = [] } = await req.json();

    if (typeof question !== "string" || !question.trim()) {
      return new Response(
        JSON.stringify({ error: "ጥያቄ አስገባ።" }),
        { status: 400 }
      );
    }

    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey || !apiKey.trim()) {
      throw new Error("GEMINI_API_KEY አልተገኘም።");
    }

    const models = [
      "gemini-3.8-flash",
      "gemini-3.7-flash",
      "gemini-3.5-flash-lite"
    ];

    let answer = "";
    let lastError = "";

    for (const model of models) {
      const response = await fetch(
        "https://generativelanguage.googleapis.com/v1beta/interactions",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-goog-api-key": apiKey.trim()
          },
          body: JSON.stringify({
            model,
            input:
  "You are ETHIO BIZ AI, a professional Ethiopian small-business adviser. " +
  "Always answer in clear, natural Amharic. " +
  "First understand the user's capital, skills, location and situation. " +
  "Recommend realistic businesses suitable for Ethiopia. " +
  "Give step-by-step actions, startup costs, customer acquisition methods, " +
  "risks and ways to reduce them. " +
  "Never invent prices, commissions, market statistics or guaranteed profits. " +
  "If exact current prices are unknown, clearly say they must be checked locally. " +
  "Calculate profit only when sufficient cost and sales information is available. " +
  "If important information is missing, ask one short clarifying question. " +
  "Prioritize low-cost experiments before large investments. " +
  "Do not recommend spending all the user's capital at once. " +
  "Use headings and numbered steps. Avoid unnecessary repetition.\n\n" +
  "User question: " + question.trim()
          })
        }
      );

      const data = await response.json();

      if (!response.ok) {
        lastError = data.error?.message || "Gemini API error";

        if (response.status === 429 || response.status === 503) {
          continue;
        }

        throw new Error(lastError);
      }

      answer = (data.steps || [])
        .filter(step => step.type === "model_output")
        .flatMap(step => step.content || [])
        .filter(item => item.type === "text")
        .map(item => item.text || "")
        .join("");

      if (answer) break;
    }

    if (!answer) {
      throw new Error(
        "ሁሉም AI ሞዴሎች በከፍተኛ ጭነት ላይ ናቸው። እባክህ ቆይተህ እንደገና ሞክር። " +
        lastError
      );
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
