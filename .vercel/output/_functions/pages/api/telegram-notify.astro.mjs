import { s as supabase } from '../../chunks/supabase_BcyI2ayE.mjs';
export { renderers } from '../../renderers.mjs';

const POST = async ({ request }) => {
  try {
    const body = await request.json();
    const { orderId, customerName, total, items, paymentMethod } = body;
    const TELEGRAM_BOT_TOKEN = "8518760405:AAGvkvVhxVfLD-7aZ6d6mPEb9UxfHmEodyY";
    const TELEGRAM_CHAT_ID = "7437458172";
    if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) ;
    let stockAlerts = [];
    if (items && items.length > 0) {
      const productIds = [...new Set(items.map((i) => i.product_id).filter(Boolean))];
      if (productIds.length > 0) {
        const { data: products } = await supabase.from("products").select("id, name, config").in("id", productIds);
        if (products) {
          items.forEach((item) => {
            const product = products.find((p) => p.id === item.product_id);
            if (!product) return;
            let currentStock = 0;
            const config = product.config || {};
            if (config.hasVariants && item.variant_name) {
              const variant = config.variants?.find((v) => v.name === item.variant_name);
              if (variant) currentStock = parseInt(variant.stock);
            } else {
              currentStock = parseInt(config.inventory?.stock);
            }
            if (currentStock <= 0) {
              stockAlerts.push(`⚠️ **SOLD OUT:** ${item.title}`);
            } else if (currentStock < 5) {
              stockAlerts.push(`📉 **Low Stock (${currentStock}):** ${item.title}`);
            }
          });
        }
      }
    }
    const itemsList = items.map((i) => `- ${i.title} (x${i.quantity})`).join("\n");
    let message = `
🚨 *New Order Received!* 🚨
-------------------------
🆔 *Order:* #${orderId}
👤 *Customer:* ${customerName}
💰 *Total:* ${total.toLocaleString()} THB
💳 *Payment:* ${paymentMethod}
-------------------------
🛍️ *Items:*
${itemsList}
-------------------------
Checking payment slip now...
        `.trim();
    if (stockAlerts.length > 0) {
      message += `

🚨 *STOCK ALERTS:*
${stockAlerts.join("\n")}`;
    }
    const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;
    const payload = {
      chat_id: TELEGRAM_CHAT_ID,
      text: message,
      parse_mode: "Markdown"
    };
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    if (!response.ok) {
      throw new Error(`Telegram API Error: ${response.statusText}`);
    }
    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (error) {
    console.error("Telegram Notification Error:", error);
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
    __proto__: null,
    POST
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
