import { e as createComponent, f as createAstro, k as renderComponent, l as renderScript, r as renderTemplate, m as maybeRenderHead, h as addAttribute } from '../../chunks/astro/server_Bu8JVBjn.mjs';
import 'piccolore';
import { $ as $$Layout, a as $$Navbar } from '../../chunks/Navbar_DWavSQqS.mjs';
import { $ as $$SellerSidebar } from '../../chunks/SellerSidebar_BcSYC2A9.mjs';
import { createClient } from '@supabase/supabase-js';
export { renderers } from '../../renderers.mjs';

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
  let shop = null;
  if (session?.user) {
    const { data } = await supabase.from("shops").select("*").eq("owner_id", session.user.id).single();
    shop = data;
    if (shop && shop.status !== "active") {
      return Astro2.redirect("/seller/pending");
    }
  }
  let stats = {
    total_sales: 0,
    pending_payouts: 0,
    paid_payouts: 0,
    available_balance: 0
  };
  let payouts = [];
  if (shop) {
    const { data: financeData } = await supabase.from("shop_finance_view").select("*").eq("shop_id", shop.id).single();
    if (financeData) {
      stats.total_sales = financeData.total_sales || 0;
      stats.pending_payouts = financeData.pending_payouts || 0;
      stats.paid_payouts = financeData.paid_payouts || 0;
      stats.available_balance = stats.total_sales - (stats.pending_payouts + stats.paid_payouts);
    }
    const { data: payoutsData } = await supabase.from("payouts").select("*").eq("shop_id", shop.id).order("created_at", { ascending: false });
    payouts = payoutsData || [];
  }
  const thb = new Intl.NumberFormat("th-TH", {
    style: "currency",
    currency: "THB"
  });
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "Seller Wallet" }, { "default": async ($$result2) => renderTemplate` ${renderComponent($$result2, "Navbar", $$Navbar, {})}  ${maybeRenderHead()}<div id="wallet-loading" style="display: none;" class="fixed inset-0 bg-[#050505] z-50 flex items-center justify-center pointer-events-none"> <div class="text-center"> <div class="w-16 h-16 border-4 border-[#D4AF37]/20 border-t-[#D4AF37] rounded-full animate-spin mx-auto mb-4"></div> <p class="text-white/60 text-sm">Loading Wallet...</p> </div> </div> <div class="flex h-screen bg-[#050505] overflow-hidden pt-24"> ${renderComponent($$result2, "SellerSidebar", $$SellerSidebar, { "activeTab": "wallet", "shop": shop })} <main class="flex-1 overflow-y-auto bg-[#050505]"> <!-- Mobile Header --> <div class="md:hidden p-4 border-b border-white/10 flex justify-between items-center bg-[#111]"> <span class="text-[#D4AF37] font-black uppercase">Wallet & Payout</span> <a href="/seller/dashboard" class="text-xs text-white/60">Back</a> </div> <div class="p-4 md:p-8 max-w-5xl mx-auto space-y-8"> <header class="hidden md:block"> <h1 class="text-3xl font-black text-white uppercase tracking-wider">
My Wallet
</h1> <p class="text-white/50" id="wallet-shop-name"> ${shop?.name || "Loading..."} </p> </header> <!-- Stats Cards --> <div class="grid grid-cols-1 md:grid-cols-3 gap-6"> <!-- Available Balance --> <div class="p-6 rounded-2xl bg-gradient-to-br from-[#D4AF37]/20 to-black border border-[#D4AF37]/30"> <h3 class="text-[#D4AF37] uppercase text-xs font-bold tracking-widest mb-2">
Available Balance
</h3> <p class="text-4xl font-black text-white" id="stat-balance"> ${thb.format(stats.available_balance)} </p> <p class="text-xs text-white/40 mt-2">
Ready to withdraw
</p> </div> <!-- Total Sales --> <div class="p-6 rounded-2xl bg-[#111] border border-white/10"> <h3 class="text-white/50 uppercase text-xs font-bold tracking-widest mb-2">
Total Earnings
</h3> <p class="text-3xl font-bold text-white" id="stat-earnings"> ${thb.format(stats.total_sales)} </p> <p class="text-xs text-white/40 mt-2">
Gross Revenue (Paid Orders)
</p> </div> <!-- Pending --> <div class="p-6 rounded-2xl bg-[#111] border border-white/10"> <h3 class="text-white/50 uppercase text-xs font-bold tracking-widest mb-2">
Pending Payout
</h3> <p class="text-3xl font-bold text-orange-400" id="stat-pending"> ${thb.format(stats.pending_payouts)} </p> <p class="text-xs text-white/40 mt-2">Processing</p> </div> </div> <div class="grid lg:grid-cols-2 gap-8"> <!-- Request Form --> <div class="bg-[#111] p-8 rounded-2xl border border-white/10"> <h2 class="text-xl font-bold text-white mb-6">
Request Payout
</h2> <form id="payout-form" class="space-y-4"${addAttribute(shop?.id, "data-shop-id")}> <div> <label class="block text-xs uppercase font-bold text-white/50 mb-2">Amount (THB)</label> <input type="number" name="amount" min="100"${addAttribute(stats.available_balance, "max")} placeholder="Min 100 THB" class="w-full bg-black border border-white/10 p-3 rounded-xl text-white outline-none focus:border-[#D4AF37]" required> <p class="text-xs text-white/30 mt-1">
Maximum: ${stats.available_balance} THB
</p> </div> <div> <label class="block text-xs uppercase font-bold text-white/50 mb-2">Bank Details</label> <textarea name="bank_info" rows="3" placeholder="Bank Name, Account Number, Account Name" class="w-full bg-black border border-white/10 p-3 rounded-xl text-white outline-none focus:border-[#D4AF37]" required></textarea> </div> <button type="submit" class="w-full py-3 bg-[#D4AF37] text-black font-bold uppercase tracking-wider rounded-xl hover:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed">
Submit Request
</button> </form> </div> <!-- History --> <div class="bg-[#111] p-8 rounded-2xl border border-white/10"> <h2 class="text-xl font-bold text-white mb-6">
Payout History
</h2> <div id="payout-history-list" class="space-y-4 max-h-[400px] overflow-y-auto pr-2"> ${(payouts || []).map((payout) => renderTemplate`<div class="flex items-center justify-between p-4 bg-white/5 rounded-xl"> <div> <p class="font-bold text-white"> ${thb.format(payout.amount)} </p> <p class="text-xs text-white/40"> ${new Date(
    payout.created_at
  ).toLocaleDateString()} </p> </div> <div> <span${addAttribute(`px-3 py-1 rounded-full text-[10px] uppercase font-black tracking-wider 
                                        ${payout.status === "paid" ? "bg-green-500/20 text-green-400" : payout.status === "rejected" ? "bg-red-500/20 text-red-400" : "bg-orange-500/20 text-orange-400"}`, "class")}> ${payout.status} </span> </div> </div>`)} </div> </div> </div> </div> </main> </div> ` })} ${renderScript($$result, "/Users/natthapongsuwanjit/Desktop/CashlessThailand/cashlessthailand/src/pages/seller/wallet.astro?astro&type=script&index=0&lang.ts")}`;
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
