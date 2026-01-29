import { e as createComponent, k as renderComponent, l as renderScript, r as renderTemplate, m as maybeRenderHead } from '../../chunks/astro/server_Bu8JVBjn.mjs';
import 'piccolore';
import { $ as $$Layout, a as $$Navbar } from '../../chunks/Navbar_DWavSQqS.mjs';
import { $ as $$Footer } from '../../chunks/Footer_BP6qeS3w.mjs';
export { renderers } from '../../renderers.mjs';

const $$Register = createComponent(async ($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "Register Shop | Cashless Thailand" }, { "default": async ($$result2) => renderTemplate` ${renderComponent($$result2, "Navbar", $$Navbar, {})} ${maybeRenderHead()}<main class="min-h-screen bg-[#050505] pt-40 pb-20 px-6 relative overflow-hidden"> <!-- Background Decor --> <div class="absolute top-0 left-1/4 w-[500px] h-[500px] bg-[#D4AF37]/5 rounded-full blur-[120px] pointer-events-none"></div> <!-- Auth check will be done by form submission --> <div class="max-w-xl mx-auto relative z-10"> <div class="text-center mb-12"> <span class="text-[#D4AF37] text-xs font-black uppercase tracking-[0.2em] mb-2 block animate-fade-in">Join the Marketplace</span> <h1 class="text-4xl md:text-5xl font-black text-white uppercase tracking-tighter mb-4 animate-fade-in-up">
Start Selling<br>With <span class="text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] to-[#8a7020]">Cashless</span> </h1> <p class="text-white/40 max-w-md mx-auto animate-fade-in-up delay-100">
Create your store, list your products, and accept Crypto
                    payments instantly.
</p> </div> <div class="bg-[#111]/80 backdrop-blur-xl border border-white/10 rounded-3xl p-8 md:p-10 shadow-[0_0_50px_rgba(212,175,55,0.1)] animate-fade-in-up delay-200"> <form id="register-shop-form" class="space-y-6"> <div class="space-y-2"> <label class="text-[10px] font-bold text-white/40 uppercase tracking-widest">Shop Name <span class="text-red-500">*</span></label> <input type="text" name="name" required placeholder="e.g. Cyber Punk Store" class="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-4 text-white focus:border-[#D4AF37] focus:bg-black outline-none transition-all font-bold placeholder:font-normal"> <p class="text-[10px] text-white/20">
This will be your store URL: /shop/<span id="url-preview" class="text-[#D4AF37]">...</span> </p> </div> <div class="space-y-2"> <label class="text-[10px] font-bold text-white/40 uppercase tracking-widest">Description</label> <textarea name="description" rows="4" placeholder="Tell customers what you sell..." class="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-4 text-white focus:border-[#D4AF37] focus:bg-black outline-none transition-all resize-none"></textarea> </div> <!-- Payment Methods Section --> <div class="space-y-4 pt-4 border-t border-white/10"> <div class="flex items-center gap-2 mb-2"> <span class="text-sm font-bold text-white/60">💰</span> <h3 class="text-sm font-bold text-white/60 uppercase tracking-widest">
Payment Methods (Optional)
</h3> </div> <p class="text-xs text-white/40 -mt-2">
Add payment details to receive payouts from admin
</p> <!-- PromptPay Field --> <div class="space-y-2"> <label class="text-[10px] font-bold text-white/40 uppercase tracking-widest flex items-center gap-2"> <span>🇹🇭</span> PromptPay ID
</label> <input type="text" name="promptpay_id" id="promptpay-input" placeholder="เบอร์โทร (10 หลัก) หรือ เลขบัตรประชาชน (13 หลัก)" pattern="[0-9]{10}|[0-9]{13}" class="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-[#D4AF37] focus:bg-black outline-none transition-all placeholder:text-white/20"> <p class="text-[10px] text-white/30">
ตัวอย่าง: 0812345678 หรือ 1234567890123
</p> </div> <!-- Lightning Address Field --> <div class="space-y-2"> <label class="text-[10px] font-bold text-white/40 uppercase tracking-widest flex items-center gap-2"> <span>⚡</span> Lightning Wallet Address
</label> <input type="text" name="lightning_address" placeholder="yourname@getalby.com or lnbc1..." class="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-[#D4AF37] focus:bg-black outline-none transition-all placeholder:text-white/20 font-mono text-sm"> <p class="text-[10px] text-white/30">
Lightning Address or Invoice Address
</p> </div> </div> <div class="pt-4"> <button type="submit" class="w-full bg-[#D4AF37] text-black font-black uppercase tracking-widest py-4 rounded-xl hover:bg-[#b89530] transition-all shadow-[0_0_30px_rgba(212,175,55,0.3)] hover:shadow-[0_0_50px_rgba(212,175,55,0.5)] transform hover:-translate-y-1">
Create My Shop
</button> <p class="text-center text-[10px] text-white/30 mt-4">
By creating a shop, you agree to our <a href="#" class="text-[#D4AF37] hover:underline">Seller Terms</a>.
</p> </div> </form> </div> </div> </main> ${renderComponent($$result2, "Footer", $$Footer, {})} ` })} ${renderScript($$result, "/Users/natthapongsuwanjit/Desktop/CashlessThailand/cashlessthailand/src/pages/seller/register.astro?astro&type=script&index=0&lang.ts")} ${renderScript($$result, "/Users/natthapongsuwanjit/Desktop/CashlessThailand/cashlessthailand/src/pages/seller/register.astro?astro&type=script&index=1&lang.ts")}`;
}, "/Users/natthapongsuwanjit/Desktop/CashlessThailand/cashlessthailand/src/pages/seller/register.astro", void 0);

const $$file = "/Users/natthapongsuwanjit/Desktop/CashlessThailand/cashlessthailand/src/pages/seller/register.astro";
const $$url = "/seller/register";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
    __proto__: null,
    default: $$Register,
    file: $$file,
    url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
