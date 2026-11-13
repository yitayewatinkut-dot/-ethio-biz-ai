
export async function onRequestPost(context) {
  const headers = {
    "Content-Type": "application/json; charset=utf-8"
  };

  try {
    const { request, env } = context;
    const body = await request.json();
    const question = body.question;

    if (typeof question !== "string" || !question.trim()) {
      return new Response(
        JSON.stringify({ error: "እባክህ ጥያቄህን አስገባ።" }),
        { status: 400, headers }
      );
    }

    if (question.length > 10000) {
      return new Response(
        JSON.stringify({ error: "ጥያቄው ከመጠን በላይ ረጅም ነው።" }),
        { status: 400, headers }
      );
    }

    const apiKey = env.OPENAI_API_KEY;

    if (!apiKey) {
      return new Response(
        JSON.stringify({ error: "API key not configured" }),
        { status: 500, headers }
      );
    }

    const instructions = `
አንተ ETHIO BIZ AI ነህ።
የኢትዮጵያ የንግድ፣ የሥራና የሥራ ፈጠራ አማካሪ ነህ።

- በግልጽና ትክክለኛ አማርኛ መልስ።
- የተጠቃሚውን ያልተናገረውን የቀድሞ ውይይት አትፍጠር።
- ያልተሰጠ ቦታ፣ ካፒታል ወይም የንግድ ውሳኔ አትገምት።
- የንግድ ሃሳብ ሲጠየቅ ቢያንስ 5 አማራጮችን፣ ወጪና አደጋቸውን ግለጽ።
- ገቢን ከትርፍ አትቀላቅል።
- የተረጋገጠ መረጃን ከግምት ለይ።
- ተግባራዊና እውነተኛ ምክር ስጥ።
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
          input: [
            {
              role: "user",
              content: [
                {
                  type: "input_text",
                  text: question.trim()
                }
              ]
            }
          ],
          max_output_tokens: 1800
        })
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return new Response(
        JSON.stringify({
          error: data.error?.message || "AI request failed"
        }),
        { status: response.status, headers }
      );
    }

    const answer = (data.output || [])
      .flatMap(item => item.content || [])
      .filter(part => part.type === "output_text")
      .map(part => part.text)
      .join("\n");

    return new Response(
      JSON.stringify({
        answer: answer || "ምላሽ ማግኘት አልተቻለም።"
      }),
      { status: 200, headers }
    );

  } catch (error) {
    return new Response(
      JSON.stringify({
        error: "የማያያዣ ስህተት ተፈጥሯል።"
      }),
      { status: 500, headers }
    );
  }
}
