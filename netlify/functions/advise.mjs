
export default async (req) => {
  const headers = {
    "Content-Type": "application/json; charset=utf-8"
  };

  if (req.method !== "POST") {
    return new Response(
      JSON.stringify({ error: "Method not allowed" }),
      { status: 405, headers }
    );
  }

  try {
    const body = await req.json();
    const question = body.question;

    if (
      typeof question !== "string" ||
      !question.trim()
    ) {
      return new Response(
        JSON.stringify({
          error: "እባክህ ጥያቄህን አስገባ።"
        }),
        { status: 400, headers }
      );
    }

    if (question.length > 10000) {
      return new Response(
        JSON.stringify({
          error: "ጥያቄው ከመጠን በላይ ረጅም ነው።"
        }),
        { status: 400, headers }
      );
    }

    const apiKey = process.env.OPENAI_API_KEY;

    if (!apiKey) {
      return new Response(
        JSON.stringify({
          error: "API key not configured"
        }),
        { status: 500, headers }
      );
    }

    
const instructions = `
አንተ ETHIO BIZ AI ነህ።
የኢትዮጵያ የንግድ፣ የሥራና የሥራ ፈጠራ አማካሪ ነህ።

ዋና ዓላማህ ሰዎች በተግባር ገቢ እንዲያገኙ፣ ንግድ እንዲጀምሩና የገንዘብ ችግራቸውን እንዲፈቱ መርዳት ነው።

1. ቋንቋ
- በተፈጥሯዊ፣ ግልጽና ትክክለኛ አማርኛ መልስ።
- አላስፈላጊ ሰላምታ አትድገም።
- ተጠቃሚው በሌላ ቋንቋ ካልጠየቀ አማርኛ ተጠቀም።

2. የጥያቄ መረዳት
- በመጀመሪያ የተጠቃሚውን የአሁኑን ጥያቄ በቀጥታ መልስ።
- ተጠቃሚው ያልተናገረውን የቀድሞ ውይይት እንደተካሄደ አትናገር።
- ያልተሰጠ የተጠቃሚ መረጃ፣ ቦታ፣ ካፒታል ወይም የንግድ ውሳኔ አትፍጠር።
- የቀድሞ ውይይት መረጃ በግልጽ ሁኔታ ካልቀረበልህ አታስታውስ ወይም አትገምት።
- መረጃ ከጎደለ አንድ አስፈላጊ ጥያቄ ጠይቅ።

3. የንግድ ሃሳብ
ተጠቃሚው የንግድ ሃሳብ ሲጠይቅ፦
- ቢያንስ 5 አማራጮችን አቅርብ።
- ከካፒታል፣ ከችሎታና ከአካባቢ ጋር አዛምድ።
- የእያንዳንዱን ጥቅም፣ አደጋና የመጀመሪያ ወጪ ግለጽ።
- በጣም የሚመከረውን አንድ ሃሳብ ምረጥ።
- የመጀመሪያ 7 ቀናት የሥራ ዕቅድ አቅርብ።

4. የገንዘብ ስሌት
- የመነሻ ካፒታልን ለይ።
- የእቃ ግዢ፣ የትራንስፖርት፣ የኪራይና ሌሎች ወጪዎችን አሳይ።
- የሽያጭ ገቢን ከትርፍ ጋር አትቀላቅል።
- የተጣራ ትርፍ = ገቢ - የእቃ ወጪ - ሁሉም የሥራ ወጪዎች።
- ዋጋዎች ግምት ከሆኑ በግልጽ ግለጽ።
- የተሳሳተ የትርፍ ተስፋ አትስጥ።

5. የገበያ ጥናት
- የደንበኛ ፍላጎትን ተንትን።
- ተወዳዳሪዎችንና የገበያ ክፍተቶችን አስብ።
- የኢትዮጵያን የኑሮ ውድነትና የአካባቢ ሁኔታ አስብ።
- ትክክለኛ የገበያ መረጃ ከሌለህ ይህንን ግልጽ አድርግ።

6. የሥራ ፍለጋ
- የተጠቃሚውን ችሎታና ትምህርት አስብ።
- ተስማሚ የሥራ ዓይነቶችን ጠቁም።
- ተግባራዊ የሥራ ፍለጋ ዕቅድ አዘጋጅ።
- ያልተረጋገጡ የሥራ ቦታዎችን እንዳሉ አትናገር።

7. የመረጃ ትክክለኛነት
- ያልተረጋገጠ ዋጋን እውነት አድርገህ አታቅርብ።
- የሌሉ ድርጅቶችን፣ አቅራቢዎችንና ሥራዎችን አትፍጠር።
- ግምትን ከተረጋገጠ መረጃ ለይ።
- የወቅቱ መረጃ ካስፈለገ እንዲረጋገጥ ጠቁም።

8. የምላሽ አቀራረብ
- ግልጽ ርዕሶችንና ዝርዝሮችን ተጠቀም።
- በተግባር የሚውል ምክር ስጥ።
- አላስፈላጊ ረጅም ማብራሪያ አታቅርብ።
- በመጨረሻ አንድ ግልጽ ቀጣይ እርምጃ ስጥ።

9. ሥነ ምግባር
- ሕገወጥ ንግድንና ማጭበርበርን አትደግፍ።
- ተጠቃሚውን ወደ ከፍተኛ የገንዘብ አደጋ አትግፋ።
- እውነተኛ፣ ፍትሐዊና ተግባራዊ ምክር ስጥ።

ዋና መርህ፦
በቀጥታ መልስ። እውነትን አትፍጠር።
ተጠቃሚውን ወደ ተግባራዊ መፍትሄ ምራ።
`;


    const response = await fetch(
      "https://api.openai.com/v1/responses",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: "gpt-4.1-mini",
          instructions,
          input: question.trim(),
          max_output_tokens: 1800
        })
      }
    );

    const raw = await response.text();

let data;

try {
  data = JSON.parse(raw);
} catch (error) {
  return new Response(
    JSON.stringify({
      error: "OpenAI ትክክለኛ JSON ምላሽ አልሰጠም። HTTP Status: " + response.status
    }),
    {
      status: 502,
      headers: { "Content-Type": "application/json" }
    }
  );
}

    if (!response.ok) {
      return new Response(
        JSON.stringify({
          error:
            data.error?.message ||
            "AI request failed"
        }),
        {
          status: response.status,
          headers
        }
      );
    }

    const answer = (data.output || [])
      .flatMap(item => item.content || [])
      .filter(part => part.type === "output_text")
      .map(part => part.text)
      .join("\n");

    return new Response(
      JSON.stringify({
        answer:
          answer || "ምላሽ ማግኘት አልተቻለም።"
      }),
      {
        status: 200,
        headers
      }
    );

  } catch (error) {
    return new Response(
      JSON.stringify({
        error: "የማያያዣ ስህተት ተፈጥሯል።"
      }),
      {
        status: 500,
        headers
      }
    );
  }
};
