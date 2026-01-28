import { e as createComponent, k as renderComponent, r as renderTemplate, m as maybeRenderHead } from '../chunks/astro/server_Bu8JVBjn.mjs';
import 'piccolore';
import { $ as $$Layout } from '../chunks/Layout_BPO4vhqY.mjs';
import { $ as $$Navbar } from '../chunks/Navbar_BK4zBr0V.mjs';
import { $ as $$Footer } from '../chunks/Footer_BDifea0a.mjs';
/* empty css                                    */
export { renderers } from '../renderers.mjs';

const $$Articles = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "Blog Coming Soon | Cashless Thailand", "data-astro-cid-xvukugm6": true }, { "default": ($$result2) => renderTemplate` ${renderComponent($$result2, "Navbar", $$Navbar, { "data-astro-cid-xvukugm6": true })} ${maybeRenderHead()}<main class="relative z-10 bg-[#050505] min-h-screen flex items-center justify-center overflow-hidden" data-astro-cid-xvukugm6> <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#D4AF37]/5 blur-[120px] rounded-full pointer-events-none" data-astro-cid-xvukugm6></div> <div class="relative z-10 text-center flex flex-col items-center gap-8 px-6" data-astro-cid-xvukugm6> <div class="relative" data-astro-cid-xvukugm6> <div class="w-24 h-24 border border-[#D4AF37]/20 rounded-full flex items-center justify-center animate-spin-slow" data-astro-cid-xvukugm6> <div class="w-20 h-20 border-t border-[#D4AF37] rounded-full" data-astro-cid-xvukugm6></div> </div> <div class="absolute inset-0 flex items-center justify-center" data-astro-cid-xvukugm6> <span class="text-3xl" data-astro-cid-xvukugm6>✍️</span> </div> </div> <div class="space-y-4" data-astro-cid-xvukugm6> <h1 class="text-5xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-b from-[#D4AF37] to-[#8B6914] uppercase tracking-tighter leading-none" data-astro-cid-xvukugm6>
Blog <br data-astro-cid-xvukugm6> Coming Soon
</h1> <p class="text-white/40 text-lg font-light max-w-md mx-auto leading-relaxed" data-astro-cid-xvukugm6>
บทความความรู้เกี่ยวกับ Bitcoin และ Freedom Technology กำลังมาเร็วๆ นี้
</p> </div> <a href="/" class="px-8 py-3 border border-white/10 rounded-full text-xs font-bold uppercase tracking-widest hover:border-[#D4AF37] hover:text-[#D4AF37] transition-all" data-astro-cid-xvukugm6>Back to Home</a> </div> </main> ${renderComponent($$result2, "Footer", $$Footer, { "data-astro-cid-xvukugm6": true })} ` })} `;
}, "/Users/natthapongsuwanjit/Desktop/CashlessThailand/cashlessthailand/src/pages/articles.astro", void 0);

const $$file = "/Users/natthapongsuwanjit/Desktop/CashlessThailand/cashlessthailand/src/pages/articles.astro";
const $$url = "/articles";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
    __proto__: null,
    default: $$Articles,
    file: $$file,
    url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
