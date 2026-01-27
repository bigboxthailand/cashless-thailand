export const POST = async ({ request }) => {
    try {
        const body = await request.json();
        const { orderId, customerName, total, items, paymentMethod } = body;

        // 1. Configuration from .env
        const TELEGRAM_BOT_TOKEN = import.meta.env.TELEGRAM_BOT_TOKEN;
        const TELEGRAM_CHAT_ID = import.meta.env.TELEGRAM_CHAT_ID;

        if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
            console.error("Missing Telegram Env Vars");
            // Fail silently or return error depending on preference. 
            // Returning error to help debug initial setup.
            return new Response(JSON.stringify({ error: "Server missing Telegram credentials" }), { status: 500 });
        }

        // 2. Format Message
        const itemsList = items.map(i => `- ${i.title} (x${i.quantity})`).join('\n');

        const message = `
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

        // 3. Send to Telegram
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
