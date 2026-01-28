import { e as createComponent, f as createAstro, k as renderComponent, r as renderTemplate, m as maybeRenderHead, h as addAttribute } from '../../chunks/astro/server_Bu8JVBjn.mjs';
import 'piccolore';
import { $ as $$Layout } from '../../chunks/Layout_BPO4vhqY.mjs';
import { s as supabase } from '../../chunks/supabase_BcyI2ayE.mjs';
export { renderers } from '../../renderers.mjs';

const $$Astro = createAstro();
const $$Dashboard = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Dashboard;
  const {
    data: { session }
  } = await supabase.auth.getSession();
  if (!session) return Astro2.redirect("/login");
  const { data: shop } = await supabase.from("shops").select("*").eq("owner_id", session.user.id).single();
  if (!shop) return Astro2.redirect("/seller/register");
  const stats = [
    { label: "Total Sales", value: "\u0E3F0.00", icon: "\u{1F4B0}" },
    { label: "Orders", value: "0", icon: "\u{1F4E6}" },
    { label: "Products", value: "0", icon: "\u{1F3F7}\uFE0F" },
    { label: "Rating", value: "5.0", icon: "\u2B50" }
  ];
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": `Dashboard | ${shop.name}` }, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="flex h-screen bg-[#050505] overflow-hidden"> <!-- Sidebar --> <aside class="w-64 bg-[#111] border-r border-white/10 hidden md:flex flex-col"> <div class="p-6 border-b border-white/10"> <h2 class="text-[#D4AF37] font-black uppercase tracking-widest text-lg">
Seller Center
</h2> <p class="text-white/40 text-xs mt-1 truncate">${shop.name}</p> </div> <nav class="flex-1 p-4 space-y-2"> <a href="/seller/dashboard" class="flex items-center gap-3 px-4 py-3 bg-[#D4AF37]/10 text-[#D4AF37] rounded-xl font-bold text-sm"> <span>📊</span> Dashboard
</a> <a href="#" class="flex items-center gap-3 px-4 py-3 text-white/60 hover:text-white hover:bg-white/5 rounded-xl font-bold text-sm transition-all"> <span>📦</span> Orders
</a> <a href="/seller/products" class="flex items-center gap-3 px-4 py-3 text-white/60 hover:text-white hover:bg-white/5 rounded-xl font-bold text-sm transition-all"> <span>🏷️</span> Products
</a> <a href="#" class="flex items-center gap-3 px-4 py-3 text-white/60 hover:text-white hover:bg-white/5 rounded-xl font-bold text-sm transition-all"> <span>⚙️</span> Settings
</a> </nav> <div class="p-4 border-t border-white/10"> <a href="/" class="flex items-center gap-2 text-white/40 hover:text-white text-xs font-bold uppercase tracking-widest transition-colors">
← Back to Market
</a> </div> </aside> <!-- Main Content --> <main class="flex-1 overflow-y-auto relative"> <!-- Mobile Header --> <div class="md:hidden p-4 border-b border-white/10 flex justify-between items-center bg-[#111]"> <span class="text-[#D4AF37] font-black uppercase">Seller Center</span> <a href="/" class="text-xs text-white/60">Exit</a> </div> <div class="p-8 max-w-7xl mx-auto space-y-8"> <!-- Header --> <div class="flex justify-between items-end"> <div> <h1 class="text-3xl font-black text-white uppercase tracking-wider">
Overview
</h1> <p class="text-white/40 text-sm mt-1">
Welcome back, ${shop.name} </p> </div> <a${addAttribute(`/shop/${shop.slug}`, "href")} target="_blank" class="px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg text-xs font-bold text-[#D4AF37] border border-[#D4AF37]/30 transition-all">
View My Shop
</a> </div> <!-- Stats Grid --> <div class="grid grid-cols-2 md:grid-cols-4 gap-6"> ${stats.map((stat) => renderTemplate`<div class="bg-[#1a1a1a] border border-white/5 p-6 rounded-2xl hover:border-[#D4AF37]/30 transition-all cursor-pointer group"> <div class="flex justify-between items-start mb-4 opacity-50 group-hover:opacity-100 transition-opacity"> <span class="text-2xl">${stat.icon}</span> </div> <p class="text-white/40 text-[10px] uppercase tracking-widest font-bold"> ${stat.label} </p> <p class="text-2xl font-black text-white mt-1 group-hover:text-[#D4AF37] transition-colors"> ${stat.value} </p> </div>`)} </div> <!-- Quick Actions --> <div class="grid md:grid-cols-2 gap-8"> <div class="bg-[#1a1a1a] border border-white/10 rounded-3xl p-8 relative overflow-hidden group"> <div class="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity"> <span class="text-6xl">📦</span> </div> <h3 class="text-xl font-bold text-white mb-2">
New Product
</h3> <p class="text-white/40 text-sm mb-6 max-w-xs">
List a new item to the marketplace. Support simple
                            and variable products.
</p> <a href="/seller/products" class="inline-block bg-[#D4AF37] text-black font-bold px-6 py-3 rounded-xl hover:bg-[#b89530] transition-colors shadow-lg">
+ Add Product
</a> </div> <div class="bg-[#1a1a1a] border border-white/10 rounded-3xl p-8 relative overflow-hidden group"> <div class="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity"> <span class="text-6xl">🎨</span> </div> <h3 class="text-xl font-bold text-white mb-2">
Shop Customization
</h3> <p class="text-white/40 text-sm mb-6 max-w-xs">
Update your logo, banner, and store description to
                            attract customers.
</p> <button class="bg-white/10 text-white font-bold px-6 py-3 rounded-xl hover:bg-white/20 transition-colors border border-white/10">
Edit Shop
</button> </div> </div> </div> </main> </div> ` })}`;
}, "/Users/natthapongsuwanjit/Desktop/CashlessThailand/cashlessthailand/src/pages/seller/dashboard.astro", void 0);

const $$file = "/Users/natthapongsuwanjit/Desktop/CashlessThailand/cashlessthailand/src/pages/seller/dashboard.astro";
const $$url = "/seller/dashboard";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
    __proto__: null,
    default: $$Dashboard,
    file: $$file,
    url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
