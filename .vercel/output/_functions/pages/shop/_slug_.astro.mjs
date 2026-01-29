import { e as createComponent, f as createAstro, m as maybeRenderHead, h as addAttribute, l as renderScript, r as renderTemplate, k as renderComponent } from '../../chunks/astro/server_Bu8JVBjn.mjs';
import 'piccolore';
import { $ as $$Layout, a as $$Navbar } from '../../chunks/Navbar_DWavSQqS.mjs';
import { $ as $$Footer } from '../../chunks/Footer_BP6qeS3w.mjs';
import 'clsx';
import { R as Reviews } from '../../chunks/Reviews_BIl4FbWg.mjs';
import { s as supabase } from '../../chunks/supabase_BcyI2ayE.mjs';
export { renderers } from '../../renderers.mjs';

const $$Astro$1 = createAstro();
const $$ProductCard = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$1, $$props, $$slots);
  Astro2.self = $$ProductCard;
  const {
    id,
    title,
    price,
    image,
    hoverImage,
    category,
    tag,
    status = "In Stock"
  } = Astro2.props;
  const formattedPrice = price.toLocaleString();
  return renderTemplate`${maybeRenderHead()}<a${addAttribute(`/products/${id}`, "href")} class="group relative block product-card"${addAttribute(category, "data-category")}${addAttribute(price, "data-price")}${addAttribute(title.toLowerCase(), "data-title")}> <div class="aspect-[4/5] bg-[#111] rounded-[1.5rem] overflow-hidden border border-white/5 group-hover:border-[#D4AF37]/50 transition-all duration-500 relative mb-4"> ${tag && renderTemplate`<div class="absolute top-3 left-3 z-20 px-3 py-1 bg-[#D4AF37] text-black text-[9px] font-black uppercase tracking-widest rounded-md"> ${tag} </div>`} <img${addAttribute(image, "src")}${addAttribute(title, "alt")}${addAttribute(`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${hoverImage ? "group-hover:opacity-0" : ""}`, "class")} loading="lazy"> ${hoverImage && renderTemplate`<img${addAttribute(hoverImage, "src")}${addAttribute(title, "alt")} class="absolute inset-0 w-full h-full object-cover opacity-0 group-hover:opacity-100 transition-opacity duration-500" loading="lazy">`} <div class="absolute inset-x-0 bottom-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300 z-30"> <button class="w-full bg-white text-black py-3 rounded-xl font-bold uppercase text-xs tracking-wider hover:bg-[#D4AF37] transition-colors shadow-lg"> ${status === "Sold Out" ? "Out of Stock" : "Quick Add"} </button> </div> <div class="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors pointer-events-none z-10"></div> </div> <div class="space-y-1 px-1"> <div class="flex justify-between items-start"> <h3 class="text-white text-base font-bold leading-tight group-hover:text-[#D4AF37] transition-colors line-clamp-2 min-h-[2.5em]"> ${title} </h3> </div> <div class="flex flex-col"> <span class="text-white/90 font-bold eng text-lg">${formattedPrice} THB</span> <span class="sats-display text-[#F7931A] text-[10px] eng font-medium"${addAttribute(price, "data-thb")}>≈ ... Sats</span> </div> </div> </a> ${renderScript($$result, "/Users/natthapongsuwanjit/Desktop/CashlessThailand/cashlessthailand/src/components/ProductCard.astro?astro&type=script&index=0&lang.ts")}`;
}, "/Users/natthapongsuwanjit/Desktop/CashlessThailand/cashlessthailand/src/components/ProductCard.astro", void 0);

const $$Astro = createAstro();
const $$slug = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$slug;
  const { slug } = Astro2.params;
  if (!slug) {
    return Astro2.redirect("/404");
  }
  const { data: shop, error: shopError } = await supabase.from("shops").select("*").eq("slug", slug).single();
  if (shopError || !shop) {
    console.error("Shop Fetch Error:", shopError);
    return Astro2.redirect("/404");
  }
  const { data: products, error: productsError } = await supabase.from("products").select("*").eq("shop_id", shop.id);
  if (productsError) {
    console.error("Products Fetch Error:", productsError);
  }
  const productItems = (products || []).map((product) => {
    const price = product.pricing?.basePrice || 0;
    const image = product.media?.mainImage || "/placeholder.png";
    const hoverImage = product.media?.gallery?.[0] || null;
    const title = product.meta?.title || product.name || "Untitled";
    return {
      id: product.id,
      title,
      price,
      image,
      hoverImage,
      category: product.category || "Product",
      status: product.config?.inventory?.stock > 0 || (product.config?.variants || []).reduce(
        (acc, v) => acc + (parseInt(v.stock) || 0),
        0
      ) > 0 ? "In Stock" : "Sold Out"
    };
  });
  const pageTitle = `${shop.name} | Cashless Thailand Shop`;
  const pageDesc = shop.description || `Browse products from ${shop.name} on Cashless Thailand.`;
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": pageTitle, "description": pageDesc }, { "default": async ($$result2) => renderTemplate` ${renderComponent($$result2, "Navbar", $$Navbar, {})} ${maybeRenderHead()}<main class="min-h-screen bg-[#050505] relative overflow-hidden pb-20">  <div class="fixed inset-0 pointer-events-none"> <div class="absolute top-0 w-full h-[50vh] bg-gradient-to-b from-[#1a1a1a] to-transparent opacity-50"></div> <div class="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-[#D4AF37]/5 blur-[120px] rounded-full"></div> <div class="absolute bottom-0 left-0 w-[40%] h-[40%] bg-[#D4AF37]/5 blur-[120px] rounded-full"></div> </div>  <div class="relative pt-32 pb-12 px-4 md:px-8 border-b border-white/5"> <div class="max-w-7xl mx-auto flex flex-col md:flex-row items-center md:items-start gap-8">  <div class="relative group"> <div class="w-32 h-32 md:w-40 md:h-40 rounded-full border-2 border-[#D4AF37]/20 bg-[#111] overflow-hidden shadow-[0_0_30px_rgba(212,175,55,0.1)] group-hover:border-[#D4AF37]/50 transition-colors"> ${shop.logo_url ? renderTemplate`<img${addAttribute(shop.logo_url, "src")}${addAttribute(shop.name, "alt")} class="w-full h-full object-cover">` : renderTemplate`<div class="w-full h-full flex items-center justify-center text-4xl font-bold text-[#D4AF37]/20"> ${shop.name.charAt(0).toUpperCase()} </div>`} </div> ${shop.is_verified && renderTemplate`<div class="absolute bottom-2 right-2 bg-[#D4AF37] text-black p-1.5 rounded-full shadow-lg" title="Verified Shop"> <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-5 h-5"> <path fill-rule="evenodd" d="M8.603 3.799A4.49 4.49 0 0112 2.25c1.357 0 2.573.6 3.397 1.549a4.49 4.49 0 013.498 1.307 4.491 4.491 0 011.307 3.497A4.49 4.49 0 0121.75 12a4.49 4.49 0 01-1.549 3.397 4.491 4.491 0 01-1.307 3.498 4.491 4.491 0 01-3.497 1.307A4.49 4.49 0 0112 21.75a4.49 4.49 0 01-3.397-1.549 4.49 4.49 0 01-3.498-1.306 4.491 4.491 0 01-1.307-3.498A4.49 4.49 0 012.25 12c0-1.357.6-2.573 1.549-3.397a4.49 4.49 0 011.307-3.497 4.49 4.49 0 013.497-1.307zm7.007 6.387a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clip-rule="evenodd"></path> </svg> </div>`} </div>  <div class="flex-1 text-center md:text-left space-y-4"> <div> <h1 class="text-3xl md:text-5xl font-black text-white tracking-tight mb-2"> ${shop.name} </h1> <p class="text-white/60 text-lg max-w-2xl leading-relaxed"> ${shop.description || "No description provided."} </p> </div> <div class="flex flex-wrap items-center justify-center md:justify-start gap-4"> <div class="px-4 py-2 rounded-full bg-white/5 border border-white/10 flex items-center gap-2"> <span class="text-[#D4AF37] font-bold">${productItems.length}</span> <span class="text-white/40 text-sm uppercase tracking-wider">Products</span> </div>  <button id="contact-seller-btn"${addAttribute(shop.id, "data-shop-id")}${addAttribute(shop.name, "data-shop-name")} class="px-6 py-2 rounded-full bg-[#D4AF37] text-black font-bold text-sm uppercase tracking-wider hover:bg-[#b08d26] transition-colors">
Contact Seller
</button> </div> </div> </div> </div>  <section class="max-w-7xl mx-auto px-4 py-16 relative z-10"> <div class="flex items-center justify-between mb-10"> <h2 class="text-2xl font-bold text-white flex items-center gap-3"> <span class="w-2 h-8 bg-[#D4AF37] rounded-sm"></span>
Allow Products
</h2>  <div class="flex gap-4"> <select class="bg-black/40 border border-white/10 rounded-lg px-4 py-2 text-sm text-white/80 focus:outline-none focus:border-[#D4AF37]/50"> <option>Newest First</option> <option>Price: Low to High</option> <option>Price: High to Low</option> </select> </div> </div> ${productItems.length > 0 ? renderTemplate`<div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8"> ${productItems.map((product) => renderTemplate`${renderComponent($$result2, "ProductCard", $$ProductCard, { ...product })}`)} </div>` : renderTemplate`<div class="py-20 text-center border border-dashed border-white/10 rounded-2xl bg-white/5"> <p class="text-white/40 text-lg">
No products available in this shop yet.
</p> </div>`} </section>  ${renderComponent($$result2, "Reviews", Reviews, { "shopId": shop.id, "client:visible": true, "client:component-hydration": "visible", "client:component-path": "/Users/natthapongsuwanjit/Desktop/CashlessThailand/cashlessthailand/src/components/Reviews.jsx", "client:component-export": "default" })} </main> ${renderComponent($$result2, "Footer", $$Footer, {})} ${renderScript($$result2, "/Users/natthapongsuwanjit/Desktop/CashlessThailand/cashlessthailand/src/pages/shop/[slug].astro?astro&type=script&index=0&lang.ts")} ` })}`;
}, "/Users/natthapongsuwanjit/Desktop/CashlessThailand/cashlessthailand/src/pages/shop/[slug].astro", void 0);

const $$file = "/Users/natthapongsuwanjit/Desktop/CashlessThailand/cashlessthailand/src/pages/shop/[slug].astro";
const $$url = "/shop/[slug]";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$slug,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
