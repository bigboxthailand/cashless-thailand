import { e as createComponent, k as renderComponent, r as renderTemplate, m as maybeRenderHead } from '../../chunks/astro/server_Bu8JVBjn.mjs';
import 'piccolore';
import { $ as $$Layout } from '../../chunks/Layout_BPO4vhqY.mjs';
import { $ as $$Navbar } from '../../chunks/Navbar_BK4zBr0V.mjs';
import { $ as $$Footer } from '../../chunks/Footer_BDifea0a.mjs';
export { renderers } from '../../renderers.mjs';

const $$Shipping = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "Shipping Policy | Cashless Thailand" }, { "default": ($$result2) => renderTemplate` ${renderComponent($$result2, "Navbar", $$Navbar, {})} ${maybeRenderHead()}<main class="bg-[#050505] min-h-screen pt-40 pb-20 px-6"> <div class="max-w-4xl mx-auto"> <h1 class="text-4xl md:text-5xl font-black text-white mb-12 uppercase tracking-tighter">
Shipping <span class="text-[#D4AF37]">Policy</span> </h1> <div class="prose prose-invert prose-lg max-w-none text-white/80"> <h3>Delivery Times</h3> <ul> <li> <strong>Bangkok & Metropolitan Areas:</strong> 1-2 business
                        days.
</li> <li> <strong>Other Provinces:</strong> 2-3 business days.
</li> <li><strong>Remote Areas:</strong> 3-4 business days.</li> </ul> <h3>Shipping Partners</h3> <p>
We primarily ship via <strong>Kerry Express</strong> and <strong>Flash Express</strong> to ensure fast and trackable delivery across Thailand. For high-value
                    items, we purchase additional insurance to cover the full value
                    of the product.
</p> <h3>Shipping Costs</h3> <p>
- Free shipping for orders over 2,000 THB.<br>
- Flat rate of 50 THB for orders under 2,000 THB.
</p> <h3>Order Processing</h3> <p>
Orders placed before 12:00 PM (GMT+7) are typically
                    processed and dispatched the same day. Orders placed after
                    this time or on weekends/public holidays will be dispatched
                    the next business day.
</p> <h3>International Shipping</h3> <p>
Currently, we only ship within Thailand. For international
                    inquiries, please contact us directly.
</p> </div> </div> </main> ${renderComponent($$result2, "Footer", $$Footer, {})} ` })}`;
}, "/Users/natthapongsuwanjit/Desktop/CashlessThailand/cashlessthailand/src/pages/policies/shipping.astro", void 0);

const $$file = "/Users/natthapongsuwanjit/Desktop/CashlessThailand/cashlessthailand/src/pages/policies/shipping.astro";
const $$url = "/policies/shipping";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
    __proto__: null,
    default: $$Shipping,
    file: $$file,
    url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
