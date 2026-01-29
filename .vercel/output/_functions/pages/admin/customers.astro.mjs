import { e as createComponent, k as renderComponent, r as renderTemplate, m as maybeRenderHead, h as addAttribute } from '../../chunks/astro/server_Bu8JVBjn.mjs';
import 'piccolore';
import { $ as $$AdminLayout } from '../../chunks/AdminLayout_CY66lzGI.mjs';
import { s as supabase } from '../../chunks/supabase_BcyI2ayE.mjs';
import { jsxs, jsx } from 'react/jsx-runtime';
import { useMemo } from 'react';
import { Chart, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';
import { Bar, Doughnut } from 'react-chartjs-2';
export { renderers } from '../../renderers.mjs';

Chart.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);
const options = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: "right",
      labels: { color: "#fff" }
    },
    tooltip: {
      backgroundColor: "#111",
      titleColor: "#fff",
      bodyColor: "#D4AF37",
      borderColor: "#333",
      borderWidth: 1
    }
  },
  scales: {
    y: {
      grid: { color: "#222" },
      ticks: { color: "#666" }
    },
    x: {
      grid: { display: false },
      ticks: { color: "#666" }
    }
  }
};
function CustomerCharts({ customers = [] }) {
  const provinceData = useMemo(() => {
    const regionMap = {
      "Bangkok": "กรุงเทพฯ",
      "Chiang Mai": "ภาคเหนือ",
      "Chiang Rai": "ภาคเหนือ",
      "Nan": "ภาคเหนือ",
      "Khon Kaen": "ภาคอีสาน",
      "Nakhon Ratchasima": "ภาคอีสาน",
      "Udon Thani": "ภาคอีสาน",
      "Phuket": "ภาคใต้",
      "Songkhla": "ภาคใต้",
      "Krabi": "ภาคใต้",
      "Chon Buri": "ภาคตะวันออก",
      "Rayong": "ภาคตะวันออก",
      "Kanchanaburi": "ภาคตะวันตก",
      "Ratchaburi": "ภาคตะวันตก",
      "Ayutthaya": "ภาคกลาง",
      "Saraburi": "ภาคกลาง",
      "Nonthaburi": "ภาคกลาง"
    };
    const counts = {
      "กรุงเทพฯ": 0,
      "ภาคเหนือ": 0,
      "ภาคกลาง": 0,
      "ภาคอีสาน": 0,
      "ภาคตะวันออก": 0,
      "ภาคตะวันตก": 0,
      "ภาคใต้": 0
    };
    customers.forEach((c) => {
      const region = regionMap[c.province] || "Unknown";
      if (counts[region] !== void 0) counts[region]++;
    });
    const sorted = Object.entries(counts).filter(([k, v]) => v >= 0).sort((a, b) => b[1] - a[1]);
    return {
      labels: sorted.map((k) => k[0]),
      datasets: [{
        label: "Customers",
        data: sorted.map((k) => k[1]),
        backgroundColor: sorted.map((k) => k[0] === "กรุงเทพฯ" ? "#D4AF37" : "#333"),
        borderColor: "#D4AF37",
        borderWidth: 1
      }]
    };
  }, [customers]);
  const spendTierData = useMemo(() => {
    let low = 0, mid = 0, high = 0;
    customers.forEach((c) => {
      if (c.totalSpent > 1e5) high++;
      else if (c.totalSpent > 3e4) mid++;
      else low++;
    });
    return {
      labels: ["Starter (<30k)", "Pro (30k-100k)", "Whale (>100k)"],
      datasets: [{
        data: [low, mid, high],
        backgroundColor: ["#888", "#D4AF37", "#FFF"],
        borderColor: "#000",
        borderWidth: 2
      }]
    };
  }, [customers]);
  return /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6 mb-8", children: [
    /* @__PURE__ */ jsxs("div", { className: "bg-[#0A0A0A] border border-white/10 p-6 rounded-xl h-[300px]", children: [
      /* @__PURE__ */ jsx("h3", { className: "text-white/50 text-xs font-bold uppercase tracking-widest mb-4", children: "Top Locations" }),
      /* @__PURE__ */ jsx(Bar, { options, data: provinceData })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "bg-[#0A0A0A] border border-white/10 p-6 rounded-xl h-[300px]", children: [
      /* @__PURE__ */ jsx("h3", { className: "text-white/50 text-xs font-bold uppercase tracking-widest mb-4", children: "Customer Tiers" }),
      /* @__PURE__ */ jsx("div", { className: "h-[220px] flex justify-center", children: /* @__PURE__ */ jsx(Doughnut, { data: spendTierData, options: { ...options, scales: {}, maintainAspectRatio: false } }) })
    ] })
  ] });
}

const $$Customers = createComponent(async ($$result, $$props, $$slots) => {
  const { data: orders } = await supabase.from("orders").select(
    "customer_name, customer_email, customer_phone, province, total_price, created_at"
  ).order("created_at", { ascending: false });
  const customerMap = /* @__PURE__ */ new Map();
  orders?.forEach((order) => {
    const key = order.customer_email || order.customer_name;
    if (!customerMap.has(key)) {
      customerMap.set(key, {
        name: order.customer_name,
        email: order.customer_email,
        phone: order.customer_phone,
        province: order.province,
        totalSpent: 0,
        orders: 0,
        lastSeen: order.created_at
      });
    }
    const customer = customerMap.get(key);
    customer.totalSpent += Number(order.total_price);
    customer.orders += 1;
    if (new Date(order.created_at) > new Date(customer.lastSeen)) {
      customer.lastSeen = order.created_at;
    }
  });
  const customers = Array.from(customerMap.values()).sort(
    (a, b) => b.totalSpent - a.totalSpent
  );
  const totalCustomers = customers.length;
  return renderTemplate`${renderComponent($$result, "AdminLayout", $$AdminLayout, { "title": "Customers" }, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="space-y-6"> <div class="flex justify-between items-center"> <div> <h1 class="text-3xl font-black text-white uppercase tracking-wider">
Customers
</h1> <p class="text-white/50 text-sm mt-1"> ${totalCustomers} Unique Customers found
</p> </div> <button class="px-4 py-2 bg-[#D4AF37] text-black font-bold rounded text-sm hover:bg-white transition-colors">
Export CRM
</button> </div> <!-- CHARTS --> ${renderComponent($$result2, "CustomerCharts", CustomerCharts, { "client:load": true, "customers": customers, "client:component-hydration": "load", "client:component-path": "/Users/natthapongsuwanjit/Desktop/CashlessThailand/cashlessthailand/src/components/admin/CustomerCharts", "client:component-export": "default" })} <!-- CUSTOMER TABLE --> <div class="bg-black/10 backdrop-blur-md border border-white/10 rounded-xl overflow-hidden"> <div class="overflow-x-auto"> <table class="w-full text-left text-sm text-white/70"> <thead class="bg-white/5 text-white font-bold uppercase text-xs tracking-wider"> <tr> <th class="p-4">Customer</th> <th class="p-4">Contact</th> <th class="p-4">Region</th> <th class="p-4 text-center">Orders</th> <th class="p-4 text-right">Lifetime Value (LTV)</th> <th class="p-4 text-right">Last Seen</th> </tr> </thead> <tbody class="divide-y divide-white/5"> ${customers.map((c) => renderTemplate`<tr class="hover:bg-white/2 transition-colors"> <td class="p-4 flex items-center gap-3"> <div class="w-10 h-10 rounded-full bg-gradient-to-br from-[#D4AF37] to-transparent p-0.5"> <div class="w-full h-full bg-black rounded-full overflow-hidden"> <img${addAttribute(`https://unavatar.io/${c.email}?fallback=https://source.boringavatars.com/marble/120/${encodeURIComponent(c.name)}`, "src")} class="w-full h-full object-cover"> </div> </div> <div> <div class="text-white font-bold"> ${c.name} </div> <div class="text-[10px] text-[#D4AF37] uppercase tracking-wider font-bold"> ${c.totalSpent > 1e5 ? "Whale" : c.totalSpent > 3e4 ? "Pro" : "User"} </div> </div> </td> <td class="p-4"> <div class="text-white">${c.phone}</div> <div class="text-xs text-white/40"> ${c.email} </div> </td> <td class="p-4">${c.province}</td> <td class="p-4 text-center font-bold text-white"> ${c.orders} </td> <td class="p-4 text-right font-black text-[#D4AF37]">
฿${c.totalSpent.toLocaleString()} </td> <td class="p-4 text-right text-xs text-white/40"> ${new Date(
    c.lastSeen
  ).toLocaleDateString()} </td> </tr>`)} </tbody> </table> </div> </div> </div> ` })}`;
}, "/Users/natthapongsuwanjit/Desktop/CashlessThailand/cashlessthailand/src/pages/admin/customers.astro", void 0);

const $$file = "/Users/natthapongsuwanjit/Desktop/CashlessThailand/cashlessthailand/src/pages/admin/customers.astro";
const $$url = "/admin/customers";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
    __proto__: null,
    default: $$Customers,
    file: $$file,
    url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
