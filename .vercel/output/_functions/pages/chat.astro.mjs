import { e as createComponent, k as renderComponent, l as renderScript, r as renderTemplate, m as maybeRenderHead } from '../chunks/astro/server_Bu8JVBjn.mjs';
import 'piccolore';
import { $ as $$Layout, a as $$Navbar } from '../chunks/Navbar_DWavSQqS.mjs';
import { $ as $$SellerSidebar } from '../chunks/SellerSidebar_BcSYC2A9.mjs';
import { s as supabase } from '../chunks/supabase_BcyI2ayE.mjs';
export { renderers } from '../renderers.mjs';

const $$Index = createComponent(async ($$result, $$props, $$slots) => {
  const {
    data: { session }
  } = await supabase.auth.getSession();
  let shop = null;
  if (session) {
    const { data } = await supabase.from("shops").select("*").eq("owner_id", session.user.id).single();
    shop = data;
  }
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "Messages | Cashless Thailand" }, { "default": async ($$result2) => renderTemplate` ${renderComponent($$result2, "Navbar", $$Navbar, {})}  ${maybeRenderHead()}<div id="wallet-loading" style="display: none;" class="fixed inset-0 bg-[#050505] z-50 flex items-center justify-center pointer-events-none"> <div class="text-center"> <div class="w-16 h-16 border-4 border-[#D4AF37]/20 border-t-[#D4AF37] rounded-full animate-spin mx-auto mb-4"></div> <p class="text-white/60 text-sm">Loading Chat...</p> </div> </div> <div class="flex h-screen bg-[#050505] overflow-hidden pt-24"> <!-- Sidebar - Always render, but hide initially if no session shop --> ${renderComponent($$result2, "SellerSidebar", $$SellerSidebar, { "activeTab": "messages", "shop": shop, "show": !!shop })} <main class="flex-1 bg-[#050505] flex flex-col min-w-0 overflow-hidden"> ${renderComponent($$result2, "ChatCenter", null, { "client:only": "react", "client:component-hydration": "only", "client:component-path": "/Users/natthapongsuwanjit/Desktop/CashlessThailand/cashlessthailand/src/components/chat/ChatCenter.jsx", "client:component-export": "default" })} </main> </div> ` })} ${renderScript($$result, "/Users/natthapongsuwanjit/Desktop/CashlessThailand/cashlessthailand/src/pages/chat/index.astro?astro&type=script&index=0&lang.ts")}`;
}, "/Users/natthapongsuwanjit/Desktop/CashlessThailand/cashlessthailand/src/pages/chat/index.astro", void 0);

const $$file = "/Users/natthapongsuwanjit/Desktop/CashlessThailand/cashlessthailand/src/pages/chat/index.astro";
const $$url = "/chat";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
    __proto__: null,
    default: $$Index,
    file: $$file,
    url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
