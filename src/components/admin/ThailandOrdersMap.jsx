import React, { useState, useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import * as d3 from 'd3';

const ThailandOrdersMap = ({ orders }) => {
    const [filterCategory, setFilterCategory] = useState('all');
    const [hoveredProvince, setHoveredProvince] = useState(null);
    const [geoData, setGeoData] = useState(null);
    const [dimensions, setDimensions] = useState({ width: 600, height: 800 });
    const containerRef = useRef(null);
    const svgRef = useRef(null);
    const gRef = useRef(null);

    // D3 Zoom Behavior
    useEffect(() => {
        if (!svgRef.current || !gRef.current) return;

        const svg = d3.select(svgRef.current);
        const g = d3.select(gRef.current);

        const zoomed = (event) => {
            const { transform } = event;
            g.attr("transform", transform);
            g.attr("stroke-width", 1 / transform.k);
        };

        const zoom = d3.zoom()
            .scaleExtent([1, 8])
            .translateExtent([[0, 0], [dimensions.width, dimensions.height]])
            .on("zoom", zoomed);

        svg.call(zoom);

        return () => {
            svg.on(".zoom", null);
        };
    }, [dimensions, geoData]);

    // Load GeoJSON Data
    useEffect(() => {
        fetch('/thailand-provinces.json')
            .then(res => res.json())
            .then(data => {
                setGeoData(data);
            })
            .catch(err => console.error('Failed to load map data', err));
    }, []);

    // Handle Resize
    useEffect(() => {
        if (containerRef.current) {
            setDimensions({
                width: containerRef.current.clientWidth,
                height: containerRef.current.clientHeight
            });
        }
    }, [containerRef]);

    // Name Normalization Helper (DB Name -> Map Name)
    const normalizeProvinceName = (dbName) => {
        if (!dbName) return 'Unknown';
        const mapping = {
            'Chon Buri': 'Chonburi',
            'Prachin Buri': 'Prachinburi',
            'Sing Buri': 'Singburi',
            'Lop Buri': 'Lopburi',
            'Saraburi': 'Saraburi',
            'Phangnga': 'Phang Nga',
            'Si Sa Ket': 'Sisaket',
            'Nong Bua Lam Phu': 'Nong Bua Lamphu',
            'Ubon Ratchathani': 'Ubon Ratchathani',
            'Bangkok': 'Bangkok',
        };
        const normalized = dbName.trim();
        return mapping[normalized] || normalized;
    };

    // Calculate Orders Stats mapped to Real Provinces
    const provinceStats = useMemo(() => {
        if (!orders || orders.length === 0) return {};

        let filteredOrders = orders;
        // Filter Logic
        if (filterCategory !== 'all') {
            switch (filterCategory) {
                case 'payment': filteredOrders = orders.filter(o => o.payment_method === 'PromptPay'); break;
                case 'status': filteredOrders = orders.filter(o => o.payment_status === 'paid'); break;
                case 'shipped': filteredOrders = orders.filter(o => o.payment_status === 'shipped'); break;
                case 'pending': filteredOrders = orders.filter(o => o.payment_status === 'pending'); break;
            }
        }

        const stats = {};
        filteredOrders.forEach(order => {
            const dbName = order.province || 'Unknown';
            const mapName = normalizeProvinceName(dbName);

            if (!stats[mapName]) {
                stats[mapName] = { count: 0, revenue: 0, dbName: dbName };
            }
            stats[mapName].count += 1;
            stats[mapName].revenue += Number(order.total_price) || 0;
        });
        return stats;
    }, [orders, filterCategory]);

    // D3 Projection
    const { pathGenerator } = useMemo(() => {
        if (!geoData) return { pathGenerator: null };

        const projection = d3.geoMercator()
            .fitSize([dimensions.width, dimensions.height], geoData);

        const pathGenerator = d3.geoPath().projection(projection);
        return { pathGenerator };
    }, [geoData, dimensions]);

    // Filter Options
    const filterOptions = [
        { id: 'all', label: 'All Orders', icon: '🌏', color: 'from-blue-500 to-cyan-500' },
        { id: 'payment', label: 'PromptPay', icon: '💳', color: 'from-yellow-500 to-orange-500' },
        { id: 'status', label: 'Paid', icon: '✅', color: 'from-green-500 to-emerald-500' },
        { id: 'shipped', label: 'Shipped', icon: '📦', color: 'from-blue-500 to-indigo-500' },
        { id: 'pending', label: 'Pending', icon: '⏳', color: 'from-orange-500 to-red-500' },
    ];

    const maxCount = Math.max(...Object.values(provinceStats).map(s => s.count), 1);

    if (!geoData) {
        return (
            <div className="h-[500px] flex items-center justify-center bg-white/5 rounded-xl animate-pulse">
                <p className="text-white/30 font-bold">Loading Real Map Data...</p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {/* Filter Buttons (Scrollable on Mobile) */}
            <div className="flex overflow-x-auto pb-2 gap-2 scrollbar-hide -mx-4 px-4 md:mx-0 md:px-0 md:flex-wrap">
                {filterOptions.map((filter) => (
                    <button
                        key={filter.id}
                        onClick={() => setFilterCategory(filter.id)}
                        className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 whitespace-nowrap flex-shrink-0 ${filterCategory === filter.id
                                ? 'bg-[#D4AF37] text-black shadow-lg shadow-yellow-500/20'
                                : 'bg-white/5 text-white/50 hover:bg-white/10 hover:text-white'
                            }`}
                    >
                        <span>{filter.icon}</span>
                        <span>{filter.label}</span>
                    </button>
                ))}
            </div>

            {/* Map Container */}
            <div
                ref={containerRef}
                className="relative bg-gradient-to-br from-[#050505] to-[#111] border border-white/10 rounded-2xl overflow-hidden aspect-[3/4] group cursor-grab active:cursor-grabbing"
            >
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(59,130,246,0.1)_0%,_transparent_70%)] pointer-events-none" />

                {/* Help Text */}
                <div className="absolute bottom-4 right-4 z-20 pointer-events-none opacity-50 text-[10px] text-white/50 bg-black/50 px-2 py-1 rounded">
                    Scroll to Zoom • Drag to Pan
                </div>

                {/* SVG MAP */}
                <svg ref={svgRef} width="100%" height="100%" viewBox={`0 0 ${dimensions.width} ${dimensions.height}`}>
                    <g ref={gRef}>
                        {geoData.features.map((feature, i) => {
                            const provinceName = feature.properties.pro_en;
                            const stats = provinceStats[provinceName];
                            const hasOrders = !!stats;
                            const isHovered = hoveredProvince === provinceName;

                            // Calculate centroid for every province to allow hovering empty ones
                            const [cx, cy] = pathGenerator.centroid(feature);
                            const isValidCentroid = !isNaN(cx) && !isNaN(cy);

                            return (
                                <g key={i}>
                                    <path
                                        d={pathGenerator(feature)}
                                        fill={hasOrders ? "rgba(212, 175, 55, 0.15)" : "rgba(255, 255, 255, 0.03)"}
                                        stroke={hasOrders ? "#D4AF37" : "rgba(255, 255, 255, 0.1)"}
                                        strokeWidth={hasOrders ? 1 : 0.5}
                                        className="transition-colors duration-200 hover:fill-white/10 cursor-pointer"
                                        onMouseEnter={() => setHoveredProvince(provinceName)}
                                        onMouseLeave={() => setHoveredProvince(null)}
                                    />

                                    {/* Bubbles (Only if orders) - Pointer events none so hover passes to path */}
                                    {hasOrders && isValidCentroid && (() => {
                                        const radius = 4 + (stats.count / maxCount) * 15;
                                        return (
                                            <g className="pointer-events-none">
                                                <circle
                                                    cx={cx} cy={cy} r={radius * 1.5}
                                                    fill="#D4AF37" opacity="0.2"
                                                    className="animate-ping"
                                                    style={{ animationDuration: '3s' }}
                                                    vectorEffect="non-scaling-stroke"
                                                />
                                                <circle
                                                    cx={cx} cy={cy} r={radius}
                                                    fill="#D4AF37" stroke="#000" strokeWidth={1}
                                                    vectorEffect="non-scaling-stroke"
                                                />
                                            </g>
                                        );
                                    })()}

                                    {/* Popup Tooltip (If Hovered) */}
                                    <AnimatePresence>
                                        {isHovered && isValidCentroid && (
                                            <foreignObject
                                                x={cx - 75} y={cy - 80}
                                                width={150} height={100}
                                                style={{ overflow: 'visible', pointerEvents: 'none' }}
                                            >
                                                <motion.div
                                                    initial={{ opacity: 0, y: 10, scale: 0.9 }}
                                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                                    exit={{ opacity: 0, scale: 0.9 }}
                                                    className="bg-black/90 backdrop-blur border border-[#D4AF37] rounded-lg p-3 text-center shadow-xl z-50 relative pointer-events-none"
                                                >
                                                    <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-[#D4AF37]"></div>
                                                    <h4 className="font-bold text-[#D4AF37] mb-0 leading-tight text-sm">
                                                        {provinceName}
                                                    </h4>
                                                    {hasOrders ? (
                                                        <div className="text-white space-y-0.5 mt-1">
                                                            <p className="font-bold text-xs">{stats.count} Orders</p>
                                                            <p className="text-white/60 text-[10px]">฿{stats.revenue.toLocaleString()}</p>
                                                        </div>
                                                    ) : (
                                                        <p className="text-white/40 text-[10px] mt-1">No orders yet</p>
                                                    )}
                                                </motion.div>
                                            </foreignObject>
                                        )}
                                    </AnimatePresence>
                                </g>
                            );
                        })}
                    </g>
                </svg>
            </div>

            {/* Summary Stats */}
            <div className="grid grid-cols-3 gap-3">
                <div className="bg-white/5 rounded-xl p-3 text-center border border-white/5">
                    <p className="text-white/50 text-[10px] uppercase tracking-widest mb-1">
                        Active Provinces
                    </p>
                    <p className="text-white text-xl font-black">
                        {Object.keys(provinceStats).length}
                    </p>
                </div>
                <div className="bg-white/5 rounded-xl p-3 text-center border border-white/5">
                    <p className="text-white/50 text-[10px] uppercase tracking-widest mb-1">
                        Total Orders
                    </p>
                    <p className="text-white text-xl font-black">
                        {Object.values(provinceStats).reduce((sum, s) => sum + s.count, 0)}
                    </p>
                </div>
                <div className="bg-white/5 rounded-xl p-3 text-center border border-white/5">
                    <p className="text-white/50 text-[10px] uppercase tracking-widest mb-1">
                        Revenue
                    </p>
                    <p className="text-white text-xl font-black">
                        ฿{Object.values(provinceStats).reduce((sum, s) => sum + s.revenue, 0).toLocaleString()}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default ThailandOrdersMap;
