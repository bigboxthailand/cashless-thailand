import { e as createComponent, r as renderTemplate, k as renderComponent, m as maybeRenderHead, h as addAttribute } from '../../chunks/astro/server_Bu8JVBjn.mjs';
import 'piccolore';
import { $ as $$AdminLayout } from '../../chunks/AdminLayout_CY66lzGI.mjs';
import { s as supabase } from '../../chunks/supabase_BcyI2ayE.mjs';
export { renderers } from '../../renderers.mjs';

var __freeze = Object.freeze;
var __defProp = Object.defineProperty;
var __template = (cooked, raw) => __freeze(__defProp(cooked, "raw", { value: __freeze(raw || cooked.slice()) }));
var _a;
const $$Disputes = createComponent(async ($$result, $$props, $$slots) => {
  const { data: disputes, error } = await supabase.from("disputes").select(
    `
        *,
        order:orders (*, order_items(*)),
        user:profiles (full_name, phone, email)
    `
  ).order("created_at", { ascending: false });
  const thbFormatter = new Intl.NumberFormat("th-TH", {
    style: "currency",
    currency: "THB"
  });
  return renderTemplate(_a || (_a = __template(["", ' <script>\n    import { supabase } from "../../lib/supabase";\n\n    window.resolveDispute = async (disputeId, orderId, action) => {\n        if (!confirm(`Confirm action: ${action.toUpperCase()}?`)) return;\n\n        try {\n            // 1. Update Dispute Status\n            const status =\n                action === "refund" ? "resolved_refund" : "resolved_close";\n            const { error: dError } = await supabase\n                .from("disputes")\n                .update({ status: status })\n                .eq("id", disputeId);\n\n            if (dError) throw dError;\n\n            // 2. Update Order Status\n            const orderStatus =\n                action === "refund"\n                    ? {\n                          payment_status: "refunded",\n                          shipping_status: "dispute_resolved",\n                      }\n                    : { shipping_status: "delivered", payment_status: "paid" }; // If rejected, assume delivered? Or just revert to shipped? Let\'s say delivered/completed to release funds.\n\n            const { error: oError } = await supabase\n                .from("orders")\n                .update(orderStatus)\n                .eq("id", orderId);\n\n            if (oError) throw oError;\n\n            alert("Resolved successfully!");\n            location.reload();\n        } catch (err) {\n            alert("Error: " + err.message);\n        }\n    };\n<\/script>'], ["", ' <script>\n    import { supabase } from "../../lib/supabase";\n\n    window.resolveDispute = async (disputeId, orderId, action) => {\n        if (!confirm(\\`Confirm action: \\${action.toUpperCase()}?\\`)) return;\n\n        try {\n            // 1. Update Dispute Status\n            const status =\n                action === "refund" ? "resolved_refund" : "resolved_close";\n            const { error: dError } = await supabase\n                .from("disputes")\n                .update({ status: status })\n                .eq("id", disputeId);\n\n            if (dError) throw dError;\n\n            // 2. Update Order Status\n            const orderStatus =\n                action === "refund"\n                    ? {\n                          payment_status: "refunded",\n                          shipping_status: "dispute_resolved",\n                      }\n                    : { shipping_status: "delivered", payment_status: "paid" }; // If rejected, assume delivered? Or just revert to shipped? Let\'s say delivered/completed to release funds.\n\n            const { error: oError } = await supabase\n                .from("orders")\n                .update(orderStatus)\n                .eq("id", orderId);\n\n            if (oError) throw oError;\n\n            alert("Resolved successfully!");\n            location.reload();\n        } catch (err) {\n            alert("Error: " + err.message);\n        }\n    };\n<\/script>'])), renderComponent($$result, "AdminLayout", $$AdminLayout, { "title": "Dispute Management" }, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="space-y-6"> <h1 class="text-3xl font-black text-white uppercase tracking-wider">
Dispute Cases
</h1> <div class="grid gap-6"> ${disputes?.map((dispute) => renderTemplate`<div class="bg-white/5 border border-white/10 rounded-2xl p-6 hover:border-red-500/30 transition-all"> <div class="flex justify-between items-start mb-6 border-b border-white/5 pb-4"> <div> <div class="flex items-center gap-3"> <span${addAttribute(`px-2 py-1 rounded text-xs font-bold uppercase ${dispute.status === "open" ? "bg-red-500 text-black" : "bg-green-500/10 text-green-500"}`, "class")}> ${dispute.status} </span> <span class="text-white/40 text-xs font-mono">
ID: ${dispute.id} </span> </div> <h2 class="text-xl font-bold text-white mt-2">
Order #${dispute.order.id} </h2> <p class="text-sm text-white/60">
Reporter:${" "} ${dispute.user?.full_name || "Unknown"} (
${dispute.user?.phone})
</p> </div> <div class="text-right"> <p class="text-[#D4AF37] font-black text-xl"> ${thbFormatter.format(
    dispute.order.total_price
  )} </p> <p class="text-white/30 text-xs"> ${new Date(
    dispute.created_at
  ).toLocaleString()} </p> </div> </div> <div class="grid md:grid-cols-2 gap-6"> <div class="space-y-4"> <div class="bg-black/40 p-4 rounded-xl border border-white/5"> <h3 class="text-xs font-bold text-white/50 uppercase tracking-widest mb-2">
Claim Details
</h3> <p class="text-white font-bold mb-1">
Reason:${" "} <span class="text-red-400 capitalize"> ${dispute.reason.replace("_", " ")} </span> </p> <p class="text-white/80 text-sm whitespace-pre-wrap">
"${dispute.description}"
</p> </div>  ${dispute.evidence_images && dispute.evidence_images.length > 0 && renderTemplate`<div class="flex gap-2"> ${dispute.evidence_images.map(
    (img) => renderTemplate`<a${addAttribute(img, "href")} target="_blank"> <img${addAttribute(img, "src")} class="w-16 h-16 rounded border border-white/20 object-cover"> </a>`
  )} </div>`} </div> <div class="space-y-4"> <div class="bg-black/40 p-4 rounded-xl border border-white/5"> <h3 class="text-xs font-bold text-white/50 uppercase tracking-widest mb-2">
Ordered Items
</h3> <ul class="space-y-2"> ${dispute.order.order_items.map(
    (item) => renderTemplate`<li class="flex justify-between text-sm text-white/70 border-b border-white/5 pb-1 last:border-0"> <span> ${item.title} (x
${item.quantity})
</span> <span> ${thbFormatter.format(
      item.price
    )} </span> </li>`
  )} </ul> </div> ${dispute.status === "open" && renderTemplate`<div class="flex gap-3 justify-end pt-4"${addAttribute(`actions-${dispute.id}`, "id")}> <button${addAttribute(`resolveDispute('${dispute.id}', '${dispute.order.id}', 'refund')`, "onclick")} class="bg-red-600/20 hover:bg-red-600 text-red-500 hover:text-white px-4 py-2 rounded-lg font-bold border border-red-600/50 transition-all text-sm">
Refund Order
</button> <button${addAttribute(`resolveDispute('${dispute.id}', '${dispute.order.id}', 'close')`, "onclick")} class="bg-green-600/20 hover:bg-green-600 text-green-500 hover:text-white px-4 py-2 rounded-lg font-bold border border-green-600/50 transition-all text-sm">
Reject & Complete
</button> </div>`} </div> </div> </div>`)} ${disputes?.length === 0 && renderTemplate`<div class="text-center py-20 bg-white/5 rounded-2xl border border-dashed border-white/10"> <p class="text-white/30">No active disputes.</p> </div>`} </div> </div> ` }));
}, "/Users/natthapongsuwanjit/Desktop/CashlessThailand/cashlessthailand/src/pages/admin/disputes.astro", void 0);

const $$file = "/Users/natthapongsuwanjit/Desktop/CashlessThailand/cashlessthailand/src/pages/admin/disputes.astro";
const $$url = "/admin/disputes";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
    __proto__: null,
    default: $$Disputes,
    file: $$file,
    url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
