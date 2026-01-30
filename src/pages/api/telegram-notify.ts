import type { APIRoute } from "astro";
import { supabase } from "../../lib/supabase";

export const POST: APIRoute = async ({ request }) => {
    try {
        const body = await request.json();
        const { orderId, customerName, total, items, paymentMethod, couponCode, discountAmount } = body;

        // 1. Configuration from .env
        const TELEGRAM_BOT_TOKEN = import.meta.env.TELEGRAM_BOT_TOKEN;
        const TELEGRAM_CHAT_ID = import.meta.env.TELEGRAM_CHAT_ID;

        if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
            console.error("Missing Telegram Env Vars");
            return new Response(JSON.stringify({ error: "Server missing Telegram credentials" }), { status: 500 });
        }

        // 2. Check Stock for OOS Alert & Coupon Alerts
        let alerts: string[] = [];
        if (items && items.length > 0) {
            const productIds = [...new Set(items.map((i: any) => i.product_id).filter(Boolean))];
            if (productIds.length > 0) {
                const { data: products } = await supabase.from('products').select('id, name, config').in('id', productIds);
                if (products) {
                    items.forEach((item: any) => {
                        const product = products.find(p => p.id === item.product_id);
                        if (!product) return;
                        let currentStock = 0;
                        const config = product.config || {};
                        if (config.hasVariants && item.variant_name) {
                            const variant = config.variants?.find((v: any) => v.name === item.variant_name);
                            if (variant) currentStock = parseInt(variant.stock);
                        } else {
                            currentStock = parseInt(config.inventory?.stock);
                        }
                        if (currentStock <= 0) {
                            alerts.push(`⚠️ **SOLD OUT:** ${item.title}`);
                        } else if (currentStock < 5) {
                            alerts.push(`📉 **Low Stock (${currentStock}):** ${item.title}`);
                        }
                    });
                }
            }
        }

        // Check Coupon Alert
        if (couponCode) {
            const { data: coupon } = await supabase
                .from('coupons')
                .select('code, usage_limit, usage_count')
                .eq('code', couponCode)
                .single();

            if (coupon && coupon.usage_limit) {
                const remaining = coupon.usage_limit - coupon.usage_count;
                if (remaining <= 0) {
                    alerts.push(`🧨 **COUPON EXHAUSTED:** ${coupon.code}`);
                } else if (remaining < 5) {
                    alerts.push(`🎟️ **Coupon Low Availability (${remaining} left):** ${coupon.code}`);
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
${couponCode ? `🎟️ *Coupon:* ${couponCode} (-${discountAmount.toLocaleString()} ฿)\n` : ''}💳 *Payment:* ${paymentMethod}
-------------------------
🛍️ *Items:*
${itemsList}
-------------------------
        `.trim();

        if (alerts.length > 0) {
            message += `\n\n🚨 *SYSTEM ALERTS:*\n${alerts.join('\n')}`;
        }

        message += `\n\nChecking payment slip now...`;

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
