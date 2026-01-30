import React, { useRef } from 'react';
import { Download, Printer, Share2, FileCheck } from 'lucide-react';

const InvoiceGenerator = ({ order, settings }) => {
    const invoiceRef = useRef();

    if (!order) return null;

    const vatRate = settings.vat_rate || settings.tax_rate || 7;
    const isVatEnabled = settings.vat_enabled;
    const subtotal = isVatEnabled ? order.total_price / (1 + (vatRate / 100)) : order.total_price;
    const taxAmount = order.total_price - subtotal;
    const currency = settings.currency || 'THB';

    const thbFormatter = new Intl.NumberFormat('th-TH', {
        style: 'currency',
        currency: currency,
    });

    const handlePrint = () => {
        window.print();
    };

    return (
        <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
            {/* INVOICE HEADER / CONTROLS */}
            <div className="p-6 border-b border-white/10 flex justify-between items-center bg-white/[0.02]">
                <div>
                    <h3 className="text-xl font-bold text-white flex items-center gap-2">
                        <FileCheck className="text-[#D4AF37]" />
                        {isVatEnabled ? 'Professional Invoice' : 'Receipt / ใบเสร็จรับเงิน'}
                    </h3>
                    <p className="text-white/40 text-xs">Generated for Order #{order.id}</p>
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={handlePrint}
                        className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-all text-xs font-bold"
                    >
                        <Printer size={14} />
                        Print / PDF
                    </button>
                </div>
            </div>

            {/* A4 INVOICE TEMPLATE (WHITE BACKGROUND FOR PRINTING) */}
            <div className="p-8 bg-white text-slate-800 font-sans" id="invoice-canvas" ref={invoiceRef}>
                <div className="flex justify-between items-start mb-12">
                    <div>
                        {settings.store_logo_url ? (
                            <img src={settings.store_logo_url} alt="Logo" className="h-12 mb-4" />
                        ) : (
                            <h2 className="text-2xl font-black text-[#D4AF37] mb-2">{settings.store_name}</h2>
                        )}
                        <div className="text-xs text-slate-500 space-y-1">
                            <p>{settings.store_address || '1509 Min Mani 1 Alley, Soi Phetkasem 4, Wat Tha Phra, Bangkok Yai, Bangkok 10700'}</p>
                            {isVatEnabled && <p>Tax ID: {settings.store_tax_id || ''}</p>}
                            <p>Tel: {settings.store_phone || '090-987-9566'}</p>
                        </div>
                    </div>
                    <div className="text-right">
                        <h1 className="text-3xl font-black text-slate-900 uppercase tracking-tighter mb-2">
                            {isVatEnabled
                                ? (order.payment_status === 'paid' ? 'Receipt' : 'Tax Invoice')
                                : 'Receipt'
                            }
                        </h1>
                        <div className="text-xs text-slate-500 space-y-1">
                            <p className="font-bold text-slate-900">Document No: {order.receipt_no || order.invoice_no || 'DRAFT'}</p>
                            <p>Date: {new Date(order.created_at).toLocaleDateString('th-TH')}</p>
                            <p>Reference: {order.id.startsWith('ORD-') ? order.id.slice(0, 12) : `ORD-${order.id.slice(0, 8)}`}</p>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-12 mb-12 pb-12 border-b-2 border-slate-100">
                    <div>
                        <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Bill To:</h4>
                        <div className="text-sm font-bold text-slate-900 mb-1">{order.customer_name}</div>
                        <div className="text-xs text-slate-500 leading-relaxed">
                            {order.billing_address || order.province || 'No Address Provided'}
                            <br />
                            Email: {order.customer_email}
                            <br />
                            Phone: {order.customer_phone}
                            {isVatEnabled && order.tax_id && (
                                <p className="mt-2 font-bold text-slate-800">Tax ID: {order.tax_id}</p>
                            )}
                        </div>
                    </div>
                    <div>
                        <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Payment Info:</h4>
                        <div className="text-xs text-slate-500 space-y-1">
                            <p>Method: <span className="font-bold text-slate-800 uppercase">{order.payment_method}</span></p>
                            <p>Status: <span className={`font-bold ${order.payment_status === 'paid' ? 'text-green-600' : 'text-orange-500'}`}>{order.payment_status?.toUpperCase()}</span></p>
                        </div>
                    </div>
                </div>

                <table className="w-full mb-12">
                    <thead>
                        <tr className="border-b-2 border-slate-900">
                            <th className="py-4 text-left text-[10px] font-black uppercase text-slate-400">Description</th>
                            <th className="py-4 text-center text-[10px] font-black uppercase text-slate-400">Quantity</th>
                            <th className="py-4 text-right text-[10px] font-black uppercase text-slate-400">Unit Price</th>
                            <th className="py-4 text-right text-[10px] font-black uppercase text-slate-400">Total</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {order.order_items?.map((item) => (
                            <tr key={item.id}>
                                <td className="py-4">
                                    <div className="text-sm font-bold text-slate-900">{item.title}</div>
                                    <div className="text-[10px] text-slate-400">{item.variant_name || 'Standard Version'}</div>
                                </td>
                                <td className="py-4 text-center text-sm font-medium">{item.quantity}</td>
                                <td className="py-4 text-right text-sm">{thbFormatter.format(item.price)}</td>
                                <td className="py-4 text-right text-sm font-bold">{thbFormatter.format(item.price * item.quantity)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                <div className="flex justify-end">
                    <div className="w-64 space-y-3">
                        {isVatEnabled && (
                            <>
                                <div className="flex justify-between text-xs text-slate-500">
                                    <span>Subtotal (Excl. VAT)</span>
                                    <span>{thbFormatter.format(subtotal)}</span>
                                </div>
                                <div className="flex justify-between text-xs text-slate-500">
                                    <span>VAT ({vatRate}%)</span>
                                    <span>{thbFormatter.format(taxAmount)}</span>
                                </div>
                            </>
                        )}
                        <div className="flex justify-between pt-3 border-t-2 border-slate-900">
                            <span className="text-sm font-black uppercase">Grand Total</span>
                            <span className="text-lg font-black text-[#D4AF37]">{thbFormatter.format(order.total_price)}</span>
                        </div>
                    </div>
                </div>

                <div className="mt-20 pt-12 border-t border-slate-100 text-[10px] text-center text-slate-400 leading-relaxed">
                    <p className="mb-2 font-bold text-slate-500 uppercase tracking-widest">Thank you for your business!</p>
                    <p>This is a computer-generated document and requires no signature.</p>
                    <p>{settings.store_name} | {settings.store_email || 'mycryptoclock@gmail.com'}</p>
                </div>
            </div>

            <style dangerouslySetInnerHTML={{
                __html: `
                @media print {
                    body * { visibility: hidden; }
                    #invoice-canvas, #invoice-canvas * { visibility: visible; }
                    #invoice-canvas {
                        position: absolute;
                        left: 0;
                        top: 0;
                        width: 100%;
                        padding: 0 !important;
                    }
                }
            ` }} />
        </div>
    );
};

export default InvoiceGenerator;
