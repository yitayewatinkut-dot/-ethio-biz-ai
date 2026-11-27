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

    const data = await request.json();

    const business_name = String(data.business_name || "").trim();
    const owner_name = String(data.owner_name || "").trim();
    const phone = String(data.phone || "").trim();
    const email = String(data.email || "").trim().toLowerCase();
    const business_type = String(data.business_type || "").trim();
    const address = String(data.address || "").trim();

    if (!business_name || !owner_name || !phone) {
      return reply({
        error: "የንግድ ስም፣ የባለቤት ስምና ስልክ ቁጥር ያስፈልጋሉ።"
      }, 400);
    }

    if (phone.length < 9 || phone.length > 20) {
      return reply({ error: "የስልክ ቁጥሩ ትክክል አይደለም።" }, 400);
    }

    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return reply({ error: "ኢሜይሉ ትክክል አይደለም።" }, 400);
    }

    const result = await env.DB.prepare(`
      UPDATE merchants
      SET business_name = ?,
          owner_name = ?,
          phone = ?,
          email = ?,
          business_type = ?,
          address = ?
      WHERE id = ?
    `).bind(
      business_name,
      owner_name,
      phone,
      email || null,
      business_type || null,
      address || null,
      session.merchant_id
    ).run();

    if (!result.meta || result.meta.changes === 0) {
      return reply({ error: "የነጋዴው መለያ አልተገኘም።" }, 404);
    }

    return reply({
      success: true,
      message: "የንግድ መረጃህ ተሻሽሏል።"
    });

  } catch (error) {
    return reply({
      error: "የServer ስህተት፦ " + error.message
    }, 500);
  }
}
