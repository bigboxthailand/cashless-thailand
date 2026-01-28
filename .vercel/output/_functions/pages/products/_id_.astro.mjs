import { e as createComponent, f as createAstro, k as renderComponent, l as renderScript, r as renderTemplate, m as maybeRenderHead, h as addAttribute } from '../../chunks/astro/server_Bu8JVBjn.mjs';
import 'piccolore';
import { s as supabase } from '../../chunks/supabase_BcyI2ayE.mjs';
import { $ as $$Layout, a as $$CartDrawer } from '../../chunks/Layout_BPO4vhqY.mjs';
import { $ as $$Navbar } from '../../chunks/Navbar_BK4zBr0V.mjs';
import { $ as $$Footer } from '../../chunks/Footer_BDifea0a.mjs';
import { jsx, jsxs } from 'react/jsx-runtime';
import { useState, useEffect } from 'react';
/* empty css                                   */
export { renderers } from '../../renderers.mjs';

const Reviews = ({ productId }) => {
  const [reviews, setReviews] = useState([]);
  const [stats, setStats] = useState({ average: 0, total: 0, counts: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 } });
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    if (productId) fetchReviews();
  }, [productId]);
  const fetchReviews = async () => {
    try {
      const { data, error } = await supabase.from("reviews").select(`
                    *,
                    profile:user_id (full_name, avatar_url)
                `).ilike("product_id", `${productId}%`).order("created_at", { ascending: false });
      if (error) throw error;
      setReviews(data);
      calculateStats(data);
    } catch (error) {
      console.error("Error fetching reviews:", error);
    } finally {
      setLoading(false);
    }
  };
  const calculateStats = (data) => {
    if (!data.length) return;
    const counts = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    let sum = 0;
    data.forEach((r) => {
      counts[r.rating] = (counts[r.rating] || 0) + 1;
      sum += r.rating;
    });
    setStats({
      average: (sum / data.length).toFixed(1),
      total: data.length,
      counts
    });
  };
  const [currentPage, setCurrentPage] = useState(1);
  const REVIEWS_PER_PAGE = 5;
  const totalPages = Math.ceil(reviews.length / REVIEWS_PER_PAGE);
  const indexOfLastReview = currentPage * REVIEWS_PER_PAGE;
  const indexOfFirstReview = indexOfLastReview - REVIEWS_PER_PAGE;
  const currentReviews = reviews.slice(indexOfFirstReview, indexOfLastReview);
  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  if (loading) return /* @__PURE__ */ jsx("div", { className: "text-white/40 text-center py-10 animate-pulse", children: "Loading reviews..." });
  if (reviews.length === 0) return /* @__PURE__ */ jsxs("div", { className: "text-center py-20 border-t border-white/5", children: [
    /* @__PURE__ */ jsx("div", { className: "w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4 text-[#D4AF37]/50", children: /* @__PURE__ */ jsx("span", { className: "text-2xl", children: "★" }) }),
    /* @__PURE__ */ jsx("h3", { className: "text-white font-bold uppercase tracking-widest mb-1", children: "No Reviews Yet" }),
    /* @__PURE__ */ jsx("p", { className: "text-white/40 text-sm", children: "Be the first to review this product!" })
  ] });
  return /* @__PURE__ */ jsxs("div", { className: "max-w-[1200px] mx-auto px-6 py-20 border-t border-white/5", id: "reviews-section", children: [
    /* @__PURE__ */ jsx("h2", { className: "text-3xl font-black text-white uppercase tracking-tighter mb-12", children: "Customer Reviews" }),
    /* @__PURE__ */ jsxs("div", { className: "grid lg:grid-cols-12 gap-12", children: [
      /* @__PURE__ */ jsxs("div", { className: "lg:col-span-4 bg-[#111] border border-white/5 rounded-[2rem] p-8 h-fit", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-end gap-4 mb-8", children: [
          /* @__PURE__ */ jsx("span", { className: "text-6xl font-black text-white leading-none", children: stats.average }),
          /* @__PURE__ */ jsxs("div", { className: "mb-2", children: [
            /* @__PURE__ */ jsx("div", { className: "flex text-[#D4AF37] text-lg mb-1", children: "★".repeat(Math.round(stats.average)).padEnd(5, "☆") }),
            /* @__PURE__ */ jsxs("p", { className: "text-white/40 text-xs font-bold uppercase tracking-widest", children: [
              stats.total,
              " Reviews"
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "space-y-3", children: [5, 4, 3, 2, 1].map((star) => /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
          /* @__PURE__ */ jsx("span", { className: "text-white/40 font-mono text-xs w-3", children: star }),
          /* @__PURE__ */ jsx("div", { className: "flex-1 h-2 bg-white/5 rounded-full overflow-hidden", children: /* @__PURE__ */ jsx(
            "div",
            {
              className: "h-full bg-[#D4AF37]",
              style: { width: `${stats.counts[star] / stats.total * 100}%` }
            }
          ) }),
          /* @__PURE__ */ jsx("span", { className: "text-white/40 font-mono text-xs w-6 text-right", children: stats.counts[star] })
        ] }, star)) })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "lg:col-span-8 space-y-6", children: [
        currentReviews.map((review) => /* @__PURE__ */ jsxs("div", { className: "bg-[#0a0a0a] border border-white/5 rounded-2xl p-6 hover:border-[#D4AF37]/30 transition-colors", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-start justify-between mb-4", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
              /* @__PURE__ */ jsx("div", { className: "w-10 h-10 rounded-full bg-white/10 flex items-center justify-center overflow-hidden border border-white/10", children: review.profile?.avatar_url ? /* @__PURE__ */ jsx("img", { src: review.profile.avatar_url, className: "w-full h-full object-cover" }) : /* @__PURE__ */ jsx("span", { className: "font-bold text-[#D4AF37]", children: review.profile?.full_name?.[0] || "U" }) }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("p", { className: "text-white font-bold text-sm", children: review.profile?.full_name || "Anonymous User" }),
                /* @__PURE__ */ jsx("div", { className: "flex text-[#D4AF37] text-xs", children: "★".repeat(review.rating).padEnd(5, "☆") })
              ] })
            ] }),
            /* @__PURE__ */ jsx("span", { className: "text-white/20 text-[10px] font-bold uppercase tracking-widest", children: new Date(review.created_at).toLocaleDateString("th-TH") })
          ] }),
          /* @__PURE__ */ jsx("p", { className: "text-white/70 font-light leading-relaxed", children: review.comment })
        ] }, review.id)),
        totalPages > 1 && /* @__PURE__ */ jsxs("div", { className: "flex justify-center items-center gap-4 pt-8", children: [
          /* @__PURE__ */ jsx(
            "button",
            {
              onClick: () => {
                paginate(Math.max(1, currentPage - 1));
                document.getElementById("reviews-section").scrollIntoView({ behavior: "smooth" });
              },
              disabled: currentPage === 1,
              className: `w-10 h-10 rounded-full flex items-center justify-center border transition-all ${currentPage === 1 ? "border-white/5 text-white/20 cursor-not-allowed" : "border-white/10 text-white hover:border-[#D4AF37] hover:text-[#D4AF37]"}`,
              children: /* @__PURE__ */ jsx("svg", { className: "w-4 h-4", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: "2", d: "M15 19l-7-7 7-7" }) })
            }
          ),
          /* @__PURE__ */ jsx("div", { className: "flex items-center gap-2", children: Array.from({ length: totalPages }, (_, i) => i + 1).map((number) => /* @__PURE__ */ jsx(
            "button",
            {
              onClick: () => {
                paginate(number);
                document.getElementById("reviews-section").scrollIntoView({ behavior: "smooth" });
              },
              className: `w-8 h-8 rounded-full text-xs font-bold transition-all ${currentPage === number ? "bg-[#D4AF37] text-black" : "bg-transparent text-white/40 hover:text-white"}`,
              children: number
            },
            number
          )) }),
          /* @__PURE__ */ jsx(
            "button",
            {
              onClick: () => {
                paginate(Math.min(totalPages, currentPage + 1));
                document.getElementById("reviews-section").scrollIntoView({ behavior: "smooth" });
              },
              disabled: currentPage === totalPages,
              className: `w-10 h-10 rounded-full flex items-center justify-center border transition-all ${currentPage === totalPages ? "border-white/5 text-white/20 cursor-not-allowed" : "border-white/10 text-white hover:border-[#D4AF37] hover:text-[#D4AF37]"}`,
              children: /* @__PURE__ */ jsx("svg", { className: "w-4 h-4", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: "2", d: "M9 5l7 7-7 7" }) })
            }
          )
        ] })
      ] })
    ] })
  ] });
};

const $$Astro = createAstro();
const $$id = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$id;
  const { id } = Astro2.params;
  const { data: productData, error } = await supabase.from("products").select("*, shop:shops(name, slug, logo_url, is_verified)").eq("id", id).single();
  if (error || !productData) {
    return Astro2.redirect("/404");
  }
  const parseIfNeeded = (val) => {
    if (typeof val === "string") {
      try {
        return JSON.parse(val);
      } catch (e) {
        return val;
      }
    }
    return val;
  };
  const product = {
    ...productData,
    meta: parseIfNeeded(productData.meta) || {},
    marketing: parseIfNeeded(productData.marketing) || {},
    // Map tech_specs (DB) to techSpecs (Frontend)
    techSpecs: parseIfNeeded(productData.tech_specs || productData.techSpecs) || [],
    config: parseIfNeeded(productData.config) || {},
    pricing: parseIfNeeded(productData.pricing) || {},
    media: parseIfNeeded(productData.media) || {},
    manualLink: productData.manual_link || productData.manualLink
  };
  const hasMarketing = product.marketing && product.marketing.benefits && product.marketing.benefits.length > 0;
  const hasSpecs = product.techSpecs && product.techSpecs.length > 0;
  const hasGallery = product.media.gallery && product.media.gallery.length > 1;
  let initialPrice = product.pricing.basePrice;
  if (product.config && product.config.variants && product.config.variants.length > 0) {
    if (!initialPrice || initialPrice === 0) {
      initialPrice = product.config.variants[0].price;
    }
  }
  const formattedPrice = (initialPrice || 0).toLocaleString();
  const currency = product.pricing.currency || "THB";
  const productJson = JSON.stringify(product);
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": `${product.meta.title} | Cashless Thailand`, "description": product.meta.description, "data-astro-cid-y5jmkon6": true }, { "default": async ($$result2) => renderTemplate` ${renderComponent($$result2, "Navbar", $$Navbar, { "data-astro-cid-y5jmkon6": true })} ${renderComponent($$result2, "CartDrawer", $$CartDrawer, { "data-astro-cid-y5jmkon6": true })} ${maybeRenderHead()}<main id="product-page-container" class="bg-[#050505] min-h-screen pt-32 pb-10 overflow-x-hidden"${addAttribute(productJson, "data-product-json")} data-astro-cid-y5jmkon6> <div class="max-w-[1200px] mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 mb-32" data-astro-cid-y5jmkon6> <div class="space-y-6 animate-fade-in" data-astro-cid-y5jmkon6> <div id="image-container" class="aspect-[4/5] md:aspect-square bg-[#111] rounded-[2rem] border border-white/5 relative group flex items-center justify-center p-8 overflow-hidden shadow-2xl touch-pan-y select-none cursor-grab active:cursor-grabbing" data-astro-cid-y5jmkon6> <div class="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" data-astro-cid-y5jmkon6></div> <img id="main-image"${addAttribute(product.media.mainImage, "src")}${addAttribute(product.meta.title, "alt")} class="w-full h-full object-contain transition-all duration-300 pointer-events-none" loading="eager" data-astro-cid-y5jmkon6> ${hasGallery && renderTemplate`<div class="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 backdrop-blur-md px-3 py-1 rounded-full border border-white/10 md:hidden flex gap-1 items-center" data-astro-cid-y5jmkon6> <span class="text-[10px] text-white/50 uppercase tracking-widest font-bold" data-astro-cid-y5jmkon6>
Swipe
</span> <svg class="w-3 h-3 text-white/50" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-astro-cid-y5jmkon6> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3" data-astro-cid-y5jmkon6></path> </svg> </div>`} </div> ${hasGallery && renderTemplate`<div class="flex gap-4 overflow-x-auto pb-4 scrollbar-hide snap-x" data-astro-cid-y5jmkon6>  ${product.media.gallery.map((img, index) => renderTemplate`<button class="w-20 h-20 rounded-2xl border border-white/10 bg-[#111] overflow-hidden hover:border-[#D4AF37] transition-all flex-shrink-0 snap-start focus:ring-2 focus:ring-[#D4AF37] focus:outline-none thumbnail-btn"${addAttribute(img, "data-src")}${addAttribute(`View image ${index + 1}`, "aria-label")} data-astro-cid-y5jmkon6> <img${addAttribute(img, "src")} class="w-full h-full object-cover opacity-60 hover:opacity-100 transition-opacity" data-astro-cid-y5jmkon6> </button>`)} </div>`} </div> <div class="flex flex-col justify-center relative pb-40 md:pb-0" data-astro-cid-y5jmkon6> <div class="animate-fade-in" data-astro-cid-y5jmkon6> <div class="flex items-center gap-4 mb-6" data-astro-cid-y5jmkon6> <a${addAttribute(product.shop ? `/shop/${product.shop.slug}` : "/shop", "href")} class="text-xs font-bold text-white/40 hover:text-white uppercase tracking-widest transition-colors" data-astro-cid-y5jmkon6>${product.shop ? product.shop.name : "Shop"}</a> <span class="text-white/20" data-astro-cid-y5jmkon6>/</span> <span class="text-xs font-bold text-[#D4AF37] uppercase tracking-widest" data-astro-cid-y5jmkon6>${product.meta.title}</span> </div> ${product.meta.tags && renderTemplate`<div class="flex gap-2 mb-6" data-astro-cid-y5jmkon6>  ${product.meta.tags.map((tag) => renderTemplate`<span class="px-3 py-1 bg-[#D4AF37]/10 border border-[#D4AF37]/30 text-[#D4AF37] text-[10px] font-black uppercase tracking-[0.2em] rounded shadow-[0_0_10px_rgba(212,175,55,0.2)]" data-astro-cid-y5jmkon6> ${tag} </span>`)} </div>`} <h1 class="text-4xl md:text-6xl font-black text-white leading-[0.9] mb-6 tracking-tight" data-astro-cid-y5jmkon6> ${product.meta.title} </h1> <p class="text-white/60 font-light text-lg mb-10 leading-relaxed max-w-lg whitespace-pre-line" data-astro-cid-y5jmkon6> ${product.meta.description} </p> <div class="mb-10" data-astro-cid-y5jmkon6> <div class="flex items-baseline gap-3" data-astro-cid-y5jmkon6> <span id="price-display" class="text-5xl text-white font-black eng tracking-tighter" data-astro-cid-y5jmkon6>${formattedPrice}</span> <span class="text-xl text-[#D4AF37] font-bold eng" data-astro-cid-y5jmkon6>${currency}</span> </div> <p class="text-[10px] text-[#D4AF37] font-bold uppercase tracking-widest mt-1" data-astro-cid-y5jmkon6>
+ ค่าจัดส่ง 50 บาท (ทั่วประเทศ)
</p> </div> </div> <div class="fixed md:static bottom-0 left-0 w-full md:w-auto bg-[#0a0a0a]/95 md:bg-transparent backdrop-blur-2xl md:backdrop-blur-none border-t border-white/10 md:border-none px-6 py-5 md:p-0 z-[100] flex flex-col gap-4" data-astro-cid-y5jmkon6> ${product.config && product.config.variants && renderTemplate`<div class="md:mb-10 md:p-6 md:bg-[#111] md:rounded-3xl md:border md:border-white/5" data-astro-cid-y5jmkon6> <span class="hidden md:block text-[10px] font-bold text-white/40 uppercase tracking-[0.2em] mb-4" data-astro-cid-y5jmkon6>
Select${" "} ${product.config.variantType === "color" ? "Color" : "Model"} </span> <div class="flex gap-3 md:gap-4 flex-wrap" id="variant-selector" data-astro-cid-y5jmkon6>  ${product.config.variants.map(
    (variant, index) => product.config.variantType === "color" ? renderTemplate`<button${addAttribute(`variant-btn w-10 h-10 md:w-12 md:h-12 rounded-full border-2 transition-all duration-300 relative group ${index === 0 ? "border-[#D4AF37] scale-110 active-variant" : "border-white/20 hover:scale-110"}`, "class")}${addAttribute(`background-color: ${variant.value}`, "style")}${addAttribute(variant.image, "data-image")}${addAttribute(variant.name, "data-name")}${addAttribute(variant.price, "data-price")}${addAttribute(variant.name, "aria-label")} data-astro-cid-y5jmkon6> <span class="absolute -top-10 left-1/2 -translate-x-1/2 bg-black text-white text-[10px] font-bold px-3 py-1 rounded-full opacity-0 group-hover:opacity-100 transition-all transform translate-y-2 group-hover:translate-y-0 whitespace-nowrap pointer-events-none border border-white/10 z-10 hidden md:block" data-astro-cid-y5jmkon6> ${variant.name} </span> </button>` : renderTemplate`<button${addAttribute(`variant-btn px-4 py-2 md:px-6 md:py-3 rounded-xl border-2 text-[10px] md:text-xs font-bold uppercase tracking-widest transition-all duration-300 ${index === 0 ? "border-[#D4AF37] bg-[#D4AF37] text-black active-variant" : "border-white/10 text-white/60 hover:border-white hover:text-white"}`, "class")}${addAttribute(variant.image, "data-image")}${addAttribute(variant.name, "data-name")}${addAttribute(variant.price, "data-price")} data-astro-cid-y5jmkon6> ${variant.name} </button>`
  )} </div> </div>`}  ${product.config && product.config.variantType === "composite" && product.config.options && renderTemplate`<div class="md:mb-10 md:p-6 md:bg-[#111] md:rounded-3xl md:border md:border-white/5 space-y-6" data-astro-cid-y5jmkon6>  ${product.config.options.map(
    (option, groupIdx) => renderTemplate`<div data-astro-cid-y5jmkon6> <span class="block text-[10px] font-bold text-white/40 uppercase tracking-[0.2em] mb-4" data-astro-cid-y5jmkon6>
Select ${option.name} </span> <div class="flex gap-3 flex-wrap option-group"${addAttribute(groupIdx, "data-group-index")} data-astro-cid-y5jmkon6>  ${option.values.map(
      (val, valIdx) => renderTemplate`<button${addAttribute(`option-btn px-4 py-2 md:px-6 md:py-3 rounded-xl border-2 text-[10px] md:text-xs font-bold uppercase tracking-widest transition-all duration-300 ${valIdx === 0 ? "border-[#D4AF37] bg-[#D4AF37] text-black active-option" : "border-white/10 text-white/60 hover:border-white hover:text-white"}`, "class")}${addAttribute(
        groupIdx,
        "data-group-index"
      )}${addAttribute(
        valIdx,
        "data-value-index"
      )}${addAttribute(
        val.name,
        "data-name"
      )}${addAttribute(
        val.price,
        "data-price"
      )}${addAttribute(
        val.image || "",
        "data-image"
      )} data-astro-cid-y5jmkon6> ${val.name} ${val.price > 0 && renderTemplate`<span class="opacity-60 ml-1" data-astro-cid-y5jmkon6>
(+
${val.price.toLocaleString()}
)
</span>`} </button>`
    )} </div> </div>`
  )} </div>`} <div class="flex gap-3 md:gap-4 h-14" data-astro-cid-y5jmkon6> <div class="flex items-center bg-[#111] border border-white/10 rounded-xl px-2 w-28 md:w-32 justify-between shrink-0" data-astro-cid-y5jmkon6> <button id="qty-minus" class="text-white/30 hover:text-white w-8 md:w-10 h-full flex items-center justify-center text-xl transition-colors active:scale-90" data-astro-cid-y5jmkon6>-</button> <input id="qty-input" type="number" value="1" min="1" class="w-8 md:w-10 bg-transparent text-center text-white font-bold outline-none appearance-none font-mono" readonly data-astro-cid-y5jmkon6> <button id="qty-plus" class="text-white/30 hover:text-white w-8 md:w-10 h-full flex items-center justify-center text-xl transition-colors active:scale-90" data-astro-cid-y5jmkon6>+</button> </div> <button id="add-to-cart-btn" class="flex-1 relative overflow-hidden bg-[#D4AF37] text-black rounded-xl font-black uppercase tracking-wider transition-all shadow-[0_0_30px_rgba(212,175,55,0.2)] hover:shadow-[0_0_50px_rgba(212,175,55,0.4)] hover:scale-[1.02] active:scale-95 group" data-astro-cid-y5jmkon6> <span class="relative z-10 flex items-center justify-center gap-2" data-astro-cid-y5jmkon6>
Add to Cart
<svg class="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-astro-cid-y5jmkon6><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" data-astro-cid-y5jmkon6></path></svg> </span> <div class="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" data-astro-cid-y5jmkon6></div> </button> </div> </div> <div class="grid grid-cols-2 gap-4 pt-8 border-t border-white/5 mt-8 md:mt-0 animate-fade-in" data-astro-cid-y5jmkon6> ${product.manualLink && renderTemplate`<a${addAttribute(product.manualLink, "href")} class="flex items-center gap-4 p-4 rounded-2xl bg-[#111] border border-white/5 hover:border-[#D4AF37]/50 hover:bg-[#1a1a1a] transition-all group" data-astro-cid-y5jmkon6> <div class="w-10 h-10 rounded-full bg-[#050505] flex items-center justify-center border border-white/10 group-hover:border-[#D4AF37] group-hover:text-[#D4AF37] transition-colors" data-astro-cid-y5jmkon6> <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-astro-cid-y5jmkon6> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" data-astro-cid-y5jmkon6></path> </svg> </div> <div class="flex flex-col" data-astro-cid-y5jmkon6> <span class="text-xs font-bold text-white uppercase tracking-wider" data-astro-cid-y5jmkon6>
User Guide
</span> <span class="text-[10px] text-white/40" data-astro-cid-y5jmkon6>
Setup & Manual
</span> </div> </a>`} ${hasSpecs && renderTemplate`<a href="#specs" class="flex items-center gap-4 p-4 rounded-2xl bg-[#111] border border-white/5 hover:border-[#D4AF37]/50 hover:bg-[#1a1a1a] transition-all group" data-astro-cid-y5jmkon6> <div class="w-10 h-10 rounded-full bg-[#050505] flex items-center justify-center border border-white/10 group-hover:border-[#D4AF37] group-hover:text-[#D4AF37] transition-colors" data-astro-cid-y5jmkon6> <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-astro-cid-y5jmkon6> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" data-astro-cid-y5jmkon6></path> </svg> </div> <div class="flex flex-col" data-astro-cid-y5jmkon6> <span class="text-xs font-bold text-white uppercase tracking-wider" data-astro-cid-y5jmkon6>
Tech Specs
</span> <span class="text-[10px] text-white/40" data-astro-cid-y5jmkon6>
Hardware Details
</span> </div> </a>`} </div> </div> </div> ${hasMarketing && renderTemplate`<div class="relative py-32 border-t border-white/5 overflow-hidden" data-astro-cid-y5jmkon6> <div class="absolute inset-0 bg-[#0a0a0a]" data-astro-cid-y5jmkon6></div> <div class="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-[500px] bg-[#D4AF37]/5 blur-[150px] rounded-full pointer-events-none" data-astro-cid-y5jmkon6></div> <div class="max-w-[1200px] mx-auto px-6 relative z-10" data-astro-cid-y5jmkon6> <div class="text-center mb-20" data-astro-cid-y5jmkon6> <h2 class="inline-block px-3 py-1 rounded-full border border-[#D4AF37]/30 bg-[#D4AF37]/5 text-[#D4AF37] text-[10px] font-black tracking-[0.3em] uppercase mb-6 backdrop-blur-md" data-astro-cid-y5jmkon6> ${product.marketing.headline} </h2> <h3 class="text-4xl md:text-6xl font-black text-white uppercase tracking-tighter leading-none" data-astro-cid-y5jmkon6> ${product.marketing.subheadline} </h3> </div> <div class="grid grid-cols-1 md:grid-cols-3 gap-8" data-astro-cid-y5jmkon6>  ${product.marketing.benefits.map((benefit) => renderTemplate`<div class="bg-[#111]/80 backdrop-blur-sm border border-white/5 p-8 rounded-[2rem] hover:border-[#D4AF37]/30 transition-all duration-500 hover:-translate-y-2 group" data-astro-cid-y5jmkon6> <div class="w-16 h-16 bg-[#050505] rounded-2xl flex items-center justify-center border border-white/10 mb-8 group-hover:scale-110 group-hover:border-[#D4AF37] transition-all shadow-lg" data-astro-cid-y5jmkon6> <span class="text-3xl filter grayscale group-hover:grayscale-0 transition-all" data-astro-cid-y5jmkon6> ${benefit.icon === "chart" && "\u{1F4C8}"} ${benefit.icon === "shop" && "\u{1F3EA}"} ${benefit.icon === "gift" && "\u{1F381}"} ${benefit.icon === "money" && "\u{1F4B0}"} ${benefit.icon === "time" && "\u23F3"} ${benefit.icon === "diamond" && "\u{1F48E}"} ${benefit.icon === "shield" && "\u{1F6E1}\uFE0F"} ${benefit.icon === "zap" && "\u26A1"} ${benefit.icon === "lock" && "\u{1F512}"} ${benefit.icon === "globe" && "\u{1F30D}"}  ${![
    "chart",
    "shop",
    "gift",
    "money",
    "time",
    "diamond",
    "shield",
    "zap",
    "lock",
    "globe"
  ].includes(benefit.icon) && "\u2728"} </span> </div> <h4 class="text-2xl font-bold text-white mb-4 group-hover:text-[#D4AF37] transition-colors" data-astro-cid-y5jmkon6> ${benefit.title} </h4> <p class="text-white/50 font-light leading-relaxed" data-astro-cid-y5jmkon6> ${benefit.desc} </p> </div>`)} </div> </div> </div>`} ${hasSpecs && renderTemplate`<div class="py-32 max-w-[900px] mx-auto px-6" id="specs" data-astro-cid-y5jmkon6> <div class="flex items-end justify-between mb-12 border-b border-white/10 pb-6" data-astro-cid-y5jmkon6> <h3 class="text-3xl md:text-4xl font-black text-white uppercase tracking-tighter" data-astro-cid-y5jmkon6>
Technical${" "} <span class="text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] to-[#F9E79F]" data-astro-cid-y5jmkon6>
Specifications
</span> </h3> <div class="hidden md:block text-[#D4AF37] font-mono text-xs opacity-50" data-astro-cid-y5jmkon6>
/// HARDWARE_ID: ${product.id.toUpperCase()} </div> </div> <div class="bg-[#111] rounded-[2rem] border border-white/5 overflow-hidden relative" data-astro-cid-y5jmkon6> <div class="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#D4AF37] to-transparent opacity-50" data-astro-cid-y5jmkon6></div>  ${product.techSpecs.map((spec, i) => renderTemplate`<div${addAttribute(`flex flex-col md:flex-row md:justify-between md:items-center p-6 ${i !== product.techSpecs.length - 1 ? "border-b border-white/5" : ""} hover:bg-white/5 transition-colors group`, "class")} data-astro-cid-y5jmkon6> <span class="text-white/40 font-bold uppercase text-xs tracking-[0.2em] mb-2 md:mb-0 group-hover:text-[#D4AF37] transition-colors" data-astro-cid-y5jmkon6> ${spec.label} </span> <span class="text-white font-medium text-sm md:text-right" data-astro-cid-y5jmkon6> ${spec.value} </span> </div>`)} </div> </div>`}  ${renderComponent($$result2, "Reviews", Reviews, { "productId": product.id, "client:visible": true, "client:component-hydration": "visible", "client:component-path": "/Users/natthapongsuwanjit/Desktop/CashlessThailand/cashlessthailand/src/components/Reviews.jsx", "client:component-export": "default", "data-astro-cid-y5jmkon6": true })} </main> ${renderComponent($$result2, "Footer", $$Footer, { "data-astro-cid-y5jmkon6": true })} ` })} ${renderScript($$result, "/Users/natthapongsuwanjit/Desktop/CashlessThailand/cashlessthailand/src/pages/products/[id].astro?astro&type=script&index=0&lang.ts")} `;
}, "/Users/natthapongsuwanjit/Desktop/CashlessThailand/cashlessthailand/src/pages/products/[id].astro", void 0);

const $$file = "/Users/natthapongsuwanjit/Desktop/CashlessThailand/cashlessthailand/src/pages/products/[id].astro";
const $$url = "/products/[id]";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
    __proto__: null,
    default: $$id,
    file: $$file,
    url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
