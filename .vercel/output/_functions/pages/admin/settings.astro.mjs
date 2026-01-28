import { e as createComponent, k as renderComponent, l as renderScript, r as renderTemplate, m as maybeRenderHead, h as addAttribute } from '../../chunks/astro/server_Bu8JVBjn.mjs';
import 'piccolore';
import { $ as $$AdminLayout } from '../../chunks/AdminLayout_B-ZiSxXY.mjs';
import { s as supabase } from '../../chunks/supabase_BcyI2ayE.mjs';
export { renderers } from '../../renderers.mjs';

const $$Settings = createComponent(async ($$result, $$props, $$slots) => {
  const { data: settings } = await supabase.from("store_settings").select("*").eq("id", 1).single();
  const config = settings || {
    store_name: "Cashless Store",
    currency: "THB",
    tax_rate: 7,
    maintenance_mode: false
  };
  return renderTemplate`${renderComponent($$result, "AdminLayout", $$AdminLayout, { "title": "Settings" }, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="max-w-3xl mx-auto space-y-8"> <div> <h1 class="text-3xl font-black text-white uppercase tracking-wider">
Store Settings
</h1> <p class="text-white/50 text-sm mt-1">
Manage global configuration
</p> </div> <div class="bg-[#0A0A0A] border border-white/10 p-8 rounded-xl space-y-8"> <!-- GENERAL SETTINGS --> <div class="space-y-4"> <h3 class="text-white font-bold uppercase text-sm border-b border-white/10 pb-2">
General
</h3> <div class="grid grid-cols-1 md:grid-cols-2 gap-6"> <div> <label class="block text-xs uppercase font-bold text-white/50 mb-2">Store Name</label> <input id="store_name" type="text"${addAttribute(config.store_name, "value")} class="w-full bg-white/5 border border-white/10 rounded px-4 py-2 text-white focus:border-[#D4AF37] outline-none transition-colors"> </div> <div> <label class="block text-xs uppercase font-bold text-white/50 mb-2">Currency Symbol</label> <input id="currency" type="text"${addAttribute(config.currency, "value")} class="w-full bg-white/5 border border-white/10 rounded px-4 py-2 text-white focus:border-[#D4AF37] outline-none transition-colors"> </div> </div> </div> <!-- TAX & FEES --> <div class="space-y-4"> <h3 class="text-white font-bold uppercase text-sm border-b border-white/10 pb-2">
Tax & Fees
</h3> <div> <label class="block text-xs uppercase font-bold text-white/50 mb-2">VAT / Tax Rate (%)</label> <input id="tax_rate" type="number"${addAttribute(config.tax_rate, "value")} class="w-full bg-white/5 border border-white/10 rounded px-4 py-2 text-white focus:border-[#D4AF37] outline-none transition-colors"> </div> </div> <!-- DANGER ZONE --> <div class="space-y-4 pt-4"> <div class="flex items-center justify-between bg-red-500/5 border border-red-500/20 p-4 rounded-lg"> <div> <h4 class="text-red-400 font-bold text-sm">
Maintenance Mode
</h4> <p class="text-red-400/50 text-xs">
Shutdown public access to the store.
</p> </div> <label class="relative inline-flex items-center cursor-pointer"> <input id="maintenance_mode" type="checkbox" class="sr-only peer"${addAttribute(config.maintenance_mode, "checked")}> <div class="w-11 h-6 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-500"></div> </label> </div> </div> <!-- ACTION --> <div class="pt-4 flex justify-end"> <button id="save-btn" class="px-8 py-3 bg-[#D4AF37] text-black font-black uppercase text-sm rounded hover:bg-white transition-colors">
Save Changes
</button> </div> </div> </div> ` })} ${renderScript($$result, "/Users/natthapongsuwanjit/Desktop/CashlessThailand/cashlessthailand/src/pages/admin/settings.astro?astro&type=script&index=0&lang.ts")}`;
}, "/Users/natthapongsuwanjit/Desktop/CashlessThailand/cashlessthailand/src/pages/admin/settings.astro", void 0);

const $$file = "/Users/natthapongsuwanjit/Desktop/CashlessThailand/cashlessthailand/src/pages/admin/settings.astro";
const $$url = "/admin/settings";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
    __proto__: null,
    default: $$Settings,
    file: $$file,
    url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
