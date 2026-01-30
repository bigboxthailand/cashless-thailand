import React from 'react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    ArcElement,
} from 'chart.js';
import { Bar, Line, Doughnut } from 'react-chartjs-2';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    PointElement,
    LineElement,
    ArcElement,
    Title,
    Tooltip,
    Legend
);

const AdvancedAnalytics = ({ data }) => {
    const { topProducts, salesOverTime, genderStats, ageStats, couponStats } = data;

    // 1. Sales Over Time (Line Chart)
    const salesChartData = {
        labels: salesOverTime.map(d => d.date),
        datasets: [
            {
                label: 'Daily Sales (THB)',
                data: salesOverTime.map(d => d.total),
                borderColor: '#D4AF37',
                backgroundColor: 'rgba(212, 175, 55, 0.2)',
                tension: 0.4,
                fill: true,
            },
        ],
    };

    // 2. Top Products (Bar Chart)
    const productChartData = {
        labels: topProducts.map(p => p.title),
        datasets: [
            {
                label: 'Units Sold',
                data: topProducts.map(p => p.count),
                backgroundColor: '#D4AF37',
                borderRadius: 8,
            },
        ],
    };

    // 3. Gender/Age (Doughnut)
    const genderChartData = {
        labels: ['Male', 'Female', 'Other'],
        datasets: [
            {
                data: [genderStats.male, genderStats.female, genderStats.other],
                backgroundColor: ['#4F46E5', '#EC4899', '#9CA3AF'],
                borderWidth: 0,
            },
        ],
    };

    const chartOptions = {
        responsive: true,
        plugins: {
            legend: {
                display: false,
            },
            tooltip: {
                backgroundColor: '#1A1A1A',
                titleColor: '#D4AF37',
                bodyColor: '#FFF',
                padding: 12,
                cornerRadius: 12,
                displayColors: false,
            },
        },
        scales: {
            y: {
                grid: { color: 'rgba(255,255,255,0.05)' },
                ticks: { color: 'rgba(255,255,255,0.5)', font: { size: 10 } },
            },
            x: {
                grid: { display: false },
                ticks: { color: 'rgba(255,255,255,0.5)', font: { size: 10 } },
            },
        },
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Sales Trend */}
            <div className="lg:col-span-2 bg-white/5 border border-white/10 p-8 rounded-3xl backdrop-blur-xl">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h3 className="text-white font-black uppercase text-sm tracking-widest">Revenue Forecast</h3>
                        <p className="text-white/40 text-xs mt-1">Total revenue performance over the last 30 days</p>
                    </div>
                    <div className="text-right">
                        <span className="text-2xl font-black text-[#D4AF37]">฿{salesOverTime.reduce((a, b) => a + b.total, 0).toLocaleString()}</span>
                    </div>
                </div>
                <div className="h-64">
                    <Line data={salesChartData} options={chartOptions} />
                </div>
            </div>

            {/* Gender Distribution */}
            <div className="bg-white/5 border border-white/10 p-8 rounded-3xl backdrop-blur-xl flex flex-col items-center justify-center">
                <h3 className="text-white font-black uppercase text-sm tracking-widest mb-8 w-full">Customer Demographics</h3>
                <div className="w-40 h-40 relative">
                    <Doughnut data={genderChartData} options={{ ...chartOptions, cutout: '70%' }} />
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-2xl font-black text-white">{genderStats.male + genderStats.female + genderStats.other}</span>
                        <span className="text-[10px] text-white/40 font-bold uppercase">Total Users</span>
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-4 w-full mt-8">
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-[#4F46E5]"></div>
                        <span className="text-xs text-white/70">Male: {genderStats.male}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-[#EC4899]"></div>
                        <span className="text-xs text-white/70">Female: {genderStats.female}</span>
                    </div>
                </div>
            </div>

            {/* Top Products */}
            <div className="lg:col-span-1 bg-white/5 border border-white/10 p-8 rounded-3xl backdrop-blur-xl">
                <h3 className="text-white font-black uppercase text-sm tracking-widest mb-6">Best Sellers</h3>
                <div className="space-y-4">
                    {topProducts.slice(0, 5).map((p, i) => (
                        <div key={i} className="flex items-center gap-4 bg-black/30 p-3 rounded-2xl border border-white/5 hover:border-[#D4AF37]/30 transition-colors">
                            <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center font-black text-[#D4AF37] text-xs">
                                #{i + 1}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-white font-bold text-sm truncate">{p.title}</p>
                                <p className="text-white/30 text-[10px] uppercase font-bold tracking-tighter">{p.count} Units Sold</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Coupon performance */}
            <div className="lg:col-span-2 bg-white/5 border border-white/10 p-8 rounded-3xl backdrop-blur-xl">
                <h3 className="text-white font-black uppercase text-sm tracking-widest mb-8">Coupon Conversion</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {couponStats.map((c, i) => (
                        <div key={i} className="p-6 bg-[#D4AF37]/5 rounded-3xl border border-[#D4AF37]/10 flex flex-col justify-between">
                            <div>
                                <h4 className="text-[#D4AF37] font-black text-lg">{c.code}</h4>
                                <p className="text-white/40 text-xs font-bold uppercase">{c.usage_count} Redemptions</p>
                            </div>
                            <div className="mt-4 pt-4 border-t border-white/5 w-full">
                                <p className="text-white text-xs font-bold">฿{c.saved.toLocaleString()} <span className="text-white/30 font-normal">Discounted</span></p>
                            </div>
                        </div>
                    ))}
                    {couponStats.length === 0 && <p className="text-white/20 text-xs italic">No coupons applied yet.</p>}
                </div>
            </div>
        </div>
    );
};

export default AdvancedAnalytics;
