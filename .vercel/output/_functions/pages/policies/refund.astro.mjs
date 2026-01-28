import { e as createComponent, k as renderComponent, r as renderTemplate, m as maybeRenderHead } from '../../chunks/astro/server_Bu8JVBjn.mjs';
import 'piccolore';
import { $ as $$Layout } from '../../chunks/Layout_BPO4vhqY.mjs';
import { $ as $$Navbar } from '../../chunks/Navbar_BK4zBr0V.mjs';
import { $ as $$Footer } from '../../chunks/Footer_BDifea0a.mjs';
export { renderers } from '../../renderers.mjs';

const $$Refund = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "Refund Policy | Cashless Thailand" }, { "default": ($$result2) => renderTemplate` ${renderComponent($$result2, "Navbar", $$Navbar, {})} ${maybeRenderHead()}<main class="bg-[#050505] min-h-screen pt-40 pb-20 px-6"> <div class="max-w-4xl mx-auto"> <h1 class="text-4xl md:text-5xl font-black text-white mb-12 uppercase tracking-tighter">
Refund <span class="text-[#D4AF37]">Policy</span> </h1> <div class="prose prose-invert prose-lg max-w-none text-white/80"> <p>Last updated: January 2026</p> <h3>1. Returns</h3> <p>
We offer a 7-day return policy for most hardware products.
                    If 7 days have gone by since your purchase, unfortunately,
                    we cannot offer you a refund or exchange. To be eligible for
                    a return, your item must be unused, sealed in its original
                    packaging (tamper-evident seals must be intact for hardware
                    wallets), and in the same condition that you received it.
</p> <h3>2. Hardware Wallets & Security Devices</h3> <p class="text-[#D4AF37]">
IMPORTANT: For security reasons, we strictly do NOT accept
                    returns of Hardware Wallets (Trezor, Ledger, BitBox, etc.)
                    if the packaging has been opened or the tamper-evident seal
                    has been broken/removed.
</p> <h3>3. Defective Items</h3> <p>
If the item is defective or damaged upon arrival, please
                    contact us immediately at support@cashless.th with
                    photographic evidence. We will arrange for a replacement or
                    a full refund including shipping costs.
</p> <h3>4. Refunds (if applicable)</h3> <p>
Once your return is received and inspected, we will send you
                    an email to notify you that we have received your returned
                    item. We will also notify you of the approval or rejection
                    of your refund. If you are approved, then your refund will
                    be processed, and a credit will automatically be applied to
                    your original method of payment (bank transfer or
                    Bitcoin/Lightning) within a certain amount of days.
</p> <h3>5. Shipping Returns</h3> <p>
You will be responsible for paying for your own shipping
                    costs for returning your item, unless the return is due to
                    our error (defective or wrong item).
</p> </div> </div> </main> ${renderComponent($$result2, "Footer", $$Footer, {})} ` })}`;
}, "/Users/natthapongsuwanjit/Desktop/CashlessThailand/cashlessthailand/src/pages/policies/refund.astro", void 0);

const $$file = "/Users/natthapongsuwanjit/Desktop/CashlessThailand/cashlessthailand/src/pages/policies/refund.astro";
const $$url = "/policies/refund";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
    __proto__: null,
    default: $$Refund,
    file: $$file,
    url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
