import { e as createComponent, k as renderComponent, r as renderTemplate, m as maybeRenderHead } from '../../chunks/astro/server_Bu8JVBjn.mjs';
import 'piccolore';
import { $ as $$Layout } from '../../chunks/Layout_BPO4vhqY.mjs';
import { $ as $$Navbar } from '../../chunks/Navbar_BK4zBr0V.mjs';
import { $ as $$Footer } from '../../chunks/Footer_BDifea0a.mjs';
export { renderers } from '../../renderers.mjs';

const $$Privacy = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "Privacy Policy | Cashless Thailand" }, { "default": ($$result2) => renderTemplate` ${renderComponent($$result2, "Navbar", $$Navbar, {})} ${maybeRenderHead()}<main class="bg-[#050505] min-h-screen pt-40 pb-20 px-6"> <div class="max-w-4xl mx-auto"> <h1 class="text-4xl md:text-5xl font-black text-white mb-12 uppercase tracking-tighter">
Privacy <span class="text-[#D4AF37]">Policy</span> </h1> <div class="prose prose-invert prose-lg max-w-none text-white/80"> <p>
Your privacy is critically important to us. At Cashless
                    Thailand, we have a few fundamental principles:
</p> <ul> <li>
We don’t ask you for personal information unless we
                        truly need it (e.g., for shipping).
</li> <li>
We don’t share your personal information with anyone
                        except to comply with the law, develop our products, or
                        protect our rights.
</li> <li>
We don’t store personal information on our servers
                        unless required for the on-going operation of one of our
                        services.
</li> </ul> <h3>1. Information We Collect</h3> <p> <strong>Order Information:</strong> When you purchase a product,
                    we ask for your name, shipping address, email address, and phone
                    number. This is solely for fulfilling your order and sending tracking
                    updates.
</p> <p> <strong>Payment Information:</strong> We do NOT store your credit
                    card information. Crypto payments are processed via decentralized
                    protocols or secure processors that do not require account registration.
</p> <h3>2. How We Use Your Information</h3> <p>
We use the order information that we collect generally to
                    fulfill any orders placed through the Site (including
                    processing your payment information, arranging for shipping,
                    and providing you with invoices and/or order confirmations).
</p> <h3>3. Data Retention</h3> <p>
When you place an order through the Site, we will maintain
                    your Order Information for our records unless and until you
                    ask us to delete this information. You can request deletion
                    of your data at any time by contacting support@cashless.th.
</p> <h3>4. Cookies</h3> <p>
We use minimal cookies purely for the functionality of the
                    shopping cart and checkout process. We do not use
                    third-party tracking cookies for advertising.
</p> </div> </div> </main> ${renderComponent($$result2, "Footer", $$Footer, {})} ` })}`;
}, "/Users/natthapongsuwanjit/Desktop/CashlessThailand/cashlessthailand/src/pages/policies/privacy.astro", void 0);

const $$file = "/Users/natthapongsuwanjit/Desktop/CashlessThailand/cashlessthailand/src/pages/policies/privacy.astro";
const $$url = "/policies/privacy";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
    __proto__: null,
    default: $$Privacy,
    file: $$file,
    url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
