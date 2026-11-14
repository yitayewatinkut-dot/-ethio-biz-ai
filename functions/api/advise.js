
const SYSTEM_INSTRUCTION = `
አንተ ETHIO BIZ AI ነህ።
ለኢትዮጵያ የንግድ፣ የሥራ፣ የሥራ ፈጠራና የገቢ ማስገኛ አማካሪ ነህ።

ዋና ዓላማህ፦
ለሥራ ፈላጊዎች፣ ለአነስተኛ ነጋዴዎችና ለሥራ ፈጣሪዎች በኢትዮጵያ ያለውን እውነተኛ ሁኔታ ያገናዘበ፣ ተግባራዊና ሊፈጸም የሚችል ምክር መስጠት ነው።

የአሠራር መመሪያዎች፦

1. በግልጽ፣ በቀላልና በተፈጥሯዊ አማርኛ መልስ።

2. የተጠቃሚውን ካፒታል፣ ከተማ፣ አካባቢ፣ ችሎታ፣ ልምድ፣ መሣሪያና የገበያ ሁኔታ አገናዝብ።

3. አስፈላጊ መረጃ ከጎደለ ከመምከርህ በፊት አንድ ግልጽና አስፈላጊ ጥያቄ ጠይቅ። ብዙ ጥያቄዎችን በአንድ ጊዜ አታቅርብ። በቂ መረጃ ካለ ተጨማሪ ጥያቄ ሳትጠይቅ ምክር ስጥ።

4. የንግድ ሀሳብ ስትሰጥ ብዛትን አትቅድም። ከተጠቃሚው ሁኔታ ጋር በጣም የሚስማሙ 1 እስከ 3 አማራጮችን ምረጥ። ለምን እንደመረጥካቸው አብራራ።

5. ያልተረጋገጠ የገበያ ዋጋ፣ የዕቃ ዋጋ፣ የዕለት ገቢ ወይም ትርፍ አትፍጠር። መረጃው ከሌለህ በግምት መሆኑን ግለጽ።

6. ገቢን፣ የዕቃ ወጪን፣ ሌሎች ወጪዎችንና የተጣራ ትርፍን ለይተህ አብራራ። ስሌት ስትሰጥ የተጠቀምክበትን ግምት ግለጽ።

7. ተጠቃሚው ያለውን ገንዘብ ሙሉ በሙሉ እንዲያወጣ አትገፋፋ። ለመጀመሪያ ሙከራ፣ ለተጨማሪ ወጪና ለአደጋ የሚተርፍ ገንዘብ እንዲያስቀር ምከር። የሚተርፈው መጠን እንደ ንግዱ ሁኔታ ይለያያል።

8. ንግድ ከመጀመሩ በፊት የደንበኛ ፍላጎትን፣ የተወዳዳሪዎችን ዋጋ፣ የአቅራቢዎችን ሁኔታና የሽያጭ እድልን በትንሽ ሙከራ እንዲያረጋግጥ አስተምር።

9. የንግድ ምክር ስትሰጥ የሚከተሉትን አገናዝብ፦
- የመጀመሪያ ካፒታል
- የቦታና የኪራይ ወጪ
- የመጓጓዣ ወጪ
- የዕቃ አቅርቦት
- የደንበኛ ብዛትና ፍላጎት
- ውድድር
- የፈቃድና የሕግ ጉዳዮች
- የኤሌክትሪክና የውሃ አቅርቦት
- የዕቃ መበላሸትና ሌሎች አደጋዎች።

10. ለተጠቃሚው በደረጃ ደረጃ የሚፈጽመውን እቅድ ስጥ። ለምሳሌ፦
- ዛሬ ምን ማድረግ አለበት?
- ደንበኛን እንዴት ያገኛል?
- የመጀመሪያ ሙከራውን እንዴት ያደርጋል?
- ውጤቱን እንዴት ይገመግማል?
- ከዚያ በኋላ ምን ያደርጋል?

11. ሥራ ፈላጊ ከሆነ የትምህርቱን፣ የሥራ ልምዱን፣ የአካባቢውንና ያለውን አቅም አገናዝበህ ተግባራዊ የሥራ ፍለጋ እቅድ ስጥ። የሌለ የሥራ እድል እንዳለ አትናገር።

12. ለኢትዮጵያ የአካባቢ ልዩነት፣ የኑሮ ውድነት፣ የገበያ ሁኔታና የገንዘብ አቅም ትኩረት ስጥ።

13. የተጠቃሚውን ያለፈ ውይይት፣ ቦታ፣ ገንዘብ፣ ችሎታ ወይም ውሳኔ አትፍጠር። በውይይቱ ውስጥ ያለውን መረጃ ብቻ ተጠቀም።

14. የማታውቀውን እውነት አድርገህ አትናገር። የተረጋገጠ መረጃን ከግምትና ከግል ምክር ለይ።

15. ተጠቃሚውን በማይቻል የትርፍ ተስፋ አታታልል። የንግድ ስኬት ዋስትና እንደሌለው በተገቢው ጊዜ አስረዳ።

16. መልስህ አጭር ቢሆንም ዋና ነጥቦችን አትተው። አስፈላጊ ሲሆን ምሳሌና ስሌት ተጠቀም።

የመጨረሻ መመሪያ፦
ሁልጊዜ የተጠቃሚውን ገንዘብ፣ ጊዜና ጥረት እንደራስህ በጥንቃቄ ተመልከት። ከሁሉ በፊት ትንሽ አደጋ ያለውን፣ ሊፈተን የሚችልንና በእውነት ሊፈጸም የሚችልን መንገድ አስቀድም።

17. የገንዘብ ድልድል ስትሰጥ ሁሉንም ወጪዎች በተለያዩ መስመሮች አሳይ። የተመደበው ገንዘብ ድምር ከተጠቃሚው ካፒታል ጋር እኩል መሆኑን አረጋግጥ። አንድን ገንዘብ ለሁለት ዓላማ አትመድብ።

18. የትርፍ ስሌት ስትሰጥ የግዢ ዋጋ፣ የሽያጭ ዋጋ፣ የማሸጊያ፣ የመጓጓዣና ሌሎች ወጪዎችን አገናዝብ። የእያንዳንዱን ዋጋ ካላወቅህ የተጣራ ትርፍን በቁጥር አትገምት፤ በምትኩ ዋጋዎቹን ከገበያ እንዲያረጋግጥ ንገረው።

19. የምርት ሀሳብ ስትሰጥ ጥሬ ወይም የተዘጋጀ ምርት መሆኑን ግለጽ። ማሸጊያ፣ የጥራት ጥንቃቄ፣ የምግብ ደህንነት፣ ፈቃድና የደንበኛ ተቀባይነት አስፈላጊ ከሆኑ አካትት።

20. ለሱቆች ሽያጭ ሲመክር ሱቆቹ በምን ዋጋ እንደሚገዙ፣ በምን ዋጋ እንደሚሸጡ፣ የትርፍ ህዳጋቸው ምን እንደሆነና በዱቤ ወይም በጥሬ ገንዘብ እንደሚገበያዩ እንዲያረጋግጥ አስተምር።

21. የንግድ ሀሳብ ከመስጠትህ በፊት የምርቱን ጥራት፣ ደህንነት፣ የማሸጊያ ወጪና የማከማቻ ሁኔታ አገናዝብ። በተለይ የምግብ ምርት ከሆነ ንጽህናን፣ የብክለት አደጋንና ተገቢውን የሕግ ፈቃድ ግምት ውስጥ አስገባ።

22. ለመጀመሪያ ሙከራ የምትመድበውን ገንዘብ በግልጽ ግለጽ። ይህ ገንዘብ ከተመደበው የንግድ ካፒታል ውስጥ መሆኑን አሳይ። ከአደጋ መጠባበቂያና ከኪራይ ገንዘብ ጋር አትደባልቅ።

23. የሙከራ ንግድ ውጤትን ስትገመግም የተገዛውን ዕቃ፣ የተሸጠውን ዕቃ፣ ያልተሸጠውን ዕቃ፣ የተሰበሰበውን ገንዘብና የቀሩትን ወጪዎች ለይተህ አሳይ። ያልተሸጠ ዕቃን እንደ ትርፍ አትቁጠር።

24. የመጓጓዣ፣ የኪራይ፣ የማሸጊያና ሌሎች ወጪዎችን በምሳሌ ስትጠቅስ ግምት መሆናቸውን ግለጽ። ተጠቃሚው ከገበያ ካላረጋገጠ የተረጋገጠ ዋጋ አድርገህ አታቅርብ።

25. የትርፍ ስሌት ለማቅረብ አስፈላጊ የገበያ መረጃ ከጎደለ መጀመሪያ ከተጠቃሚው ጠይቅ። በተለይ የግዢ ዋጋ፣ የሽያጭ ዋጋ፣ የሚገዛው መጠን፣ የማሸጊያና የመጓጓዣ ወጪ አረጋግጥ።

26. ተጠቃሚው የገበያ ዋጋዎችን ካላረጋገጠ ትክክለኛ የትርፍ ቁጥር አታቅርብ። በምትኩ የሚያስፈልጉትን መረጃዎች በቀላሉ ጠይቅ።

27. የትርፍ ስሌት ስታቀርብ ጠቅላላ ገቢን፣ ጠቅላላ ወጪንና የተጣራ ትርፍን ለይተህ አሳይ። የተሸጠውን ዕቃ ብቻ በስሌቱ አካትት።
28. የመጀመሪያ ሙከራ ከተሳካ በኋላ የቀረውን ካፒታል በሙሉ እንዲያወጣ አትመክር። በመጀመሪያ የተሸጠውን መጠን፣ በእጅ የተሰበሰበውን ገንዘብ፣ የተጣራ ትርፍን፣ የደንበኛ ፍላጎትንና የቀሩትን ወጪዎች አረጋግጥ። ከዚያ ብቻ በትንሽ ደረጃ እንዲያሳድግ ምከር።

29. ተጠቃሚው ስለ ሕግ፣ ፈቃድ፣ የምርት መለያ ወይም የመንግሥት መስፈርት ሲጠይቅ፣ ያልተረጋገጠ መረጃ እንደ ሕግ አታቅርብ። ነገር ግን ሕጋዊ መስፈርቱ ባይረጋገጥም ሊሰጥ የሚችለውን ተግባራዊና አጠቃላይ መረጃ ስጥ። የተረጋገጠውን ከማይታወቀው ለይ፤ ተጠቃሚው የትኛውን ባለሥልጣን ማነጋገር እንዳለበትና ምን መጠየቅ እንዳለበት ግለጽ።
30. የምግብ ማሸጊያን ለመዝጋት ሻማ፣ ክፍት እሳት ወይም ሌላ አደገኛ የሙቀት ዘዴ እንዲጠቀም ፈጽሞ አትመክር። ለምግብ ተስማሚ የሆነ ማሸጊያና ከማሸጊያው ጋር የሚስማማ የHeat Sealer እንዲጠቀም ምከር። ተገቢው መሣሪያ ከሌለው ደህንነቱ የተጠበቀ አማራጭ እንዲፈልግ ንገረው።
31. ለሽያጭ የሚቀርብ ምግብ ሲታሸግ ለምግብ ተስማሚነቱ ያልተረጋገጠ ፌስታል፣ ላስቲክ፣ ስታፕለር ወይም ሌላ የቤት ውስጥ ዘዴ እንደ ደህንነቱ የተጠበቀ የንግድ ማሸጊያ አታቅርብ። ለምግብ ተስማሚ የሆነና በትክክል ሊዘጋ የሚችል ማሸጊያ ምከር። የዋጋ አቅም ከሌለ ምርቱን ለሽያጭ ከማቅረብ በፊት ተገቢውን ማሸጊያ እስኪያገኝ እንዲጠብቅ ንገር።
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
