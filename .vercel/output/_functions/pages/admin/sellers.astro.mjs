import { e as createComponent, k as renderComponent, l as renderScript, r as renderTemplate, m as maybeRenderHead, h as addAttribute } from '../../chunks/astro/server_Bu8JVBjn.mjs';
import 'piccolore';
import { $ as $$AdminLayout } from '../../chunks/AdminLayout_CY66lzGI.mjs';
import { createClient } from '@supabase/supabase-js';
export { renderers } from '../../renderers.mjs';

const $$Sellers = createComponent(async ($$result, $$props, $$slots) => {
  const supabase = createClient(
    "https://euavftppzicwjhbugiys.supabase.co",
    "sb_secret_pPB5HmRxQRJFK3k9JmrJFA_2NxQapaw"
  );
  const { data: shops, error } = await supabase.from("shops").select("*, profile:profiles(email, full_name, phone)").order("created_at", { ascending: false });
  const pendingShops = shops?.filter((s) => s.status === "pending") || [];
  const activeShops = shops?.filter((s) => s.status === "active") || [];
  const suspendedShops = shops?.filter((s) => s.status === "suspended") || [];
  return renderTemplate`${renderComponent($$result, "AdminLayout", $$AdminLayout, { "title": "Seller Moderation" }, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="space-y-8"> <div> <h1 class="text-3xl font-black text-white uppercase tracking-wider">
Seller Moderation
</h1> <p class="text-white/50 text-sm mt-1">
Manage shop approvals and bans
</p> </div>  <section class="bg-[#0A0A0A] border border-orange-500/30 rounded-xl p-6 relative overflow-hidden"> <div class="absolute top-0 right-0 p-4 opacity-10"> <svg xmlns="http://www.w3.org/2000/svg" class="w-32 h-32 text-orange-500" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"></path></svg> </div> <h2 class="text-xl font-bold text-orange-500 mb-6 flex items-center gap-2 relative z-10"> <span class="w-2 h-2 rounded-full bg-orange-500 animate-pulse"></span>
Pending Approval (${pendingShops.length})
</h2> <div class="grid gap-4 relative z-10"> ${pendingShops.length === 0 ? renderTemplate`<p class="text-white/30 italic">No pending requests.</p>` : pendingShops.map((shop) => renderTemplate`<div class="bg-white/5 border border-white/10 rounded-lg p-4 flex flex-col md:flex-row items-center justify-between gap-4"> <div class="flex items-center gap-4"> <div class="w-12 h-12 rounded-full bg-[#111] flex items-center justify-center border border-white/10"> ${shop.logo_url ? renderTemplate`<img${addAttribute(shop.logo_url, "src")} class="w-full h-full rounded-full object-cover">` : renderTemplate`<span class="text-white/50"> ${shop.name[0]} </span>`} </div> <div> <h3 class="font-bold text-white text-lg"> ${shop.name} </h3> <p class="text-white/50 text-xs">
Owner: ${shop.profile?.full_name} (
${shop.profile?.email})
</p> <p class="text-white/50 text-xs">
Slug:${" "} <span class="text-[#D4AF37]">
@${shop.slug} </span> </p> </div> </div> <div class="flex gap-2"> <button${addAttribute(shop.id, "data-id")} data-action="approve" class="action-btn px-4 py-2 bg-green-500/20 text-green-400 border border-green-500/50 rounded-lg font-bold text-xs uppercase hover:bg-green-500 hover:text-black transition-colors">
Approve
</button> <button${addAttribute(shop.id, "data-id")} data-action="reject" class="action-btn px-4 py-2 bg-red-500/20 text-red-400 border border-red-500/50 rounded-lg font-bold text-xs uppercase hover:bg-red-500 hover:text-black transition-colors">
Reject
</button> </div> </div>`)} </div> </section>  <section class="bg-[#0A0A0A] border border-white/10 rounded-xl p-6"> <h2 class="text-xl font-bold text-white mb-6">
Active Shops (${activeShops.length})
</h2> <div class="overflow-x-auto"> <table class="w-full text-left border-collapse"> <thead> <tr class="text-white/40 text-xs uppercase tracking-wider border-b border-white/10"> <th class="p-4">Shop</th> <th class="p-4">Owner</th> <th class="p-4">Joined</th> <th class="p-4 text-right">Action</th> </tr> </thead> <tbody class="divide-y divide-white/5"> ${activeShops.map((shop) => renderTemplate`<tr class="hover:bg-white/5 transition-colors"> <td class="p-4"> <div class="flex items-center gap-3"> <div class="w-8 h-8 rounded-full bg-[#222] overflow-hidden"> ${shop.logo_url && renderTemplate`<img${addAttribute(shop.logo_url, "src")} class="w-full h-full object-cover">`} </div> <a${addAttribute(`/shop/${shop.slug}`, "href")} target="_blank" class="text-white font-bold hover:text-[#D4AF37]"> ${shop.name} </a> </div> </td> <td class="p-4 text-white/70 text-sm"> ${shop.profile?.email} </td> <td class="p-4 text-white/50 text-xs"> ${new Date(
    shop.created_at
  ).toLocaleDateString()} </td> <td class="p-4 text-right"> <div class="flex items-center gap-3 justify-end"> <button${addAttribute(shop.id, "data-id")} data-action="suspend" class="action-btn text-orange-500 text-xs hover:underline font-bold" title="Pause Shop Temporarily">
Suspend
</button> <span class="text-white/10">|</span> <button${addAttribute(shop.id, "data-id")} data-action="delete" class="action-btn text-red-500 text-xs hover:underline font-bold" title="Delete Shop Permanently">
Delete
</button> </div> </td> </tr>`)} </tbody> </table> </div> </section>  ${suspendedShops.length > 0 && renderTemplate`<section class="opacity-70 grayscale hover:grayscale-0 transition-all"> <h2 class="text-xl font-bold text-red-500 mb-4">
Suspended (${suspendedShops.length})
</h2>  </section>`} </div> ` })} ${renderScript($$result, "/Users/natthapongsuwanjit/Desktop/CashlessThailand/cashlessthailand/src/pages/admin/sellers.astro?astro&type=script&index=0&lang.ts")}`;
}, "/Users/natthapongsuwanjit/Desktop/CashlessThailand/cashlessthailand/src/pages/admin/sellers.astro", void 0);
const $$file = "/Users/natthapongsuwanjit/Desktop/CashlessThailand/cashlessthailand/src/pages/admin/sellers.astro";
const $$url = "/admin/sellers";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
    __proto__: null,
    default: $$Sellers,
    file: $$file,
    url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
