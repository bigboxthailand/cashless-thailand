import { e as createComponent, f as createAstro, r as renderTemplate, k as renderComponent, m as maybeRenderHead, h as addAttribute } from '../../chunks/astro/server_Bu8JVBjn.mjs';
import 'piccolore';
import { $ as $$Layout } from '../../chunks/Layout_BPO4vhqY.mjs';
import { s as supabase } from '../../chunks/supabase_BcyI2ayE.mjs';
export { renderers } from '../../renderers.mjs';

var __freeze = Object.freeze;
var __defProp = Object.defineProperty;
var __template = (cooked, raw) => __freeze(__defProp(cooked, "raw", { value: __freeze(raw || cooked.slice()) }));
var _a;
const $$Astro = createAstro();
const $$Orders = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Orders;
  const {
    data: { session }
  } = await supabase.auth.getSession();
  if (!session) return Astro2.redirect("/login");
  const { data: shop } = await supabase.from("shops").select("*").eq("owner_id", session.user.id).single();
  if (!shop) return Astro2.redirect("/seller/register");
  const { data: myProducts } = await supabase.from("products").select("id").eq("shop_id", shop.id);
  const myProductIds = myProducts?.map((p) => p.id) || [];
  let orders = [];
  if (myProductIds.length > 0) {
    const { data: orderItems } = await supabase.from("order_items").select("order_id").in("product_id", myProductIds);
    const uniqueOrderIds = [
      ...new Set(orderItems?.map((item) => item.order_id))
    ];
    if (uniqueOrderIds.length > 0) {
      const { data: fullOrders, error } = await supabase.from("orders").select(
        `
                *,
                order_items (
                    *,
                    product:products (
                        id, meta, shop_id, media, image_url
                    )
                ),
                user:profiles (full_name, email, phone)
            `
      ).in("id", uniqueOrderIds).order("created_at", { ascending: false });
      if (fullOrders) {
        orders = fullOrders.map((order) => {
          const myItems = order.order_items.filter(
            (item) => item.product?.shop_id === shop.id || myProductIds.includes(item.product_id)
          );
          const myTotal = myItems.reduce(
            (sum, item) => sum + item.price * item.quantity,
            0
          );
          return {
            ...order,
            myItems,
            // Only relevant items
            myTotal
            // Only relevant total
          };
        });
      }
    }
  }
  const thbFormatter = new Intl.NumberFormat("th-TH", {
    style: "currency",
    currency: "THB"
  });
  return renderTemplate(_a || (_a = __template(["", ' <script>\n    import { supabase } from "../../lib/supabase";\n\n    const modal = document.getElementById("ship-modal");\n    const form = document.getElementById("ship-form");\n    // const input = document.getElementById(\'ship-tracking-input\');\n\n    window.openShipModal = (orderId, shopName, currentTracking) => {\n        document.getElementById("ship-order-id").value = orderId;\n        document.getElementById("ship-shop-name").value = shopName;\n        document.getElementById("ship-current-tracking").value =\n            currentTracking;\n        document.getElementById("ship-tracking-input").value = "";\n        modal.classList.remove("hidden");\n        modal.classList.add("flex");\n    };\n\n    window.closeShipModal = () => {\n        modal.classList.add("hidden");\n        modal.classList.remove("flex");\n    };\n\n    form.addEventListener("submit", async (e) => {\n        e.preventDefault();\n        const btn = form.querySelector(\'button[type="submit"]\');\n        const originalText = btn.innerText;\n        btn.disabled = true;\n        btn.innerText = "Processing...";\n\n        const orderId = document.getElementById("ship-order-id").value;\n        const shopName = document.getElementById("ship-shop-name").value;\n        const newTracking = document.getElementById(\n            "ship-tracking-input",\n        ).value;\n        let currentTracking = document.getElementById(\n            "ship-current-tracking",\n        ).value;\n\n        // Smart Append Logic\n        // If currentTracking is empty -> "ShopName: Tracking"\n        // If exists -> "Existing, ShopName: Tracking"\n        // Avoid duplicate shop entries if updating\n\n        let finalTracking = "";\n        const entry = `${shopName}: ${newTracking}`;\n\n        if (!currentTracking || currentTracking === "null") {\n            finalTracking = entry;\n        } else {\n            // Check if this shop already has an entry\n            if (currentTracking.includes(shopName + ":")) {\n                // Replace existing entry (Regex is safer but simple split works for MVP structured data)\n                // "ShopA: 123, ShopB: 456"\n                const parts = currentTracking.split(", ");\n                const updatedParts = parts.map((p) =>\n                    p.startsWith(shopName + ":") ? entry : p,\n                );\n                finalTracking = updatedParts.join(", ");\n            } else {\n                finalTracking = `${currentTracking}, ${entry}`;\n            }\n        }\n\n        try {\n            const { error } = await supabase\n                .from("orders")\n                .update({\n                    shipping_status: "shipped", // Mark global as shipped (MVP)\n                    tracking_number: finalTracking,\n                    updated_at: new Date(),\n                })\n                .eq("id", orderId);\n\n            if (error) throw error;\n\n            alert("Order shipped! Tracking updated.");\n            location.reload();\n        } catch (err) {\n            alert("Error: " + err.message);\n            btn.disabled = false;\n            btn.innerText = originalText;\n        }\n    });\n<\/script>'], ["", ' <script>\n    import { supabase } from "../../lib/supabase";\n\n    const modal = document.getElementById("ship-modal");\n    const form = document.getElementById("ship-form");\n    // const input = document.getElementById(\'ship-tracking-input\');\n\n    window.openShipModal = (orderId, shopName, currentTracking) => {\n        document.getElementById("ship-order-id").value = orderId;\n        document.getElementById("ship-shop-name").value = shopName;\n        document.getElementById("ship-current-tracking").value =\n            currentTracking;\n        document.getElementById("ship-tracking-input").value = "";\n        modal.classList.remove("hidden");\n        modal.classList.add("flex");\n    };\n\n    window.closeShipModal = () => {\n        modal.classList.add("hidden");\n        modal.classList.remove("flex");\n    };\n\n    form.addEventListener("submit", async (e) => {\n        e.preventDefault();\n        const btn = form.querySelector(\'button[type="submit"]\');\n        const originalText = btn.innerText;\n        btn.disabled = true;\n        btn.innerText = "Processing...";\n\n        const orderId = document.getElementById("ship-order-id").value;\n        const shopName = document.getElementById("ship-shop-name").value;\n        const newTracking = document.getElementById(\n            "ship-tracking-input",\n        ).value;\n        let currentTracking = document.getElementById(\n            "ship-current-tracking",\n        ).value;\n\n        // Smart Append Logic\n        // If currentTracking is empty -> "ShopName: Tracking"\n        // If exists -> "Existing, ShopName: Tracking"\n        // Avoid duplicate shop entries if updating\n\n        let finalTracking = "";\n        const entry = \\`\\${shopName}: \\${newTracking}\\`;\n\n        if (!currentTracking || currentTracking === "null") {\n            finalTracking = entry;\n        } else {\n            // Check if this shop already has an entry\n            if (currentTracking.includes(shopName + ":")) {\n                // Replace existing entry (Regex is safer but simple split works for MVP structured data)\n                // "ShopA: 123, ShopB: 456"\n                const parts = currentTracking.split(", ");\n                const updatedParts = parts.map((p) =>\n                    p.startsWith(shopName + ":") ? entry : p,\n                );\n                finalTracking = updatedParts.join(", ");\n            } else {\n                finalTracking = \\`\\${currentTracking}, \\${entry}\\`;\n            }\n        }\n\n        try {\n            const { error } = await supabase\n                .from("orders")\n                .update({\n                    shipping_status: "shipped", // Mark global as shipped (MVP)\n                    tracking_number: finalTracking,\n                    updated_at: new Date(),\n                })\n                .eq("id", orderId);\n\n            if (error) throw error;\n\n            alert("Order shipped! Tracking updated.");\n            location.reload();\n        } catch (err) {\n            alert("Error: " + err.message);\n            btn.disabled = false;\n            btn.innerText = originalText;\n        }\n    });\n<\/script>'])), renderComponent($$result, "Layout", $$Layout, { "title": `Orders | ${shop.name}` }, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="flex h-screen bg-[#050505] overflow-hidden"> <!-- Sidebar (Same as Products) --> <aside class="w-64 bg-[#111] border-r border-white/10 hidden md:flex flex-col"> <div class="p-6 border-b border-white/10"> <h2 class="text-[#D4AF37] font-black uppercase tracking-widest text-lg">
Seller Center
</h2> <p class="text-white/40 text-xs mt-1 truncate">${shop.name}</p> </div> <nav class="flex-1 p-4 space-y-2"> <a href="/seller/dashboard" class="flex items-center gap-3 px-4 py-3 text-white/60 hover:text-white hover:bg-white/5 rounded-xl font-bold text-sm transition-all"> <span>📊</span> Dashboard
</a> <a href="/seller/orders" class="flex items-center gap-3 px-4 py-3 bg-[#D4AF37]/10 text-[#D4AF37] rounded-xl font-bold text-sm transition-all"> <span>📦</span> Orders
</a> <a href="/seller/products" class="flex items-center gap-3 px-4 py-3 text-white/60 hover:text-white hover:bg-white/5 rounded-xl font-bold text-sm transition-all"> <span>🏷️</span> Products
</a> <a href="/seller/settings" class="flex items-center gap-3 px-4 py-3 text-white/60 hover:text-white hover:bg-white/5 rounded-xl font-bold text-sm transition-all"> <span>⚙️</span> Settings
</a> </nav> <div class="p-4 border-t border-white/10"> <a href="/" class="flex items-center gap-2 text-white/40 hover:text-white text-xs font-bold uppercase tracking-widest transition-colors">
← Back to Market
</a> </div> </aside> <!-- Main Content --> <main class="flex-1 overflow-y-auto relative bg-[#050505]"> <!-- Mobile Header --> <div class="md:hidden p-4 border-b border-white/10 flex justify-between items-center bg-[#111]"> <span class="text-[#D4AF37] font-black uppercase">Orders</span> <a href="/seller/dashboard" class="text-xs text-white/60">Back</a> </div> <div class="p-4 md:p-8 max-w-7xl mx-auto space-y-8"> <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4"> <div> <h1 class="text-3xl font-black text-white uppercase tracking-wider">
Order Management
</h1> <p class="text-white/50 text-sm">
Manage and fulfill your orders.
</p> </div> </div> <div class="bg-[#111] border border-white/10 rounded-2xl overflow-hidden"> ${orders.length === 0 ? renderTemplate`<div class="p-12 text-center"> <div class="text-4xl mb-4">📦</div> <h3 class="text-white font-bold mb-2">
No Orders Yet
</h3> <p class="text-white/40 text-sm">
When customers buy your products, they will
                                    appear here.
</p> </div>` : renderTemplate`<div class="divide-y divide-white/5"> ${orders.map((order) => renderTemplate`<div class="p-6 hover:bg-white/[0.02] transition-colors"${addAttribute(`order-${order.id}`, "id")}> <div class="flex flex-col md:flex-row justify-between gap-6 mb-6"> <div> <div class="flex items-center gap-3 mb-2"> <span class="text-[#D4AF37] font-black text-lg">
Order #
${order.id.substring(
    0,
    8
  )} </span> <span${addAttribute(`px-2 py-1 rounded text-[10px] font-bold uppercase ${order.shipping_status === "shipped" || order.shipping_status === "delivered" ? "bg-green-500/20 text-green-500 border border-green-500/30" : "bg-yellow-500/20 text-yellow-500 border border-yellow-500/30"}`, "class")}> ${order.shipping_status || "Pending"} </span> </div> <p class="text-white/60 text-xs">
Customer:${" "} <span class="text-white font-bold"> ${order.customer_name || order.user?.full_name || "Guest"} </span> <span class="mx-2">•</span>
Date:${" "} ${new Date(
    order.created_at
  ).toLocaleDateString()} </p>  ${order.tracking_number && renderTemplate`<div class="mt-3 inline-flex items-center gap-2 bg-white/5 px-3 py-2 rounded-lg border border-white/10"> <span class="text-[10px] text-white/40 font-bold uppercase tracking-widest">
Tracking Info:
</span> <span class="text-white font-mono text-xs"> ${order.tracking_number} </span> </div>`} </div> <div class="text-right"> <p class="text-[10px] text-white/40 font-bold uppercase tracking-widest mb-1">
My Revenue
</p> <p class="text-2xl font-black text-[#D4AF37]"> ${thbFormatter.format(
    order.myTotal
  )} </p> </div> </div>  <div class="bg-black/30 rounded-xl overflow-hidden border border-white/5 mb-6"> <table class="w-full text-left text-sm text-white/70"> <thead class="bg-white/5 text-[10px] font-bold uppercase text-white/40 tracking-widest"> <tr> <th class="p-3">
Product
</th> <th class="p-3 text-center">
Qty
</th> <th class="p-3 text-right">
Price
</th> <th class="p-3 text-right">
Total
</th> </tr> </thead> <tbody class="divide-y divide-white/5"> ${order.myItems.map(
    (item) => renderTemplate`<tr> <td class="p-3 flex items-center gap-3"> <img${addAttribute(
      item.product?.media?.mainImage || item.product?.image_url || "https://placehold.co/50",
      "src"
    )} class="w-10 h-10 rounded object-cover border border-white/10"> <div> <div class="text-white font-bold"> ${item.title} </div> <div class="text-xs text-white/40"> ${item.variant_name || "Standard"} </div> </div> </td> <td class="p-3 text-center text-white"> ${item.quantity} </td> <td class="p-3 text-right"> ${thbFormatter.format(
      item.price
    )} </td> <td class="p-3 text-right font-bold text-white"> ${thbFormatter.format(
      item.price * item.quantity
    )} </td> </tr>`
  )} </tbody> </table> </div>  <div class="flex justify-between items-center bg-white/5 p-4 rounded-xl border border-white/5"> <div class="text-xs text-white/40"> <p>Shipping Address:</p> <p class="text-white"> ${order.shipping_address || "No address provided"} </p> </div> <div class="flex gap-2"> ${order.shipping_status !== "delivered" && renderTemplate`<button${addAttribute(`openShipModal('${order.id}', '${shop.name}', '${order.tracking_number || ""}')`, "onclick")} class="px-6 py-2 bg-[#D4AF37] hover:bg-[#b89530] text-black font-bold uppercase tracking-widest rounded-lg shadow-lg transition-all"> ${order.tracking_number ? "Update Tracking" : "Mark as Shipped"} </button>`} </div> </div> </div>`)} </div>`} </div> </div> </main> </div> <div id="ship-modal" class="fixed inset-0 z-[200] hidden items-center justify-center p-4"> <div class="absolute inset-0 bg-black/90 backdrop-blur-md" onclick="closeShipModal()"></div> <div class="bg-[#1a1a1a] border border-white/10 rounded-2xl w-full max-w-md p-8 relative z-10 shadow-2xl animate-fade-in-up"> <h3 class="text-2xl font-black text-white uppercase mb-6">
Ship Order
</h3> <form id="ship-form" class="space-y-6"> <input type="hidden" name="orderId" id="ship-order-id"> <input type="hidden" name="shopName" id="ship-shop-name"> <input type="hidden" name="currentTracking" id="ship-current-tracking"> <div class="space-y-2"> <label class="text-[10px] font-bold text-white/40 uppercase tracking-widest">Tracking Number</label> <input type="text" name="tracking" id="ship-tracking-input" required placeholder="e.g. KERRY-123456" class="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-[#D4AF37] outline-none font-mono"> <p class="text-[10px] text-white/30">
If other shops already added tracking, this will append
                        to it.
</p> </div> <div class="flex gap-4"> <button type="button" onclick="closeShipModal()" class="flex-1 bg-white/10 text-white font-bold py-3 rounded-xl hover:bg-white/20">Cancel</button> <button type="submit" class="flex-1 bg-[#D4AF37] text-black font-bold py-3 rounded-xl hover:bg-[#b89530]">Confirm Ship</button> </div> </form> </div> </div> ` }));
}, "/Users/natthapongsuwanjit/Desktop/CashlessThailand/cashlessthailand/src/pages/seller/orders.astro", void 0);

const $$file = "/Users/natthapongsuwanjit/Desktop/CashlessThailand/cashlessthailand/src/pages/seller/orders.astro";
const $$url = "/seller/orders";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
    __proto__: null,
    default: $$Orders,
    file: $$file,
    url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
