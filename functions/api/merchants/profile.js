export async function onRequestGet({ request, env }) {
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
      return reply({ error: "መጀመሪያ ወደ መለያዎ ይግቡ።" }, 401);
    }

    const hashBuffer = await crypto.subtle.digest(
      "SHA-256",
      new TextEncoder().encode(token)
    );

    const tokenHash = Array.from(
      new Uint8Array(hashBuffer)
    ).map(b => b.toString(16).padStart(2, "0")).join("");

    const session = await env.DB.prepare(`
      SELECT merchant_id
      FROM merchant_sessions
      WHERE token_hash = ?
        AND expires_at > unixepoch()
      LIMIT 1
    `).bind(tokenHash).first();

    if (!session) {
      return reply({ error: "የመግቢያ ጊዜዎ አብቅቷል። እንደገና ይግቡ።" }, 401);
    }

    const merchant = await env.DB.prepare(`
      SELECT id, business_name, owner_name, phone, email,
             business_type, address, status, verification_level
      FROM merchants
      WHERE id = ?
      LIMIT 1
    `).bind(session.merchant_id).first();

    if (!merchant) {
      return reply({ error: "የነጋዴ መለያው አልተገኘም።" }, 404);
    }

    return reply({
      success: true,
      message: "የንግድ መረጃህ ተገኝቷል።",
      merchant
    });

  } catch (error) {
    return reply({
      error: "የServer ስህተት፦ " + error.message
    }, 500);
  }
}
