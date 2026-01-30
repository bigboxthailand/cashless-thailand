
import React, { useState, useMemo } from 'react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend,
    Filler,
} from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';
import { motion } from 'framer-motion';

// Register ChartJS functionality
ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend,
    Filler
);

// Chart Options (Dark Theme)
const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        legend: {
            display: false,
        },
        tooltip: {
            backgroundColor: '#111',
            titleColor: '#fff',
            bodyColor: '#D4AF37',
            borderColor: '#333',
            borderWidth: 1,
            padding: 10,
        },
    },
    scales: {
        x: {
            grid: {
                color: '#333',
                display: false,
            },
            ticks: {
                color: '#666',
            },
        },
        y: {
            grid: {
                color: '#222',
                borderDash: [5, 5],
            },
            ticks: {
                color: '#666',
                callback: (value) => value.toLocaleString(),
            },
        },
    },
    interaction: {
        mode: 'index',
        intersect: false,
    },
    elements: {
        line: {
            tension: 0.4, // Smooth curves
        },
        bar: {
            borderRadius: 4,
        }
    },
};

export default function DashboardCharts({ orders = [], shops = [] }) {
    const [chartType, setChartType] = useState('line');
    const [timeView, setTimeView] = useState('day'); // 'day', 'month', 'year'

    // Filters
    const [filterSex, setFilterSex] = useState('all');
    const [filterAge, setFilterAge] = useState('all');
    const [filterRegion, setFilterRegion] = useState('all');
    const [filterDuration, setFilterDuration] = useState('all');
    const [filterShop, setFilterShop] = useState('all');
    const [filterMonth, setFilterMonth] = useState('all'); // 'all' or 0-11
    const [filterYear, setFilterYear] = useState(new Date().getFullYear().toString()); // Default to current year

    // Process Data
    const chartData = useMemo(() => {
        // Region Mapper
        const getRegion = (prov) => {
            const map = {
                'Bangkok': 'Bangkok',
                'Chiang Mai': 'North', 'Chiang Rai': 'North', 'Nan': 'North',
                'Khon Kaen': 'Isan', 'Nakhon Ratchasima': 'Isan', 'Udon Thani': 'Isan',
                'Phuket': 'South', 'Songkhla': 'South', 'Krabi': 'South',
                'Chon Buri': 'East', 'Rayong': 'East',
                'Kanchanaburi': 'West', 'Ratchaburi': 'West',
                'Ayutthaya': 'Central', 'Saraburi': 'Central'
            };
            return map[prov] || 'Other';
        };

        // 1. Filter Data
        let filtered = orders.filter(o => {
            // Sex Filter (ต้องตรงกับ "Male" หรือ "Female" ตัวพิมพ์ใหญ่-เล็ก)
            if (filterSex !== 'all' && o.sex !== filterSex) return false;

            // Age Filter (ช่วงอายุที่ชัดเจน)
            const age = o.age || 0;
            if (filterAge === '<25' && age >= 25) return false;          // แสดงเฉพาะ age < 25
            if (filterAge === '25-40' && (age < 25 || age > 40)) return false; // แสดง 25 ≤ age ≤ 40
            if (filterAge === '>40' && age <= 40) return false;          // แสดงเฉพาะ age > 40

            // Region Filter (แมพจังหวัดเป็นภูมิภาค)
            if (filterRegion !== 'all' && getRegion(o.province) !== filterRegion) return false;

            // Duration Filter (เวลาตัดสินใจซื้อ เป็นวินาที)
            const dur = o.buy_duration || 0;
            if (filterDuration === 'fast' && dur > 60) return false;     // แสดงเฉพาะ <= 60 วินาที (< 1 นาที)
            if (filterDuration === 'normal' && (dur <= 60 || dur > 300)) return false; // แสดง 60 < dur ≤ 300 (1-5 นาที)
            if (filterDuration === 'long' && dur <= 300) return false;   // แสดงเฉพาะ > 300 วินาที (> 5 นาที)

            // Shop Filter
            if (filterShop !== 'all' && o.shop_id !== filterShop) return false;

            // Date Filters
            const orderDate = new Date(o.created_at);
            if (filterYear !== 'all' && orderDate.getFullYear().toString() !== filterYear) return false;
            if (filterMonth !== 'all' && orderDate.getMonth().toString() !== filterMonth) return false;

            // NEW: Only include PAID orders in revenue analytics
            if (o.payment_status !== 'paid') return false;

            return true;
        });

        // 2. Sort
        filtered.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));

        // 3. Group by Time View
        const grouped = filtered.reduce((acc, order) => {
            const d = new Date(order.created_at);
            let key;
            if (timeView === 'day') key = d.toLocaleDateString('th-TH', { day: '2-digit', month: 'short' });
            else if (timeView === 'month') key = d.toLocaleDateString('th-TH', { month: 'long', year: 'numeric' });
            else key = d.getFullYear().toString();

            acc[key] = (acc[key] || 0) + Number(order.total_price);
            return acc;
        }, {});

        const labels = Object.keys(grouped);
        const dataPoints = Object.values(grouped);

        return {
            labels,
            datasets: [
                {
                    label: `Revenue (${timeView})`,
                    data: dataPoints,
                    borderColor: '#D4AF37',
                    backgroundColor: chartType === 'area' ? 'rgba(212, 175, 55, 0.2)' : '#D4AF37',
                    fill: chartType === 'area',
                    borderWidth: 2,
                    pointBackgroundColor: '#000',
                    pointBorderColor: '#D4AF37',
                    pointRadius: 4
                },
            ],
            summary: {
                totalRevenue: filtered.reduce((sum, o) => sum + (Number(o.total_price) || 0), 0),
                totalOrders: filtered.length
            }
        };
    }, [orders, chartType, timeView, filterSex, filterAge, filterRegion, filterDuration, filterShop, filterMonth, filterYear]);

    return (
        <div className="bg-[#0A0A0A] border border-white/10 p-6 rounded-xl relative overflow-hidden space-y-6">

            {/* 1. CONTROLS HEADER */}
            <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-4">
                <div>
                    <h3 className="text-white font-bold uppercase tracking-wider text-sm flex items-center gap-2">
                        <span className="w-2 h-2 bg-[#D4AF37] rounded-full animate-pulse"></span>
                        Advanced Analytics
                    </h3>
                    <p className="text-white/30 text-xs mt-1">Filtered Revenue Performance</p>
                </div>

                {/* Filters Panel */}
                <div className="flex flex-wrap gap-2 bg-white/5 p-2 rounded-lg border border-white/5 w-full xl:w-auto items-center">
                    {/* Time View */}
                    <div className="flex bg-black/40 rounded p-1">
                        {['day', 'month', 'year'].map(v => (
                            <button key={v} onClick={() => setTimeView(v)} className={`px-2 py-1 text-[10px] font-bold uppercase rounded ${timeView === v ? 'bg-[#D4AF37] text-black' : 'text-white/50 hover:text-white'}`}>
                                {v}
                            </button>
                        ))}
                    </div>

                    <div className="w-px h-6 bg-white/10 mx-1 hidden sm:block"></div>

                    {/* Sex Filter */}
                    <select value={filterSex} onChange={e => setFilterSex(e.target.value)} className="bg-black/40 text-white text-[10px] px-2 py-1.5 rounded border border-white/10 outline-none hover:border-[#D4AF37]">
                        <option value="all">Sex: All</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                    </select>

                    {/* Age Filter */}
                    <select value={filterAge} onChange={e => setFilterAge(e.target.value)} className="bg-black/40 text-white text-[10px] px-2 py-1.5 rounded border border-white/10 outline-none hover:border-[#D4AF37]">
                        <option value="all">Age: All</option>
                        <option value="<25">{'<'} 25</option>
                        <option value="25-40">25-40</option>
                        <option value=">40">{'>'} 40</option>
                    </select>

                    {/* Region Filter */}
                    <select value={filterRegion} onChange={e => setFilterRegion(e.target.value)} className="bg-black/40 text-white text-[10px] px-2 py-1.5 rounded border border-white/10 outline-none hover:border-[#D4AF37]">
                        <option value="all">Region: All</option>
                        <option value="Bangkok">Bangkok</option>
                        <option value="North">North</option>
                        <option value="South">South</option>
                        <option value="Isan">Isan</option>
                        <option value="East">East</option>
                        <option value="West">West</option>
                        <option value="Central">Central</option>
                    </select>

                    {/* Duration Filter */}
                    <select value={filterDuration} onChange={e => setFilterDuration(e.target.value)} className="bg-black/40 text-white text-[10px] px-2 py-1.5 rounded border border-white/10 outline-none hover:border-[#D4AF37]">
                        <option value="all">Time: All</option>
                        <option value="fast">Fast ({'<'}1m)</option>
                        <option value="normal">Normal (1-5m)</option>
                        <option value="long">Long ({'>'}5m)</option>
                    </select>

                    {/* Shop Filter */}
                    <select value={filterShop} onChange={e => setFilterShop(e.target.value)} className="bg-[#D4AF37]/10 text-[#D4AF37] font-bold text-[10px] px-2 py-1.5 rounded border border-[#D4AF37]/20 outline-none hover:border-[#D4AF37] cursor-pointer">
                        <option value="all">All Shops</option>
                        {shops.map(shop => (
                            <option key={shop.id} value={shop.id}>{shop.name}</option>
                        ))}
                    </select>

                    <div className="w-px h-6 bg-white/10 mx-1 hidden sm:block"></div>

                    {/* Month/Year Filter */}
                    <div className="flex gap-1 items-center">
                        <select
                            value={filterMonth}
                            onChange={e => setFilterMonth(e.target.value)}
                            className="bg-black/40 text-white text-[10px] px-2 py-1.5 rounded border border-white/10 outline-none hover:border-[#D4AF37]"
                        >
                            <option value="all">All Months</option>
                            {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].map((m, i) => (
                                <option key={m} value={i}>{m}</option>
                            ))}
                        </select>
                        <select
                            value={filterYear}
                            onChange={e => setFilterYear(e.target.value)}
                            className="bg-black/40 text-white text-[10px] px-2 py-1.5 rounded border border-white/10 outline-none hover:border-[#D4AF37]"
                        >
                            <option value="all">All Years</option>
                            {Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - 2 + i).map(y => (
                                <option key={y} value={y.toString()}>{y}</option>
                            ))}
                        </select>
                        <button
                            onClick={() => {
                                setFilterMonth(new Date().getMonth().toString());
                                setFilterYear(new Date().getFullYear().toString());
                                setTimeView('day');
                            }}
                            className="bg-[#D4AF37]/20 text-[#D4AF37] text-[9px] font-black uppercase px-2 py-1.5 rounded hover:bg-[#D4AF37] hover:text-black transition-colors"
                        >
                            Current Month
                        </button>
                    </div>

                    <div className="w-px h-6 bg-white/10 mx-1 hidden sm:block"></div>

                    {/* Chart Style */}
                    <div className="flex gap-1">
                        {['line', 'bar', 'area'].map(type => (
                            <button key={type} onClick={() => setChartType(type)} className={`w-6 h-6 flex items-center justify-center rounded text-[10px] uppercase font-bold ${chartType === type ? 'bg-white text-black' : 'bg-white/10 text-white hover:bg-white/20'}`}>
                                {type[0]}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* SEGMENTED SUMMARY STATS */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 bg-white/[0.02] border border-white/5 rounded-xl">
                <div>
                    <p className="text-[10px] text-white/30 uppercase font-black tracking-widest mb-1 flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
                        Verified Revenue
                    </p>
                    <p className="text-xl font-black text-[#D4AF37]">฿{chartData.summary.totalRevenue.toLocaleString()}</p>
                </div>
                <div>
                    <p className="text-[10px] text-white/30 uppercase font-black tracking-widest mb-1">Paid Orders</p>
                    <p className="text-xl font-black text-white">{chartData.summary.totalOrders.toLocaleString()}</p>
                </div>
                <div className="hidden sm:block">
                    <p className="text-[10px] text-white/30 uppercase font-black tracking-widest mb-1">Time Range</p>
                    <p className="text-xl font-black text-white/80 uppercase">{timeView}</p>
                </div>
                <div className="hidden sm:block">
                    <p className="text-[10px] text-white/30 uppercase font-black tracking-widest mb-1">Shop Scope</p>
                    <p className="text-xl font-black text-[#D4AF37]/80 truncate">
                        {filterShop === 'all' ? 'All Vendors' : shops.find(s => s.id === filterShop)?.name || 'Filtered'}
                    </p>
                </div>
            </div>

            {/* 2. CHART CANVAS */}
            <motion.div
                key={chartType + timeView}
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                className="h-[350px] w-full bg-gradient-to-b from-white/2 to-transparent rounded-lg border border-white/5 p-2"
            >
                {chartType === 'bar' ? <Bar options={options} data={chartData} /> : <Line options={options} data={chartData} />}
            </motion.div>
        </div>
    );
}
