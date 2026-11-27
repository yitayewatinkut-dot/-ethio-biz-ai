async function authenticate(request, env) {
  const authHeader = request.headers.get("Authorization") || "";
  const token = authHeader.startsWith("Bearer ")
    ? authHeader.slice(7).trim()
    : "";

  if (!token) return null;

  const hashBuffer = await crypto.subtle.digest(
    "SHA-256",
    new TextEncoder().encode(token)
  );

  const tokenHash = Array.from(new Uint8Array(hashBuffer))
    .map(b => b.toString(16).padStart(2, "0"))
    .join("");

  return await env.DB.prepare(`
    SELECT merchant_id
    FROM merchant_sessions
    WHERE token_hash = ?
    AND expires_at > unixepoch()
  `).bind(tokenHash).first();
}

function reply(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8"
    }
  });
}

export async function onRequestGet({ request, env }) {
  try {
    if (!env.DB) {
      return reply({ error: "Database binding DB is missing." }, 500);
    }

    const session = await authenticate(request, env);

    if (!session) {
      return reply({ error: "መጀመሪያ ወደ መለያዎ ይግቡ።" }, 401);
    }

    const result = await env.DB.prepare(`
      SELECT id, transaction_type, amount, description,
             transaction_date, created_at
      FROM merchant_transactions
      WHERE merchant_id = ?
      ORDER BY transaction_date DESC, created_at DESC
    `).bind(session.merchant_id).all();

    return reply({
      success: true,
      transactions: result.results
    });

  } catch (error) {
    return reply({ error: error.message }, 500);
  }
}

export async function onRequestPost({ request, env }) {
  try {
    if (!env.DB) {
      return reply({ error: "Database binding DB is missing." }, 500);
    }

    const session = await authenticate(request, env);

    if (!session) {
      return reply({ error: "መጀመሪያ ወደ መለያዎ ይግቡ።" }, 401);
    }

    const data = await request.json();

    const type = data.transaction_type;
    const amount = Number(data.amount);
    const description = String(data.description || "").trim();
    const date = String(data.transaction_date || "");

    if (!["sale", "expense"].includes(type)) {
      return reply({ error: "የግብይት ዓይነት ትክክል አይደለም።" }, 400);
    }

    if (!Number.isFinite(amount) || amount <= 0) {
      return reply({ error: "ትክክለኛ መጠን ያስገቡ።" }, 400);
    }

    if (description.length > 250) {
      return reply({ error: "መግለጫው ከ250 ቁምፊ መብለጥ የለበትም።" }, 400);
    }

    if (!/^\d{4}-\d{2}-\d{2}$/.test(date) ||
        Number.isNaN(Date.parse(date))) {
      return reply({ error: "ትክክለኛ ቀን ያስገቡ።" }, 400);
    }

    const id = crypto.randomUUID();

    await env.DB.prepare(`
      INSERT INTO merchant_transactions
      (id, merchant_id, transaction_type, amount, description, transaction_date)
      VALUES (?, ?, ?, ?, ?, ?)
    `).bind(
      id,
      session.merchant_id,
      type,
      amount,
      description,
      date
    ).run();

    return reply({
      success: true,
      message: "መዝገቡ በተሳካ ሁኔታ ተቀምጧል።",
      id
    }, 201);

  } catch (error) {
    return reply({ error: error.message }, 500);
  }
}
