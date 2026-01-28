import { e as createComponent, r as renderTemplate, l as renderScript, n as defineScriptVars, k as renderComponent, m as maybeRenderHead, h as addAttribute } from '../../chunks/astro/server_Bu8JVBjn.mjs';
import 'piccolore';
import { $ as $$AdminLayout } from '../../chunks/AdminLayout_B-ZiSxXY.mjs';
import { s as supabase } from '../../chunks/supabase_BcyI2ayE.mjs';
export { renderers } from '../../renderers.mjs';

var __freeze = Object.freeze;
var __defProp = Object.defineProperty;
var __template = (cooked, raw) => __freeze(__defProp(cooked, "raw", { value: __freeze(raw || cooked.slice()) }));
var _a;
const $$Orders = createComponent(async ($$result, $$props, $$slots) => {
  const { data: orders } = await supabase.from("orders").select("*, order_items(*)").order("created_at", { ascending: false });
  const thbFormatter = new Intl.NumberFormat("th-TH", {
    style: "currency",
    currency: "THB"
  });
  return renderTemplate(_a || (_a = __template(["", " <script>(function(){", '\n    // 1. \u0E2A\u0E48\u0E07\u0E02\u0E49\u0E2D\u0E21\u0E39\u0E25 orders \u0E40\u0E02\u0E49\u0E32 window \u0E17\u0E31\u0E19\u0E17\u0E35\u0E17\u0E35\u0E48\u0E42\u0E2B\u0E25\u0E14\n    window.allOrders = orders;\n\n    // 2. \u0E43\u0E0A\u0E49 astro:page-load \u0E40\u0E1E\u0E37\u0E48\u0E2D\u0E23\u0E31\u0E19\u0E2A\u0E04\u0E23\u0E34\u0E1B\u0E15\u0E4C\u0E43\u0E2B\u0E21\u0E48\u0E17\u0E38\u0E01\u0E04\u0E23\u0E31\u0E49\u0E07\u0E17\u0E35\u0E48\u0E40\u0E1B\u0E25\u0E35\u0E48\u0E22\u0E19\u0E2B\u0E19\u0E49\u0E32\u0E21\u0E32\n    document.addEventListener("astro:page-load", () => {\n        const modal = document.getElementById("order-modal");\n        const closeBtn = document.getElementById("close-modal");\n\n        // \u0E16\u0E49\u0E32\u0E44\u0E21\u0E48\u0E21\u0E35 modal \u0E43\u0E19\u0E2B\u0E19\u0E49\u0E32\u0E19\u0E35\u0E49\u0E43\u0E2B\u0E49\u0E2B\u0E22\u0E38\u0E14\u0E17\u0E33\u0E07\u0E32\u0E19 (\u0E1B\u0E49\u0E2D\u0E07\u0E01\u0E31\u0E19 Error \u0E40\u0E27\u0E25\u0E32\u0E2D\u0E22\u0E39\u0E48\u0E2B\u0E19\u0E49\u0E32\u0E2D\u0E37\u0E48\u0E19)\n        if (!modal) return;\n\n        // \u0E01\u0E33\u0E2B\u0E19\u0E14\u0E1F\u0E31\u0E07\u0E01\u0E4C\u0E0A\u0E31\u0E19\u0E40\u0E1B\u0E34\u0E14 Modal\n        window.openOrderModal = function (orderId) {\n            const order = window.allOrders.find((o) => o.id === orderId);\n            if (!order) return;\n\n            // Populate Header\n            document.getElementById("modal-order-id").innerText = order.id;\n            document.getElementById("modal-order-date").innerText = new Date(\n                order.created_at,\n            ).toLocaleString("th-TH");\n\n            // Populate Customer\n            document.getElementById("modal-customer-name").innerText =\n                order.customer_name || "Guest";\n            document.getElementById("modal-customer-email").innerText =\n                order.customer_email || "No Email";\n            document.getElementById("modal-customer-phone").innerText =\n                order.customer_phone || "-";\n            document.getElementById("modal-customer-address").innerText =\n                (order.shipping_address || "") +\n                " " +\n                (order.province || "") +\n                " " +\n                (order.zipcode || "");\n\n            // Avatar\n            const email = order.customer_email || "guest@example.com";\n            document.getElementById("modal-customer-img").src =\n                order.customer_avatar ||\n                `https://unavatar.io/${email}?fallback=https://source.boringavatars.com/marble/120/${encodeURIComponent(order.customer_name)}`;\n\n            // Populate Stats\n            const total = Number(order.total_price).toLocaleString();\n            document.getElementById("modal-total-price").innerText =\n                `\u0E3F${total}`;\n\n            const statusEl = document.getElementById("modal-status-badge");\n            statusEl.innerText = order.payment_status;\n            statusEl.className = `mt-1 inline-flex px-3 py-1 rounded font-bold uppercase text-sm ${\n                order.payment_status === "paid"\n                    ? "bg-green-500/10 text-green-500"\n                    : order.payment_status === "pending"\n                      ? "bg-yellow-500/10 text-yellow-500"\n                      : order.payment_status === "shipped"\n                        ? "bg-blue-500/10 text-blue-500"\n                        : "bg-red-500/10 text-red-500"\n            }`;\n\n            // Prepare Action Button\n            const actionBtn = document.getElementById("modal-action-btn");\n            if (order.payment_status === "pending") {\n                actionBtn.textContent = "Confirm Payment";\n                actionBtn.dataset.action = "paid";\n                actionBtn.dataset.orderId = order.id;\n                actionBtn.disabled = false;\n                actionBtn.classList.remove("hidden");\n            } else if (order.payment_status === "paid") {\n                actionBtn.textContent = "Confirm Shipping";\n                actionBtn.dataset.action = "ship";\n                actionBtn.dataset.orderId = order.id;\n                actionBtn.disabled = false;\n                actionBtn.classList.remove("hidden");\n            } else {\n                actionBtn.classList.add("hidden");\n                actionBtn.dataset.action = "";\n                actionBtn.dataset.orderId = "";\n            }\n\n            // Populate Tracking Number\n            const trackingContainer = document.getElementById(\n                "modal-tracking-container",\n            );\n            const trackingEl = document.getElementById("modal-tracking-number");\n\n            if (order.tracking_number) {\n                trackingContainer.classList.remove("hidden");\n                trackingEl.innerText = order.tracking_number;\n            } else {\n                trackingContainer.classList.add("hidden");\n                trackingEl.innerText = "-";\n            }\n\n            // Populate Items\n            const tbody = document.getElementById("modal-items-list");\n            tbody.innerHTML = order.order_items\n                .map(\n                    (item) => `\n                <tr class="hover:bg-white/2">\n                    <td class="p-4 flex items-center gap-4">\n                        <div class="w-12 h-12 bg-white/5 rounded overflow-hidden shrink-0">\n                            <img src="${item.image_url || "https://placehold.co/100"}" class="w-full h-full object-cover">\n                        </div>\n                        <div>\n                            <div class="text-white font-bold flex items-center">\n                                ${item.title}\n                                ${item.variant_name ? `<span class="bg-[#D4AF37]/20 text-[#D4AF37] text-[10px] px-2 py-0.5 rounded ml-2 uppercase tracking-wide border border-[#D4AF37]/30">${item.variant_name}</span>` : ""}\n                            </div>\n                            <div class="text-xs text-white/40">ID: ${item.id.slice(0, 8)}...</div>\n                        </div>\n                    </td>\n                    <td class="p-4 text-center text-white/70">${item.quantity}</td>\n                    <td class="p-4 text-right text-white/70">\u0E3F${Number(item.price).toLocaleString()}</td>\n                     <td class="p-4 text-right font-bold text-white">\u0E3F${(Number(item.price) * item.quantity).toLocaleString()}</td>\n                </tr>\n            `,\n                )\n                .join("");\n\n            // Populate Payment Proof\n            const proofDiv = document.getElementById("modal-proof-content");\n            document.getElementById("modal-payment-method").innerText =\n                order.payment_method;\n\n            if (order.slip_image?.startsWith("TX:")) {\n                const tx = order.slip_image.replace("TX:", "");\n                proofDiv.innerHTML = `\n                    <div class="text-center p-4">\n                        <p class="text-green-400 font-mono text-xs break-all mb-2">${tx}</p>\n                        <a href="https://etherscan.io/tx/${tx}" target="_blank" class="text-[#D4AF37] underline text-xs">Verify on Blockchain</a>\n                    </div>\n                `;\n            } else if (order.slip_image) {\n                let src;\n                if (\n                    order.slip_image.startsWith("http://") ||\n                    order.slip_image.startsWith("https://")\n                ) {\n                    src = order.slip_image;\n                } else if (order.slip_image.startsWith("/")) {\n                    src = order.slip_image;\n                } else if (order.slip_image.includes("data:")) {\n                    src = order.slip_image;\n                } else {\n                    src = `data:image/png;base64,${order.slip_image}`;\n                }\n                proofDiv.innerHTML = `<img src="${src}" class="max-h-[200px] object-contain rounded cursor-pointer" onclick="window.open(this.src)">`;\n            } else {\n                proofDiv.innerHTML = `<p class="text-white/30 text-sm">No proof uploaded</p>`;\n            }\n\n            modal.classList.remove("hidden");\n        };\n\n        // \u0E1C\u0E39\u0E01 Event Listener \u0E01\u0E31\u0E1A\u0E1B\u0E38\u0E48\u0E21\u0E1B\u0E34\u0E14\n        closeBtn?.addEventListener("click", () => {\n            modal.classList.add("hidden");\n        });\n    });\n\n    document.addEventListener("click", (e) => {\n        const btn = e.target.closest("#modal-action-btn");\n        if (!btn) return;\n\n        const action = btn.dataset.action;\n        const orderId = btn.dataset.orderId;\n\n        if (!action || !orderId) return;\n\n        if (action === "paid") {\n            window.updateStatus(orderId, "paid");\n        }\n\n        if (action === "ship") {\n            window.updateStatus(orderId, "shipped");\n        }\n    });\n})();<\/script> ', ` <script>
    document.addEventListener("astro:page-load", () => {
        console.log("Admin Orders Script Loaded"); // Debugging

        // [New] Filter Logic - Unified Handler
        document.addEventListener("click", (e) => {
            // 1. Action Buttons (View/Paid/Ship)
            const btn = e.target.closest("button[data-action]");
            if (btn) {
                const { action, orderId } = btn.dataset;
                if (action && orderId) {
                    if (action === "view") window.openOrderModal(orderId);
                    if (action === "paid") window.updateStatus(orderId, "paid");
                    if (action === "ship")
                        window.updateStatus(orderId, "shipped");
                }
                return; // Exit early if action button
            }

            // 2. Filter Tabs (All/Pending/Paid/Shipped)
            const filterBtn = e.target.closest("button[data-filter]");
            if (filterBtn) {
                // Update Active UI State
                document
                    .querySelectorAll("button[data-filter]")
                    .forEach((b) => {
                        b.classList.remove("bg-[#D4AF37]", "text-black");
                        b.classList.add("bg-white/5", "text-white/70");
                        b.removeAttribute("data-active");
                    });
                filterBtn.classList.remove("bg-white/5", "text-white/70");
                filterBtn.classList.add("bg-[#D4AF37]", "text-black");
                filterBtn.setAttribute("data-active", "true");

                // Trigger Central Filter
                triggerFilter();
            }
        });

        // 3. Input Listeners (Search & Date)
        const searchInput = document.getElementById("order-search");
        const dateStartInput = document.getElementById("date-start");
        const dateEndInput = document.getElementById("date-end");

        if (searchInput) {
            searchInput.removeEventListener("input", triggerFilter); // Clean up old
            searchInput.addEventListener("input", triggerFilter);
        }
        if (dateStartInput) {
            dateStartInput.removeEventListener("change", triggerFilter);
            dateStartInput.addEventListener("change", triggerFilter);
        }
        if (dateEndInput) {
            dateEndInput.removeEventListener("change", triggerFilter);
            dateEndInput.addEventListener("change", triggerFilter);
        }

        // --- Central Filter Logic ---
        function triggerFilter() {
            const searchInput = document.getElementById("order-search");
            const dateStartInput = document.getElementById("date-start");
            const dateEndInput = document.getElementById("date-end");

            const searchText = searchInput ? searchInput.value : "";
            // Fix: Use data-active attribute for selection
            const activeBtn = document.querySelector(
                "button[data-filter][data-active='true']",
            );
            const activeFilter = activeBtn ? activeBtn.dataset.filter : "all";

            const dateStart =
                dateStartInput && dateStartInput.valueAsDate
                    ? dateStartInput.valueAsDate
                    : null;
            const dateEnd =
                dateEndInput && dateEndInput.valueAsDate
                    ? dateEndInput.valueAsDate
                    : null;

            // Adjust dateEnd to include the full day (23:59:59)
            if (dateEnd) dateEnd.setHours(23, 59, 59, 999);

            filterOrders(activeFilter, searchText, dateStart, dateEnd);
        }

        function filterOrders(status, searchText, dateStart, dateEnd) {
            const normalizedSearch = searchText
                ? searchText.toLowerCase().trim()
                : "";
            const rows = document.querySelectorAll("#orders-table-body tr");

            rows.forEach((row) => {
                const rowStatus = row.dataset.status;
                const rowSearch = (row.dataset.search || "").toLowerCase();
                const rowDate = Number(row.dataset.date);

                const matchStatus = status === "all" || rowStatus === status;
                const matchSearch =
                    !normalizedSearch || rowSearch.includes(normalizedSearch);

                let matchDate = true;
                if (dateStart && rowDate < dateStart.getTime())
                    matchDate = false;
                if (dateEnd && rowDate > dateEnd.getTime()) matchDate = false;

                if (matchStatus && matchSearch && matchDate) {
                    row.classList.remove("hidden");
                } else {
                    row.classList.add("hidden");
                }
            });
        }

        // [New] Sort Logic
        document.querySelectorAll("th[data-sort]").forEach((th) => {
            // Clone node to remove old listeners (brute force cleanup)
            const newTh = th.cloneNode(true);
            th.parentNode.replaceChild(newTh, th);

            newTh.addEventListener("click", () => {
                const sortKey = newTh.dataset.sort;
                const tbody = document.getElementById("orders-table-body");
                const rows = Array.from(tbody.querySelectorAll("tr"));

                // Determine Sort Direction
                let direction = "asc";
                if (newTh.classList.contains("asc")) {
                    direction = "desc";
                }

                // Reset all headers
                document.querySelectorAll("th[data-sort]").forEach((t) => {
                    t.classList.remove("asc", "desc");
                });

                // Set current header
                newTh.classList.add(direction);
                newTh.classList.toggle("asc", direction === "asc");
                newTh.classList.toggle("desc", direction === "desc");

                // Sort Rows
                rows.sort((a, b) => {
                    let valA, valB;

                    if (sortKey === "date") {
                        valA = Number(a.dataset.date);
                        valB = Number(b.dataset.date);
                    } else if (sortKey === "price") {
                        valA = Number(a.dataset.price);
                        valB = Number(b.dataset.price);
                    } else if (sortKey === "id") {
                        valA = a.dataset.orderId;
                        valB = b.dataset.orderId;
                    } else {
                        // status
                        valA = a.dataset.status;
                        valB = b.dataset.status;
                    }

                    if (valA < valB) return direction === "asc" ? -1 : 1;
                    if (valA > valB) return direction === "asc" ? 1 : -1;
                    return 0;
                });

                // Re-append sorted rows
                rows.forEach((row) => tbody.appendChild(row));
            });
        });
    });
<\/script>`], ["", " <script>(function(){", '\n    // 1. \u0E2A\u0E48\u0E07\u0E02\u0E49\u0E2D\u0E21\u0E39\u0E25 orders \u0E40\u0E02\u0E49\u0E32 window \u0E17\u0E31\u0E19\u0E17\u0E35\u0E17\u0E35\u0E48\u0E42\u0E2B\u0E25\u0E14\n    window.allOrders = orders;\n\n    // 2. \u0E43\u0E0A\u0E49 astro:page-load \u0E40\u0E1E\u0E37\u0E48\u0E2D\u0E23\u0E31\u0E19\u0E2A\u0E04\u0E23\u0E34\u0E1B\u0E15\u0E4C\u0E43\u0E2B\u0E21\u0E48\u0E17\u0E38\u0E01\u0E04\u0E23\u0E31\u0E49\u0E07\u0E17\u0E35\u0E48\u0E40\u0E1B\u0E25\u0E35\u0E48\u0E22\u0E19\u0E2B\u0E19\u0E49\u0E32\u0E21\u0E32\n    document.addEventListener("astro:page-load", () => {\n        const modal = document.getElementById("order-modal");\n        const closeBtn = document.getElementById("close-modal");\n\n        // \u0E16\u0E49\u0E32\u0E44\u0E21\u0E48\u0E21\u0E35 modal \u0E43\u0E19\u0E2B\u0E19\u0E49\u0E32\u0E19\u0E35\u0E49\u0E43\u0E2B\u0E49\u0E2B\u0E22\u0E38\u0E14\u0E17\u0E33\u0E07\u0E32\u0E19 (\u0E1B\u0E49\u0E2D\u0E07\u0E01\u0E31\u0E19 Error \u0E40\u0E27\u0E25\u0E32\u0E2D\u0E22\u0E39\u0E48\u0E2B\u0E19\u0E49\u0E32\u0E2D\u0E37\u0E48\u0E19)\n        if (!modal) return;\n\n        // \u0E01\u0E33\u0E2B\u0E19\u0E14\u0E1F\u0E31\u0E07\u0E01\u0E4C\u0E0A\u0E31\u0E19\u0E40\u0E1B\u0E34\u0E14 Modal\n        window.openOrderModal = function (orderId) {\n            const order = window.allOrders.find((o) => o.id === orderId);\n            if (!order) return;\n\n            // Populate Header\n            document.getElementById("modal-order-id").innerText = order.id;\n            document.getElementById("modal-order-date").innerText = new Date(\n                order.created_at,\n            ).toLocaleString("th-TH");\n\n            // Populate Customer\n            document.getElementById("modal-customer-name").innerText =\n                order.customer_name || "Guest";\n            document.getElementById("modal-customer-email").innerText =\n                order.customer_email || "No Email";\n            document.getElementById("modal-customer-phone").innerText =\n                order.customer_phone || "-";\n            document.getElementById("modal-customer-address").innerText =\n                (order.shipping_address || "") +\n                " " +\n                (order.province || "") +\n                " " +\n                (order.zipcode || "");\n\n            // Avatar\n            const email = order.customer_email || "guest@example.com";\n            document.getElementById("modal-customer-img").src =\n                order.customer_avatar ||\n                \\`https://unavatar.io/\\${email}?fallback=https://source.boringavatars.com/marble/120/\\${encodeURIComponent(order.customer_name)}\\`;\n\n            // Populate Stats\n            const total = Number(order.total_price).toLocaleString();\n            document.getElementById("modal-total-price").innerText =\n                \\`\u0E3F\\${total}\\`;\n\n            const statusEl = document.getElementById("modal-status-badge");\n            statusEl.innerText = order.payment_status;\n            statusEl.className = \\`mt-1 inline-flex px-3 py-1 rounded font-bold uppercase text-sm \\${\n                order.payment_status === "paid"\n                    ? "bg-green-500/10 text-green-500"\n                    : order.payment_status === "pending"\n                      ? "bg-yellow-500/10 text-yellow-500"\n                      : order.payment_status === "shipped"\n                        ? "bg-blue-500/10 text-blue-500"\n                        : "bg-red-500/10 text-red-500"\n            }\\`;\n\n            // Prepare Action Button\n            const actionBtn = document.getElementById("modal-action-btn");\n            if (order.payment_status === "pending") {\n                actionBtn.textContent = "Confirm Payment";\n                actionBtn.dataset.action = "paid";\n                actionBtn.dataset.orderId = order.id;\n                actionBtn.disabled = false;\n                actionBtn.classList.remove("hidden");\n            } else if (order.payment_status === "paid") {\n                actionBtn.textContent = "Confirm Shipping";\n                actionBtn.dataset.action = "ship";\n                actionBtn.dataset.orderId = order.id;\n                actionBtn.disabled = false;\n                actionBtn.classList.remove("hidden");\n            } else {\n                actionBtn.classList.add("hidden");\n                actionBtn.dataset.action = "";\n                actionBtn.dataset.orderId = "";\n            }\n\n            // Populate Tracking Number\n            const trackingContainer = document.getElementById(\n                "modal-tracking-container",\n            );\n            const trackingEl = document.getElementById("modal-tracking-number");\n\n            if (order.tracking_number) {\n                trackingContainer.classList.remove("hidden");\n                trackingEl.innerText = order.tracking_number;\n            } else {\n                trackingContainer.classList.add("hidden");\n                trackingEl.innerText = "-";\n            }\n\n            // Populate Items\n            const tbody = document.getElementById("modal-items-list");\n            tbody.innerHTML = order.order_items\n                .map(\n                    (item) => \\`\n                <tr class="hover:bg-white/2">\n                    <td class="p-4 flex items-center gap-4">\n                        <div class="w-12 h-12 bg-white/5 rounded overflow-hidden shrink-0">\n                            <img src="\\${item.image_url || "https://placehold.co/100"}" class="w-full h-full object-cover">\n                        </div>\n                        <div>\n                            <div class="text-white font-bold flex items-center">\n                                \\${item.title}\n                                \\${item.variant_name ? \\`<span class="bg-[#D4AF37]/20 text-[#D4AF37] text-[10px] px-2 py-0.5 rounded ml-2 uppercase tracking-wide border border-[#D4AF37]/30">\\${item.variant_name}</span>\\` : ""}\n                            </div>\n                            <div class="text-xs text-white/40">ID: \\${item.id.slice(0, 8)}...</div>\n                        </div>\n                    </td>\n                    <td class="p-4 text-center text-white/70">\\${item.quantity}</td>\n                    <td class="p-4 text-right text-white/70">\u0E3F\\${Number(item.price).toLocaleString()}</td>\n                     <td class="p-4 text-right font-bold text-white">\u0E3F\\${(Number(item.price) * item.quantity).toLocaleString()}</td>\n                </tr>\n            \\`,\n                )\n                .join("");\n\n            // Populate Payment Proof\n            const proofDiv = document.getElementById("modal-proof-content");\n            document.getElementById("modal-payment-method").innerText =\n                order.payment_method;\n\n            if (order.slip_image?.startsWith("TX:")) {\n                const tx = order.slip_image.replace("TX:", "");\n                proofDiv.innerHTML = \\`\n                    <div class="text-center p-4">\n                        <p class="text-green-400 font-mono text-xs break-all mb-2">\\${tx}</p>\n                        <a href="https://etherscan.io/tx/\\${tx}" target="_blank" class="text-[#D4AF37] underline text-xs">Verify on Blockchain</a>\n                    </div>\n                \\`;\n            } else if (order.slip_image) {\n                let src;\n                if (\n                    order.slip_image.startsWith("http://") ||\n                    order.slip_image.startsWith("https://")\n                ) {\n                    src = order.slip_image;\n                } else if (order.slip_image.startsWith("/")) {\n                    src = order.slip_image;\n                } else if (order.slip_image.includes("data:")) {\n                    src = order.slip_image;\n                } else {\n                    src = \\`data:image/png;base64,\\${order.slip_image}\\`;\n                }\n                proofDiv.innerHTML = \\`<img src="\\${src}" class="max-h-[200px] object-contain rounded cursor-pointer" onclick="window.open(this.src)">\\`;\n            } else {\n                proofDiv.innerHTML = \\`<p class="text-white/30 text-sm">No proof uploaded</p>\\`;\n            }\n\n            modal.classList.remove("hidden");\n        };\n\n        // \u0E1C\u0E39\u0E01 Event Listener \u0E01\u0E31\u0E1A\u0E1B\u0E38\u0E48\u0E21\u0E1B\u0E34\u0E14\n        closeBtn?.addEventListener("click", () => {\n            modal.classList.add("hidden");\n        });\n    });\n\n    document.addEventListener("click", (e) => {\n        const btn = e.target.closest("#modal-action-btn");\n        if (!btn) return;\n\n        const action = btn.dataset.action;\n        const orderId = btn.dataset.orderId;\n\n        if (!action || !orderId) return;\n\n        if (action === "paid") {\n            window.updateStatus(orderId, "paid");\n        }\n\n        if (action === "ship") {\n            window.updateStatus(orderId, "shipped");\n        }\n    });\n})();<\/script> ', ` <script>
    document.addEventListener("astro:page-load", () => {
        console.log("Admin Orders Script Loaded"); // Debugging

        // [New] Filter Logic - Unified Handler
        document.addEventListener("click", (e) => {
            // 1. Action Buttons (View/Paid/Ship)
            const btn = e.target.closest("button[data-action]");
            if (btn) {
                const { action, orderId } = btn.dataset;
                if (action && orderId) {
                    if (action === "view") window.openOrderModal(orderId);
                    if (action === "paid") window.updateStatus(orderId, "paid");
                    if (action === "ship")
                        window.updateStatus(orderId, "shipped");
                }
                return; // Exit early if action button
            }

            // 2. Filter Tabs (All/Pending/Paid/Shipped)
            const filterBtn = e.target.closest("button[data-filter]");
            if (filterBtn) {
                // Update Active UI State
                document
                    .querySelectorAll("button[data-filter]")
                    .forEach((b) => {
                        b.classList.remove("bg-[#D4AF37]", "text-black");
                        b.classList.add("bg-white/5", "text-white/70");
                        b.removeAttribute("data-active");
                    });
                filterBtn.classList.remove("bg-white/5", "text-white/70");
                filterBtn.classList.add("bg-[#D4AF37]", "text-black");
                filterBtn.setAttribute("data-active", "true");

                // Trigger Central Filter
                triggerFilter();
            }
        });

        // 3. Input Listeners (Search & Date)
        const searchInput = document.getElementById("order-search");
        const dateStartInput = document.getElementById("date-start");
        const dateEndInput = document.getElementById("date-end");

        if (searchInput) {
            searchInput.removeEventListener("input", triggerFilter); // Clean up old
            searchInput.addEventListener("input", triggerFilter);
        }
        if (dateStartInput) {
            dateStartInput.removeEventListener("change", triggerFilter);
            dateStartInput.addEventListener("change", triggerFilter);
        }
        if (dateEndInput) {
            dateEndInput.removeEventListener("change", triggerFilter);
            dateEndInput.addEventListener("change", triggerFilter);
        }

        // --- Central Filter Logic ---
        function triggerFilter() {
            const searchInput = document.getElementById("order-search");
            const dateStartInput = document.getElementById("date-start");
            const dateEndInput = document.getElementById("date-end");

            const searchText = searchInput ? searchInput.value : "";
            // Fix: Use data-active attribute for selection
            const activeBtn = document.querySelector(
                "button[data-filter][data-active='true']",
            );
            const activeFilter = activeBtn ? activeBtn.dataset.filter : "all";

            const dateStart =
                dateStartInput && dateStartInput.valueAsDate
                    ? dateStartInput.valueAsDate
                    : null;
            const dateEnd =
                dateEndInput && dateEndInput.valueAsDate
                    ? dateEndInput.valueAsDate
                    : null;

            // Adjust dateEnd to include the full day (23:59:59)
            if (dateEnd) dateEnd.setHours(23, 59, 59, 999);

            filterOrders(activeFilter, searchText, dateStart, dateEnd);
        }

        function filterOrders(status, searchText, dateStart, dateEnd) {
            const normalizedSearch = searchText
                ? searchText.toLowerCase().trim()
                : "";
            const rows = document.querySelectorAll("#orders-table-body tr");

            rows.forEach((row) => {
                const rowStatus = row.dataset.status;
                const rowSearch = (row.dataset.search || "").toLowerCase();
                const rowDate = Number(row.dataset.date);

                const matchStatus = status === "all" || rowStatus === status;
                const matchSearch =
                    !normalizedSearch || rowSearch.includes(normalizedSearch);

                let matchDate = true;
                if (dateStart && rowDate < dateStart.getTime())
                    matchDate = false;
                if (dateEnd && rowDate > dateEnd.getTime()) matchDate = false;

                if (matchStatus && matchSearch && matchDate) {
                    row.classList.remove("hidden");
                } else {
                    row.classList.add("hidden");
                }
            });
        }

        // [New] Sort Logic
        document.querySelectorAll("th[data-sort]").forEach((th) => {
            // Clone node to remove old listeners (brute force cleanup)
            const newTh = th.cloneNode(true);
            th.parentNode.replaceChild(newTh, th);

            newTh.addEventListener("click", () => {
                const sortKey = newTh.dataset.sort;
                const tbody = document.getElementById("orders-table-body");
                const rows = Array.from(tbody.querySelectorAll("tr"));

                // Determine Sort Direction
                let direction = "asc";
                if (newTh.classList.contains("asc")) {
                    direction = "desc";
                }

                // Reset all headers
                document.querySelectorAll("th[data-sort]").forEach((t) => {
                    t.classList.remove("asc", "desc");
                });

                // Set current header
                newTh.classList.add(direction);
                newTh.classList.toggle("asc", direction === "asc");
                newTh.classList.toggle("desc", direction === "desc");

                // Sort Rows
                rows.sort((a, b) => {
                    let valA, valB;

                    if (sortKey === "date") {
                        valA = Number(a.dataset.date);
                        valB = Number(b.dataset.date);
                    } else if (sortKey === "price") {
                        valA = Number(a.dataset.price);
                        valB = Number(b.dataset.price);
                    } else if (sortKey === "id") {
                        valA = a.dataset.orderId;
                        valB = b.dataset.orderId;
                    } else {
                        // status
                        valA = a.dataset.status;
                        valB = b.dataset.status;
                    }

                    if (valA < valB) return direction === "asc" ? -1 : 1;
                    if (valA > valB) return direction === "asc" ? 1 : -1;
                    return 0;
                });

                // Re-append sorted rows
                rows.forEach((row) => tbody.appendChild(row));
            });
        });
    });
<\/script>`])), renderComponent($$result, "AdminLayout", $$AdminLayout, { "title": "Orders" }, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="space-y-6"> <div class="flex justify-between items-center"> <h1 class="text-3xl font-black text-white uppercase tracking-wider">
Order Management
</h1> <div class="flex gap-2"> <button class="px-4 py-2 bg-white/5 rounded text-sm text-white hover:bg-white/10">Export CSV</button> </div> </div> <div class="flex flex-col md:flex-row gap-4 justify-between items-center bg-black/10 backdrop-blur-md p-4 rounded-xl border border-white/10"> <!-- Search --> <div class="relative w-full md:w-96"> <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg> <input type="text" id="order-search" placeholder="Search Order ID or Customer..." class="w-full bg-white/5 border border-white/10 rounded-lg pl-10 pr-4 py-2 text-sm text-white focus:outline-none focus:border-[#D4AF37] transition-colors"> </div> <!-- Filters --> <div class="flex flex-col md:flex-row gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0 items-center" id="filter-buttons"> <div class="flex items-center gap-2 bg-white/5 p-1 rounded-lg border border-white/10 mr-2"> <input type="date" id="date-start" class="bg-transparent text-white text-xs px-2 focus:outline-none [color-scheme:dark]"> <span class="text-white/30 text-xs">-</span> <input type="date" id="date-end" class="bg-transparent text-white text-xs px-2 focus:outline-none [color-scheme:dark]"> </div> <button data-filter="all" data-active="true" class="px-4 py-2 rounded-lg text-sm font-bold bg-[#D4AF37] text-black hover:bg-white transition-colors whitespace-nowrap">
All
</button> <button data-filter="pending" class="px-4 py-2 rounded-lg text-sm font-bold bg-white/5 text-white/70 hover:bg-white/10 transition-colors whitespace-nowrap">
Pending
</button> <button data-filter="paid" class="px-4 py-2 rounded-lg text-sm font-bold bg-white/5 text-white/70 hover:bg-white/10 transition-colors whitespace-nowrap">
Paid
</button> <button data-filter="shipped" class="px-4 py-2 rounded-lg text-sm font-bold bg-white/5 text-white/70 hover:bg-white/10 transition-colors whitespace-nowrap">
Shipped
</button> </div> </div> <div class="bg-black/10 backdrop-blur-md border border-white/10 rounded-xl overflow-hidden"> <div class="overflow-x-auto"> <table class="w-full text-left text-sm text-white/70"> <thead class="bg-white/5 text-white font-bold uppercase text-xs tracking-wider"> <tr> <th class="p-4 cursor-pointer hover:text-[#D4AF37] select-none group" data-sort="id">
Order ID <span class="hidden group-[.asc]:inline">▲</span><span class="hidden group-[.desc]:inline">▼</span> </th> <th class="p-4 cursor-pointer hover:text-[#D4AF37] select-none group" data-sort="date">
Date <span class="hidden group-[.asc]:inline">▲</span><span class="hidden group-[.desc]:inline">▼</span> </th> <th class="p-4">Customer</th> <th class="p-4">Items</th> <th class="p-4 text-right cursor-pointer hover:text-[#D4AF37] select-none group" data-sort="price">
Total <span class="hidden group-[.asc]:inline">▲</span><span class="hidden group-[.desc]:inline">▼</span> </th> <th class="p-4">Payment</th> <th class="p-4 cursor-pointer hover:text-[#D4AF37] select-none group" data-sort="status">
Status <span class="hidden group-[.asc]:inline">▲</span><span class="hidden group-[.desc]:inline">▼</span> </th> <th class="p-4 text-right">Actions</th> </tr> </thead> <tbody class="divide-y divide-white/5" id="orders-table-body"> ${orders?.map((order) => renderTemplate`<tr class="hover:bg-white/2 transition-colors transition-all duration-300"${addAttribute(order.id, "data-order-id")}${addAttribute(order.payment_status, "data-status")}${addAttribute(`${order.id} ${order.customer_name}`.toLowerCase(), "data-search")}${addAttribute(new Date(
    order.created_at
  ).getTime(), "data-date")}${addAttribute(order.total_price, "data-price")}> <td class="p-4 font-mono text-white/50"> <span class="text-white font-bold"> ${order.id} </span> </td> <td class="p-4"> ${new Date(
    order.created_at
  ).toLocaleDateString("th-TH", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit"
  })} </td> <td class="p-4"> <div class="font-bold text-white"> ${order.customer_name} </div> <div class="text-xs text-white/40"> ${order.shipping_address} </div> </td> <td class="p-4"> ${order.order_items.reduce(
    (sum, item) => sum + Number(item.quantity || 0),
    0
  )}${" "}
items
<div class="text-xs text-white/40 mt-1 truncate max-w-[150px]"> ${order.order_items.map((i) => i.title).join(", ")} </div> </td> <td class="p-4 text-right"> <div class="font-bold text-white"> ${thbFormatter.format(
    order.total_price
  )} </div> ${order.total_sats > 0 && renderTemplate`<div class="text-[10px] text-[#D4AF37]"> ${Number(
    order.total_sats
  ).toLocaleString()}${" "}
Sats
</div>`} </td> <td class="p-4"> <span class="text-xs font-bold"> ${order.payment_method} </span> </td> <td class="p-4"> <span${addAttribute(`px-2 py-1 rounded text-xs font-bold uppercase ${order.payment_status === "paid" ? "bg-green-500/10 text-green-500" : order.payment_status === "pending" ? "bg-yellow-500/10 text-yellow-500" : order.payment_status === "shipped" ? "bg-blue-500/10 text-blue-500" : "bg-red-500/10 text-red-500"}`, "class")}> ${order.payment_status} </span> </td> <td class="p-4 text-right"> <div class="flex justify-end gap-2"> <button type="button" data-action="view"${addAttribute(order.id, "data-order-id")} class="bg-white/10 hover:bg-white/20 text-white text-xs px-3 py-1.5 rounded font-bold transition-colors">
VIEW
</button> ${order.payment_status === "pending" && renderTemplate`<button type="button" data-action="paid"${addAttribute(order.id, "data-order-id")} class="bg-green-600 hover:bg-green-500 text-white text-xs px-3 py-1.5 rounded font-bold">
Confirm Paid
</button>`} ${order.payment_status === "paid" && renderTemplate`<button type="button" data-action="ship"${addAttribute(order.id, "data-order-id")} class="bg-blue-600 hover:bg-blue-500 text-white text-xs px-3 py-1.5 rounded font-bold">
Ship
</button>`} </div> </td> </tr>`)} ${!orders?.length && renderTemplate`<tr> <td colspan="8" class="p-8 text-center text-white/30">
No orders found.
</td> </tr>`} </tbody> </table> </div> </div> </div> <div id="order-modal" class="fixed inset-0 z-50 bg-black/90 hidden flex items-center justify-center p-4 backdrop-blur-sm"> <div class="bg-[#111] border border-[#D4AF37]/30 rounded-2xl w-full max-w-4xl h-[90vh] flex flex-col relative overflow-hidden shadow-[0_0_50px_rgba(212,175,55,0.1)]"> <div class="p-6 border-b border-white/10 flex justify-between items-center bg-[#1A1A1A]"> <div> <h2 class="text-2xl font-black text-white uppercase tracking-wider flex items-center gap-3">
Order #<span id="modal-order-id" class="text-[#D4AF37]"></span> </h2> <p class="text-white/40 text-sm mt-1" id="modal-order-date"></p> </div> <button id="close-modal" class="w-10 h-10 rounded-full bg-white/5 hover:bg-white/20 flex items-center justify-center text-white transition-colors"> <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6 6 18"></path><path d="m6 6 12 12"></path></svg> </button> </div> <div class="flex-1 overflow-y-auto p-8 space-y-8"> <div class="grid grid-cols-1 md:grid-cols-3 gap-8"> <div class="bg-white/5 rounded-xl p-6 border border-white/5 flex flex-col items-center text-center"> <div class="w-24 h-24 rounded-full p-1 bg-gradient-to-br from-[#D4AF37] to-transparent mb-4"> <img id="modal-customer-img" src="" class="w-full h-full rounded-full object-cover bg-black"> </div> <h3 class="text-xl font-bold text-white mb-1" id="modal-customer-name"></h3> <p class="text-[#D4AF37] text-sm font-mono mb-4" id="modal-customer-role">
Guest Customer
</p> <div class="w-full space-y-3 text-left bg-black/30 p-4 rounded-lg"> <div class="flex items-center gap-3 text-sm text-white/70"> <svg class="w-4 h-4 text-[#D4AF37]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg> <span id="modal-customer-phone"></span> </div> <div class="flex items-center gap-3 text-sm text-white/70"> <svg class="w-4 h-4 text-[#D4AF37]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect width="20" height="16" x="2" y="4" rx="2"></rect><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path></svg> <span id="modal-customer-email" class="truncate"></span> </div> <div class="flex items-start gap-3 text-sm text-white/70"> <svg class="w-4 h-4 text-[#D4AF37] shrink-0 mt-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"></path><circle cx="12" cy="10" r="3"></circle></svg> <span id="modal-customer-address"></span> </div> </div> </div> <div class="col-span-2 space-y-6"> <div class="grid grid-cols-2 gap-4"> <div class="bg-[#D4AF37] text-black p-4 rounded-xl"> <p class="text-xs font-black uppercase tracking-widest opacity-70">
Total Paid
</p> <p class="text-3xl font-black mt-1" id="modal-total-price">
฿0
</p> </div> <div class="bg-white/5 text-white p-4 rounded-xl border border-white/10"> <p class="text-xs font-black uppercase tracking-widest opacity-50">
Status
</p> <div class="mt-1 inline-flex px-3 py-1 rounded font-bold uppercase text-sm" id="modal-status-badge">
PENDING
</div> </div> <!-- Tracking # Display --> <div class="bg-white/5 text-white p-4 rounded-xl border border-white/10 col-span-2 hidden" id="modal-tracking-container"> <p class="text-xs font-black uppercase tracking-widest opacity-50">
Tracking Number
</p> <p class="text-lg font-mono font-bold mt-1 text-[#D4AF37]" id="modal-tracking-number">
-
</p> </div> </div> </div> <div class="bg-white/5 rounded-xl p-6 border border-white/5"> <h4 class="text-white font-bold uppercase text-sm mb-4">
Payment Proof via <span id="modal-payment-method" class="text-[#D4AF37]"></span> </h4> <div id="modal-proof-content" class="min-h-[150px] bg-black/50 rounded-lg flex items-center justify-center border border-dashed border-white/20"></div> </div> </div> </div> <div> <h3 class="text-xl font-bold text-white mb-6 flex items-center gap-3"> <span class="w-2 h-2 bg-[#D4AF37] rounded-full"></span>
Ordered Items
</h3> <div class="bg-[#0A0A0A] rounded-xl overflow-hidden border border-white/10"> <table class="w-full text-left"> <thead class="bg-white/5 text-white/50 text-xs font-bold uppercase tracking-wider"> <tr> <th class="p-4">Product</th> <th class="p-4 text-center">Qty</th> <th class="p-4 text-right">Price</th> <th class="p-4 text-right">Total</th> </tr> </thead> <tbody class="divide-y divide-white/5 text-sm" id="modal-items-list"></tbody> </table> </div> </div> </div> <div class="p-6 border-t border-white/10 bg-[#1A1A1A] flex justify-end gap-4"> <button class="px-6 py-2 rounded-lg font-bold text-white/70 hover:text-white transition-colors" onclick="document.getElementById('order-modal').classList.add('hidden')">Close</button> <button id="modal-action-btn" class="px-6 py-2 rounded-lg font-bold bg-[#D4AF37] text-black hover:bg-white transition-colors shadow-lg shadow-[#D4AF37]/20">
Mark as Paid
</button> </div> </div> ` }), defineScriptVars({ orders }), renderScript($$result, "/Users/natthapongsuwanjit/Desktop/CashlessThailand/cashlessthailand/src/pages/admin/orders.astro?astro&type=script&index=0&lang.ts"));
}, "/Users/natthapongsuwanjit/Desktop/CashlessThailand/cashlessthailand/src/pages/admin/orders.astro", void 0);

const $$file = "/Users/natthapongsuwanjit/Desktop/CashlessThailand/cashlessthailand/src/pages/admin/orders.astro";
const $$url = "/admin/orders";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
    __proto__: null,
    default: $$Orders,
    file: $$file,
    url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
