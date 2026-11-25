

export async function onRequestPost({ request, env }) {
  const headers = {
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "no-store"
  };

  const respond = (status, data) =>
    new Response(JSON.stringify(data), { status, headers });

  if (!env.DB) {
    return respond(500, {
      error: "Database binding DB is not configured."
    });
  }

  let input;

  try {
    input = await request.json();
  } catch {
    return respond(400, {
      error: "የተላከው መረጃ ትክክለኛ JSON አይደለም።"
    });
  }

  const businessName = String(input.business_name || "").trim();
  const ownerName = String(input.owner_name || "").trim();
  const phone = String(input.phone || "").replace(/[\s()-]/g, "");
  const email = String(input.email || "").trim().toLowerCase();
  const businessType = String(input.business_type || "").trim();
  const address = String(input.address || "").trim();

  if (businessName.length < 2 || businessName.length > 120) {
    return respond(400, { error: "የንግድ ስም ትክክል አይደለም።" });
  }

  if (ownerName.length < 2 || ownerName.length > 100) {
    return respond(400, { error: "የባለቤት ስም ትክክል አይደለም።" });
  }

  if (!/^\+?[0-9]{9,15}$/.test(phone)) {
    return respond(400, { error: "ትክክለኛ ስልክ ቁጥር አስገባ።" });
  }

  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return respond(400, { error: "ኢሜይሉ ትክክል አይደለም።" });
  }

  const id = crypto.randomUUID();

  try {
    await env.DB.prepare(`
      INSERT INTO merchants
      (id, business_name, owner_name, phone, email,
       business_type, address, verification_level, status)
      VALUES (?, ?, ?, ?, ?, ?, ?, 'basic', 'pending')
    `).bind(
      id,
      businessName,
      ownerName,
      phone,
      email || null,
      businessType || null,
      address || null
    ).run();

    return respond(201, {
      success: true,
      merchant_id: id,
      status: "pending",
      verification_level: "basic",
      message: "ምዝገባህ ተቀብሏል።"
    });

  } catch (error) {
    if (String(error.message).includes("UNIQUE constraint failed")) {
      return respond(409, {
        error: "ይህ ስልክ ቁጥር ቀድሞ ተመዝግቧል።"
      });
    }

    return respond(500, {
      error: "ምዝገባውን ማስቀመጥ አልተቻለም።"
    });
  }
}
