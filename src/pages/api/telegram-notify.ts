import type { APIRoute } from "astro";
import { supabase } from "../../lib/supabase";

export const POST: APIRoute = async ({ request }) => {
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

        // 2. Check Stock for OOS Alert
        let stockAlerts: string[] = [];
        if (items && items.length > 0) {
            // Get all product IDs from items
            const productIds = [...new Set(items.map((i: any) => i.product_id).filter(Boolean))];

            if (productIds.length > 0) {
                const { data: products } = await supabase
                    .from('products')
                    .select('id, name, config')
                    // @ts-ignore
                    .in('id', productIds);

                if (products) {
                    items.forEach((item: any) => {
                        const product = products.find(p => p.id === item.product_id);
                        if (!product) return;

                        let currentStock = 0;
                        const config = product.config || {};

                        // @ts-ignore
                        if (config.hasVariants && item.variant_name) {
                            // @ts-ignore
                            const variant = config.variants?.find((v: any) => v.name === item.variant_name);
                            if (variant) currentStock = parseInt(variant.stock);
                        } else {
                            // @ts-ignore
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

        // 3. Format Message
        const itemsList = items.map((i: any) => `- ${i.title} (x${i.quantity})`).join('\n');

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
            message += `\n\n🚨 *STOCK ALERTS:*\n${stockAlerts.join('\n')}`;
        }

        // 4. Send to Telegram
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

    } catch (error: any) {
        console.error("Telegram Notification Error:", error);
        return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    }
};
