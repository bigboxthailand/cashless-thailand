import { e as createComponent, f as createAstro, m as maybeRenderHead, k as renderComponent, l as renderScript, r as renderTemplate } from '../../chunks/astro/server_Bu8JVBjn.mjs';
import 'piccolore';
import { $ as $$Layout, a as $$Navbar } from '../../chunks/Navbar_DWavSQqS.mjs';
import { s as supabase } from '../../chunks/supabase_BcyI2ayE.mjs';
import { $ as $$SellerSidebar } from '../../chunks/SellerSidebar_BcSYC2A9.mjs';
export { renderers } from '../../renderers.mjs';

const $$Astro = createAstro();
const $$Products = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Products;
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
  return renderTemplate`<!-- Loading overlay for wallet users -->${maybeRenderHead()}<div id="wallet-loading" style="display: none;" class="fixed inset-0 bg-[#050505] z-50 flex items-center justify-center pointer-events-none"> <div class="text-center"> <div class="w-16 h-16 border-4 border-[#D4AF37]/20 border-t-[#D4AF37] rounded-full animate-spin mx-auto mb-4"></div> <p class="text-white/60 text-sm">Loading...</p> </div> </div> ${renderComponent($$result, "Layout", $$Layout, { "title": `Products | ${shop?.name || "My Shop"}` }, { "default": async ($$result2) => renderTemplate` ${renderComponent($$result2, "Navbar", $$Navbar, {})} <div class="flex h-screen bg-[#050505] overflow-hidden pt-24"> ${renderComponent($$result2, "SellerSidebar", $$SellerSidebar, { "activeTab": "products", "shop": shop })} <!-- Main Content --> <main class="flex-1 overflow-y-auto relative bg-[#050505]"> <!-- Mobile Header --> <div class="md:hidden p-4 border-b border-white/10 flex justify-between items-center bg-[#111]"> <span class="text-[#D4AF37] font-black uppercase">Products</span> <a href="/seller/dashboard" class="text-xs text-white/60">Back</a> </div> <div class="p-4 md:p-8 max-w-7xl mx-auto"> ${renderComponent($$result2, "SellerProductManager", null, { "shopId": shop?.id, "client:only": "react", "client:component-hydration": "only", "client:component-path": "/Users/natthapongsuwanjit/Desktop/CashlessThailand/cashlessthailand/src/components/seller/SellerProductManager", "client:component-export": "default" })} </div> </main> </div> ` })} ${renderScript($$result, "/Users/natthapongsuwanjit/Desktop/CashlessThailand/cashlessthailand/src/pages/seller/products.astro?astro&type=script&index=0&lang.ts")}`;
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
