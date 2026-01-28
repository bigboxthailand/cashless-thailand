import { e as createComponent, k as renderComponent, r as renderTemplate, m as maybeRenderHead } from '../chunks/astro/server_Bu8JVBjn.mjs';
import 'piccolore';
import { $ as $$Layout } from '../chunks/Layout_BPO4vhqY.mjs';
import { $ as $$Navbar } from '../chunks/Navbar_BK4zBr0V.mjs';
import { $ as $$Footer } from '../chunks/Footer_BDifea0a.mjs';
export { renderers } from '../renderers.mjs';

const $$404 = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "404 - Page Not Found | Cashless Thailand" }, { "default": ($$result2) => renderTemplate` ${renderComponent($$result2, "Navbar", $$Navbar, {})} ${maybeRenderHead()}<main class="bg-[#050505] min-h-screen flex items-center justify-center relative overflow-hidden px-6"> <!-- Decor Elements --> <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#D4AF37]/5 blur-[120px] rounded-full pointer-events-none"></div> <div class="text-center relative z-10 space-y-8"> <h1 class="text-[120px] md:text-[200px] font-black text-white/5 leading-none select-none">
404
</h1> <div class="-mt-20 md:-mt-32"> <h2 class="text-3xl md:text-5xl font-black text-white uppercase tracking-tight mb-4">
Page Not Found
</h2> <p class="text-white/60 text-lg max-w-md mx-auto mb-8">
The page you are looking for does not exist or has been
                    moved.
</p> <a href="/" class="inline-block px-8 py-4 bg-[#D4AF37] text-black font-bold uppercase tracking-widest rounded-full hover:bg-white transition-colors">
Back to Home
</a> </div> </div> </main> ${renderComponent($$result2, "Footer", $$Footer, {})} ` })}`;
}, "/Users/natthapongsuwanjit/Desktop/CashlessThailand/cashlessthailand/src/pages/404.astro", void 0);

const $$file = "/Users/natthapongsuwanjit/Desktop/CashlessThailand/cashlessthailand/src/pages/404.astro";
const $$url = "/404";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
    __proto__: null,
    default: $$404,
    file: $$file,
    url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
