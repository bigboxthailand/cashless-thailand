import { e as createComponent, f as createAstro, k as renderComponent, l as renderScript, r as renderTemplate, m as maybeRenderHead } from '../../chunks/astro/server_Bu8JVBjn.mjs';
import 'piccolore';
import { $ as $$Layout, a as $$Navbar } from '../../chunks/Navbar_DWavSQqS.mjs';
import { s as supabase } from '../../chunks/supabase_BcyI2ayE.mjs';
import { $ as $$SellerSidebar } from '../../chunks/SellerSidebar_BcSYC2A9.mjs';
export { renderers } from '../../renderers.mjs';

const $$Astro = createAstro();
const $$Dashboard = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Dashboard;
  const {
    data: { session }
  } = await supabase.auth.getSession();
  let shop = null;
  if (session) {
    const { data } = await supabase.from("shops").select("*").eq("owner_id", session.user.id).single();
    shop = data;
    if (shop && shop.status !== "active") {
      return Astro2.redirect("/seller/pending");
    }
    if (!shop) {
      return Astro2.redirect("/seller/register");
    }
  }
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": shop ? `Dashboard | ${shop.name}` : "Seller Dashboard" }, { "default": async ($$result2) => renderTemplate` ${renderComponent($$result2, "Navbar", $$Navbar, {})}  ${maybeRenderHead()}<div id="wallet-loading" style="display: none;" class="fixed inset-0 bg-[#050505] z-50 flex items-center justify-center pointer-events-none"> <div class="text-center"> <div class="w-16 h-16 border-4 border-[#D4AF37]/20 border-t-[#D4AF37] rounded-full animate-spin mx-auto mb-4"></div> <p class="text-white/60 text-sm">Loading dashboard...</p> </div> </div> <div id="dashboard-content" class="flex h-screen bg-[#050505] overflow-hidden pt-24"> ${renderComponent($$result2, "SellerSidebar", $$SellerSidebar, { "activeTab": "dashboard", "shop": shop })} <!-- Main Content --> <main class="flex-1 overflow-y-auto"> <!-- Mobile Header --> <div class="md:hidden p-4 border-b border-white/10 flex justify-between items-center bg-[#111]"> <span class="text-[#D4AF37] font-black uppercase">Dashboard</span> <a href="/" class="text-xs text-white/60">Home</a> </div> <div class="p-4 md:p-8 max-w-7xl mx-auto space-y-8"> <header class="hidden md:block"> <h1 id="shop-name-header" class="text-3xl font-black text-white"> ${shop?.name || "My Shop"} Overview
</h1> </header> <!-- Stats Grid (Dynamic) --> ${renderComponent($$result2, "SellerDashboardStats", null, { "shopId": shop?.id, "client:only": "react", "client:component-hydration": "only", "client:component-path": "/Users/natthapongsuwanjit/Desktop/CashlessThailand/cashlessthailand/src/components/seller/SellerDashboardStats", "client:component-export": "default" })} <!-- Quick Actions --> <div class="grid md:grid-cols-2 gap-6"> <div class="bg-[#111] border border-white/10 rounded-2xl p-6"> <h3 class="text-xl font-bold text-[#D4AF37] mb-4">
Add Product
</h3> <p class="text-white/60 mb-6">
List a new item to the marketplace. Support simple
                            and variable products.
</p> <a href="/seller/products" class="inline-block px-6 py-3 bg-[#D4AF37] hover:bg-[#B8941F] text-black font-bold rounded-xl transition-all">
+ New Product
</a> </div> <div class="bg-[#111] border border-white/10 rounded-2xl p-6"> <h3 class="text-xl font-bold text-[#D4AF37] mb-4">
Shop Customization
</h3> <p class="text-white/60 mb-6">
Update your logo, banner and store description to
                            attract customers.
</p> <a href="/seller/settings" class="inline-block px-6 py-3 border-2 border-[#D4AF37]/50 hover:border-[#D4AF37] text-[#D4AF37] font-bold rounded-xl transition-all">
Edit Shop
</a> </div> </div> </div> </main> </div> ` })} ${renderScript($$result, "/Users/natthapongsuwanjit/Desktop/CashlessThailand/cashlessthailand/src/pages/seller/dashboard.astro?astro&type=script&index=0&lang.ts")}`;
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
