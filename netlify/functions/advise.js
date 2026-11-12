export default async (req) => {
  if (req.method !== "POST") {
    return new Response(
      JSON.stringify({ error: "POST method required" }),
      { status: 405 }
    );
  }
try {
    const { question } = await req.json();
if (!question || !question.trim()) {
      return new Response(
        JSON.stringify({ error: "ጥያቄ አስገባ።" }),
        { status: 400 }
      );
    }
 const apiKey = process.env.GEMINI_API_KEY;
 if (!apiKey) {
      throw new Error("Gemini API Key አልተገኘም።");
    }
const response = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": apiKey
        },
        body: JSON.stringify({
          system_instruction: {
            parts: [{
              text: "You are ETHIO BIZ AI, an Ethiopian business adviser. Answer in clear Amharic. Give realistic, practical business advice for Ethiopia. Explain costs, customers, risks and possible profit. Never invent verified market facts."
            }]
          },
          contents: [{
            role: "user",
            parts: [{ text: question }]
          }]
        })
      }
    );
 const data = await response.json();
if (!response.ok) {
      throw new Error(
        data.error?.message || "Gemini API error"
      );
    }
const answer =
      data.candidates?.[0]?.content?.parts
        ?.map(p => p.text || "")
        .join("") || "ምላሽ አልተገኘም።";
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
      { status: 500 }
    );
  }
};
