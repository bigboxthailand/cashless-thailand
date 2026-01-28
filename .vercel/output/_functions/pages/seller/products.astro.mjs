import { e as createComponent, f as createAstro, k as renderComponent, r as renderTemplate, m as maybeRenderHead } from '../../chunks/astro/server_Bu8JVBjn.mjs';
import 'piccolore';
import { $ as $$Layout } from '../../chunks/Layout_BPO4vhqY.mjs';
import { s as supabase } from '../../chunks/supabase_BcyI2ayE.mjs';
export { renderers } from '../../renderers.mjs';

const $$Astro = createAstro();
const $$Products = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Products;
  const {
    data: { session }
  } = await supabase.auth.getSession();
  if (!session) return Astro2.redirect("/login");
  const { data: shop } = await supabase.from("shops").select("*").eq("owner_id", session.user.id).single();
  if (!shop) return Astro2.redirect("/seller/register");
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": `Products | ${shop.name}` }, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="flex h-screen bg-[#050505] overflow-hidden"> <!-- Sidebar --> <aside class="w-64 bg-[#111] border-r border-white/10 hidden md:flex flex-col"> <div class="p-6 border-b border-white/10"> <h2 class="text-[#D4AF37] font-black uppercase tracking-widest text-lg">
Seller Center
</h2> <p class="text-white/40 text-xs mt-1 truncate">${shop.name}</p> </div> <nav class="flex-1 p-4 space-y-2"> <a href="/seller/dashboard" class="flex items-center gap-3 px-4 py-3 text-white/60 hover:text-white hover:bg-white/5 rounded-xl font-bold text-sm transition-all"> <span>📊</span> Dashboard
</a> <a href="/seller/orders" class="flex items-center gap-3 px-4 py-3 text-white/60 hover:text-white hover:bg-white/5 rounded-xl font-bold text-sm transition-all"> <span>📦</span> Orders
</a> <a href="/seller/products" class="flex items-center gap-3 px-4 py-3 bg-[#D4AF37]/10 text-[#D4AF37] rounded-xl font-bold text-sm"> <span>🏷️</span> Products
</a> <a href="/seller/settings" class="flex items-center gap-3 px-4 py-3 text-white/60 hover:text-white hover:bg-white/5 rounded-xl font-bold text-sm transition-all"> <span>⚙️</span> Settings
</a> </nav> <div class="p-4 border-t border-white/10"> <a href="/" class="flex items-center gap-2 text-white/40 hover:text-white text-xs font-bold uppercase tracking-widest transition-colors">
← Back to Market
</a> </div> </aside> <!-- Main Content --> <main class="flex-1 overflow-y-auto relative bg-[#050505]"> <!-- Mobile Header --> <div class="md:hidden p-4 border-b border-white/10 flex justify-between items-center bg-[#111]"> <span class="text-[#D4AF37] font-black uppercase">Products</span> <a href="/seller/dashboard" class="text-xs text-white/60">Back</a> </div> <div class="p-4 md:p-8 max-w-7xl mx-auto"> ${renderComponent($$result2, "SellerProductManager", null, { "shopId": shop.id, "client:only": "react", "client:component-hydration": "only", "client:component-path": "/Users/natthapongsuwanjit/Desktop/CashlessThailand/cashlessthailand/src/components/seller/SellerProductManager", "client:component-export": "default" })} </div> </main> </div> ` })}`;
}, "/Users/natthapongsuwanjit/Desktop/CashlessThailand/cashlessthailand/src/pages/seller/products.astro", void 0);

const $$file = "/Users/natthapongsuwanjit/Desktop/CashlessThailand/cashlessthailand/src/pages/seller/products.astro";
const $$url = "/seller/products";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
    __proto__: null,
    default: $$Products,
    file: $$file,
    url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
