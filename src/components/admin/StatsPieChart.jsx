import React, { useState, useMemo } from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';
import { motion, AnimatePresence } from 'framer-motion';

ChartJS.register(ArcElement, Tooltip, Legend);

const StatsPieChart = ({ orders }) => {
    const [viewMode, setViewMode] = useState('payment'); // payment, status, province, products, gender, age, duration

    // Calculate data based on view mode
    const chartData = useMemo(() => {
        if (!orders || orders.length === 0) {
            return null;
        }

        let labels = [];
        let data = [];
        let colors = [];
        let gradients = [];

        switch (viewMode) {
            case 'payment':
                // Payment Methods
                const paymentCounts = orders.reduce((acc, order) => {
                    const method = order.payment_method || 'Unknown';
                    acc[method] = (acc[method] || 0) + 1;
                    return acc;
                }, {});
                labels = Object.keys(paymentCounts);
                data = Object.values(paymentCounts);
                colors = ['#D4AF37', '#3B82F6', '#10B981', '#F59E0B', '#8B5CF6'];
                break;

            case 'status':
                // Order Status
                const statusCounts = orders.reduce((acc, order) => {
                    const status = order.payment_status || 'Unknown';
                    acc[status] = (acc[status] || 0) + 1;
                    return acc;
                }, {});
                labels = Object.keys(statusCounts);
                data = Object.values(statusCounts);
                colors = ['#EAB308', '#10B981', '#3B82F6', '#EF4444'];
                break;

            case 'province':
                // Top 5 Provinces
                const provinceCounts = orders.reduce((acc, order) => {
                    const province = order.province || 'Unknown';
                    acc[province] = (acc[province] || 0) + 1;
                    return acc;
                }, {});
                const sortedProvinces = Object.entries(provinceCounts)
                    .sort(([, a], [, b]) => b - a)
                    .slice(0, 5);
                labels = sortedProvinces.map(([province]) => province);
                data = sortedProvinces.map(([, count]) => count);
                colors = ['#D4AF37', '#3B82F6', '#10B981', '#F59E0B', '#EF4444'];
                break;

            case 'gender':
                // Gender Distribution (ผู้ชาย vs ผู้หญิง)
                const genderCounts = orders.reduce((acc, order) => {
                    const gender = order.sex || 'Unknown';
                    acc[gender] = (acc[gender] || 0) + 1;
                    return acc;
                }, {});
                labels = Object.keys(genderCounts);
                data = Object.values(genderCounts);
                colors = ['#3B82F6', '#EC4899', '#6B7280']; // Blue, Pink, Gray
                break;

            case 'age':
                // Age Groups
                const ageCounts = { '<25': 0, '25-40': 0, '>40': 0 };
                orders.forEach(order => {
                    const age = order.age;
                    if (age < 25) ageCounts['<25']++;
                    else if (age >= 25 && age <= 40) ageCounts['25-40']++;
                    else if (age > 40) ageCounts['>40']++;
                });
                labels = Object.keys(ageCounts);
                data = Object.values(ageCounts);
                colors = ['#10B981', '#3B82F6', '#F59E0B'];
                break;

            case 'duration':
                // Buy Duration (ความเร็วในการตัดสินใจ)
                const durationCounts = orders.reduce((acc, order) => {
                    const duration = order.buy_duration || 'Unknown';
                    acc[duration] = (acc[duration] || 0) + 1;
                    return acc;
                }, {});
                labels = Object.keys(durationCounts);
                data = Object.values(durationCounts);
                colors = ['#10B981', '#3B82F6', '#F59E0B', '#EF4444'];
                break;

            case 'products':
                // Top 5 Products (placeholder - enhance later with real data)
                const productPlaceholder = {
                    'BitNode Personal': Math.floor(orders.length * 0.3),
                    'CryptoClock Pro': Math.floor(orders.length * 0.25),
                    'Ledger Nano X': Math.floor(orders.length * 0.2),
                    'Trezor Model T': Math.floor(orders.length * 0.15),
                    'Others': Math.floor(orders.length * 0.1),
                };
                labels = Object.keys(productPlaceholder);
                data = Object.values(productPlaceholder);
                colors = ['#D4AF37', '#3B82F6', '#10B981', '#F59E0B', '#6B7280'];
                break;

            default:
                return null;
        }

        return {
            labels,
            datasets: [
                {
                    data,
                    backgroundColor: colors,
                    borderColor: '#0A0A0A',
                    borderWidth: 3,
                    hoverBorderColor: '#D4AF37',
                    hoverBorderWidth: 4,
                    hoverOffset: 15, // 3D pop-out effect
                },
            ],
        };
    }, [orders, viewMode]);

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        animation: {
            animateRotate: true,
            animateScale: true,
            duration: 800,
            easing: 'easeOutQuart',
        },
        plugins: {
            legend: {
                position: 'bottom',
                labels: {
                    color: '#fff',
                    font: {
                        size: 11,
                        weight: 'bold',
                        family: "'Inter', sans-serif",
                    },
                    padding: 15,
                    usePointStyle: true,
                    pointStyle: 'circle',
                },
            },
            tooltip: {
                backgroundColor: 'rgba(0, 0, 0, 0.95)',
                titleColor: '#D4AF37',
                titleFont: {
                    size: 14,
                    weight: 'bold',
                },
                bodyColor: '#fff',
                bodyFont: {
                    size: 12,
                },
                borderColor: '#D4AF37',
                borderWidth: 2,
                padding: 16,
                displayColors: true,
                boxPadding: 6,
                callbacks: {
                    label: function (context) {
                        const label = context.label || '';
                        const value = context.parsed || 0;
                        const total = context.dataset.data.reduce((a, b) => a + b, 0);
                        const percentage = ((value / total) * 100).toFixed(1);
                        return ` ${label}: ${value} orders (${percentage}%)`;
                    },
                },
            },
        },
        interaction: {
            mode: 'index',
            intersect: false,
        },
    };

    const viewModes = [
        { id: 'payment', label: 'Payment', icon: '💳', color: 'from-yellow-500 to-yellow-600' },
        { id: 'status', label: 'Status', icon: '📦', color: 'from-green-500 to-emerald-600' },
        { id: 'gender', label: 'Gender', icon: '👥', color: 'from-blue-500 to-pink-500' },
        { id: 'age', label: 'Age', icon: '🎂', color: 'from-purple-500 to-indigo-600' },
        { id: 'duration', label: 'Duration', icon: '⚡', color: 'from-orange-500 to-red-600' },
        { id: 'province', label: 'Location', icon: '🗺️', color: 'from-cyan-500 to-blue-600' },
        { id: 'products', label: 'Products', icon: '📱', color: 'from-pink-500 to-purple-600' },
    ];

    if (!chartData) {
        return (
            <div className="text-center py-10">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-white/20 border-t-[#D4AF37] mb-4"></div>
                <p className="text-white/40 text-sm">Loading analytics...</p>
            </div>
        );
    }

    const currentMode = viewModes.find(m => m.id === viewMode);
    const totalItems = chartData.datasets[0].data.reduce((a, b) => a + b, 0);

    return (
        <div className="space-y-4">
            {/* View Mode Selector with Premium Design (Scrollable on Mobile) */}
            <div className="flex overflow-x-auto pb-2 gap-2 scrollbar-hide -mx-4 px-4 md:mx-0 md:px-0 md:flex-wrap">
                {viewModes.map((mode) => (
                    <motion.button
                        key={mode.id}
                        onClick={() => setViewMode(mode.id)}
                        whileHover={{ scale: 1.05, y: -2 }}
                        whileTap={{ scale: 0.95 }}
                        className={`px-3 py-2 text-xs font-bold rounded-lg transition-all relative overflow-hidden whitespace-nowrap flex-shrink-0 ${viewMode === mode.id
                            ? 'text-white shadow-lg'
                            : 'bg-white/5 text-white/50 hover:bg-white/10 hover:text-white'
                            }`}
                    >
                        {viewMode === mode.id && (
                            <motion.div
                                layoutId="activeTab"
                                className={`absolute inset-0 bg-gradient-to-br ${mode.color}`}
                                initial={false}
                                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                            />
                        )}
                        <span className="relative z-10 flex items-center gap-1.5">
                            <span className="text-sm">{mode.icon}</span>
                            <span>{mode.label}</span>
                        </span>
                    </motion.button>
                ))}
            </div>

            {/* Pie Chart with Stunning Animation */}
            <AnimatePresence mode="wait">
                <motion.div
                    key={viewMode}
                    initial={{ opacity: 0, scale: 0.8, rotateY: 90 }}
                    animate={{ opacity: 1, scale: 1, rotateY: 0 }}
                    exit={{ opacity: 0, scale: 0.8, rotateY: -90 }}
                    transition={{
                        duration: 0.5,
                        type: 'spring',
                        stiffness: 100,
                    }}
                    className="relative"
                >
                    {/* Glow Effect Background */}
                    <div className={`absolute inset-0 blur-3xl opacity-20 bg-gradient-to-br ${currentMode.color} rounded-full`} />

                    {/* Chart Container with Glass Effect */}
                    <div className="relative bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 shadow-2xl">
                        <div className="h-[280px]">
                            <Pie data={chartData} options={options} />
                        </div>
                    </div>
                </motion.div>
            </AnimatePresence>

            {/* Enhanced Summary Stats with Gradient Cards */}
            <div className="grid grid-cols-2 gap-3 pt-2">
                <motion.div
                    whileHover={{ scale: 1.02, y: -2 }}
                    className="bg-gradient-to-br from-white/10 to-white/5 rounded-xl p-4 text-center border border-white/10 shadow-lg relative overflow-hidden"
                >
                    <div className="absolute inset-0 bg-gradient-to-br from-[#D4AF37]/10 to-transparent" />
                    <div className="relative z-10">
                        <p className="text-white/50 text-[10px] uppercase tracking-widest mb-2 font-bold">
                            Total Items
                        </p>
                        <p className="text-white text-2xl font-black bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent">
                            {totalItems}
                        </p>
                    </div>
                </motion.div>
                <motion.div
                    whileHover={{ scale: 1.02, y: -2 }}
                    className="bg-gradient-to-br from-white/10 to-white/5 rounded-xl p-4 text-center border border-white/10 shadow-lg relative overflow-hidden"
                >
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-transparent" />
                    <div className="relative z-10">
                        <p className="text-white/50 text-[10px] uppercase tracking-widest mb-2 font-bold">
                            Categories
                        </p>
                        <p className="text-white text-2xl font-black bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent">
                            {chartData.labels.length}
                        </p>
                    </div>
                </motion.div>
            </div>

            {/* Category Breakdown List */}
            <div className="space-y-2">
                {chartData.labels.map((label, index) => {
                    const value = chartData.datasets[0].data[index];
                    const percentage = ((value / totalItems) * 100).toFixed(1);
                    const color = chartData.datasets[0].backgroundColor[index];

                    return (
                        <motion.div
                            key={label}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="flex items-center justify-between bg-white/5 rounded-lg p-3 border border-white/5 hover:bg-white/10 transition-all group"
                        >
                            <div className="flex items-center gap-3">
                                <div
                                    className="w-3 h-3 rounded-full shadow-lg group-hover:scale-125 transition-transform"
                                    style={{ backgroundColor: color }}
                                />
                                <span className="text-white/90 text-sm font-semibold">{label}</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <span className="text-white/40 text-xs">{value}</span>
                                <span className="text-[#D4AF37] text-sm font-bold min-w-[50px] text-right">
                                    {percentage}%
                                </span>
                            </div>
                        </motion.div>
                    );
                })}
            </div>
        </div>
    );
};

export default StatsPieChart;
