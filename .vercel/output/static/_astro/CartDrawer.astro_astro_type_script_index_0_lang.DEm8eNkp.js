import{c}from"./cartStore.IpiDG6ld.js";document.addEventListener("astro:page-load",()=>{const l=document.getElementById("cart-drawer-container"),d=document.getElementById("cart-backdrop"),u=document.getElementById("cart-panel"),f=document.getElementById("close-cart-btn"),a=document.getElementById("cart-items-container"),h=document.getElementById("cart-total"),m=document.getElementById("cart-sats"),s=document.getElementById("checkout-btn");if(!l||!u){console.warn("CartDrawer DOM not found");return}const w=t=>{t?(l.classList.remove("invisible","pointer-events-none"),p(),requestAnimationFrame(()=>{d?.classList.remove("opacity-0"),u?.classList.remove("translate-x-full")})):(d?.classList.add("opacity-0"),u?.classList.add("translate-x-full"),setTimeout(()=>{l.classList.add("invisible","pointer-events-none")},300))};let i=null,v=0;const b=6e4;async function g(){const t=Date.now();if(i&&t-v<b)return i;try{const o=await(await fetch("https://api.bitkub.com/api/v3/market/ticker?sym=BTC_THB")).json();let e=0;if(Array.isArray(o)&&o[0]?.last&&(e=parseFloat(o[0].last)),e)return i=e,v=t,e;throw new Error("Invalid Bitkub v3 data")}catch(n){return console.error("BTC price fetch error:",n),i||33e5}}const p=async()=>{try{const t=c.get(),{total:n}=c.totals(),o=await g(),e=Math.ceil(n/o*1e8);h&&(h.innerText=n.toLocaleString()+" THB"),m&&(m.innerText="≈ "+e.toLocaleString()+" SATS"),t.length===0?(a&&(a.innerHTML=`
                            <div class="flex flex-col items-center justify-center h-48 text-white/30">
                                <svg class="w-12 h-12 mb-3 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path></svg>
                                <p class="text-sm uppercase tracking-widest font-bold">Your cart is empty</p>
                            </div>
                        `),s&&(s.disabled=!0,s.classList.add("opacity-50","pointer-events-none"))):(s&&(s.disabled=!1,s.classList.remove("opacity-50","pointer-events-none")),a&&(a.innerHTML=t.map(r=>`
                            <div class="flex gap-4 items-center bg-white/5 p-3 rounded-xl border border-white/5 relative group">
                                <div class="w-16 h-16 bg-black rounded-lg overflow-hidden shrink-0">
                                    <img src="${r.image}" class="w-full h-full object-cover" onerror="this.src='https://placehold.co/100x100?text=No+Image'"/>
                                </div>
                                <div class="flex-1 min-w-0">
                                    <h3 class="text-sm font-bold text-white truncate pr-6">${r.title}</h3>
                                    <div class="flex items-center justify-between mt-2">
                                        <p class="text-[#D4AF37] text-xs font-bold">${Number(r.price).toLocaleString()} ฿</p>
                                        <div class="flex items-center gap-2 bg-black/40 rounded-lg p-1">
                                            <button class="qty-btn w-6 h-6 flex items-center justify-center text-white/50 hover:text-white transition-colors" data-action="minus" data-id="${r.id}">-</button>
                                            <span class="text-xs font-bold text-white w-4 text-center">${r.quantity}</span>
                                            <button class="qty-btn w-6 h-6 flex items-center justify-center text-white/50 hover:text-white transition-colors" data-action="plus" data-id="${r.id}">+</button>
                                        </div>
                                    </div>
                                </div>
                                <button class="remove-btn absolute top-2 right-2 text-white/20 hover:text-red-400 transition-colors p-1" data-id="${r.id}">
                                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
                                </button>
                            </div>
                        `).join(""),x()))}catch(t){console.error("Render Cart Error:",t)}},x=()=>{a&&(a.querySelectorAll(".qty-btn").forEach(t=>{t.addEventListener("click",n=>{const o=n.currentTarget,e=o.dataset.id,r=o.dataset.action;e&&c.updateQty(e,r==="plus"?1:-1)})}),a.querySelectorAll(".remove-btn").forEach(t=>{t.addEventListener("click",n=>{const e=n.currentTarget.dataset.id;e&&c.remove(e)})}),s&&(s.onclick=()=>{window.location.href="/checkout"}))};window.addEventListener("toggle-cart",t=>{w(t.detail?.open)}),window.addEventListener("cart-updated",()=>{p()}),d?.addEventListener("click",()=>c.close()),f?.addEventListener("click",()=>c.close()),p()});
