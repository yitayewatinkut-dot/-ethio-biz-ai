
export async function onRequestPost({ request, env }) {
  const headers = {
    "Content-Type": "application/json; charset=utf-8"
  };

  const reply = (data, status = 200) =>
    new Response(JSON.stringify(data), { status, headers });

  try {
    if (!env.DB) {
      return reply({ error: "D1 Database binding DB is missing." }, 500);
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

    const id = crypto.randomUUID();

    await env.DB.prepare(`
      INSERT INTO merchants (
        id,
        business_name,
        owner_name,
        phone,
        email,
        business_type,
        address,
        verification_level,
        status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).bind(
      id,
      business_name,
      owner_name,
      phone,
      email || null,
      business_type || null,
      address || null,
      "basic",
      "pending"
    ).run();

    return reply({
      success: true,
      merchant_id: id,
      message: "የነጋዴ ምዝገባው ተሳክቷል።",
      status: "pending",
      verification_level: "basic"
    }, 201);

  } catch (error) {
    if (error.message && error.message.includes("UNIQUE")) {
      return reply({
        error: "ይህ ስልክ ቁጥር አስቀድሞ ተመዝግቧል።"
      }, 409);
    }

    return reply({
      error: "የServer ስህተት፦ " + error.message
    }, 500);
  }
}
