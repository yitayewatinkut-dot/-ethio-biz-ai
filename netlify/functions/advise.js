
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
        JSON.stringify({ error: "እባክህ ጥያቄህን አስገባ።" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" }
        }
      );
    }

    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey || !apiKey.trim()) {
      throw new Error("GEMINI_API_KEY አልተገኘም።");
    }

    const safeHistory = Array.isArray(history)
      ? history.slice(-12)
          .filter(item =>
            item &&
            ["user", "assistant"].includes(item.role) &&
            typeof item.text === "string"
          )
          .map(item => ({
            role: item.role,
            text: item.text.slice(0, 3000)
          }))
      : [];

    const conversation = safeHistory.map(item =>
      (item.role === "user" ? "ተጠቃሚ፦ " : "ETHIO BIZ AI፦ ") +
      item.text
    ).join("\n\n");

    const instructions =
      "አንተ ETHIO BIZ AI ነህ። በኢትዮጵያ ለሥራ ፈላጊዎችና " +
      "ለአነስተኛ ነጋዴዎች ተግባራዊ ምክር የምትሰጥ ባለሙያ አማካሪ ነህ።\n\n" +

      "የምላሽ መመሪያዎች፦\n" +
      "1. ሁልጊዜ በተፈጥሯዊ፣ ግልጽና ትክክለኛ አማርኛ መልስ።\n" +
      "2. የተጠቃሚውን ካፒታል፣ ቦታ፣ ችሎታና ሁኔታ አስብ።\n" +
      "3. መረጃ ከጎደለ አንድ አስፈላጊ ጥያቄ ብቻ ጠይቅ።\n" +
      "4. በትንሽ ካፒታል ሊጀመሩ የሚችሉ እውነተኛ አማራጮችን ጠቁም።\n" +
      "5. የሥራ ፍለጋ፣ ንግድ መጀመር፣ የገበያ ጥናትና የንግድ እድገት ላይ እገዛ አድርግ።\n" +
      "6. የመነሻ ወጪን፣ ወርሃዊ ወጪን፣ ገቢንና የተጣራ ትርፍን ለይተህ አሳይ።\n" +
      "7. የትርፍ ስሌት ሲያደርግ የተጠቀምክባቸውን ግምቶች ግለጽ።\n" +
      "8. ያልተረጋገጡ ዋጋዎችን፣ የገበያ መረጃዎችንና ዋስትና የሌለውን ትርፍ እንደ እውነት አትናገር።\n" +
      "9. ዋጋ ካልታወቀ በአካባቢው መጠየቅና ማረጋገጥ እንዳለበት ግለጽ።\n" +
      "10. ካፒታሉን በሙሉ አንድ ጊዜ እንዲያወጣ አትመክር። በትንሽ ሙከራ እንዲጀምር አበረታታ።\n" +
      "11. በደረጃ የተደራጀ፣ ተግባራዊና የሚተገበር ምላሽ ስጥ።\n" +
      "12. የቀድሞ ውይይትን አስታውስ፤ ተጠቃሚው የሰጠውን መረጃ እንደገና አትጠይቅ።\n" +
      "13. አላስፈላጊ የእንግሊዝኛ ቃላትንና የተበላሹ ምልክቶችን አትጠቀም።\n\n" +

      "የቀድሞ ውይይት፦\n" +
      (conversation || "የቀድሞ ውይይት የለም።") +
      "\n\nአዲስ ጥያቄ፦\n" + question.trim();

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
            input: instructions
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
        "AI አሁን ምላሽ መስጠት አልቻለም። ቆይተህ እንደገና ሞክር። " +
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
