import { e as createComponent, k as renderComponent, r as renderTemplate, m as maybeRenderHead } from '../../chunks/astro/server_Bu8JVBjn.mjs';
import 'piccolore';
import { $ as $$Layout } from '../../chunks/Layout_BPO4vhqY.mjs';
import { $ as $$Navbar } from '../../chunks/Navbar_BK4zBr0V.mjs';
import { $ as $$Footer } from '../../chunks/Footer_BDifea0a.mjs';
export { renderers } from '../../renderers.mjs';

const $$SelfCustody = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "Self-Custody Guide | Cashless Thailand" }, { "default": ($$result2) => renderTemplate` ${renderComponent($$result2, "Navbar", $$Navbar, {})} ${maybeRenderHead()}<main class="bg-[#050505] min-h-screen pt-40 pb-20 px-6 flex items-center justify-center"> <div class="text-center"> <h1 class="text-4xl md:text-6xl font-black text-white mb-6 uppercase tracking-tighter">
Self-Custody <span class="text-[#D4AF37]">Guide</span> </h1> <p class="text-white/60 text-lg">coming soon...</p> </div> </main> ${renderComponent($$result2, "Footer", $$Footer, {})} ` })}`;
}, "/Users/natthapongsuwanjit/Desktop/CashlessThailand/cashlessthailand/src/pages/learn/self-custody.astro", void 0);

const $$file = "/Users/natthapongsuwanjit/Desktop/CashlessThailand/cashlessthailand/src/pages/learn/self-custody.astro";
const $$url = "/learn/self-custody";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
    __proto__: null,
    default: $$SelfCustody,
    file: $$file,
    url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
