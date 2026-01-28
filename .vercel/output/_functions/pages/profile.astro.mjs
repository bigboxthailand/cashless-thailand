import { e as createComponent, k as renderComponent, l as renderScript, r as renderTemplate, m as maybeRenderHead } from '../chunks/astro/server_Bu8JVBjn.mjs';
import 'piccolore';
import { $ as $$Layout } from '../chunks/Layout_BPO4vhqY.mjs';
import { $ as $$Navbar } from '../chunks/Navbar_BK4zBr0V.mjs';
import { $ as $$Footer } from '../chunks/Footer_BDifea0a.mjs';
export { renderers } from '../renderers.mjs';

const $$Profile = createComponent(async ($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "My Profile | Cashless Thailand" }, { "default": async ($$result2) => renderTemplate` ${renderComponent($$result2, "Navbar", $$Navbar, {})} ${maybeRenderHead()}<main class="bg-[#050505] min-h-screen pt-40 pb-20 px-6"> <div class="max-w-6xl mx-auto"> ${renderComponent($$result2, "UserProfile", null, { "client:only": "react", "client:component-hydration": "only", "client:component-path": "/Users/natthapongsuwanjit/Desktop/CashlessThailand/cashlessthailand/src/components/UserProfile.jsx", "client:component-export": "default" })} </div> </main> ${renderComponent($$result2, "Footer", $$Footer, {})} ` })} ${renderScript($$result, "/Users/natthapongsuwanjit/Desktop/CashlessThailand/cashlessthailand/src/pages/profile.astro?astro&type=script&index=0&lang.ts")}`;
}, "/Users/natthapongsuwanjit/Desktop/CashlessThailand/cashlessthailand/src/pages/profile.astro", void 0);

const $$file = "/Users/natthapongsuwanjit/Desktop/CashlessThailand/cashlessthailand/src/pages/profile.astro";
const $$url = "/profile";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
    __proto__: null,
    default: $$Profile,
    file: $$file,
    url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
