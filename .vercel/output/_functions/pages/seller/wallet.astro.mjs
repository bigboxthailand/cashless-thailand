import { e as createComponent, f as createAstro, r as renderTemplate, n as defineScriptVars, l as renderScript, k as renderComponent, m as maybeRenderHead, h as addAttribute } from '../../chunks/astro/server_Bu8JVBjn.mjs';
import 'piccolore';
import { $ as $$Layout } from '../../chunks/Layout_BPO4vhqY.mjs';
import { $ as $$Navbar } from '../../chunks/Navbar_BK4zBr0V.mjs';
import { $ as $$Footer } from '../../chunks/Footer_BDifea0a.mjs';
import { createClient } from '@supabase/supabase-js';
export { renderers } from '../../renderers.mjs';

var __freeze = Object.freeze;
var __defProp = Object.defineProperty;
var __template = (cooked, raw) => __freeze(__defProp(cooked, "raw", { value: __freeze(cooked.slice()) }));
var _a;
const $$Astro = createAstro();
const $$Wallet = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Wallet;
  const supabase = createClient(
    "https://euavftppzicwjhbugiys.supabase.co",
    "sb_publishable_poJ-NobQZpARz_G4cWG96Q_vxIPZkrE"
  );
  const {
    data: { session }
  } = await supabase.auth.getSession();
  if (!session) return Astro2.redirect("/login");
  const { data: shop } = await supabase.from("shops").select("id, name").eq("owner_id", session.user.id).single();
  if (!shop) return Astro2.redirect("/seller/register");
  let stats = {
    total_sales: 0,
    pending_payouts: 0,
    paid_payouts: 0,
    available_balance: 0
  };
  const { data: financeData, error: viewError } = await supabase.from("shop_finance_view").select("*").eq("shop_id", shop.id).single();
  if (financeData) {
    stats.total_sales = financeData.total_sales || 0;
    stats.pending_payouts = financeData.pending_payouts || 0;
    stats.paid_payouts = financeData.paid_payouts || 0;
    stats.available_balance = stats.total_sales - (stats.pending_payouts + stats.paid_payouts);
  }
  const { data: payouts } = await supabase.from("payouts").select("*").eq("shop_id", shop.id).order("created_at", { ascending: false });
  const thb = new Intl.NumberFormat("th-TH", {
    style: "currency",
    currency: "THB"
  });
  return renderTemplate(_a || (_a = __template(["", " ", "  <script>(function(){", '\n    import { createClient } from "@supabase/supabase-js";\n    const supabase = createClient(\n        import.meta.env.PUBLIC_SUPABASE_URL,\n        import.meta.env.PUBLIC_SUPABASE_ANON_KEY,\n    );\n\n    const form = document.getElementById("payout-form");\n    form?.addEventListener("submit", async (e) => {\n        e.preventDefault();\n        const btn = form.querySelector("button");\n        if (btn) {\n            btn.disabled = true;\n            btn.innerText = "Submitting...";\n        }\n\n        const formData = new FormData(e.target);\n        const amount = parseFloat(formData.get("amount").toString());\n        const bankInfo = { details: formData.get("bank_info") };\n\n        const { error } = await supabase.from("payouts").insert({\n            shop_id: initialShopId,\n            amount: amount,\n            bank_info: bankInfo,\n            status: "pending",\n        });\n\n        if (error) {\n            alert("Request failed: " + error.message);\n            if (btn) {\n                btn.disabled = false;\n                btn.innerText = "Submit Request";\n            }\n        } else {\n            alert("Payout requested successfully!");\n            window.location.reload();\n        }\n    });\n})();</script>'])), renderComponent($$result, "Layout", $$Layout, { "title": "Seller Wallet" }, { "default": async ($$result2) => renderTemplate` ${renderComponent($$result2, "Navbar", $$Navbar, {})} ${maybeRenderHead()}<main class="min-h-screen bg-[#050505] pt-32 pb-20 px-6"> <div class="max-w-5xl mx-auto space-y-8"> <header class="flex justify-between items-center"> <div> <h1 class="text-3xl font-black text-white uppercase tracking-wider">
My Wallet
</h1> <p class="text-white/50">${shop.name}</p> </div> </header>  <div class="grid grid-cols-1 md:grid-cols-3 gap-6">  <div class="p-6 rounded-2xl bg-gradient-to-br from-[#D4AF37]/20 to-black border border-[#D4AF37]/30"> <h3 class="text-[#D4AF37] uppercase text-xs font-bold tracking-widest mb-2">
Available Balance
</h3> <p class="text-4xl font-black text-white"> ${thb.format(stats.available_balance)} </p> <p class="text-xs text-white/40 mt-2">Ready to withdraw</p> </div>  <div class="p-6 rounded-2xl bg-[#111] border border-white/10"> <h3 class="text-white/50 uppercase text-xs font-bold tracking-widest mb-2">
Total Earnings
</h3> <p class="text-3xl font-bold text-white"> ${thb.format(stats.total_sales)} </p> <p class="text-xs text-white/40 mt-2">
Gross Revenue (Paid Orders)
</p> </div>  <div class="p-6 rounded-2xl bg-[#111] border border-white/10"> <h3 class="text-white/50 uppercase text-xs font-bold tracking-widest mb-2">
Pending Payout
</h3> <p class="text-3xl font-bold text-orange-400"> ${thb.format(stats.pending_payouts)} </p> <p class="text-xs text-white/40 mt-2">Processing</p> </div> </div>  <div class="grid lg:grid-cols-2 gap-8">  <div class="bg-[#111] p-8 rounded-2xl border border-white/10"> <h2 class="text-xl font-bold text-white mb-6">
Request Payout
</h2> <form id="payout-form" class="space-y-4"> <div> <label class="block text-xs uppercase font-bold text-white/50 mb-2">Amount (THB)</label> <input type="number" name="amount" min="100"${addAttribute(stats.available_balance, "max")} placeholder="Min 100 THB" class="w-full bg-black border border-white/10 p-3 rounded-xl text-white outline-none focus:border-[#D4AF37]" required> <p class="text-xs text-white/30 mt-1">
Maximum: ${stats.available_balance} THB
</p> </div> <div> <label class="block text-xs uppercase font-bold text-white/50 mb-2">Bank Details</label> <textarea name="bank_info" rows="3" placeholder="Bank Name, Account Number, Account Name" class="w-full bg-black border border-white/10 p-3 rounded-xl text-white outline-none focus:border-[#D4AF37]" required></textarea> </div> <button type="submit" class="w-full py-3 bg-[#D4AF37] text-black font-bold uppercase tracking-wider rounded-xl hover:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed">
Submit Request
</button> </form> </div>  <div class="bg-[#111] p-8 rounded-2xl border border-white/10"> <h2 class="text-xl font-bold text-white mb-6">
Payout History
</h2> <div class="space-y-4 max-h-[400px] overflow-y-auto pr-2"> ${(payouts || []).map((payout) => renderTemplate`<div class="flex items-center justify-between p-4 bg-white/5 rounded-xl"> <div> <p class="font-bold text-white"> ${thb.format(payout.amount)} </p> <p class="text-xs text-white/40"> ${new Date(
    payout.created_at
  ).toLocaleDateString()} </p> </div> <div> <span${addAttribute(`px-3 py-1 rounded-full text-[10px] uppercase font-black tracking-wider 
                                        ${payout.status === "paid" ? "bg-green-500/20 text-green-400" : payout.status === "rejected" ? "bg-red-500/20 text-red-400" : "bg-orange-500/20 text-orange-400"}`, "class")}> ${payout.status} </span> </div> </div>`)} </div> </div> </div> </div> </main> ${renderComponent($$result2, "Footer", $$Footer, {})} ` }), renderScript($$result, "/Users/natthapongsuwanjit/Desktop/CashlessThailand/cashlessthailand/src/pages/seller/wallet.astro?astro&type=script&index=0&lang.ts"), defineScriptVars({ initialShopId: shop.id }));
}, "/Users/natthapongsuwanjit/Desktop/CashlessThailand/cashlessthailand/src/pages/seller/wallet.astro", void 0);
const $$file = "/Users/natthapongsuwanjit/Desktop/CashlessThailand/cashlessthailand/src/pages/seller/wallet.astro";
const $$url = "/seller/wallet";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
    __proto__: null,
    default: $$Wallet,
    file: $$file,
    url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
