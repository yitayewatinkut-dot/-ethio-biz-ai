export async function onRequestGet({ request, env }) {
  const headers = {
    "Content-Type": "application/json; charset=utf-8"
  };

  const reply = (data, status = 200) =>
    new Response(JSON.stringify(data), { status, headers });

  try {
    if (!env.DB) {
      return reply({ error: "D1 Database binding DB is missing." }, 500);
    }

    const url = new URL(request.url);
    const id = String(url.searchParams.get("id") || "").trim();

    if (!id) {
      return reply({ error: "የነጋዴ ID አልተሰጠም።" }, 400);
    }

    const merchant = await env.DB.prepare(`
      SELECT id, business_name, business_type, status, verification_level
      FROM merchants
      WHERE id = ?
      LIMIT 1
    `).bind(id).first();

    if (!merchant) {
      return reply({ error: "ይህ የነጋዴ መለያ አልተገኘም።" }, 404);
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
