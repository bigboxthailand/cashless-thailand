import React, { useState, useEffect } from 'react';
import { estimateShipping, formatLocation } from '../../lib/shippingEstimation.js';

/**
 * Shipping Estimation Display Component
 * Shows estimated delivery time based on seller and customer locations
 */
const ShippingEstimation = ({ cart, customerProvince, customerDistrict }) => {
    const [estimates, setEstimates] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!cart || cart.length === 0) {
            setEstimates([]);
            setLoading(false);
            return;
        }

        // Calculate estimates for each unique seller
        const sellerEstimates = {};

        cart.forEach(item => {
            const sellerId = item.shop_id;
            if (!sellerEstimates[sellerId]) {
                const estimate = estimateShipping(
                    item.seller_district,
                    item.seller_province,
                    customerDistrict,
                    customerProvince
                );

                sellerEstimates[sellerId] = {
                    shopName: item.shop_name || 'ร้านค้า',
                    sellerLocation: formatLocation(item.seller_district, item.seller_province),
                    ...estimate,
                    items: []
                };
            }
            sellerEstimates[sellerId].items.push(item);
        });

        setEstimates(Object.values(sellerEstimates));
        setLoading(false);
    }, [cart, customerProvince, customerDistrict]);

    // Don't show if no customer location yet
    if (!customerProvince) {
        return null;
    }

    if (loading) {
        return (
            <div className="bg-[#111] border border-white/10 rounded-2xl p-6">
                <div className="animate-pulse">
                    <div className="h-4 bg-white/10 rounded w-1/3 mb-4"></div>
                    <div className="h-3 bg-white/5 rounded w-2/3"></div>
                </div>
            </div>
        );
    }

    if (estimates.length === 0) {
        return null;
    }

    return (
        <div className="bg-[#111] border border-white/10 rounded-2xl p-6 space-y-4">
            <h3 className="text-lg font-bold text-white uppercase flex items-center gap-2">
                <svg className="w-5 h-5 text-[#D4AF37]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
                </svg>
                ประมาณการจัดส่ง
            </h3>

            {estimates.map((estimate, index) => (
                <div key={index} className="bg-black/30 rounded-xl p-4 space-y-3">
                    {/* Shop Info */}
                    <div className="flex items-start justify-between">
                        <div>
                            <p className="text-white font-bold text-sm">{estimate.shopName}</p>
                            <p className="text-white/40 text-xs mt-1">
                                📍 ส่งจาก: {estimate.sellerLocation}
                            </p>
                        </div>
                        <div className="text-right">
                            <div className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold ${estimate.maxDays <= 2 ? 'bg-green-500/20 text-green-400' :
                                    estimate.maxDays <= 4 ? 'bg-blue-500/20 text-blue-400' :
                                        'bg-orange-500/20 text-orange-400'
                                }`}>
                                🚚 {estimate.minDays}-{estimate.maxDays} วัน
                            </div>
                        </div>
                    </div>

                    {/* Delivery Estimate */}
                    <div className="border-t border-white/5 pt-3">
                        <p className="text-white/60 text-xs">{estimate.description}</p>
                        <p className="text-white/40 text-[10px] mt-1">
                            ส่งถึง: {formatLocation(customerDistrict, customerProvince)}
                        </p>
                    </div>

                    {/* Items from this seller */}
                    <div className="border-t border-white/5 pt-2">
                        <p className="text-white/30 text-[10px] uppercase mb-2">สินค้าในพัสดุนี้:</p>
                        <div className="space-y-1">
                            {estimate.items.map((item, idx) => (
                                <div key={idx} className="flex items-center gap-2 text-xs text-white/50">
                                    <span className="w-1 h-1 bg-[#D4AF37] rounded-full"></span>
                                    <span>{item.title} (x{item.quantity})</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            ))}

            {/* Info Note */}
            <div className="bg-[#D4AF37]/5 border border-[#D4AF37]/20 rounded-lg p-3">
                <p className="text-[#D4AF37] text-[10px] font-bold uppercase mb-1">
                    📦 หมายเหตุ
                </p>
                <p className="text-white/60 text-[10px]">
                    • ระยะเวลาเป็นเพียงประมาณการ อาจแตกต่างตามสภาพจริง<br />
                    • นับเฉพาะวันทำการ (จันทร์-ศุกร์)<br />
                    • หากสั่งซื้อจากหลายร้าน จะจัดส่งแยกพัสดุ
                </p>
            </div>
        </div>
    );
};

export default ShippingEstimation;
