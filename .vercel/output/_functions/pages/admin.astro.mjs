import { e as createComponent, k as renderComponent, r as renderTemplate, m as maybeRenderHead } from '../chunks/astro/server_Bu8JVBjn.mjs';
import 'piccolore';
import { $ as $$AdminLayout } from '../chunks/AdminLayout_B-ZiSxXY.mjs';
import { s as supabase } from '../chunks/supabase_BcyI2ayE.mjs';
import { jsxs, jsx } from 'react/jsx-runtime';
import { useState, useMemo, useRef, useEffect } from 'react';
import { Chart, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend, Filler, ArcElement } from 'chart.js';
import { Bar, Line, Pie } from 'react-chartjs-2';
import { motion, AnimatePresence } from 'framer-motion';
import * as d3 from 'd3';
export { renderers } from '../renderers.mjs';

Chart.register(
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
const options = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false
    },
    tooltip: {
      backgroundColor: "#111",
      titleColor: "#fff",
      bodyColor: "#D4AF37",
      borderColor: "#333",
      borderWidth: 1,
      padding: 10
    }
  },
  scales: {
    x: {
      grid: {
        color: "#333",
        display: false
      },
      ticks: {
        color: "#666"
      }
    },
    y: {
      grid: {
        color: "#222",
        borderDash: [5, 5]
      },
      ticks: {
        color: "#666",
        callback: (value) => value.toLocaleString()
      }
    }
  },
  interaction: {
    mode: "index",
    intersect: false
  },
  elements: {
    line: {
      tension: 0.4
      // Smooth curves
    },
    bar: {
      borderRadius: 4
    }
  }
};
function DashboardCharts({ orders = [] }) {
  const [chartType, setChartType] = useState("line");
  const [timeView, setTimeView] = useState("day");
  const [filterSex, setFilterSex] = useState("all");
  const [filterAge, setFilterAge] = useState("all");
  const [filterRegion, setFilterRegion] = useState("all");
  const [filterDuration, setFilterDuration] = useState("all");
  const chartData = useMemo(() => {
    const getRegion = (prov) => {
      const map = {
        "Bangkok": "Bangkok",
        "Chiang Mai": "North",
        "Chiang Rai": "North",
        "Nan": "North",
        "Khon Kaen": "Isan",
        "Nakhon Ratchasima": "Isan",
        "Udon Thani": "Isan",
        "Phuket": "South",
        "Songkhla": "South",
        "Krabi": "South",
        "Chon Buri": "East",
        "Rayong": "East",
        "Kanchanaburi": "West",
        "Ratchaburi": "West",
        "Ayutthaya": "Central",
        "Saraburi": "Central"
      };
      return map[prov] || "Other";
    };
    let filtered = orders.filter((o) => {
      if (filterSex !== "all" && o.sex !== filterSex) return false;
      const age = o.age || 0;
      if (filterAge === "<25" && age >= 25) return false;
      if (filterAge === "25-40" && (age < 25 || age > 40)) return false;
      if (filterAge === ">40" && age <= 40) return false;
      if (filterRegion !== "all" && getRegion(o.province) !== filterRegion) return false;
      const dur = o.buy_duration || 0;
      if (filterDuration === "fast" && dur > 60) return false;
      if (filterDuration === "normal" && (dur <= 60 || dur > 300)) return false;
      if (filterDuration === "long" && dur <= 300) return false;
      return true;
    });
    filtered.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
    const grouped = filtered.reduce((acc, order) => {
      const d = new Date(order.created_at);
      let key;
      if (timeView === "day") key = d.toLocaleDateString("th-TH", { day: "2-digit", month: "short" });
      else if (timeView === "month") key = d.toLocaleDateString("th-TH", { month: "long", year: "numeric" });
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
          borderColor: "#D4AF37",
          backgroundColor: chartType === "area" ? "rgba(212, 175, 55, 0.2)" : "#D4AF37",
          fill: chartType === "area",
          borderWidth: 2,
          pointBackgroundColor: "#000",
          pointBorderColor: "#D4AF37",
          pointRadius: 4
        }
      ]
    };
  }, [orders, chartType, timeView, filterSex, filterAge, filterRegion, filterDuration]);
  return /* @__PURE__ */ jsxs("div", { className: "bg-[#0A0A0A] border border-white/10 p-6 rounded-xl relative overflow-hidden space-y-6", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex flex-col xl:flex-row justify-between items-start xl:items-center gap-4", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsxs("h3", { className: "text-white font-bold uppercase tracking-wider text-sm flex items-center gap-2", children: [
          /* @__PURE__ */ jsx("span", { className: "w-2 h-2 bg-[#D4AF37] rounded-full animate-pulse" }),
          "Advanced Analytics"
        ] }),
        /* @__PURE__ */ jsx("p", { className: "text-white/30 text-xs mt-1", children: "Filtered Revenue Performance" })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap gap-2 bg-white/5 p-2 rounded-lg border border-white/5 w-full xl:w-auto items-center", children: [
        /* @__PURE__ */ jsx("div", { className: "flex bg-black/40 rounded p-1", children: ["day", "month", "year"].map((v) => /* @__PURE__ */ jsx("button", { onClick: () => setTimeView(v), className: `px-2 py-1 text-[10px] font-bold uppercase rounded ${timeView === v ? "bg-[#D4AF37] text-black" : "text-white/50 hover:text-white"}`, children: v }, v)) }),
        /* @__PURE__ */ jsx("div", { className: "w-px h-6 bg-white/10 mx-1 hidden sm:block" }),
        /* @__PURE__ */ jsxs("select", { value: filterSex, onChange: (e) => setFilterSex(e.target.value), className: "bg-black/40 text-white text-[10px] px-2 py-1.5 rounded border border-white/10 outline-none hover:border-[#D4AF37]", children: [
          /* @__PURE__ */ jsx("option", { value: "all", children: "Sex: All" }),
          /* @__PURE__ */ jsx("option", { value: "Male", children: "Male" }),
          /* @__PURE__ */ jsx("option", { value: "Female", children: "Female" })
        ] }),
        /* @__PURE__ */ jsxs("select", { value: filterAge, onChange: (e) => setFilterAge(e.target.value), className: "bg-black/40 text-white text-[10px] px-2 py-1.5 rounded border border-white/10 outline-none hover:border-[#D4AF37]", children: [
          /* @__PURE__ */ jsx("option", { value: "all", children: "Age: All" }),
          /* @__PURE__ */ jsxs("option", { value: "<25", children: [
            "<",
            " 25"
          ] }),
          /* @__PURE__ */ jsx("option", { value: "25-40", children: "25-40" }),
          /* @__PURE__ */ jsxs("option", { value: ">40", children: [
            ">",
            " 40"
          ] })
        ] }),
        /* @__PURE__ */ jsxs("select", { value: filterRegion, onChange: (e) => setFilterRegion(e.target.value), className: "bg-black/40 text-white text-[10px] px-2 py-1.5 rounded border border-white/10 outline-none hover:border-[#D4AF37]", children: [
          /* @__PURE__ */ jsx("option", { value: "all", children: "Region: All" }),
          /* @__PURE__ */ jsx("option", { value: "Bangkok", children: "Bangkok" }),
          /* @__PURE__ */ jsx("option", { value: "North", children: "North" }),
          /* @__PURE__ */ jsx("option", { value: "South", children: "South" }),
          /* @__PURE__ */ jsx("option", { value: "Isan", children: "Isan" }),
          /* @__PURE__ */ jsx("option", { value: "East", children: "East" }),
          /* @__PURE__ */ jsx("option", { value: "West", children: "West" }),
          /* @__PURE__ */ jsx("option", { value: "Central", children: "Central" })
        ] }),
        /* @__PURE__ */ jsxs("select", { value: filterDuration, onChange: (e) => setFilterDuration(e.target.value), className: "bg-black/40 text-white text-[10px] px-2 py-1.5 rounded border border-white/10 outline-none hover:border-[#D4AF37]", children: [
          /* @__PURE__ */ jsx("option", { value: "all", children: "Time: All" }),
          /* @__PURE__ */ jsxs("option", { value: "fast", children: [
            "Fast (",
            "<",
            "1m)"
          ] }),
          /* @__PURE__ */ jsx("option", { value: "normal", children: "Normal (1-5m)" }),
          /* @__PURE__ */ jsxs("option", { value: "long", children: [
            "Long (",
            ">",
            "5m)"
          ] })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "w-px h-6 bg-white/10 mx-1 hidden sm:block" }),
        /* @__PURE__ */ jsx("div", { className: "flex gap-1", children: ["line", "bar", "area"].map((type) => /* @__PURE__ */ jsx("button", { onClick: () => setChartType(type), className: `w-6 h-6 flex items-center justify-center rounded text-[10px] uppercase font-bold ${chartType === type ? "bg-white text-black" : "bg-white/10 text-white hover:bg-white/20"}`, children: type[0] }, type)) })
      ] })
    ] }),
    /* @__PURE__ */ jsx(
      motion.div,
      {
        initial: { opacity: 0, scale: 0.98 },
        animate: { opacity: 1, scale: 1 },
        transition: { duration: 0.3 },
        className: "h-[350px] w-full bg-gradient-to-b from-white/2 to-transparent rounded-lg border border-white/5 p-2",
        children: chartType === "bar" ? /* @__PURE__ */ jsx(Bar, { options, data: chartData }) : /* @__PURE__ */ jsx(Line, { options, data: chartData })
      },
      chartType + timeView
    )
  ] });
}

Chart.register(ArcElement, Tooltip, Legend);
const StatsPieChart = ({ orders }) => {
  const [viewMode, setViewMode] = useState("payment");
  const chartData = useMemo(() => {
    if (!orders || orders.length === 0) {
      return null;
    }
    let labels = [];
    let data = [];
    let colors = [];
    switch (viewMode) {
      case "payment":
        const paymentCounts = orders.reduce((acc, order) => {
          const method = order.payment_method || "Unknown";
          acc[method] = (acc[method] || 0) + 1;
          return acc;
        }, {});
        labels = Object.keys(paymentCounts);
        data = Object.values(paymentCounts);
        colors = ["#D4AF37", "#3B82F6", "#10B981", "#F59E0B", "#8B5CF6"];
        break;
      case "status":
        const statusCounts = orders.reduce((acc, order) => {
          const status = order.payment_status || "Unknown";
          acc[status] = (acc[status] || 0) + 1;
          return acc;
        }, {});
        labels = Object.keys(statusCounts);
        data = Object.values(statusCounts);
        colors = ["#EAB308", "#10B981", "#3B82F6", "#EF4444"];
        break;
      case "province":
        const provinceCounts = orders.reduce((acc, order) => {
          const province = order.province || "Unknown";
          acc[province] = (acc[province] || 0) + 1;
          return acc;
        }, {});
        const sortedProvinces = Object.entries(provinceCounts).sort(([, a], [, b]) => b - a).slice(0, 5);
        labels = sortedProvinces.map(([province]) => province);
        data = sortedProvinces.map(([, count]) => count);
        colors = ["#D4AF37", "#3B82F6", "#10B981", "#F59E0B", "#EF4444"];
        break;
      case "gender":
        const genderCounts = orders.reduce((acc, order) => {
          const gender = order.sex || "Unknown";
          acc[gender] = (acc[gender] || 0) + 1;
          return acc;
        }, {});
        labels = Object.keys(genderCounts);
        data = Object.values(genderCounts);
        colors = ["#3B82F6", "#EC4899", "#6B7280"];
        break;
      case "age":
        const ageCounts = { "<25": 0, "25-40": 0, ">40": 0 };
        orders.forEach((order) => {
          const age = order.age;
          if (age < 25) ageCounts["<25"]++;
          else if (age >= 25 && age <= 40) ageCounts["25-40"]++;
          else if (age > 40) ageCounts[">40"]++;
        });
        labels = Object.keys(ageCounts);
        data = Object.values(ageCounts);
        colors = ["#10B981", "#3B82F6", "#F59E0B"];
        break;
      case "duration":
        const durationCounts = orders.reduce((acc, order) => {
          const duration = order.buy_duration || "Unknown";
          acc[duration] = (acc[duration] || 0) + 1;
          return acc;
        }, {});
        labels = Object.keys(durationCounts);
        data = Object.values(durationCounts);
        colors = ["#10B981", "#3B82F6", "#F59E0B", "#EF4444"];
        break;
      case "products":
        const productPlaceholder = {
          "BitNode Personal": Math.floor(orders.length * 0.3),
          "CryptoClock Pro": Math.floor(orders.length * 0.25),
          "Ledger Nano X": Math.floor(orders.length * 0.2),
          "Trezor Model T": Math.floor(orders.length * 0.15),
          "Others": Math.floor(orders.length * 0.1)
        };
        labels = Object.keys(productPlaceholder);
        data = Object.values(productPlaceholder);
        colors = ["#D4AF37", "#3B82F6", "#10B981", "#F59E0B", "#6B7280"];
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
          borderColor: "#0A0A0A",
          borderWidth: 3,
          hoverBorderColor: "#D4AF37",
          hoverBorderWidth: 4,
          hoverOffset: 15
          // 3D pop-out effect
        }
      ]
    };
  }, [orders, viewMode]);
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    animation: {
      animateRotate: true,
      animateScale: true,
      duration: 800,
      easing: "easeOutQuart"
    },
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          color: "#fff",
          font: {
            size: 11,
            weight: "bold",
            family: "'Inter', sans-serif"
          },
          padding: 15,
          usePointStyle: true,
          pointStyle: "circle"
        }
      },
      tooltip: {
        backgroundColor: "rgba(0, 0, 0, 0.95)",
        titleColor: "#D4AF37",
        titleFont: {
          size: 14,
          weight: "bold"
        },
        bodyColor: "#fff",
        bodyFont: {
          size: 12
        },
        borderColor: "#D4AF37",
        borderWidth: 2,
        padding: 16,
        displayColors: true,
        boxPadding: 6,
        callbacks: {
          label: function(context) {
            const label = context.label || "";
            const value = context.parsed || 0;
            const total = context.dataset.data.reduce((a, b) => a + b, 0);
            const percentage = (value / total * 100).toFixed(1);
            return ` ${label}: ${value} orders (${percentage}%)`;
          }
        }
      }
    },
    interaction: {
      mode: "index",
      intersect: false
    }
  };
  const viewModes = [
    { id: "payment", label: "Payment", icon: "💳", color: "from-yellow-500 to-yellow-600" },
    { id: "status", label: "Status", icon: "📦", color: "from-green-500 to-emerald-600" },
    { id: "gender", label: "Gender", icon: "👥", color: "from-blue-500 to-pink-500" },
    { id: "age", label: "Age", icon: "🎂", color: "from-purple-500 to-indigo-600" },
    { id: "duration", label: "Duration", icon: "⚡", color: "from-orange-500 to-red-600" },
    { id: "province", label: "Location", icon: "🗺️", color: "from-cyan-500 to-blue-600" },
    { id: "products", label: "Products", icon: "📱", color: "from-pink-500 to-purple-600" }
  ];
  if (!chartData) {
    return /* @__PURE__ */ jsxs("div", { className: "text-center py-10", children: [
      /* @__PURE__ */ jsx("div", { className: "inline-block animate-spin rounded-full h-8 w-8 border-4 border-white/20 border-t-[#D4AF37] mb-4" }),
      /* @__PURE__ */ jsx("p", { className: "text-white/40 text-sm", children: "Loading analytics..." })
    ] });
  }
  const currentMode = viewModes.find((m) => m.id === viewMode);
  const totalItems = chartData.datasets[0].data.reduce((a, b) => a + b, 0);
  return /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
    /* @__PURE__ */ jsx("div", { className: "flex overflow-x-auto pb-2 gap-2 scrollbar-hide -mx-4 px-4 md:mx-0 md:px-0 md:flex-wrap", children: viewModes.map((mode) => /* @__PURE__ */ jsxs(
      motion.button,
      {
        onClick: () => setViewMode(mode.id),
        whileHover: { scale: 1.05, y: -2 },
        whileTap: { scale: 0.95 },
        className: `px-3 py-2 text-xs font-bold rounded-lg transition-all relative overflow-hidden whitespace-nowrap flex-shrink-0 ${viewMode === mode.id ? "text-white shadow-lg" : "bg-white/5 text-white/50 hover:bg-white/10 hover:text-white"}`,
        children: [
          viewMode === mode.id && /* @__PURE__ */ jsx(
            motion.div,
            {
              layoutId: "activeTab",
              className: `absolute inset-0 bg-gradient-to-br ${mode.color}`,
              initial: false,
              transition: { type: "spring", stiffness: 500, damping: 30 }
            }
          ),
          /* @__PURE__ */ jsxs("span", { className: "relative z-10 flex items-center gap-1.5", children: [
            /* @__PURE__ */ jsx("span", { className: "text-sm", children: mode.icon }),
            /* @__PURE__ */ jsx("span", { children: mode.label })
          ] })
        ]
      },
      mode.id
    )) }),
    /* @__PURE__ */ jsx(AnimatePresence, { mode: "wait", children: /* @__PURE__ */ jsxs(
      motion.div,
      {
        initial: { opacity: 0, scale: 0.8, rotateY: 90 },
        animate: { opacity: 1, scale: 1, rotateY: 0 },
        exit: { opacity: 0, scale: 0.8, rotateY: -90 },
        transition: {
          duration: 0.5,
          type: "spring",
          stiffness: 100
        },
        className: "relative",
        children: [
          /* @__PURE__ */ jsx("div", { className: `absolute inset-0 blur-3xl opacity-20 bg-gradient-to-br ${currentMode.color} rounded-full` }),
          /* @__PURE__ */ jsx("div", { className: "relative bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 shadow-2xl", children: /* @__PURE__ */ jsx("div", { className: "h-[280px]", children: /* @__PURE__ */ jsx(Pie, { data: chartData, options }) }) })
        ]
      },
      viewMode
    ) }),
    /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-3 pt-2", children: [
      /* @__PURE__ */ jsxs(
        motion.div,
        {
          whileHover: { scale: 1.02, y: -2 },
          className: "bg-gradient-to-br from-white/10 to-white/5 rounded-xl p-4 text-center border border-white/10 shadow-lg relative overflow-hidden",
          children: [
            /* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-gradient-to-br from-[#D4AF37]/10 to-transparent" }),
            /* @__PURE__ */ jsxs("div", { className: "relative z-10", children: [
              /* @__PURE__ */ jsx("p", { className: "text-white/50 text-[10px] uppercase tracking-widest mb-2 font-bold", children: "Total Items" }),
              /* @__PURE__ */ jsx("p", { className: "text-white text-2xl font-black bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent", children: totalItems })
            ] })
          ]
        }
      ),
      /* @__PURE__ */ jsxs(
        motion.div,
        {
          whileHover: { scale: 1.02, y: -2 },
          className: "bg-gradient-to-br from-white/10 to-white/5 rounded-xl p-4 text-center border border-white/10 shadow-lg relative overflow-hidden",
          children: [
            /* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-gradient-to-br from-blue-500/10 to-transparent" }),
            /* @__PURE__ */ jsxs("div", { className: "relative z-10", children: [
              /* @__PURE__ */ jsx("p", { className: "text-white/50 text-[10px] uppercase tracking-widest mb-2 font-bold", children: "Categories" }),
              /* @__PURE__ */ jsx("p", { className: "text-white text-2xl font-black bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent", children: chartData.labels.length })
            ] })
          ]
        }
      )
    ] }),
    /* @__PURE__ */ jsx("div", { className: "space-y-2", children: chartData.labels.map((label, index) => {
      const value = chartData.datasets[0].data[index];
      const percentage = (value / totalItems * 100).toFixed(1);
      const color = chartData.datasets[0].backgroundColor[index];
      return /* @__PURE__ */ jsxs(
        motion.div,
        {
          initial: { opacity: 0, x: -20 },
          animate: { opacity: 1, x: 0 },
          transition: { delay: index * 0.1 },
          className: "flex items-center justify-between bg-white/5 rounded-lg p-3 border border-white/5 hover:bg-white/10 transition-all group",
          children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
              /* @__PURE__ */ jsx(
                "div",
                {
                  className: "w-3 h-3 rounded-full shadow-lg group-hover:scale-125 transition-transform",
                  style: { backgroundColor: color }
                }
              ),
              /* @__PURE__ */ jsx("span", { className: "text-white/90 text-sm font-semibold", children: label })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
              /* @__PURE__ */ jsx("span", { className: "text-white/40 text-xs", children: value }),
              /* @__PURE__ */ jsxs("span", { className: "text-[#D4AF37] text-sm font-bold min-w-[50px] text-right", children: [
                percentage,
                "%"
              ] })
            ] })
          ]
        },
        label
      );
    }) })
  ] });
};

const ThailandOrdersMap = ({ orders }) => {
  const [filterCategory, setFilterCategory] = useState("all");
  const [hoveredProvince, setHoveredProvince] = useState(null);
  const [geoData, setGeoData] = useState(null);
  const [dimensions, setDimensions] = useState({ width: 600, height: 800 });
  const containerRef = useRef(null);
  const svgRef = useRef(null);
  const gRef = useRef(null);
  useEffect(() => {
    if (!svgRef.current || !gRef.current) return;
    const svg = d3.select(svgRef.current);
    const g = d3.select(gRef.current);
    const zoomed = (event) => {
      const { transform } = event;
      g.attr("transform", transform);
      g.attr("stroke-width", 1 / transform.k);
    };
    const zoom = d3.zoom().scaleExtent([1, 8]).translateExtent([[0, 0], [dimensions.width, dimensions.height]]).on("zoom", zoomed);
    svg.call(zoom);
    return () => {
      svg.on(".zoom", null);
    };
  }, [dimensions, geoData]);
  useEffect(() => {
    fetch("/thailand-provinces.json").then((res) => res.json()).then((data) => {
      setGeoData(data);
    }).catch((err) => console.error("Failed to load map data", err));
  }, []);
  useEffect(() => {
    if (containerRef.current) {
      setDimensions({
        width: containerRef.current.clientWidth,
        height: containerRef.current.clientHeight
      });
    }
  }, [containerRef]);
  const normalizeProvinceName = (dbName) => {
    const mapping = {
      "Chon Buri": "Chonburi",
      "Prachin Buri": "Prachinburi",
      "Sing Buri": "Singburi",
      "Lop Buri": "Lopburi",
      "Saraburi": "Saraburi",
      "Phangnga": "Phang Nga",
      "Si Sa Ket": "Sisaket",
      "Nong Bua Lam Phu": "Nong Bua Lamphu",
      "Ubon Ratchathani": "Ubon Ratchathani",
      "Bangkok": "Bangkok"
    };
    const normalized = dbName.trim();
    return mapping[normalized] || normalized;
  };
  const provinceStats = useMemo(() => {
    if (!orders || orders.length === 0) return {};
    let filteredOrders = orders;
    if (filterCategory !== "all") {
      switch (filterCategory) {
        case "payment":
          filteredOrders = orders.filter((o) => o.payment_method === "PromptPay");
          break;
        case "status":
          filteredOrders = orders.filter((o) => o.payment_status === "paid");
          break;
        case "shipped":
          filteredOrders = orders.filter((o) => o.payment_status === "shipped");
          break;
        case "pending":
          filteredOrders = orders.filter((o) => o.payment_status === "pending");
          break;
      }
    }
    const stats = {};
    filteredOrders.forEach((order) => {
      const dbName = order.province || "Unknown";
      const mapName = normalizeProvinceName(dbName);
      if (!stats[mapName]) {
        stats[mapName] = { count: 0, revenue: 0, dbName };
      }
      stats[mapName].count += 1;
      stats[mapName].revenue += Number(order.total_price) || 0;
    });
    return stats;
  }, [orders, filterCategory]);
  const { pathGenerator } = useMemo(() => {
    if (!geoData) return { pathGenerator: null };
    const projection = d3.geoMercator().fitSize([dimensions.width, dimensions.height], geoData);
    const pathGenerator2 = d3.geoPath().projection(projection);
    return { pathGenerator: pathGenerator2 };
  }, [geoData, dimensions]);
  const filterOptions = [
    { id: "all", label: "All Orders", icon: "🌏", color: "from-blue-500 to-cyan-500" },
    { id: "payment", label: "PromptPay", icon: "💳", color: "from-yellow-500 to-orange-500" },
    { id: "status", label: "Paid", icon: "✅", color: "from-green-500 to-emerald-500" },
    { id: "shipped", label: "Shipped", icon: "📦", color: "from-blue-500 to-indigo-500" },
    { id: "pending", label: "Pending", icon: "⏳", color: "from-orange-500 to-red-500" }
  ];
  const maxCount = Math.max(...Object.values(provinceStats).map((s) => s.count), 1);
  if (!geoData) {
    return /* @__PURE__ */ jsx("div", { className: "h-[500px] flex items-center justify-center bg-white/5 rounded-xl animate-pulse", children: /* @__PURE__ */ jsx("p", { className: "text-white/30 font-bold", children: "Loading Real Map Data..." }) });
  }
  return /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
    /* @__PURE__ */ jsx("div", { className: "flex overflow-x-auto pb-2 gap-2 scrollbar-hide -mx-4 px-4 md:mx-0 md:px-0 md:flex-wrap", children: filterOptions.map((filter) => /* @__PURE__ */ jsxs(
      "button",
      {
        onClick: () => setFilterCategory(filter.id),
        className: `px-3 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 whitespace-nowrap flex-shrink-0 ${filterCategory === filter.id ? "bg-[#D4AF37] text-black shadow-lg shadow-yellow-500/20" : "bg-white/5 text-white/50 hover:bg-white/10 hover:text-white"}`,
        children: [
          /* @__PURE__ */ jsx("span", { children: filter.icon }),
          /* @__PURE__ */ jsx("span", { children: filter.label })
        ]
      },
      filter.id
    )) }),
    /* @__PURE__ */ jsxs(
      "div",
      {
        ref: containerRef,
        className: "relative bg-gradient-to-br from-[#050505] to-[#111] border border-white/10 rounded-2xl overflow-hidden aspect-[3/4] group cursor-grab active:cursor-grabbing",
        children: [
          /* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(59,130,246,0.1)_0%,_transparent_70%)] pointer-events-none" }),
          /* @__PURE__ */ jsx("div", { className: "absolute bottom-4 right-4 z-20 pointer-events-none opacity-50 text-[10px] text-white/50 bg-black/50 px-2 py-1 rounded", children: "Scroll to Zoom • Drag to Pan" }),
          /* @__PURE__ */ jsx("svg", { ref: svgRef, width: "100%", height: "100%", viewBox: `0 0 ${dimensions.width} ${dimensions.height}`, children: /* @__PURE__ */ jsx("g", { ref: gRef, children: geoData.features.map((feature, i) => {
            const provinceName = feature.properties.pro_en;
            const stats = provinceStats[provinceName];
            const hasOrders = !!stats;
            const isHovered = hoveredProvince === provinceName;
            const [cx, cy] = pathGenerator.centroid(feature);
            const isValidCentroid = !isNaN(cx) && !isNaN(cy);
            return /* @__PURE__ */ jsxs("g", { children: [
              /* @__PURE__ */ jsx(
                "path",
                {
                  d: pathGenerator(feature),
                  fill: hasOrders ? "rgba(212, 175, 55, 0.15)" : "rgba(255, 255, 255, 0.03)",
                  stroke: hasOrders ? "#D4AF37" : "rgba(255, 255, 255, 0.1)",
                  strokeWidth: hasOrders ? 1 : 0.5,
                  className: "transition-colors duration-200 hover:fill-white/10 cursor-pointer",
                  onMouseEnter: () => setHoveredProvince(provinceName),
                  onMouseLeave: () => setHoveredProvince(null)
                }
              ),
              hasOrders && isValidCentroid && (() => {
                const radius = 4 + stats.count / maxCount * 15;
                return /* @__PURE__ */ jsxs("g", { className: "pointer-events-none", children: [
                  /* @__PURE__ */ jsx(
                    "circle",
                    {
                      cx,
                      cy,
                      r: radius * 1.5,
                      fill: "#D4AF37",
                      opacity: "0.2",
                      className: "animate-ping",
                      style: { animationDuration: "3s" },
                      vectorEffect: "non-scaling-stroke"
                    }
                  ),
                  /* @__PURE__ */ jsx(
                    "circle",
                    {
                      cx,
                      cy,
                      r: radius,
                      fill: "#D4AF37",
                      stroke: "#000",
                      strokeWidth: 1,
                      vectorEffect: "non-scaling-stroke"
                    }
                  )
                ] });
              })(),
              /* @__PURE__ */ jsx(AnimatePresence, { children: isHovered && isValidCentroid && /* @__PURE__ */ jsx(
                "foreignObject",
                {
                  x: cx - 75,
                  y: cy - 80,
                  width: 150,
                  height: 100,
                  style: { overflow: "visible", pointerEvents: "none" },
                  children: /* @__PURE__ */ jsxs(
                    motion.div,
                    {
                      initial: { opacity: 0, y: 10, scale: 0.9 },
                      animate: { opacity: 1, y: 0, scale: 1 },
                      exit: { opacity: 0, scale: 0.9 },
                      className: "bg-black/90 backdrop-blur border border-[#D4AF37] rounded-lg p-3 text-center shadow-xl z-50 relative pointer-events-none",
                      children: [
                        /* @__PURE__ */ jsx("div", { className: "absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-[#D4AF37]" }),
                        /* @__PURE__ */ jsx("h4", { className: "font-bold text-[#D4AF37] mb-0 leading-tight text-sm", children: provinceName }),
                        hasOrders ? /* @__PURE__ */ jsxs("div", { className: "text-white space-y-0.5 mt-1", children: [
                          /* @__PURE__ */ jsxs("p", { className: "font-bold text-xs", children: [
                            stats.count,
                            " Orders"
                          ] }),
                          /* @__PURE__ */ jsxs("p", { className: "text-white/60 text-[10px]", children: [
                            "฿",
                            stats.revenue.toLocaleString()
                          ] })
                        ] }) : /* @__PURE__ */ jsx("p", { className: "text-white/40 text-[10px] mt-1", children: "No orders yet" })
                      ]
                    }
                  )
                }
              ) })
            ] }, i);
          }) }) })
        ]
      }
    ),
    /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-3 gap-3", children: [
      /* @__PURE__ */ jsxs("div", { className: "bg-white/5 rounded-xl p-3 text-center border border-white/5", children: [
        /* @__PURE__ */ jsx("p", { className: "text-white/50 text-[10px] uppercase tracking-widest mb-1", children: "Active Provinces" }),
        /* @__PURE__ */ jsx("p", { className: "text-white text-xl font-black", children: Object.keys(provinceStats).length })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "bg-white/5 rounded-xl p-3 text-center border border-white/5", children: [
        /* @__PURE__ */ jsx("p", { className: "text-white/50 text-[10px] uppercase tracking-widest mb-1", children: "Total Orders" }),
        /* @__PURE__ */ jsx("p", { className: "text-white text-xl font-black", children: Object.values(provinceStats).reduce((sum, s) => sum + s.count, 0) })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "bg-white/5 rounded-xl p-3 text-center border border-white/5", children: [
        /* @__PURE__ */ jsx("p", { className: "text-white/50 text-[10px] uppercase tracking-widest mb-1", children: "Revenue" }),
        /* @__PURE__ */ jsxs("p", { className: "text-white text-xl font-black", children: [
          "฿",
          Object.values(provinceStats).reduce((sum, s) => sum + s.revenue, 0).toLocaleString()
        ] })
      ] })
    ] })
  ] });
};

const $$Index = createComponent(async ($$result, $$props, $$slots) => {
  const { data: orders } = await supabase.from("orders").select(
    "total_price, total_sats, payment_status, created_at, payment_method, sex, age, province, buy_duration"
  ).order("created_at", { ascending: false });
  const totalRevenueTHB = orders?.filter((o) => o.payment_status === "paid").reduce((acc, curr) => acc + (Number(curr.total_price) || 0), 0) || 0;
  const totalRevenueSats = orders?.filter((o) => o.payment_status === "paid").reduce((acc, curr) => acc + (Number(curr.total_sats) || 0), 0) || 0;
  const pendingOrders = orders?.filter((o) => o.payment_status === "pending").length || 0;
  const totalOrders = orders?.length || 0;
  const thbFormatter = new Intl.NumberFormat("th-TH", {
    style: "currency",
    currency: "THB"
  });
  return renderTemplate`${renderComponent($$result, "AdminLayout", $$AdminLayout, { "title": "Dashboard" }, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="space-y-8"> <!-- HEADER --> <div> <h1 class="text-3xl font-black text-white uppercase tracking-wider">
Dashboard
</h1> <p class="text-white/50 text-sm mt-1">
Overview of your store performance
</p> </div> <!-- KPI GRID --> <div class="grid grid-cols-1 md:grid-cols-3 gap-6"> <!-- REVENUE CARD --> <div class="bg-[#0A0A0A] border border-[#D4AF37]/20 p-6 rounded-xl relative overflow-hidden group"> <div class="absolute inset-0 bg-gradient-to-br from-[#D4AF37]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div> <h3 class="text-white/50 text-xs font-bold uppercase tracking-widest mb-4">
Total Revenue
</h3> <div class="space-y-1 relative z-10"> <p class="text-3xl font-black text-white"> ${thbFormatter.format(totalRevenueTHB)} </p> <p class="text-sm font-bold text-[#D4AF37] flex items-center gap-2"> <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm.55-12h-3v1.79c-1.35.15-2.29.98-2.45 2.11h4.92c.16 1.13 1.1 1.96 2.45 2.11V18h-2.5v-2.21c-1.35-.15-2.29-.98-2.45-2.11H8.55c.16 1.13 1.1 1.96 2.45 2.11V8z"></path></svg> ${totalRevenueSats.toLocaleString()} Sats
</p> </div> </div> <!-- PENDING ORDERS CARD --> <div class="bg-[#0A0A0A] border border-white/10 p-6 rounded-xl relative overflow-hidden"> <h3 class="text-white/50 text-xs font-bold uppercase tracking-widest mb-4">
Pending Orders
</h3> <div class="flex items-end justify-between"> <p class="text-4xl font-black text-white"> ${pendingOrders} </p> <span class="text-xs text-white/30 mb-1">Orders need action</span> </div> ${pendingOrders > 0 && renderTemplate`<div class="absolute top-4 right-4 w-3 h-3 bg-red-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(239,68,68,0.5)]"></div>`} </div> <!-- TOTAL ORDERS CARD --> <div class="bg-[#0A0A0A] border border-white/10 p-6 rounded-xl"> <h3 class="text-white/50 text-xs font-bold uppercase tracking-widest mb-4">
Total Orders
</h3> <p class="text-4xl font-black text-white">${totalOrders}</p> </div> </div> <!-- REVENUE CHART -->  ${renderComponent($$result2, "DashboardCharts", DashboardCharts, { "client:load": true, "orders": orders || [], "client:component-hydration": "load", "client:component-path": "/Users/natthapongsuwanjit/Desktop/CashlessThailand/cashlessthailand/src/components/admin/DashboardCharts", "client:component-export": "default" })} <!-- RECENT ACTIVITY / LIVE CART --> <div class="grid grid-cols-1 lg:grid-cols-2 gap-8"> <!-- THAILAND MAP --> <div class="bg-[#0A0A0A] border border-white/10 rounded-xl p-6"> <div class="flex justify-between items-center mb-6"> <h3 class="text-white font-bold uppercase tracking-wider text-sm flex items-center gap-2"> <span class="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span>
Order Locations (Thailand)
</h3> </div> ${renderComponent($$result2, "ThailandOrdersMap", ThailandOrdersMap, { "client:load": true, "orders": orders || [], "client:component-hydration": "load", "client:component-path": "/Users/natthapongsuwanjit/Desktop/CashlessThailand/cashlessthailand/src/components/admin/ThailandOrdersMap", "client:component-export": "default" })} </div> <!-- ANALYTICS PIE CHART --> <div class="bg-[#0A0A0A] border border-white/10 rounded-xl p-6 relative"> <div class="flex justify-between items-center mb-6"> <h3 class="text-white font-bold uppercase tracking-wider text-sm flex items-center gap-2"> <span class="w-2 h-2 bg-[#D4AF37] rounded-full animate-pulse"></span>
Analytics Breakdown
</h3> </div> ${renderComponent($$result2, "StatsPieChart", StatsPieChart, { "client:load": true, "orders": orders || [], "client:component-hydration": "load", "client:component-path": "/Users/natthapongsuwanjit/Desktop/CashlessThailand/cashlessthailand/src/components/admin/StatsPieChart", "client:component-export": "default" })} </div> </div> </div> ` })}`;
}, "/Users/natthapongsuwanjit/Desktop/CashlessThailand/cashlessthailand/src/pages/admin/index.astro", void 0);

const $$file = "/Users/natthapongsuwanjit/Desktop/CashlessThailand/cashlessthailand/src/pages/admin/index.astro";
const $$url = "/admin";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
    __proto__: null,
    default: $$Index,
    file: $$file,
    url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
