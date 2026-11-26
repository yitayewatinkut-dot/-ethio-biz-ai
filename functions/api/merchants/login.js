
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

    const data = await request.json();
    const phone = String(data.phone || "").trim();
    const password = String(data.password || "");

    if (!phone || !password) {
      return reply({
        error: "ስልክ ቁጥርና ይለፍ ቃል ያስፈልጋሉ።"
      }, 400);
    }

    const merchant = await env.DB.prepare(`
      SELECT m.id, m.phone, a.password_hash, a.password_salt
      FROM merchants m
      JOIN merchant_auth a ON a.merchant_id = m.id
      WHERE m.phone = ?
      LIMIT 1
    `).bind(phone).first();

    if (!merchant) {
      return reply({
        error: "የስልክ ቁጥሩ ወይም ይለፍ ቃሉ ትክክል አይደለም።"
      }, 401);
    }

    const fromBase64 = value =>
      Uint8Array.from(atob(value), c => c.charCodeAt(0));

    const salt = fromBase64(merchant.password_salt);
    const storedHash = fromBase64(merchant.password_hash);

    const key = await crypto.subtle.importKey(
      "raw",
      new TextEncoder().encode(password),
      "PBKDF2",
      false,
      ["deriveBits"]
    );

    const hashBuffer = await crypto.subtle.deriveBits(
      {
        name: "PBKDF2",
        salt,
        iterations: 100000,
        hash: "SHA-256"
      },
      key,
      256
    );

    const calculatedHash = new Uint8Array(hashBuffer);

    if (
      calculatedHash.length !== storedHash.length ||
      !calculatedHash.every((value, index) =>
        value === storedHash[index]
      )
    ) {
      return reply({
        error: "የስልክ ቁጥሩ ወይም ይለፍ ቃሉ ትክክል አይደለም።"
      }, 401);
    }

    const randomToken = crypto.getRandomValues(
      new Uint8Array(32)
    );

    const token = Array.from(randomToken)
      .map(b => b.toString(16).padStart(2, "0"))
      .join("");

    const tokenHashBuffer = await crypto.subtle.digest(
      "SHA-256",
      new TextEncoder().encode(token)
    );

    const tokenHash = Array.from(
      new Uint8Array(tokenHashBuffer)
    ).map(b => b.toString(16).padStart(2, "0")).join("");

    const sessionId = crypto.randomUUID();
    const expiresAt = Math.floor(Date.now() / 1000) + 604800;

    await env.DB.prepare(`
      INSERT INTO merchant_sessions (
        id, merchant_id, token_hash, expires_at
      ) VALUES (?, ?, ?, ?)
    `).bind(
      sessionId,
      merchant.id,
      tokenHash,
      expiresAt
    ).run();

    return reply({
      success: true,
      token,
      merchant_id: merchant.id,
      expires_at: expiresAt,
      message: "ወደ ነጋዴ መለያዎ በተሳካ ሁኔታ ገብተዋል።"
    });

  } catch (error) {
    return reply({
      error: "የServer ስህተት፦ " + error.message
    }, 500);
  }
}
