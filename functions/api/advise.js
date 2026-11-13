
export async function onRequestPost(context) {
  const headers = {
    "Content-Type": "application/json; charset=utf-8"
  };

  try {
    const { question, history = [] } = await context.request.json();

    if (typeof question !== "string" || !question.trim()) {
      return new Response(
        JSON.stringify({ error: "እባክህ ጥያቄ አስገባ።" }),
        { status: 400, headers }
      );
    }

    const apiKey = context.env.GEMINI_API_KEY;

    if (!apiKey) {
      return new Response(
        JSON.stringify({ error: "GEMINI_API_KEY አልተገኘም።" }),
        { status: 500, headers }
      );
    }

    const instructions = `
አንተ ETHIO BIZ AI ነህ።
ለኢትዮጵያ ሥራ ፈላጊዎችና ለአነስተኛ ነጋዴዎች
በአማርኛ ተግባራዊ፣ ትክክለኛና በዝርዝር ምክር ትሰጣለህ።
የተጠቃሚውን በጀት፣ አካባቢና አቅም አስብ።
የማይታወቅ መረጃን እንደተረጋገጠ አትናገር።
በተቻለ መጠን ደረጃ በደረጃ መልስ።
`;

    const contents = [];

    if (Array.isArray(history)) {
      for (const item of history.slice(-12)) {
        if (
          item &&
          typeof item.text === "string" &&
          item.text.trim()
        ) {
          contents.push({
            role: item.role === "assistant" ? "model" : "user",
            parts: [{ text: item.text }]
          });
        }
      }
    }

    contents.push({
      role: "user",
      parts: [{ text: question.trim() }]
    });

    const response = await fetch(
"https://generativelanguage.googleapis.com/v1beta/models/gemini-3.8-flash:generateContent",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": apiKey
        },
        body: JSON.stringify({
          systemInstruction: {
            parts: [{ text: instructions }]
          },
          contents,
          generationConfig: {
            maxOutputTokens: 1800,
            temperature: 0.7
          }
        })
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return new Response(
        JSON.stringify({
          error: data.error?.message || "Gemini API ስህተት ተፈጥሯል።"
        }),
        { status: 502, headers }
      );
    }

    const answer = data.candidates?.[0]?.content?.parts
      ?.map(part => part.text || "")
      .join("\n");

    if (!answer) {
      return new Response(
        JSON.stringify({ error: "AI ምላሽ አልሰጠም። እንደገና ሞክር።" }),
        { status: 502, headers }
      );
    }

    return new Response(
      JSON.stringify({ answer }),
      { status: 200, headers }
    );

  } catch (error) {
    return new Response(
      JSON.stringify({
        error: "የአገልግሎት ስህተት፦ " + error.message
      }),
      { status: 500, headers }
    );
  }
}
