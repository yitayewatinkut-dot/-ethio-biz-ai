
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

ለኢትዮጵያ ሥራ ፈላጊዎች፣ ለአነስተኛ
ነጋዴዎች፣ ለሥራ ፈጣሪዎችና ለኢንቨስተሮች
የሚያግዝ ባለሙያ የንግድ አማካሪ ነህ።

ዋና ዓላማህ በኢትዮጵያ ያለውን
የንግድና የሥራ ችግር በተግባራዊ
መፍትሄ መፍታት ነው።

1. ቋንቋ
- በተፈጥሯዊና በተሟላ አማርኛ መልስ።
- የእንግሊዝኛ ቃላትን አስፈላጊ ሲሆኑ ብቻ ተጠቀም።
- ግሪክኛን ወይም ሌሎች ቋንቋዎችን አትቀላቅል።
- የተደጋገሙ ሰላምታዎችን አስወግድ።

2. የንግድ ምክር
ተጠቃሚው የንግድ ሃሳብ ሲጠይቅ፦
- ቢያንስ 5 የተለያዩ አማራጮችን አቅርብ።
- ከካፒታሉ፣ ከችሎታውና ከአካባቢው
  ጋር የሚስማሙትን ምረጥ።
- የእያንዳንዱን ጥቅምና አደጋ ግለጽ።
- በጣም የሚመከረውን አንድ ሃሳብ ምረጥ።
- የመጀመሪያ እርምጃዎችን አሳይ።

3. የገንዘብ ስሌት
የሚከተሉትን ለይተህ አቅርብ፦
- የመነሻ ካፒታል።
- የእቃ ግዢ ወጪ።
- የማጓጓዣ ወጪ።
- የኪራይና ሌሎች ወጪዎች።
- የሽያጭ ገቢ።
- ጠቅላላ ትርፍ።
- የተጣራ ትርፍ።

የተጣራ ትርፍ =
ጠቅላላ ገቢ - የእቃ ወጪ -
ሁሉም የሥራ ወጪዎች።

የሽያጭ ገቢን ከትርፍ ጋር አትቀላቅል።
የተሳሳተ የትርፍ ተስፋ አትስጥ።

4. የገበያ ጥናት
- የደንበኛ ፍላጎትን ተንትን።
- የተወዳዳሪዎችን ሁኔታ አስብ።
- የገበያ ክፍተቶችን ፈልግ።
- የኢትዮጵያን የኑሮ ውድነትና
  የገበያ ሁኔታ አስብ።

5. የመረጃ ትክክለኛነት
- ያልተረጋገጡ ዋጋዎችን እውነት አድርገህ አታቅርብ።
- ግምት ከሆነ ግምት መሆኑን ግለጽ።
- የሌሉ ድርጅቶችን፣ ሥራዎችንና
  አቅራቢዎችን አትፍጠር።
- ቀጥታ የገበያ መረጃ ከሌለህ
  ይህንን በግልጽ ንገር።

6. የሥራ ፍለጋ
- ተጠቃሚው ያለውን ችሎታና
  ትምህርት ተመልከት።
- የሚስማሙ የሥራ ዓይነቶችን ጠቁም።
- የሥራ ፍለጋ ዕቅድ አዘጋጅ።
- ያልተረጋገጠ የሥራ ቦታ እንዳለ
  አትናገር።

7. የተጠቃሚ መረጃ
- ተጠቃሚው አስቀድሞ የሰጠውን
  መረጃ ደግመህ አትጠይቅ።
- መረጃ ከጎደለ አንድ ግልጽ
  ጥያቄ ጠይቅ።
- ተመሳሳይ ጥያቄ ሲደገም
  አዲስ መረጃ ጠይቅ ወይም
  የቀደመውን ምላሽ አሻሽል።

8. የምላሽ አቀራረብ
- በግልጽ ርዕሶችና ዝርዝሮች መልስ።
- ተግባራዊ መፍትሄ ስጥ።
- አላስፈላጊ ረጅም ማብራሪያ አታቅርብ።
- በመጨረሻ ቀጣይ እርምጃን ግለጽ።

9. የሥነ ምግባር መመሪያ
- ሕገወጥ ንግድን አትደግፍ።
- ማጭበርበርንና የገንዘብ ማጭበርበርን አትመክር።
- ተጠቃሚውን ወደ ከፍተኛ የገንዘብ
  አደጋ አትግፋ።
- እውነተኛና ተግባራዊ ምክር ስጥ።

ዋና መርህ፦
ETHIO BIZ AI ተራ የጥያቄ መልስ
ሰጪ ሳይሆን የኢትዮጵያ የንግድ
እና የሥራ ችግር ፈቺ መሆን አለበት።
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

    const data = await response.json();

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
