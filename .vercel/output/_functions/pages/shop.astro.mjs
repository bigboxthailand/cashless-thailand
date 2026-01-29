import { e as createComponent, k as renderComponent, r as renderTemplate, m as maybeRenderHead, h as addAttribute } from '../chunks/astro/server_Bu8JVBjn.mjs';
import 'piccolore';
import { $ as $$Layout, a as $$Navbar, b as $$CartDrawer } from '../chunks/Navbar_DWavSQqS.mjs';
import { $ as $$Footer } from '../chunks/Footer_BP6qeS3w.mjs';
import { s as supabase } from '../chunks/supabase_BcyI2ayE.mjs';
/* empty css                                */
export { renderers } from '../renderers.mjs';

const $$Shop = createComponent(async ($$result, $$props, $$slots) => {
  let allProducts = [];
  const { data, error } = await supabase.from("products").select("*").order("created_at", { ascending: false });
  if (error) {
    console.error("Error fetching products:", error);
  } else {
    allProducts = data || [];
  }
  const categories = [
    {
      id: "clock",
      title: "CryptoClock Series",
      desc: "\u0E19\u0E32\u0E2C\u0E34\u0E01\u0E32\u0E04\u0E23\u0E34\u0E1B\u0E42\u0E15\u0E2A\u0E33\u0E2B\u0E23\u0E31\u0E1A\u0E17\u0E38\u0E01\u0E44\u0E25\u0E1F\u0E4C\u0E2A\u0E44\u0E15\u0E25\u0E4C"
    },
    {
      id: "kiosk",
      title: "BiTTerm Solutions",
      desc: "\u0E15\u0E39\u0E49\u0E41\u0E25\u0E01\u0E40\u0E2B\u0E23\u0E35\u0E22\u0E0D\u0E41\u0E25\u0E30\u0E40\u0E15\u0E34\u0E21\u0E40\u0E07\u0E34\u0E19\u0E2D\u0E31\u0E15\u0E42\u0E19\u0E21\u0E31\u0E15\u0E34"
    },
    {
      id: "pos",
      title: "Point of Sale (POS)",
      desc: "\u0E23\u0E30\u0E1A\u0E1A\u0E23\u0E31\u0E1A\u0E0A\u0E33\u0E23\u0E30\u0E40\u0E07\u0E34\u0E19\u0E2A\u0E33\u0E2B\u0E23\u0E31\u0E1A\u0E23\u0E49\u0E32\u0E19\u0E04\u0E49\u0E32\u0E22\u0E38\u0E04\u0E43\u0E2B\u0E21\u0E48"
    },
    {
      id: "node",
      title: "Infrastructure",
      desc: "\u0E2D\u0E38\u0E1B\u0E01\u0E23\u0E13\u0E4C\u0E23\u0E31\u0E19\u0E42\u0E2B\u0E19\u0E14\u0E40\u0E1E\u0E37\u0E48\u0E2D\u0E04\u0E27\u0E32\u0E21\u0E40\u0E1B\u0E47\u0E19\u0E2A\u0E48\u0E27\u0E19\u0E15\u0E31\u0E27"
    },
    {
      id: "shirt",
      title: "Bitcoin WEAR",
      desc: "\u0E40\u0E2A\u0E37\u0E49\u0E2D\u0E04\u0E23\u0E34\u0E1B\u0E42\u0E15\u0E2A\u0E33\u0E2B\u0E23\u0E31\u0E1A\u0E2A\u0E32\u0E22 Hodl"
    },
    {
      id: "keychain",
      title: "Crypto Keychains",
      desc: "\u0E1E\u0E27\u0E07\u0E01\u0E38\u0E0D\u0E41\u0E08\u0E02\u0E2D\u0E07\u0E2A\u0E30\u0E2A\u0E21"
    },
    {
      id: "mug",
      title: "Holder Mugs",
      desc: "\u0E41\u0E01\u0E49\u0E27\u0E19\u0E49\u0E33\u0E0A\u0E32\u0E27\u0E14\u0E2D\u0E22"
    }
  ];
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "Shop | Cashless Thailand", "data-astro-cid-5w43p2qc": true }, { "default": async ($$result2) => renderTemplate` ${renderComponent($$result2, "Navbar", $$Navbar, { "data-astro-cid-5w43p2qc": true })} ${renderComponent($$result2, "CartDrawer", $$CartDrawer, { "data-astro-cid-5w43p2qc": true })} ${maybeRenderHead()}<main class="bg-[#050505] min-h-screen pb-32" data-astro-cid-5w43p2qc> <div class="relative pt-40 pb-20 px-6 text-center overflow-hidden" data-astro-cid-5w43p2qc> <div class="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-[500px] bg-[#D4AF37]/10 rounded-full blur-[120px] pointer-events-none" data-astro-cid-5w43p2qc></div> <h1 class="text-6xl md:text-8xl font-[900] text-white uppercase tracking-tighter mb-6 relative z-10 animate-fade-in-up" data-astro-cid-5w43p2qc>
Store <span class="text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] via-[#F4E08F] to-[#D4AF37]" data-astro-cid-5w43p2qc>Catalog</span> </h1> <p class="text-white/60 font-light text-lg max-w-2xl mx-auto relative z-10 animate-fade-in-up delay-100" data-astro-cid-5w43p2qc>
นวัตกรรม Bitcoin Hardware ฝีมือคนไทย
                ที่ผสมผสานเทคโนโลยีเข้ากับไลฟ์สไตล์ของคุณ
</p> </div> <div class="max-w-[1400px] mx-auto px-6 md:px-12 space-y-32" data-astro-cid-5w43p2qc> ${categories.map((cat, index) => {
    const categoryProducts = allProducts.filter((p) => {
      const productCategory = p.category || p.config?.category || "";
      return productCategory.toLowerCase() === cat.id.toLowerCase();
    });
    if (categoryProducts.length === 0) return null;
    return renderTemplate`<section${addAttribute(cat.id, "id")} class="scroll-mt-32" data-astro-cid-5w43p2qc> <div class="flex items-center gap-6 mb-12 group cursor-default" data-astro-cid-5w43p2qc> <div class="h-[1px] flex-1 bg-gradient-to-r from-transparent to-[#D4AF37]/50" data-astro-cid-5w43p2qc></div> <h2 class="text-3xl md:text-4xl font-[900] text-white uppercase tracking-tight text-center" data-astro-cid-5w43p2qc> <span class="text-[#D4AF37] block text-sm tracking-[0.3em] mb-2 font-medium" data-astro-cid-5w43p2qc>
0${index + 1} Collection
</span> ${cat.title} </h2> <div class="h-[1px] flex-1 bg-gradient-to-l from-transparent to-[#D4AF37]/50" data-astro-cid-5w43p2qc></div> </div> <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8" data-astro-cid-5w43p2qc> ${categoryProducts.map((rawItem, i) => {
      const parse = (val) => typeof val === "string" ? JSON.parse(val) : val;
      const item = {
        ...rawItem,
        meta: parse(rawItem.meta) || {},
        pricing: parse(rawItem.pricing) || {},
        config: parse(rawItem.config) || {},
        media: parse(rawItem.media) || {}
      };
      let displayPrice = item.pricing.basePrice || 0;
      if ((displayPrice === 0 || !displayPrice) && item.config.variants && item.config.variants.length > 0) {
        displayPrice = item.config.variants[0].price || 0;
      }
      return renderTemplate`<a${addAttribute(`/products/${item.id}`, "href")} class="group relative block bg-[#111] rounded-[20px] overflow-hidden border border-white/5 hover:border-[#D4AF37]/50 transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_10px_40px_-10px_rgba(212,175,55,0.2)] product-card-anim"${addAttribute(`animation-delay: ${i * 100}ms`, "style")} data-astro-cid-5w43p2qc> <div class="aspect-[4/5] relative overflow-hidden bg-[#0a0a0a]" data-astro-cid-5w43p2qc> <img${addAttribute(item.media.mainImage, "src")}${addAttribute(item.meta.title, "alt")} class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" loading="lazy" onerror="this.src='https://placehold.co/600x800/1a1a1a/FFF?text=No+Image'" data-astro-cid-5w43p2qc> <div class="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent opacity-60" data-astro-cid-5w43p2qc></div>  ${item.meta.tags && item.meta.tags.length > 0 && renderTemplate`<div class="absolute top-3 left-3 px-3 py-1 bg-[#D4AF37] text-black text-[10px] font-black uppercase tracking-widest rounded-full shadow-lg z-10" data-astro-cid-5w43p2qc> ${item.meta.tags[0]} </div>`} <div class="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/20 backdrop-blur-[2px]" data-astro-cid-5w43p2qc> <span class="px-6 py-3 bg-white text-black font-bold uppercase tracking-wider rounded-full transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 shadow-xl hover:bg-[#D4AF37] hover:scale-105" data-astro-cid-5w43p2qc>
View Details
</span> </div> </div> <div class="p-6 relative bg-[#111]" data-astro-cid-5w43p2qc> <div class="absolute -top-10 left-0 w-full h-10 bg-gradient-to-t from-[#111] to-transparent" data-astro-cid-5w43p2qc></div> <h3 class="text-lg font-bold text-white mb-1 group-hover:text-[#D4AF37] transition-colors line-clamp-1" data-astro-cid-5w43p2qc> ${item.meta.title} </h3> <p class="text-xs text-white/40 mb-4 font-light line-clamp-1" data-astro-cid-5w43p2qc> ${item.meta.description} </p> <div class="flex items-center justify-between pt-4 border-t border-white/5" data-astro-cid-5w43p2qc> <div class="flex flex-col" data-astro-cid-5w43p2qc> <span class="text-[10px] text-white/40 uppercase tracking-widest" data-astro-cid-5w43p2qc>
Starts at
</span> <span class="text-xl font-black text-[#D4AF37] eng" data-astro-cid-5w43p2qc> ${displayPrice.toLocaleString()}${" "} <span class="text-xs font-medium text-white/50" data-astro-cid-5w43p2qc> ${item.pricing.currency || "THB"} </span> </span> </div> <div class="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-[#D4AF37] group-hover:text-black transition-colors" data-astro-cid-5w43p2qc> <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" data-astro-cid-5w43p2qc> <path d="m9 18 6-6-6-6" data-astro-cid-5w43p2qc></path> </svg> </div> </div> </div> </a>`;
    })} </div> </section>`;
  })} </div> </main> ${renderComponent($$result2, "Footer", $$Footer, { "data-astro-cid-5w43p2qc": true })} ` })} `;
}, "/Users/natthapongsuwanjit/Desktop/CashlessThailand/cashlessthailand/src/pages/shop.astro", void 0);

const $$file = "/Users/natthapongsuwanjit/Desktop/CashlessThailand/cashlessthailand/src/pages/shop.astro";
const $$url = "/shop";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
    __proto__: null,
    default: $$Shop,
    file: $$file,
    url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
