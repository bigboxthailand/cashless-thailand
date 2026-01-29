import { e as createComponent, k as renderComponent, r as renderTemplate, m as maybeRenderHead } from '../../chunks/astro/server_Bu8JVBjn.mjs';
import 'piccolore';
import { $ as $$Layout, a as $$Navbar } from '../../chunks/Navbar_DWavSQqS.mjs';
import { $ as $$Footer } from '../../chunks/Footer_BP6qeS3w.mjs';
export { renderers } from '../../renderers.mjs';

const $$Terms = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "Terms of Service | Cashless Thailand" }, { "default": ($$result2) => renderTemplate` ${renderComponent($$result2, "Navbar", $$Navbar, {})} ${maybeRenderHead()}<main class="bg-[#050505] min-h-screen pt-40 pb-20 px-6"> <div class="max-w-4xl mx-auto"> <h1 class="text-4xl md:text-5xl font-black text-white mb-12 uppercase tracking-tighter">
Terms of <span class="text-[#D4AF37]">Service</span> </h1> <div class="prose prose-invert prose-lg max-w-none text-white/80"> <h3>1. Overview</h3> <p>
This website is operated by Cashless Thailand. Throughout
                    the site, the terms "we", "us" and "our" refer to Cashless
                    Thailand. We offer this website, including all information,
                    tools, and services available from this site to you, the
                    user, conditioned upon your acceptance of all terms,
                    conditions, policies, and notices stated here.
</p> <h3>2. Products & Pricing</h3> <p>
Prices for our products are subject to change without
                    notice. We guarantee the authenticity of all hardware
                    wallets we sell; we are authorized resellers for the brands
                    listed on our site.
</p> <h3>3. Crypto Payments</h3> <p>
We accept Bitcoin (On-chain & Lightning Network). Due to the
                    volatility of cryptocurrency markets, the rate is fixed only
                    for the duration of the payment window (usually 15 minutes).
                    If payment is not received within this window, the order may
                    be cancelled or recalculated.
</p> <p class="text-[#D4AF37]">
Transactions on the blockchain are irreversible. Please
                    ensure you are sending to the correct address/invoice. We
                    are not responsible for funds sent to incorrect addresses.
</p> <h3>4. Educational Content</h3> <p>
All content provided on this site (course materials, blogs,
                    guides) is for educational purposes only and should not be
                    construed as financial advice. Cryptocurrency investments
                    carry inherent risks.
</p> <h3>5. Governing Law</h3> <p>
These Terms of Service and any separate agreements whereby
                    we provide you Services shall be governed by and construed
                    in accordance with the laws of Thailand.
</p> </div> </div> </main> ${renderComponent($$result2, "Footer", $$Footer, {})} ` })}`;
}, "/Users/natthapongsuwanjit/Desktop/CashlessThailand/cashlessthailand/src/pages/policies/terms.astro", void 0);

const $$file = "/Users/natthapongsuwanjit/Desktop/CashlessThailand/cashlessthailand/src/pages/policies/terms.astro";
const $$url = "/policies/terms";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
    __proto__: null,
    default: $$Terms,
    file: $$file,
    url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
