
import type { APIRoute } from 'astro';
import { supabaseAdmin } from '../../lib/supabase';
import { sendEmail } from '../../lib/email';

export const POST: APIRoute = async ({ request }) => {
    try {
        const { orderId } = await request.json();

        if (!orderId) {
            return new Response(JSON.stringify({ error: 'Order ID is required' }), { status: 400 });
        }

        // 1. Fetch Order Data
        const { data: order, error: orderError } = await supabaseAdmin
            .from('orders')
            .select('*, order_items(*)')
            .eq('id', orderId)
            .single();

        if (orderError || !order) {
            return new Response(JSON.stringify({ error: 'Order not found' }), { status: 404 });
        }

        // 2. Fetch Store Settings
        const { data: settings } = await supabaseAdmin
            .from('store_settings')
            .select('*')
            .eq('id', 1)
            .single();

        // 3. Generate HTML Template
        const itemsHtml = order.order_items.map((item: any) => `
            <tr>
                <td style="padding: 12px 0; border-bottom: 1px solid #eee;">${item.title}</td>
                <td style="padding: 12px 0; border-bottom: 1px solid #eee; text-align: center;">${item.quantity}</td>
                <td style="padding: 12px 0; border-bottom: 1px solid #eee; text-align: right;">${item.price.toLocaleString()} ฿</td>
            </tr>
        `).join('');

        const isVatEnabled = settings?.vat_enabled || false;
        const vatRatePercent = Number(settings?.vat_rate) || 7;
        const vat = isVatEnabled ? (order.total_price - (order.total_price / (1 + vatRatePercent / 100))) : 0;
        const subtotal = order.total_price - vat;

        const emailHtml = `
            <div style="font-family: 'Inter', sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
                <div style="padding: 40px 0; text-align: center;">
                    <h1 style="margin: 0; color: #D4AF37;">CASHLESS THAILAND</h1>
                    <p style="color: #666; font-size: 14px; margin-top: 5px;">Your ${isVatEnabled ? 'digital invoice' : 'receipt'} is ready</p>
                </div>

                <div style="background: #f9f9f9; padding: 30px; border-radius: 20px;">
                    <div style="display: flex; justify-content: space-between; margin-bottom: 30px;">
                        <div>
                            <h2 style="margin: 0; font-size: 18px;">${isVatEnabled ? 'Invoice' : 'Receipt'} #${order.invoice_no || order.receipt_no || order.id}</h2>
                            <p style="color: #666; font-size: 14px;">Date: ${new Date(order.created_at).toLocaleDateString()}</p>
                        </div>
                    </div>

                    <table style="width: 100%; border-collapse: collapse;">
                        <thead>
                            <tr style="text-align: left; font-size: 12px; color: #666; text-transform: uppercase;">
                                <th style="padding-bottom: 10px; border-bottom: 2px solid #eee;">Item</th>
                                <th style="padding-bottom: 10px; border-bottom: 2px solid #eee; text-align: center;">Qty</th>
                                <th style="padding-bottom: 10px; border-bottom: 2px solid #eee; text-align: right;">Price</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${itemsHtml}
                        </tbody>
                    </table>

                    <div style="margin-top: 30px; border-top: 2px solid #eee; padding-top: 20px;">
                        ${isVatEnabled ? `
                        <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                            <span>Subtotal</span>
                            <span>${subtotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ฿</span>
                        </div>
                        <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                            <span>VAT (${vatRatePercent}%)</span>
                            <span>${vat.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ฿</span>
                        </div>
                        ` : ''}
                        <div style="display: flex; justify-content: space-between; font-weight: bold; font-size: 20px; color: #D4AF37; margin-top: 10px;">
                            <span>Total</span>
                            <span>${order.total_price.toLocaleString()} ฿</span>
                        </div>
                    </div>
                </div>

                <div style="padding: 40px 0; text-align: center;">
                    <a href="${request.url.replace('/api/send-invoice', `/invoice/${order.id}`)}" style="background: #D4AF37; color: black; padding: 15px 30px; text-decoration: none; border-radius: 12px; font-weight: bold; display: inline-block;">View Full ${isVatEnabled ? 'Invoice' : 'Receipt'}</a>
                    <p style="color: #999; font-size: 12px; margin-top: 30px;">
                        ${settings?.store_address || ''}<br/>
                        ${settings?.store_phone || ''} | ${settings?.store_email || ''}
                    </p>
                </div>
            </div>
        `;

        // 4. Send Email
        const result = await sendEmail({
            to: order.customer_email || 'guest@example.com',
            subject: `Invoice #${order.invoice_no || order.id} from Cashless Thailand`,
            html: emailHtml
        });

        if (result.error) {
            return new Response(JSON.stringify({ error: result.error }), { status: 500 });
        }

        return new Response(JSON.stringify({ success: true, message: 'Invoice sent successfully' }), { status: 200 });

    } catch (error: any) {
        console.error('Invoice API Error:', error);
        return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    }
};
