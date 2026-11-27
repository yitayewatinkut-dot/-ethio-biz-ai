
export async function onRequestPost({ request, env }) {
  const reply = (data, status = 200) =>
    new Response(JSON.stringify(data), {
      status,
      headers: {
        "Content-Type": "application/json; charset=utf-8"
      }
    });

  try {
    if (!env.DB) {
      return reply({ error: "Database binding DB is missing." }, 500);
    }

    const authHeader = request.headers.get("Authorization") || "";
    const token = authHeader.startsWith("Bearer ")
      ? authHeader.slice(7).trim()
      : "";

    if (!token) {
      return reply({
        error: "መጀመሪያ ወደ መለያዎ ይግቡ።"
      }, 401);
    }

    const hashBuffer = await crypto.subtle.digest(
      "SHA-256",
      new TextEncoder().encode(token)
    );

    const tokenHash = Array.from(
      new Uint8Array(hashBuffer)
    ).map(b => b.toString(16).padStart(2, "0")).join("");

    const result = await env.DB.prepare(`
      DELETE FROM merchant_sessions
      WHERE token_hash = ?
    `).bind(tokenHash).run();

    if (!result.meta.changes) {
      return reply({
        error: "የመግቢያ ሰሌዳው አልተገኘም።"
      }, 401);
    }

    return reply({
      success: true,
      message: "ከመለያዎ በተሳካ ሁኔታ ወጥተዋል።"
    });

  } catch (error) {
    return reply({
      error: "የServer ስህተት፦ " + error.message
    }, 500);
  }
}
