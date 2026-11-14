
const SYSTEM_INSTRUCTION = `
አንተ ETHIO BIZ AI ነህ።
የኢትዮጵያ የንግድ፣ የሥራና የሥራ ፈጠራ አማካሪ ነህ።

ዋና ዓላማህ ለኢትዮጵያ ሥራ ፈላጊዎች፣ ለአነስተኛ ነጋዴዎችና ለሥራ ፈጣሪዎች ተግባራዊ ምክር መስጠት ነው።

መመሪያዎች፦
1. በግልጽና በቀላል አማርኛ መልስ።
2. ተግባራዊ፣ እውነተኛና ሊፈጸም የሚችል ምክር ስጥ።
3. የተጠቃሚውን ካፒታል፣ ቦታና አቅም ከግምት አስገባ።
4. የማታውቀውን እውነት አድርገህ አትናገር።
5. ያልተረጋገጠ መረጃን እንደ ግምት ግለጽ።
6. የንግድ ሀሳብ ስትሰጥ ቢያንስ 5 አማራጮችን፣ ወጪዎችንና አደጋዎችን አብራራ።
7. ገቢንና ትርፍን ለይተህ ግለጽ።
8. የተጠቃሚውን ያለፈ ውይይት፣ ቦታ፣ ገንዘብ ወይም ውሳኔ አትፍጠር።
9. ምክርህን በደረጃ ደረጃ አቅርብ።
10. የኢትዮጵያን የኢኮኖሚ ሁኔታና የአካባቢ ልዩነት ከግምት አስገባ።
`;

const sleep = (ms) =>
  new Promise((resolve) => setTimeout(resolve, ms));

async function callGemini(model, contents, apiKey) {
  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-goog-api-key": apiKey
      },
      body: JSON.stringify({
        systemInstruction: {
          parts: [{ text: SYSTEM_INSTRUCTION }]
        },
        contents,
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 2048
        }
      })
    }
  );

  const data = await response.json();

  if (!response.ok) {
    const error = new Error("Gemini API request failed");
    error.status = response.status;
    throw error;
  }

  const answer = data.candidates?.[0]?.content?.parts
    ?.map((part) => part.text || "")
    .join("")
    .trim();

  if (!answer) {
    throw new Error("Empty AI response");
  }

  return answer;
}

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

    if (question.length > 10000) {
      return new Response(
        JSON.stringify({ error: "ጥያቄው ከ10,000 ፊደላት መብለጥ የለበትም።" }),
        { status: 400, headers }
      );
    }

    const apiKey = context.env.GEMINI_API_KEY;

    if (!apiKey) {
      return new Response(
        JSON.stringify({ error: "API key አልተዘጋጀም።" }),
        { status: 500, headers }
      );
    }

    const contents = [];

    if (Array.isArray(history)) {
      for (const item of history.slice(-12)) {
        if (
          item &&
          typeof item.text === "string" &&
          item.text.trim()
        ) {
          contents.push({
            role: item.role === "assistant" || item.role === "model"
              ? "model"
              : "user",
            parts: [{ text: item.text.slice(0, 5000) }]
          });
        }
      }
    }

    contents.push({
      role: "user",
      parts: [{ text: question.trim() }]
    });

    // First try: Gemini 3.8 Flash
    try {
      const answer = await callGemini(
        "gemini-3.8-flash",
        contents,
        apiKey
      );

      return new Response(
  JSON.stringify({
    answer,
    model: "gemini-3.8-flash"
  }),
  { status: 200, headers }
);

    } catch (firstError) {const temporary = [429, 500, 502, 503, 504].includes(firstError.status);
      if (!temporary) {
        throw firstError;
      }
    }

    // Retry Gemini 3.8 Flash once
    await sleep(1000);

    try {
      const answer = await callGemini(
        "gemini-3.8-flash",
        contents,
        apiKey
      );

      return new Response(
        JSON.stringify({
  answer,
  model: "gemini-3.8-flash"
}),
        { status: 200, headers }
      );

} catch (retryError) {
  const temporary = [429, 500, 502, 503, 504].includes(retryError.status);

      if (!temporary) {
        throw retryError;
      }
    }

    // Fallback: Gemini 3.5 Flash Lite
    const answer = await callGemini(
      "gemini-3.5-flash-lite",
      contents,
      apiKey
    );

    return new Response(
      JSON.stringify({
  answer,
  model: "gemini-3.5-flash-lite"
}),
      { status: 200, headers }
    );

  } catch (error) {
    return new Response(
      JSON.stringify({error: "ስህተት፦ " + (error.message || "ዝርዝር የለም") +
  " | HTTP: " + (error.status || 500)
      }),
      { status: error.status || 500, headers }
    );
  }
}
