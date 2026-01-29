import { e as createComponent, m as maybeRenderHead, r as renderTemplate, l as renderScript, h as addAttribute, k as renderComponent, q as Fragment, f as createAstro } from '../chunks/astro/server_Bu8JVBjn.mjs';
import 'piccolore';
import { $ as $$Layout, b as $$CartDrawer, a as $$Navbar } from '../chunks/Navbar_DWavSQqS.mjs';
import 'clsx';
/* empty css                                 */
import { s as supabase } from '../chunks/supabase_BcyI2ayE.mjs';
import { jsxs, jsx } from 'react/jsx-runtime';
import { useRef } from 'react';
import { useMotionValue, useScroll, useVelocity, useSpring, useTransform, useAnimationFrame, motion } from 'framer-motion';
import { p as products } from '../chunks/products_DJd6FeeG.mjs';
import { $ as $$Footer } from '../chunks/Footer_BP6qeS3w.mjs';
export { renderers } from '../renderers.mjs';

const $$Hero = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${maybeRenderHead()}<section class="relative min-h-screen flex items-center justify-center overflow-hidden pt-20" data-astro-cid-bbe6dxrz> <div class="absolute inset-0 z-0" data-astro-cid-bbe6dxrz> <img src="/images/ui/hero-bg.webp" alt="Bitcoin Innovation Devices" class="w-full h-full object-cover opacity-80" data-astro-cid-bbe6dxrz> <div class="absolute inset-0 bg-gradient-to-b from-[#050505] via-[#050505]/30 to-[#050505]" data-astro-cid-bbe6dxrz></div> <div class="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_20%,#050505_100%)] opacity-80" data-astro-cid-bbe6dxrz></div> </div> <div class="relative z-10 text-center px-6 max-w-6xl mx-auto space-y-8 reveal" data-astro-cid-bbe6dxrz> <div class="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#D4AF37]/30 bg-[#D4AF37]/10 backdrop-blur-md mb-4 animate-fade-in-down" data-astro-cid-bbe6dxrz> <span class="w-2 h-2 rounded-full bg-[#D4AF37] animate-pulse" data-astro-cid-bbe6dxrz></span> <span class="eng text-[#D4AF37] text-xs font-bold uppercase tracking-widest" data-astro-cid-bbe6dxrz>Innovation for Bitcoiners</span> </div> <h1 class="text-5xl md:text-7xl lg:text-9xl font-[900] text-white tracking-tighter leading-none uppercase drop-shadow-2xl" data-astro-cid-bbe6dxrz>
Bitcoin <br data-astro-cid-bbe6dxrz> <span class="text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] via-[#F4E08F] to-[#D4AF37] animate-gradient" data-astro-cid-bbe6dxrz>Hardware</span> </h1> <p class="text-white text-lg md:text-2xl font-light max-w-3xl mx-auto leading-relaxed mt-4 drop-shadow-md" data-astro-cid-bbe6dxrz>
ศูนย์รวมนวัตกรรมฝีมือคนไทย: <span class="text-[#D4AF37] font-bold" data-astro-cid-bbe6dxrz>CryptoClock</span> นาฬิกาดูราคา,
<span class="text-[#D4AF37] font-bold" data-astro-cid-bbe6dxrz>BiTTerm</span> ตู้แลกเหรียญ, และ
<span class="text-[#D4AF37] font-bold" data-astro-cid-bbe6dxrz>BiTNode</span> สำหรับรันโหนดส่วนตัว
</p> <div class="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8" data-astro-cid-bbe6dxrz> <a href="/shop" class="group relative px-8 py-4 bg-[#D4AF37] text-black font-black uppercase tracking-widest rounded-full overflow-hidden transition-all hover:scale-105 active:scale-95 shadow-[0_0_40px_rgba(212,175,55,0.3)] min-w-[200px]" data-astro-cid-bbe6dxrz> <div class="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" data-astro-cid-bbe6dxrz></div> <span class="relative flex items-center justify-center gap-2" data-astro-cid-bbe6dxrz>
Shop Now
<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-astro-cid-bbe6dxrz><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3" data-astro-cid-bbe6dxrz></path></svg> </span> </a> <a href="/shop#kiosk" class="group px-8 py-4 border border-white/20 text-white font-bold uppercase tracking-widest rounded-full hover:bg-white/5 transition-all hover:border-[#D4AF37]/50 min-w-[200px] backdrop-blur-sm" data-astro-cid-bbe6dxrz> <span data-astro-cid-bbe6dxrz>See BiTTerm</span> </a> </div> </div> <div class="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce opacity-80" data-astro-cid-bbe6dxrz> <svg class="w-6 h-6 text-white drop-shadow-md" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-astro-cid-bbe6dxrz><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 14l-7 7m0 0l-7-7m7 7V3" data-astro-cid-bbe6dxrz></path></svg> </div> </section> `;
}, "/Users/natthapongsuwanjit/Desktop/CashlessThailand/cashlessthailand/src/components/Hero.astro", void 0);

const $$Marquee = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${maybeRenderHead()}<div class="relative flex overflow-x-hidden bg-gradient-to-r from-[#996515] via-[#D4AF37] to-[#F9E79F] text-black py-4 border-y-4 border-black/20 shadow-2xl" data-astro-cid-tpudeaz7> <div class="animate-marquee whitespace-nowrap flex items-center" data-astro-cid-tpudeaz7> <span class="mx-8 text-2xl font-black italic tracking-widest uppercase" data-astro-cid-tpudeaz7>Not your keys, not your coins</span> <span class="mx-8 text-xl" data-astro-cid-tpudeaz7>★</span> <span class="mx-8 text-2xl font-black italic tracking-widest uppercase" data-astro-cid-tpudeaz7>Be your own bank</span> <span class="mx-8 text-xl" data-astro-cid-tpudeaz7>★</span> <span class="mx-8 text-2xl font-black italic tracking-widest uppercase" data-astro-cid-tpudeaz7>Bitcoin Thailand</span> <span class="mx-8 text-xl" data-astro-cid-tpudeaz7>★</span> <span class="mx-8 text-2xl font-black italic tracking-widest uppercase" data-astro-cid-tpudeaz7>Cashless Society</span> <span class="mx-8 text-xl" data-astro-cid-tpudeaz7>★</span> </div> <div class="absolute top-0 animate-marquee2 whitespace-nowrap flex items-center h-full" data-astro-cid-tpudeaz7> <span class="mx-8 text-2xl font-black italic tracking-widest uppercase" data-astro-cid-tpudeaz7>Not your keys, not your coins</span> <span class="mx-8 text-xl" data-astro-cid-tpudeaz7>★</span> <span class="mx-8 text-2xl font-black italic tracking-widest uppercase" data-astro-cid-tpudeaz7>Be your own bank</span> <span class="mx-8 text-xl" data-astro-cid-tpudeaz7>★</span> <span class="mx-8 text-2xl font-black italic tracking-widest uppercase" data-astro-cid-tpudeaz7>Bitcoin Thailand</span> <span class="mx-8 text-xl" data-astro-cid-tpudeaz7>★</span> <span class="mx-8 text-2xl font-black italic tracking-widest uppercase" data-astro-cid-tpudeaz7>Cashless Society</span> <span class="mx-8 text-xl" data-astro-cid-tpudeaz7>★</span> </div> </div> `;
}, "/Users/natthapongsuwanjit/Desktop/CashlessThailand/cashlessthailand/src/components/Marquee.astro", void 0);

const $$Features = createComponent(async ($$result, $$props, $$slots) => {
  const featureSteps = [
    { id: "cryptoclock-basic", step: "01 / FRONT OF HOUSE" },
    { id: "bitterm-series", step: "02 / CUSTOMER SCREEN" },
    { id: "bitpos-terminal", step: "03 / CASHIER CONTROL" },
    { id: "bitnode-personal", step: "04 / INFRASTRUCTURE" },
    {
      id: "bitcoin-t-shirt--by-blc",
      step: "05 / APPAREL",
      overrides: {
        title: "Bitcoin Legacy Shirt",
        subheadline: "\u0E2A\u0E27\u0E21\u0E43\u0E2A\u0E48\u0E2D\u0E38\u0E14\u0E21\u0E01\u0E32\u0E23\u0E13\u0E4C\u0E41\u0E2B\u0E48\u0E07\u0E2D\u0E19\u0E32\u0E04\u0E15",
        description: "\u0E40\u0E19\u0E37\u0E49\u0E2D\u0E1C\u0E49\u0E32 Cotton Premium 100% \u0E2A\u0E31\u0E21\u0E1C\u0E31\u0E2A\u0E19\u0E38\u0E48\u0E21 \u0E43\u0E2A\u0E48\u0E2A\u0E1A\u0E32\u0E22 \u0E14\u0E35\u0E44\u0E0B\u0E19\u0E4C\u0E21\u0E34\u0E19\u0E34\u0E21\u0E2D\u0E25\u0E41\u0E15\u0E48\u0E17\u0E23\u0E07\u0E1E\u0E25\u0E31\u0E07 \u0E2A\u0E33\u0E2B\u0E23\u0E31\u0E1A Bitcoiner \u0E15\u0E31\u0E27\u0E08\u0E23\u0E34\u0E07\u0E17\u0E35\u0E48\u0E15\u0E49\u0E2D\u0E07\u0E01\u0E32\u0E23\u0E04\u0E27\u0E32\u0E21\u0E41\u0E15\u0E01\u0E15\u0E48\u0E32\u0E07"
      }
    }
  ];
  const { data: dbProducts } = await supabase.from("products").select("*").in(
    "id",
    featureSteps.map((f) => f.id)
  );
  const products = dbProducts?.map((p) => ({
    ...p,
    meta: typeof p.meta === "string" ? JSON.parse(p.meta) : p.meta,
    media: typeof p.media === "string" ? JSON.parse(p.media) : p.media,
    marketing: typeof p.marketing === "string" ? JSON.parse(p.marketing) : p.marketing
  })) || [];
  return renderTemplate`${maybeRenderHead()}<section class="bg-[#050505] text-white py-32 overflow-hidden font-sans relative" id="ecosystem-section" data-astro-cid-vnivfuh2> <div class="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[800px] bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#D4AF37]/10 via-transparent to-transparent pointer-events-none" data-astro-cid-vnivfuh2></div> <div class="max-w-[1400px] mx-auto px-6 md:px-12 relative z-10" data-astro-cid-vnivfuh2> <div class="text-center max-w-4xl mx-auto mb-40 reveal-element" data-astro-cid-vnivfuh2> <span class="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-[#D4AF37] font-bold tracking-[0.2em] uppercase text-xs mb-6 backdrop-blur-md shadow-[0_0_20px_rgba(212,175,55,0.1)]" data-astro-cid-vnivfuh2> <span class="w-1.5 h-1.5 bg-[#D4AF37] rounded-full animate-pulse" data-astro-cid-vnivfuh2></span>
The Complete Ecosystem
</span> <h2 class="text-4xl md:text-6xl lg:text-7xl font-black tracking-tight leading-[1.1] mb-8" data-astro-cid-vnivfuh2>
เปลี่ยนร้านของคุณให้เป็น <br data-astro-cid-vnivfuh2> <span class="text-transparent bg-clip-text bg-gradient-to-r from-white via-[#F4E08F] to-[#D4AF37] italic" data-astro-cid-vnivfuh2>แลนด์มาร์ค</span> แห่งอนาคต
</h2> <p class="text-white/60 text-lg md:text-xl font-light max-w-2xl mx-auto" data-astro-cid-vnivfuh2>
4 นวัตกรรมที่ทำงานประสานกันอย่างไร้รอยต่อ
                ตั้งแต่หน้าร้านจนถึงหลังบ้าน ยกระดับธุรกิจคุณสู่ยุค Cashless
                อย่างสมบูรณ์แบบ
</p> </div> <div class="relative" data-astro-cid-vnivfuh2> <div class="absolute left-1/2 top-0 bottom-0 w-[1px] bg-gradient-to-b from-transparent via-white/10 to-transparent hidden md:block" data-astro-cid-vnivfuh2></div> ${featureSteps.map((feature, index) => {
    const product = products.find((p) => p.id === feature.id);
    if (!product) return null;
    const isEven = index % 2 === 0;
    const overrides = feature.overrides || {};
    const displayTitle = overrides.title || product.meta?.title || "Untitled";
    const displaySubheadline = overrides.subheadline || product.marketing?.subheadline || "";
    const displayDesc = overrides.description || product.meta?.description || "";
    return renderTemplate`<div${addAttribute(`ecosystem-step flex flex-col ${isEven ? "md:flex-row" : "md:flex-row-reverse"} items-center gap-12 md:gap-20 mb-40`, "class")} data-astro-cid-vnivfuh2> <div class="w-full md:w-1/2 relative step-img" data-astro-cid-vnivfuh2> ${!isEven && renderTemplate`<div class="absolute top-1/2 -left-[51px] w-3 h-3 bg-[#D4AF37] rounded-full shadow-[0_0_15px_#D4AF37] hidden md:block" data-astro-cid-vnivfuh2></div>`} <div class="aspect-[4/3] rounded-[2.5rem] overflow-hidden bg-[#111] border border-white/10 shadow-[0_0_50px_rgba(212,175,55,0.05)] relative group" data-astro-cid-vnivfuh2> <img${addAttribute(product.media?.mainImage || "", "src")}${addAttribute(
      product.meta?.title || "Product Image",
      "alt"
    )} class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-[1.5s]" loading="lazy" data-astro-cid-vnivfuh2> <div class="absolute inset-0 bg-gradient-to-t from-[#050505]/80 via-transparent to-transparent" data-astro-cid-vnivfuh2></div> <div class="absolute top-6 left-6" data-astro-cid-vnivfuh2> <span class="text-white/80 font-mono text-xs tracking-widest bg-black/50 px-3 py-1 rounded-full backdrop-blur-md border border-white/10" data-astro-cid-vnivfuh2> ${feature.step} </span> </div> </div> </div> <div${addAttribute(`w-full md:w-1/2 space-y-6 step-text ${!isEven ? "md:pl-10" : ""}`, "class")} data-astro-cid-vnivfuh2> <h3 class="text-4xl md:text-5xl font-bold tracking-tight text-white" data-astro-cid-vnivfuh2> ${displayTitle} </h3> <h4 class="text-xl md:text-2xl font-light text-[#D4AF37]" data-astro-cid-vnivfuh2> ${displaySubheadline} </h4> <p class="text-white/60 text-lg leading-relaxed max-w-md mb-8" data-astro-cid-vnivfuh2> ${displayDesc} </p> <a${addAttribute(`/products/${product.id}`, "href")} class="group inline-flex items-center gap-3 px-8 py-4 bg-white text-black rounded-full font-bold text-sm tracking-widest uppercase hover:bg-[#D4AF37] transition-all duration-300" data-astro-cid-vnivfuh2> <span data-astro-cid-vnivfuh2>
Explore${" "} ${product.meta?.title?.split(" ")[0]} </span> <svg class="w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-astro-cid-vnivfuh2> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3" data-astro-cid-vnivfuh2></path> </svg> </a> </div> </div>`;
  })} </div> <div class="relative bg-gradient-to-br from-[#111] to-[#0a0a0a] rounded-[3rem] p-10 md:p-16 overflow-hidden border border-[#D4AF37]/20 shadow-[0_0_80px_rgba(212,175,55,0.08)] mt-20 reveal-element" data-astro-cid-vnivfuh2> <div class="flex flex-col md:flex-row items-center justify-between gap-10 relative z-10" data-astro-cid-vnivfuh2> <div class="w-full md:w-2/3 space-y-4" data-astro-cid-vnivfuh2> <h3 class="text-3xl md:text-4xl font-bold text-white" data-astro-cid-vnivfuh2>
ต้องการคำปรึกษาสำหรับร้านของคุณ?
</h3> <p class="text-white/60 text-lg max-w-lg" data-astro-cid-vnivfuh2>
ติดต่อทีมวิศวกรคนไทยของเรา
                        เพื่อออกแบบระบบนิเวศการรับเงินที่เหมาะสมกับรูปแบบธุรกิจของคุณโดยเฉพาะ
</p> </div> <div class="w-full md:w-1/3 flex justify-start md:justify-end" data-astro-cid-vnivfuh2> <a href="https://lin.ee/fllUbyx" target="_blank" class="w-full md:w-auto inline-flex items-center justify-center gap-3 px-8 py-5 bg-[#00B900] text-white rounded-2xl font-bold text-lg hover:scale-105 active:scale-95 transition-all shadow-xl group" data-astro-cid-vnivfuh2> <svg class="w-8 h-8" viewBox="0 0 24 24" fill="currentColor" data-astro-cid-vnivfuh2><path d="M21.733 11.5c0-4.962-4.869-9-10.866-9-5.998 0-10.867 4.038-10.867 9 0 4.417 3.864 8.2 8.947 8.868.35.07.828.163 1.056.634.204.426.136.963.064 1.488l-.135 1.012c-.042.316-.201.954.837.515 1.037-.439 5.61-3.311 7.85-5.832C20.89 15.356 21.733 13.567 21.733 11.5z" data-astro-cid-vnivfuh2></path></svg> <span data-astro-cid-vnivfuh2>คุยกับทีมงานบน LINE</span> </a> </div> </div> </div> </div> </section> ${renderScript($$result, "/Users/natthapongsuwanjit/Desktop/CashlessThailand/cashlessthailand/src/components/Features.astro?astro&type=script&index=0&lang.ts")} `;
}, "/Users/natthapongsuwanjit/Desktop/CashlessThailand/cashlessthailand/src/components/Features.astro", void 0);

const shuffle = (arr) => [...arr, ...arr, ...arr];
function ImageCard({ src }) {
  return /* @__PURE__ */ jsxs("div", { className: "\n      relative h-[25vh] min-h-[200px] max-h-[350px] aspect-[4/3]\n      rounded-2xl overflow-hidden\n      border-[1px] border-white/10\n      shadow-[0_0_30px_-10px_rgba(212,175,55,0.3)] // เงาสีทองฟุ้งๆ\n      group\n    ", children: [
    /* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-gradient-to-tr from-white/0 via-white/5 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 z-10 pointer-events-none mix-blend-overlay" }),
    /* @__PURE__ */ jsx(
      "img",
      {
        src,
        alt: "Gallery",
        className: "w-full h-full object-cover scale-105 group-hover:scale-110 transition-transform duration-[2s] ease-out",
        loading: "lazy"
      }
    ),
    /* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-gradient-to-t from-[#050505]/60 via-transparent to-transparent" })
  ] });
}
function ParallaxText({ children, baseVelocity = 100 }) {
  const baseX = useMotionValue(0);
  const { scrollY } = useScroll();
  const scrollVelocity = useVelocity(scrollY);
  const smoothVelocity = useSpring(scrollVelocity, {
    damping: 50,
    stiffness: 400
  });
  const velocityFactor = useTransform(smoothVelocity, [0, 1e3], [0, 5], {
    clamp: false
  });
  const x = useTransform(baseX, (v) => `${wrap(-20, -45, v)}%`);
  const directionFactor = useRef(1);
  useAnimationFrame((t, delta) => {
    let moveBy = directionFactor.current * baseVelocity * (delta / 1e3);
    if (velocityFactor.get() < 0) {
      directionFactor.current = -1;
    } else if (velocityFactor.get() > 0) {
      directionFactor.current = 1;
    }
    moveBy += directionFactor.current * moveBy * velocityFactor.get();
    baseX.set(baseX.get() + moveBy);
  });
  return /* @__PURE__ */ jsx("div", { className: "parallax overflow-hidden m-0 flex flex-nowrap whitespace-nowrap", children: /* @__PURE__ */ jsxs(motion.div, { className: "scroller flex whitespace-nowrap gap-[2vw]", style: { x }, children: [
    children,
    children,
    children,
    children
  ] }) });
}
const wrap = (min, max, v) => {
  const rangeSize = max - min;
  return ((v - min) % rangeSize + rangeSize) % rangeSize + min;
};
function LuxuryMotionGallery({ images }) {
  const shuffledImages = shuffle(images);
  return /* @__PURE__ */ jsxs("section", { className: "relative w-full overflow-hidden py-20 perspective-1000", children: [
    /* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-[url('/images/grid-pattern.svg')] bg-center opacity-5 pointer-events-none fixed" }),
    /* @__PURE__ */ jsx("div", { className: "transform -rotate-[2deg] -translate-x-[10%] scale-110 origin-center hover:opacity-90 transition-opacity duration-500", children: /* @__PURE__ */ jsx(ParallaxText, { baseVelocity: -2, children: shuffledImages.map((src, i) => /* @__PURE__ */ jsx(ImageCard, { src }, `row1-${i}`)) }) }),
    /* @__PURE__ */ jsx("div", { className: "transform rotate-[3deg] translate-x-[5%] scale-110 origin-center mt-8 hover:opacity-90 transition-opacity duration-500", children: /* @__PURE__ */ jsx(ParallaxText, { baseVelocity: 1.5, children: shuffledImages.map((src, i) => /* @__PURE__ */ jsx(ImageCard, { src }, `row2-${i}`)) }) }),
    /* @__PURE__ */ jsx("div", { className: "absolute inset-0 pointer-events-none bg-radial-gradient-to-t from-[#050505] via-transparent to-[#050505]/80" })
  ] });
}

const $$ProductGallery = createComponent(($$result, $$props, $$slots) => {
  const galleryImages = [
    "/images/gallery/setup-1.webp",
    "/images/gallery/cafe-1.webp",
    "/images/gallery/clock-night.webp",
    "/images/gallery/node-shelf.webp",
    // ใส่เพิ่มได้เลย
    "https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=800&auto=format&fit=crop"
  ];
  return renderTemplate`${maybeRenderHead()}<section class="relative bg-[#050505] overflow-hidden pb-24 pt-32" data-astro-cid-g66van4u> <div class="max-w-[1800px] mx-auto px-6 mb-16 text-center relative z-10" data-astro-cid-g66van4u> <span class="inline-block py-1 px-4 rounded-full bg-white/5 border border-[#D4AF37]/30 text-[#D4AF37] text-xs font-bold tracking-[0.3em] uppercase mb-6 backdrop-blur-md shadow-[0_0_15px_-5px_#D4AF37]" data-astro-cid-g66van4u>
The Lifestyle
</span> <h3 class="text-4xl md:text-7xl font-black text-white uppercase tracking-tighter leading-none drop-shadow-2xl" data-astro-cid-g66van4u>
Cashless <span class="text-transparent bg-clip-text bg-gradient-to-r from-white via-white/50 to-white/10 italic" data-astro-cid-g66van4u>Revolution.</span> </h3> </div> ${renderComponent($$result, "LuxuryMotionGallery", LuxuryMotionGallery, { "client:load": true, "images": galleryImages, "client:component-hydration": "load", "client:component-path": "/Users/natthapongsuwanjit/Desktop/CashlessThailand/cashlessthailand/src/components/LuxuryMotionGallery.jsx", "client:component-export": "default", "data-astro-cid-g66van4u": true })} </section> `;
}, "/Users/natthapongsuwanjit/Desktop/CashlessThailand/cashlessthailand/src/components/ProductGallery.astro", void 0);

const $$ShopExplorer = createComponent(async ($$result, $$props, $$slots) => {
  const { data: shops } = await supabase.from("shops").select("name, logo_url, slug, is_verified").eq("status", "active").limit(6);
  return renderTemplate`${maybeRenderHead()}<section class="py-32 relative overflow-hidden bg-[#050505]" data-astro-cid-ib57zxaj>  <div class="absolute top-1/2 left-0 -translate-y-1/2 w-full h-[1px] bg-white/5" data-astro-cid-ib57zxaj></div> <div class="max-w-[1800px] mx-auto px-6 md:px-12 relative z-10" data-astro-cid-ib57zxaj> <div class="flex flex-col md:flex-row justify-between items-end mb-20 gap-8" data-astro-cid-ib57zxaj> <div class="space-y-4" data-astro-cid-ib57zxaj> <span class="inline-block px-3 py-1 rounded-full border border-[#D4AF37]/30 bg-[#D4AF37]/5 text-[#D4AF37] text-[10px] font-black tracking-[0.3em] uppercase backdrop-blur-md" data-astro-cid-ib57zxaj>
Vendors Network
</span> <h2 class="text-5xl md:text-7xl font-[900] tracking-tighter leading-none italic uppercase text-white" data-astro-cid-ib57zxaj>
Our Trusted <br data-astro-cid-ib57zxaj> <span class="text-white/10 not-italic" data-astro-cid-ib57zxaj>Partners.</span> </h2> </div> <a href="/shops" class="group flex items-center gap-4 text-[#D4AF37] eng font-black uppercase tracking-[0.3em] text-xs pb-2 border-b border-[#D4AF37]/20 hover:border-[#D4AF37] transition-all" data-astro-cid-ib57zxaj>
View All Shops
<svg class="group-hover:translate-x-2 transition-transform" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" data-astro-cid-ib57zxaj><path d="M5 12h14m-7-7 7 7-7 7" data-astro-cid-ib57zxaj></path></svg> </a> </div> <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 md:gap-8" data-astro-cid-ib57zxaj> ${shops?.map((shop, i) => renderTemplate`<a${addAttribute(`/shop/${shop.slug}`, "href")} class="group relative aspect-square bg-[#111] rounded-3xl border border-white/5 hover:border-[#D4AF37]/30 transition-all duration-500 flex items-center justify-center p-6 overflow-hidden reveal shadow-2xl"${addAttribute(`animation-delay: ${i * 0.1}s`, "style")} data-astro-cid-ib57zxaj> <div class="absolute inset-0 bg-gradient-to-br from-[#D4AF37]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" data-astro-cid-ib57zxaj></div> <div class="relative z-10 w-full h-full flex flex-col items-center justify-center gap-4" data-astro-cid-ib57zxaj> ${shop.logo_url ? renderTemplate`<img${addAttribute(shop.logo_url, "src")}${addAttribute(shop.name, "alt")} class="w-20 h-20 md:w-24 md:h-24 object-contain transition-transform duration-500 group-hover:scale-110 drop-shadow-2xl" data-astro-cid-ib57zxaj>` : renderTemplate`<div class="w-20 h-20 md:w-24 md:h-24 rounded-full bg-white/5 flex items-center justify-center text-3xl font-bold text-white/20" data-astro-cid-ib57zxaj> ${shop.name[0]} </div>`} <span class="text-[10px] font-bold text-white/60 uppercase tracking-widest text-center group-hover:text-white transition-colors truncate w-full px-2" data-astro-cid-ib57zxaj> ${shop.name} </span> </div> ${shop.is_verified && renderTemplate`<div class="absolute top-4 right-4 text-[#D4AF37] transform scale-75 group-hover:scale-100 transition-transform duration-500" data-astro-cid-ib57zxaj> <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-6 h-6" data-astro-cid-ib57zxaj> <path fill-rule="evenodd" d="M8.603 3.799A4.49 4.49 0 0112 2.25c1.357 0 2.573.6 3.397 1.549a4.49 4.49 0 013.498 1.307 4.491 4.491 0 011.307 3.497A4.49 4.49 0 0121.75 12a4.49 4.49 0 01-1.549 3.397 4.491 4.491 0 01-1.307 3.498 4.491 4.491 0 01-3.497 1.307A4.49 4.49 0 0112 21.75a4.49 4.49 0 01-3.397-1.549 4.49 4.49 0 01-3.498-1.306 4.491 4.491 0 01-1.307-3.498A4.49 4.49 0 012.25 12c0-1.357.6-2.573 1.549-3.397a4.49 4.49 0 011.307-3.497 4.49 4.49 0 013.497-1.307zm7.007 6.387a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clip-rule="evenodd" data-astro-cid-ib57zxaj></path> </svg> </div>`} </a>`)} </div> </div> </section> `;
}, "/Users/natthapongsuwanjit/Desktop/CashlessThailand/cashlessthailand/src/components/ShopExplorer.astro", void 0);

const $$FeaturedGrid = createComponent(($$result, $$props, $$slots) => {
  const uniqueCategories = /* @__PURE__ */ new Set();
  const items = [];
  for (const p of products) {
    if (!uniqueCategories.has(p.category) && items.length < 4) {
      uniqueCategories.add(p.category);
      items.push({
        id: p.id,
        title: p.meta?.title || "Untitled Product",
        category: p.meta?.tags ? p.meta.tags[0] : p.category,
        // Use first tag or category
        price: (p.pricing?.basePrice || 0).toLocaleString(void 0, {
          minimumFractionDigits: 0
        }),
        image: p.media?.mainImage || "",
        hoverImage: p.media?.gallery && p.media.gallery.length > 1 ? p.media.gallery[1] : p.media?.mainImage || "",
        tag: p.meta?.tags && p.meta.tags.length > 0 ? p.meta.tags[0] : "Featured"
      });
    }
  }
  return renderTemplate`${maybeRenderHead()}<section class="max-w-[1800px] mx-auto px-6 md:px-12 py-32 relative" data-astro-cid-n6wttucx> <div class="flex flex-col md:flex-row justify-between items-end mb-20 gap-8 reveal" data-astro-cid-n6wttucx> <div class="space-y-4" data-astro-cid-n6wttucx> <h2 class="text-5xl md:text-7xl font-[900] tracking-tighter leading-none italic uppercase text-white" data-astro-cid-n6wttucx>
Curated <br data-astro-cid-n6wttucx> <span class="text-white/10 not-italic" data-astro-cid-n6wttucx>Selection.</span> </h2> <div class="w-24 h-1 bg-gradient-to-r from-[#D4AF37] to-transparent" data-astro-cid-n6wttucx></div> </div> <a href="/shop" class="group flex items-center gap-4 text-[#D4AF37] eng font-black uppercase tracking-[0.3em] text-xs pb-2 border-b border-[#D4AF37]/20 hover:border-[#D4AF37] transition-all" data-astro-cid-n6wttucx>
Explore All
<svg class="group-hover:translate-x-2 transition-transform" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" data-astro-cid-n6wttucx><path d="M5 12h14m-7-7 7 7-7 7" data-astro-cid-n6wttucx></path></svg> </a> </div> <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-16" data-astro-cid-n6wttucx> ${items.map((item, i) => renderTemplate`<div class="group relative reveal"${addAttribute(`animation-delay: ${0.2 * i}s`, "style")} data-astro-cid-n6wttucx> <div class="absolute -inset-2 bg-gradient-to-b from-[#D4AF37]/20 to-transparent opacity-0 group-hover:opacity-100 blur-xl transition-all duration-700 rounded-[3rem]" data-astro-cid-n6wttucx></div> <div class="relative" data-astro-cid-n6wttucx> <a${addAttribute(`/products/${item.id}`, "href")} class="block aspect-[4/5] bg-[#0a0a0a] rounded-[2.5rem] overflow-hidden border border-white/5 group-hover:border-[#D4AF37]/30 transition-all duration-500 shadow-2xl flex flex-col relative cursor-pointer" data-astro-cid-n6wttucx> <img${addAttribute(item.image, "src")}${addAttribute(item.title, "alt")} class="absolute inset-0 w-full h-full object-cover transition-opacity duration-500 opacity-100 group-hover:opacity-0" loading="lazy" data-astro-cid-n6wttucx> <img${addAttribute(item.hoverImage, "src")}${addAttribute(`${item.title} side view`, "alt")} class="absolute inset-0 w-full h-full object-cover transition-opacity duration-500 opacity-0 group-hover:opacity-100" loading="lazy" data-astro-cid-n6wttucx> <div class="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/80 to-transparent pointer-events-none" data-astro-cid-n6wttucx></div> <div class="absolute top-6 left-6 px-4 py-1 bg-black/80 backdrop-blur-md border border-[#D4AF37]/30 rounded-full z-10" data-astro-cid-n6wttucx> <span class="eng text-[10px] font-black uppercase tracking-widest text-[#D4AF37]" data-astro-cid-n6wttucx> ${item.tag} </span> </div> <div class="absolute inset-0 flex items-center justify-center pointer-events-none" data-astro-cid-n6wttucx> <span class="bg-[#D4AF37] text-black px-8 py-4 rounded-2xl font-black eng text-sm uppercase tracking-tighter opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500 shadow-[0_0_20px_#D4AF37]" data-astro-cid-n6wttucx>
View Details
</span> </div> </a> <div class="mt-6 space-y-1 px-2" data-astro-cid-n6wttucx> <p class="eng text-[10px] font-bold uppercase tracking-[0.2em] text-[#D4AF37]/60" data-astro-cid-n6wttucx> ${item.category} </p> <h3 class="text-lg font-bold text-white leading-tight group-hover:text-[#D4AF37] transition-colors" data-astro-cid-n6wttucx> ${item.title} </h3> <div class="flex items-center gap-2 pt-1" data-astro-cid-n6wttucx> <span class="text-xl eng font-black text-white" data-astro-cid-n6wttucx> ${item.price} </span> <span class="text-[10px] eng font-medium text-white/30 uppercase tracking-widest" data-astro-cid-n6wttucx>
THB
</span> </div> </div> </div> </div>`)} </div> </section> `;
}, "/Users/natthapongsuwanjit/Desktop/CashlessThailand/cashlessthailand/src/components/FeaturedGrid.astro", void 0);

const $$Partners = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${maybeRenderHead()}<section class="py-20 border-t border-white/5 bg-[#050505]" data-astro-cid-s63cuhea> <div class="max-w-[1200px] mx-auto px-6 text-center" data-astro-cid-s63cuhea> <p class="eng text-white/20 text-xs font-bold uppercase tracking-[0.2em] mb-12" data-astro-cid-s63cuhea>
Trusted by Industry Leaders
</p> <div class="flex flex-wrap justify-center items-center gap-12 md:gap-20" data-astro-cid-s63cuhea> ${[
    {
      name: "Bitkub",
      logo: "/images/partners/bitkub.svg",
      url: "https://www.bitkub.com"
    },
    {
      name: "Binance",
      logo: "/images/partners/binance.svg",
      url: "https://www.binance.com"
    },
    {
      name: "Maxbit",
      logo: "/images/partners/maxbit.svg",
      url: "https://www.maxbit.com"
    },
    {
      name: "Cryptomind",
      logo: "/images/partners/cryptomind.svg",
      url: "https://cryptomind.group"
    },
    {
      name: "Bitget",
      logo: "/images/partners/bitget.svg",
      url: "https://www.bitget.com"
    }
  ].map((p, index) => renderTemplate`<a${addAttribute(p.url, "href")} target="_blank" rel="noopener noreferrer" class="partner-logo group relative flex flex-col items-center gap-4 hover:scale-110 transition-all duration-500"${addAttribute(`animation-delay: ${index * 150}ms`, "style")} data-astro-cid-s63cuhea> <div class="h-16 w-32 flex items-center justify-center" data-astro-cid-s63cuhea> <img${addAttribute(p.logo, "src")}${addAttribute(p.name, "alt")} class="max-h-full max-w-full object-contain transition-all duration-500 group-hover:drop-shadow-[0_0_20px_rgba(212,175,55,0.5)]" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';" data-astro-cid-s63cuhea>  <div class="hidden h-full items-center justify-center bg-white/5 px-4 rounded border border-white/10 text-white font-bold tracking-wider group-hover:bg-[#D4AF37] group-hover:text-black transition-colors" data-astro-cid-s63cuhea> ${p.name} </div> </div> <span class="text-white/40 text-[10px] font-bold uppercase tracking-widest group-hover:text-[#D4AF37] transition-colors" data-astro-cid-s63cuhea> ${p.name} </span> </a>`)} </div> </div> </section> `;
}, "/Users/natthapongsuwanjit/Desktop/CashlessThailand/cashlessthailand/src/components/Partners.astro", void 0);

const $$Testimonials = createComponent(($$result, $$props, $$slots) => {
  const reviews = [
    {
      name: "Tanin S.",
      role: "Crypto Investor",
      text: "\u0E2A\u0E31\u0E48\u0E07 Trezor Safe 3 \u0E21\u0E32 \u0E2A\u0E48\u0E07\u0E44\u0E27\u0E21\u0E32\u0E01 \u0E41\u0E1E\u0E47\u0E04\u0E40\u0E01\u0E08\u0E08\u0E34\u0E49\u0E07\u0E1E\u0E23\u0E35\u0E40\u0E21\u0E35\u0E22\u0E21 \u0E17\u0E35\u0E21\u0E07\u0E32\u0E19 CryptoClock \u0E43\u0E2B\u0E49\u0E04\u0E33\u0E41\u0E19\u0E30\u0E19\u0E33\u0E14\u0E35\u0E2A\u0E38\u0E14\u0E46 \u0E04\u0E23\u0E31\u0E1A"
    },
    {
      name: "Sarah J.",
      role: "DeFi User",
      text: "\u0E04\u0E2D\u0E23\u0E4C\u0E2A\u0E40\u0E23\u0E35\u0E22\u0E19\u0E40\u0E02\u0E49\u0E32\u0E43\u0E08\u0E07\u0E48\u0E32\u0E22\u0E21\u0E32\u0E01\u0E04\u0E48\u0E30 \u0E08\u0E32\u0E01\u0E04\u0E19\u0E17\u0E35\u0E48\u0E44\u0E21\u0E48\u0E01\u0E25\u0E49\u0E32\u0E42\u0E2D\u0E19\u0E40\u0E2D\u0E07 \u0E15\u0E2D\u0E19\u0E19\u0E35\u0E49\u0E43\u0E0A\u0E49 Hardware Wallet \u0E04\u0E25\u0E48\u0E2D\u0E07\u0E41\u0E25\u0E49\u0E27 \u0E02\u0E2D\u0E1A\u0E04\u0E38\u0E13\u0E04\u0E48\u0E30"
    },
    {
      name: "Metapon K.",
      role: "Business Owner",
      text: "\u0E0A\u0E2D\u0E1A\u0E14\u0E35\u0E44\u0E0B\u0E19\u0E4C\u0E40\u0E27\u0E47\u0E1A\u0E41\u0E25\u0E30\u0E01\u0E32\u0E23\u0E1A\u0E23\u0E34\u0E01\u0E32\u0E23\u0E04\u0E23\u0E31\u0E1A \u0E14\u0E39\u0E40\u0E1B\u0E47\u0E19\u0E21\u0E37\u0E2D\u0E2D\u0E32\u0E0A\u0E35\u0E1E\u0E41\u0E25\u0E30\u0E19\u0E48\u0E32\u0E40\u0E0A\u0E37\u0E48\u0E2D\u0E16\u0E37\u0E2D\u0E17\u0E35\u0E48\u0E2A\u0E38\u0E14\u0E43\u0E19\u0E44\u0E17\u0E22\u0E41\u0E25\u0E49\u0E27\u0E2A\u0E33\u0E2B\u0E23\u0E31\u0E1A\u0E2D\u0E38\u0E1B\u0E01\u0E23\u0E13\u0E4C Web3"
    },
    {
      name: "CryptoGuy99",
      role: "Trader",
      text: "\u0E2A\u0E34\u0E19\u0E04\u0E49\u0E32\u0E02\u0E2D\u0E07\u0E41\u0E17\u0E49\u0E41\u0E19\u0E48\u0E19\u0E2D\u0E19 \u0E40\u0E0A\u0E47\u0E04 Verify \u0E44\u0E14\u0E49 \u0E2B\u0E32\u0E22\u0E2B\u0E48\u0E27\u0E07\u0E04\u0E23\u0E31\u0E1A \u0E41\u0E19\u0E30\u0E19\u0E33\u0E40\u0E25\u0E22\u0E23\u0E49\u0E32\u0E19\u0E19\u0E35\u0E49"
    }
  ];
  return renderTemplate`${maybeRenderHead()}<section class="py-32 overflow-hidden bg-[#050505] relative border-t border-white/5" data-astro-cid-aadlzisc> <div class="max-w-[1800px] mx-auto px-6 md:px-12 mb-16 flex flex-col md:flex-row justify-between items-end gap-6 reveal" data-astro-cid-aadlzisc> <div data-astro-cid-aadlzisc> <h2 class="text-xs font-black tracking-[0.5em] text-[#D4AF37] mb-4 uppercase" data-astro-cid-aadlzisc>
Testimonials
</h2> <h3 class="text-4xl md:text-6xl font-black text-white tracking-tighter uppercase leading-none" data-astro-cid-aadlzisc>
Trusted by <br data-astro-cid-aadlzisc> <span class="text-white/20" data-astro-cid-aadlzisc>Thousands.</span> </h3> </div> <div class="flex gap-2" data-astro-cid-aadlzisc> <button class="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center text-white hover:bg-[#D4AF37] hover:text-black transition-all" data-astro-cid-aadlzisc>←</button> <button class="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center text-white hover:bg-[#D4AF37] hover:text-black transition-all" data-astro-cid-aadlzisc>→</button> </div> </div> <div class="relative w-full" data-astro-cid-aadlzisc> <div class="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-[#050505] to-transparent z-10" data-astro-cid-aadlzisc></div> <div class="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-[#050505] to-transparent z-10" data-astro-cid-aadlzisc></div> <div class="flex gap-8 animate-scroll hover:pause" data-astro-cid-aadlzisc> ${[...reviews, ...reviews, ...reviews].map((review) => renderTemplate`<div class="min-w-[350px] md:min-w-[450px] bg-[#0a0a0a] border border-white/5 p-8 rounded-3xl hover:border-[#D4AF37]/30 transition-colors group" data-astro-cid-aadlzisc> <div class="flex gap-1 text-[#D4AF37] mb-6" data-astro-cid-aadlzisc> ${Array(5).fill(0).map(() => renderTemplate`<svg class="w-4 h-4 fill-current" viewBox="0 0 20 20" data-astro-cid-aadlzisc> <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" data-astro-cid-aadlzisc></path> </svg>`)} </div> <p class="text-xl text-white/80 font-medium leading-relaxed mb-8" data-astro-cid-aadlzisc>
"${review.text}"
</p> <div class="flex items-center gap-4" data-astro-cid-aadlzisc> <div class="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center font-bold text-white" data-astro-cid-aadlzisc> ${review.name.charAt(0)} </div> <div data-astro-cid-aadlzisc> <div class="text-white font-bold text-sm" data-astro-cid-aadlzisc> ${review.name} </div> <div class="text-[#D4AF37] text-xs uppercase tracking-wider" data-astro-cid-aadlzisc> ${review.role} </div> </div> </div> </div>`)} </div> </div> </section> `;
}, "/Users/natthapongsuwanjit/Desktop/CashlessThailand/cashlessthailand/src/components/Testimonials.astro", void 0);

const $$CommunityEvents = createComponent(($$result, $$props, $$slots) => {
  const events = [
    {
      date: "22-25 JAN",
      title: "Block Mountain CNX 2026",
      location: "Chiang Mai Grandview",
      // [แก้ไข] เปลี่ยนเป็นลิงก์รูปใหม่ที่คุณให้มา
      image: "/images/events/block-mountain-2026.jpg",
      status: "Starting Soon",
      link: "https://www.facebook.com/BlockMountainOfficial/"
    },
    {
      date: "26 JAN",
      title: "Satoshi Square Monday",
      location: "Bangkok (Sukhumvit)",
      // ใช้รูปเดิมที่อยู่ในเครื่อง
      image: "/images/events/satoshi-square.webp",
      status: "Open Entry",
      link: "https://www.meetup.com/satoshi-square-bangkok/"
    },
    {
      date: "29 JAN",
      title: "Road to Consensus",
      location: "Bitkub M Social, BKK",
      // ใช้รูปเดิมที่อยู่ในเครื่อง
      image: "/images/events/consensus-road.webp",
      status: "Registration",
      link: "https://www.facebook.com/bitkubgroup/"
    }
  ];
  return renderTemplate`${maybeRenderHead()}<section class="py-24 bg-[#0a0a0a] relative overflow-hidden"> <div class="absolute top-0 right-0 w-[500px] h-[500px] bg-[#D4AF37]/5 blur-[120px] rounded-full pointer-events-none"></div> <div class="max-w-[1400px] mx-auto px-6 md:px-12 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center"> <div class="space-y-10 relative z-10"> <div> <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#D4AF37]/30 bg-[#D4AF37]/10 backdrop-blur-md mb-4"> <span class="w-1.5 h-1.5 rounded-full bg-[#D4AF37] animate-pulse"></span> <span class="eng text-[#D4AF37] text-[10px] font-black tracking-[0.2em] uppercase">Join the Movement</span> </div> <h2 class="text-5xl md:text-6xl font-black text-white uppercase tracking-tighter leading-none mb-6">
Thailand's <br> <span class="text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] to-[#F9E79F]">Bitcoin Hub.</span> </h2> <p class="text-white/60 font-light leading-relaxed max-w-md text-lg">
เราคือคอมมูนิตี้ที่แข็งแกร่งที่สุด รวมตัว Bitcoiners ตัวจริง
                    นักพัฒนา และผู้ประกอบการ เพื่อขับเคลื่อนประเทศไทยสู่ยุค
                    Cashless Society
</p> </div> <a href="https://t.me/myCryptoClock" target="_blank" class="inline-flex items-center gap-3 px-8 py-4 bg-white text-black rounded-full font-bold uppercase tracking-widest hover:bg-[#D4AF37] hover:scale-105 transition-all shadow-xl group"> <span>Join Telegram</span> <svg class="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path></svg> </a> </div> <div class="relative z-10"> <div class="flex items-center justify-between mb-8"> <h3 class="text-2xl font-bold text-white uppercase tracking-wide flex items-center gap-3"> <span class="w-1.5 h-8 bg-[#D4AF37] rounded-full"></span>
Upcoming Events
</h3> <a href="/events" class="text-xs text-[#D4AF37] border-b border-[#D4AF37]/30 pb-1 hover:border-[#D4AF37] hover:text-white transition-colors eng font-bold tracking-widest uppercase">View Calendar</a> </div> <div class="space-y-5"> ${events.map((event, i) => (
    // [แก้ไขดีไซน์การ์ด]
    renderTemplate`<a${addAttribute(event.link, "href")} target="_blank" class="group relative flex items-center gap-6 p-5 rounded-3xl border border-white/10 bg-[#111] transition-all duration-500 cursor-pointer overflow-hidden hover:border-[#D4AF37] hover:shadow-[0_0_40px_-10px_rgba(212,175,55,0.3)] hover:-translate-y-1"> <div class="w-28 h-28 rounded-2xl overflow-hidden flex-shrink-0 relative z-10 border border-white/10 bg-[#0a0a0a] group-hover:border-[#D4AF37]/30 transition-colors"> <img${addAttribute(event.image, "src")}${addAttribute(event.title, "alt")} class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" loading="lazy" onerror="this.src='https://placehold.co/200x200/111/333?text=Event'"> </div> <div class="flex-1 relative z-10 py-1"> <div class="flex justify-between items-start mb-2"> <span class="text-[#D4AF37] text-[10px] font-black tracking-[0.1em] uppercase bg-[#D4AF37]/10 px-2 py-1 rounded-md border border-[#D4AF37]/20"> ${event.date} </span> <span${addAttribute(`text-[9px] font-bold uppercase tracking-widest px-3 py-1 rounded-full border ${event.status === "Starting Soon" ? "text-red-400 border-red-500/30 bg-red-500/10 animate-pulse" : "text-white/50 border-white/10 bg-white/5"}`, "class")}> ${event.status} </span> </div> <h4 class="text-xl font-bold text-white mb-2 group-hover:text-[#D4AF37] transition-colors leading-tight line-clamp-1"> ${event.title} </h4> <div class="flex items-center gap-2 text-white/40 text-xs font-light"> <svg class="w-3 h-3 text-[#D4AF37]" fill="none" stroke="currentColor" viewBox="0 0 24 24"> ${renderComponent($$result, "Fragment", Fragment, {}, { "default": ($$result2) => renderTemplate` <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path> ` })} </svg> <span class="group-hover:text-white transition-colors line-clamp-1"> ${event.location} </span> </div> </div> <div class="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-white/20 group-hover:text-[#D4AF37] group-hover:border-[#D4AF37] group-hover:rotate-[-45deg] group-hover:bg-[#D4AF37]/10 transition-all duration-300 relative z-10"> <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path> </svg> </div> </a>`
  ))} </div> </div> </div> </section>`;
}, "/Users/natthapongsuwanjit/Desktop/CashlessThailand/cashlessthailand/src/components/CommunityEvents.astro", void 0);

const $$BlogSection = createComponent(($$result, $$props, $$slots) => {
  const articles = [
    {
      title: "\u0E2D\u0E19\u0E32\u0E04\u0E15\u0E02\u0E2D\u0E07 Bitcoin \u0E43\u0E19\u0E1B\u0E35 2026: \u0E08\u0E32\u0E01\u0E2A\u0E34\u0E19\u0E17\u0E23\u0E31\u0E1E\u0E22\u0E4C\u0E17\u0E32\u0E07\u0E40\u0E25\u0E37\u0E2D\u0E01\u0E2A\u0E39\u0E48\u0E40\u0E07\u0E34\u0E19\u0E2A\u0E33\u0E23\u0E2D\u0E07\u0E42\u0E25\u0E01",
      excerpt: "\u0E40\u0E08\u0E32\u0E30\u0E25\u0E36\u0E01\u0E27\u0E34\u0E2A\u0E31\u0E22\u0E17\u0E31\u0E28\u0E19\u0E4C\u0E41\u0E25\u0E30\u0E1B\u0E31\u0E08\u0E08\u0E31\u0E22\u0E17\u0E32\u0E07\u0E40\u0E28\u0E23\u0E29\u0E10\u0E01\u0E34\u0E08\u0E17\u0E35\u0E48\u0E08\u0E30\u0E02\u0E31\u0E1A\u0E40\u0E04\u0E25\u0E37\u0E48\u0E2D\u0E19 Bitcoin \u0E43\u0E2B\u0E49\u0E01\u0E25\u0E32\u0E22\u0E40\u0E1B\u0E47\u0E19\u0E2B\u0E31\u0E27\u0E43\u0E08\u0E2B\u0E25\u0E31\u0E01\u0E02\u0E2D\u0E07\u0E23\u0E30\u0E1A\u0E1A\u0E01\u0E32\u0E23\u0E40\u0E07\u0E34\u0E19\u0E22\u0E38\u0E04\u0E43\u0E2B\u0E21\u0E48...",
      date: "20 JAN 2026",
      category: "INSIGHTS",
      isFeatured: true
    },
    {
      title: "Hardware Wallet vs Cold Storage: \u0E40\u0E25\u0E37\u0E2D\u0E01\u0E41\u0E1A\u0E1A\u0E44\u0E2B\u0E19\u0E43\u0E2B\u0E49\u0E1B\u0E25\u0E2D\u0E14\u0E20\u0E31\u0E22\u0E17\u0E35\u0E48\u0E2A\u0E38\u0E14?",
      excerpt: "\u0E04\u0E27\u0E32\u0E21\u0E15\u0E48\u0E32\u0E07\u0E17\u0E35\u0E48\u0E04\u0E38\u0E13\u0E15\u0E49\u0E2D\u0E07\u0E23\u0E39\u0E49\u0E01\u0E48\u0E2D\u0E19\u0E40\u0E01\u0E47\u0E1A\u0E40\u0E2B\u0E23\u0E35\u0E22\u0E0D\u0E2B\u0E25\u0E31\u0E01\u0E25\u0E49\u0E32\u0E19...",
      date: "18 JAN 2026",
      category: "SECURITY",
      isFeatured: false
    },
    {
      title: "Lightning Network 101: \u0E08\u0E48\u0E32\u0E22\u0E01\u0E32\u0E41\u0E1F\u0E14\u0E49\u0E27\u0E22\u0E1A\u0E34\u0E17\u0E04\u0E2D\u0E22\u0E19\u0E4C\u0E43\u0E19 1 \u0E27\u0E34\u0E19\u0E32\u0E17\u0E35",
      excerpt: "\u0E04\u0E39\u0E48\u0E21\u0E37\u0E2D\u0E40\u0E23\u0E34\u0E48\u0E21\u0E15\u0E49\u0E19\u0E01\u0E32\u0E23\u0E43\u0E0A\u0E49\u0E07\u0E32\u0E19 Layer 2 \u0E2A\u0E33\u0E2B\u0E23\u0E31\u0E1A\u0E04\u0E19\u0E44\u0E17\u0E22...",
      date: "15 JAN 2026",
      category: "TECHNOLOGY",
      isFeatured: false
    }
  ];
  const featured = articles.find((a) => a.isFeatured);
  const secondary = articles.filter((a) => !a.isFeatured);
  return renderTemplate`${maybeRenderHead()}<section class="max-w-[1800px] mx-auto px-6 md:px-12 py-32 border-t border-white/5" data-astro-cid-fjwk6imu> <div class="mb-20 reveal" data-astro-cid-fjwk6imu> <h2 class="text-xs font-black tracking-[0.5em] text-[#D4AF37] mb-6 flex items-center gap-4" data-astro-cid-fjwk6imu> <span class="w-12 h-[1px] bg-[#D4AF37]" data-astro-cid-fjwk6imu></span>
KNOWLEDGE BASE
</h2> <div class="flex justify-between items-end" data-astro-cid-fjwk6imu> <h3 class="text-5xl md:text-8xl font-[900] tracking-tighter uppercase leading-none" data-astro-cid-fjwk6imu>
The <span class="italic text-white/10" data-astro-cid-fjwk6imu>Standard</span> <br data-astro-cid-fjwk6imu> Reports.
</h3> </div> </div> <div class="grid lg:grid-cols-12 gap-12" data-astro-cid-fjwk6imu> <div class="lg:col-span-7 group cursor-pointer reveal" style="animation-delay: 0.2s" data-astro-cid-fjwk6imu> <div class="relative overflow-hidden rounded-[2.5rem] bg-[#0a0a0a] aspect-[16/9] border border-white/5 group-hover:border-[#D4AF37]/30 transition-all duration-700" data-astro-cid-fjwk6imu> <div class="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent z-10" data-astro-cid-fjwk6imu></div> <div class="absolute inset-0 flex items-center justify-center text-white/5 font-black text-9xl italic group-hover:scale-110 transition-transform duration-1000" data-astro-cid-fjwk6imu>
FEATURED
</div> </div> <div class="mt-8 space-y-6" data-astro-cid-fjwk6imu> <div class="flex items-center gap-6" data-astro-cid-fjwk6imu> <span class="eng text-[10px] font-black tracking-[0.2em] px-3 py-1 border border-[#D4AF37] text-[#D4AF37] rounded-md uppercase" data-astro-cid-fjwk6imu>${featured.category}</span> <span class="eng text-[10px] font-medium tracking-widest text-white/30 uppercase" data-astro-cid-fjwk6imu>${featured.date}</span> </div> <h4 class="text-3xl md:text-5xl font-bold leading-tight hover:text-gold transition-all duration-300" data-astro-cid-fjwk6imu> ${featured.title} </h4> <p class="text-xl text-white/40 font-light leading-relaxed max-w-2xl" data-astro-cid-fjwk6imu> ${featured.excerpt} </p> <div class="pt-4" data-astro-cid-fjwk6imu> <button class="eng text-xs font-black uppercase tracking-[0.3em] text-white border-b border-white/20 pb-2 hover:border-[#D4AF37] hover:text-[#D4AF37] transition-all" data-astro-cid-fjwk6imu>
Read Analysis
</button> </div> </div> </div> <div class="lg:col-span-5 flex flex-col gap-12" data-astro-cid-fjwk6imu> ${secondary.map((article, i) => renderTemplate`<div class="group cursor-pointer flex flex-col sm:flex-row gap-8 reveal"${addAttribute(`animation-delay: ${0.4 + i * 0.2}s`, "style")} data-astro-cid-fjwk6imu> <div class="w-full sm:w-48 aspect-square bg-[#0a0a0a] rounded-3xl shrink-0 border border-white/5 overflow-hidden group-hover:border-[#D4AF37]/30 transition-all" data-astro-cid-fjwk6imu> <div class="w-full h-full flex items-center justify-center text-white/5 font-black text-2xl italic" data-astro-cid-fjwk6imu>ARTICLE</div> </div> <div class="space-y-4" data-astro-cid-fjwk6imu> <div class="flex items-center gap-4" data-astro-cid-fjwk6imu> <span class="eng text-[9px] font-black tracking-[0.2em] text-[#D4AF37] uppercase" data-astro-cid-fjwk6imu>${article.category}</span> <span class="eng text-[9px] font-medium tracking-widest text-white/30 uppercase" data-astro-cid-fjwk6imu>${article.date}</span> </div> <h4 class="text-xl font-bold leading-snug group-hover:text-gold transition-all duration-300" data-astro-cid-fjwk6imu> ${article.title} </h4> <p class="text-sm text-white/40 line-clamp-2 leading-relaxed" data-astro-cid-fjwk6imu> ${article.excerpt} </p> </div> </div>`)} <div class="mt-auto p-8 rounded-[2rem] bg-gradient-to-br from-[#111] to-black border border-[#D4AF37]/20 relative overflow-hidden group reveal" style="animation-delay: 0.8s" data-astro-cid-fjwk6imu> <div class="absolute top-[-20%] right-[-10%] w-32 h-32 bg-[#D4AF37]/10 blur-3xl rounded-full group-hover:bg-[#D4AF37]/20 transition-all" data-astro-cid-fjwk6imu></div> <h5 class="text-xl font-bold mb-4 relative z-10 uppercase italic tracking-tighter" data-astro-cid-fjwk6imu>Stay <span class="text-[#D4AF37]" data-astro-cid-fjwk6imu>Ahead.</span></h5> <p class="text-xs text-white/40 mb-6 relative z-10 leading-relaxed uppercase tracking-widest font-medium" data-astro-cid-fjwk6imu>รับบทวิเคราะห์เจาะลึกส่งตรงถึงอีเมลคุณ</p> <form class="flex gap-2 relative z-10" data-astro-cid-fjwk6imu> <input type="email" placeholder="YOUR EMAIL" class="bg-black/50 border border-white/5 rounded-xl px-4 py-3 text-[10px] eng tracking-widest focus:border-[#D4AF37] outline-none grow transition-all" data-astro-cid-fjwk6imu> <button class="bg-[#D4AF37] text-black p-3 rounded-xl hover:scale-105 transition-transform" data-astro-cid-fjwk6imu> <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" data-astro-cid-fjwk6imu><path d="M5 12h14m-7-7 7 7-7 7" data-astro-cid-fjwk6imu></path></svg> </button> </form> </div> </div> </div> </section> `;
}, "/Users/natthapongsuwanjit/Desktop/CashlessThailand/cashlessthailand/src/components/BlogSection.astro", void 0);

const $$Astro = createAstro();
const $$FAQ = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$FAQ;
  const faqCategories = [
    {
      id: "basics",
      label: "Bitcoin & Self-Custody",
      questions: [
        {
          q: "\u0E17\u0E33\u0E44\u0E21\u0E15\u0E49\u0E2D\u0E07\u0E23\u0E31\u0E19 Bitcoin Node \u0E40\u0E2D\u0E07 (BiTNode)?",
          a: "\u0E01\u0E32\u0E23\u0E23\u0E31\u0E19 Node \u0E40\u0E2D\u0E07\u0E04\u0E37\u0E2D\u0E27\u0E34\u0E18\u0E35\u0E40\u0E14\u0E35\u0E22\u0E27\u0E17\u0E35\u0E48\u0E04\u0E38\u0E13\u0E08\u0E30\u0E15\u0E23\u0E27\u0E08\u0E2A\u0E2D\u0E1A\u0E04\u0E27\u0E32\u0E21\u0E16\u0E39\u0E01\u0E15\u0E49\u0E2D\u0E07\u0E02\u0E2D\u0E07\u0E18\u0E38\u0E23\u0E01\u0E23\u0E23\u0E21\u0E44\u0E14\u0E49 100% \u0E42\u0E14\u0E22\u0E44\u0E21\u0E48\u0E15\u0E49\u0E2D\u0E07\u0E40\u0E0A\u0E37\u0E48\u0E2D\u0E43\u0E08\u0E43\u0E04\u0E23 (Don't Trust, Verify) \u0E41\u0E25\u0E30\u0E0A\u0E48\u0E27\u0E22\u0E23\u0E31\u0E01\u0E29\u0E32\u0E04\u0E27\u0E32\u0E21\u0E40\u0E1B\u0E47\u0E19\u0E2A\u0E48\u0E27\u0E19\u0E15\u0E31\u0E27\u0E02\u0E2D\u0E07\u0E02\u0E49\u0E2D\u0E21\u0E39\u0E25\u0E01\u0E32\u0E23\u0E40\u0E07\u0E34\u0E19\u0E44\u0E21\u0E48\u0E43\u0E2B\u0E49\u0E23\u0E31\u0E48\u0E27\u0E44\u0E2B\u0E25\u0E44\u0E1B\u0E2A\u0E39\u0E48 Public Server \u0E02\u0E2D\u0E07\u0E04\u0E19\u0E2D\u0E37\u0E48\u0E19\u0E04\u0E23\u0E31\u0E1A"
        },
        {
          q: "Lightning Network \u0E04\u0E37\u0E2D\u0E2D\u0E30\u0E44\u0E23 \u0E40\u0E01\u0E35\u0E48\u0E22\u0E27\u0E01\u0E31\u0E1A BiTTerm \u0E22\u0E31\u0E07\u0E44\u0E07?",
          a: "Lightning Network \u0E04\u0E37\u0E2D\u0E23\u0E30\u0E1A\u0E1A\u0E0A\u0E33\u0E23\u0E30\u0E40\u0E07\u0E34\u0E19 Bitcoin \u0E17\u0E35\u0E48\u0E40\u0E23\u0E47\u0E27\u0E23\u0E30\u0E14\u0E31\u0E1A\u0E27\u0E34\u0E19\u0E32\u0E17\u0E35\u0E41\u0E25\u0E30\u0E04\u0E48\u0E32\u0E18\u0E23\u0E23\u0E21\u0E40\u0E19\u0E35\u0E22\u0E21\u0E15\u0E48\u0E33\u0E21\u0E32\u0E01 (\u0E2B\u0E25\u0E31\u0E01\u0E2A\u0E15\u0E32\u0E07\u0E04\u0E4C) \u0E0B\u0E36\u0E48\u0E07 BiTTerm \u0E41\u0E25\u0E30 BiTPos \u0E43\u0E0A\u0E49\u0E23\u0E30\u0E1A\u0E1A\u0E19\u0E35\u0E49\u0E40\u0E1E\u0E37\u0E48\u0E2D\u0E43\u0E2B\u0E49\u0E25\u0E39\u0E01\u0E04\u0E49\u0E32\u0E02\u0E2D\u0E07\u0E04\u0E38\u0E13\u0E41\u0E25\u0E01\u0E40\u0E1B\u0E25\u0E35\u0E48\u0E22\u0E19\u0E2B\u0E23\u0E37\u0E2D\u0E08\u0E48\u0E32\u0E22\u0E40\u0E07\u0E34\u0E19\u0E44\u0E14\u0E49\u0E17\u0E31\u0E19\u0E17\u0E35\u0E42\u0E14\u0E22\u0E44\u0E21\u0E48\u0E15\u0E49\u0E2D\u0E07\u0E23\u0E2D Confirm \u0E19\u0E32\u0E19"
        },
        {
          q: "Hardware Wallet \u0E15\u0E48\u0E32\u0E07\u0E08\u0E32\u0E01\u0E41\u0E2D\u0E1B\u0E43\u0E19\u0E21\u0E37\u0E2D\u0E16\u0E37\u0E2D\u0E22\u0E31\u0E07\u0E44\u0E07?",
          a: "Hardware Wallet \u0E40\u0E01\u0E47\u0E1A Private Key \u0E41\u0E1A\u0E1A\u0E2D\u0E2D\u0E1F\u0E44\u0E25\u0E19\u0E4C (Cold Storage) \u0E41\u0E2E\u0E47\u0E01\u0E40\u0E01\u0E2D\u0E23\u0E4C\u0E40\u0E08\u0E32\u0E30\u0E44\u0E21\u0E48\u0E44\u0E14\u0E49\u0E41\u0E21\u0E49\u0E04\u0E2D\u0E21\u0E15\u0E34\u0E14\u0E44\u0E27\u0E23\u0E31\u0E2A \u0E2A\u0E48\u0E27\u0E19\u0E41\u0E2D\u0E1B\u0E21\u0E37\u0E2D\u0E16\u0E37\u0E2D (Hot Wallet) \u0E2A\u0E30\u0E14\u0E27\u0E01\u0E41\u0E15\u0E48\u0E40\u0E2A\u0E35\u0E48\u0E22\u0E07\u0E01\u0E27\u0E48\u0E32 \u0E40\u0E2B\u0E21\u0E32\u0E30\u0E2A\u0E33\u0E2B\u0E23\u0E31\u0E1A\u0E40\u0E01\u0E47\u0E1A\u0E40\u0E07\u0E34\u0E19\u0E08\u0E33\u0E19\u0E27\u0E19\u0E19\u0E49\u0E2D\u0E22\u0E46 \u0E44\u0E27\u0E49\u0E43\u0E0A\u0E49\u0E08\u0E48\u0E32\u0E22\u0E40\u0E17\u0E48\u0E32\u0E19\u0E31\u0E49\u0E19"
        },
        {
          q: "Not your keys, not your coins \u0E2B\u0E21\u0E32\u0E22\u0E04\u0E27\u0E32\u0E21\u0E27\u0E48\u0E32\u0E44\u0E07?",
          a: "\u0E2B\u0E21\u0E32\u0E22\u0E16\u0E36\u0E07\u0E16\u0E49\u0E32\u0E04\u0E38\u0E13\u0E1D\u0E32\u0E01 Bitcoin \u0E44\u0E27\u0E49\u0E1A\u0E19\u0E40\u0E27\u0E47\u0E1A\u0E40\u0E17\u0E23\u0E14 (Exchange) \u0E04\u0E38\u0E13\u0E44\u0E21\u0E48\u0E44\u0E14\u0E49\u0E40\u0E1B\u0E47\u0E19\u0E40\u0E08\u0E49\u0E32\u0E02\u0E2D\u0E07\u0E08\u0E23\u0E34\u0E07\u0E46 \u0E2B\u0E32\u0E01\u0E40\u0E27\u0E47\u0E1A\u0E1B\u0E34\u0E14\u0E15\u0E31\u0E27\u0E2B\u0E23\u0E37\u0E2D\u0E23\u0E30\u0E07\u0E31\u0E1A\u0E16\u0E2D\u0E19 \u0E04\u0E38\u0E13\u0E08\u0E30\u0E40\u0E2A\u0E35\u0E22\u0E40\u0E07\u0E34\u0E19\u0E17\u0E31\u0E49\u0E07\u0E2B\u0E21\u0E14 \u0E01\u0E32\u0E23\u0E40\u0E01\u0E47\u0E1A\u0E40\u0E2D\u0E07\u0E43\u0E19 Hardware Wallet \u0E2B\u0E23\u0E37\u0E2D Node \u0E2A\u0E48\u0E27\u0E19\u0E15\u0E31\u0E27\u0E08\u0E36\u0E07\u0E1B\u0E25\u0E2D\u0E14\u0E20\u0E31\u0E22\u0E17\u0E35\u0E48\u0E2A\u0E38\u0E14\u0E04\u0E23\u0E31\u0E1A"
        },
        {
          q: "\u0E16\u0E49\u0E32\u0E44\u0E1F\u0E14\u0E31\u0E1A\u0E2B\u0E23\u0E37\u0E2D\u0E40\u0E19\u0E47\u0E15\u0E2B\u0E25\u0E38\u0E14 Bitcoin \u0E43\u0E19 Node \u0E08\u0E30\u0E2B\u0E32\u0E22\u0E44\u0E2B\u0E21?",
          a: "\u0E44\u0E21\u0E48\u0E2B\u0E32\u0E22\u0E04\u0E23\u0E31\u0E1A! \u0E02\u0E49\u0E2D\u0E21\u0E39\u0E25 Blockchain \u0E16\u0E39\u0E01\u0E1A\u0E31\u0E19\u0E17\u0E36\u0E01\u0E25\u0E07\u0E43\u0E19 SSD (Harddisk) \u0E40\u0E21\u0E37\u0E48\u0E2D\u0E44\u0E1F\u0E21\u0E32\u0E2B\u0E23\u0E37\u0E2D\u0E40\u0E19\u0E47\u0E15\u0E15\u0E34\u0E14 \u0E40\u0E04\u0E23\u0E37\u0E48\u0E2D\u0E07\u0E08\u0E30\u0E17\u0E33\u0E01\u0E32\u0E23 Sync \u0E02\u0E49\u0E2D\u0E21\u0E39\u0E25\u0E2A\u0E48\u0E27\u0E19\u0E17\u0E35\u0E48\u0E02\u0E32\u0E14\u0E2B\u0E32\u0E22\u0E44\u0E1B\u0E15\u0E48\u0E2D\u0E43\u0E2B\u0E49\u0E40\u0E2D\u0E07\u0E42\u0E14\u0E22\u0E2D\u0E31\u0E15\u0E42\u0E19\u0E21\u0E31\u0E15\u0E34\u0E04\u0E23\u0E31\u0E1A"
        }
      ]
    },
    {
      id: "products",
      label: "Product Usage",
      questions: [
        {
          q: "BiTTerm (\u0E15\u0E39\u0E49 ATM) \u0E2A\u0E23\u0E49\u0E32\u0E07\u0E23\u0E32\u0E22\u0E44\u0E14\u0E49\u0E22\u0E31\u0E07\u0E44\u0E07?",
          a: "\u0E40\u0E08\u0E49\u0E32\u0E02\u0E2D\u0E07\u0E15\u0E39\u0E49\u0E2A\u0E32\u0E21\u0E32\u0E23\u0E16\u0E01\u0E33\u0E2B\u0E19\u0E14 '\u0E04\u0E48\u0E32\u0E18\u0E23\u0E23\u0E21\u0E40\u0E19\u0E35\u0E22\u0E21' (Fee) \u0E43\u0E19\u0E01\u0E32\u0E23\u0E41\u0E25\u0E01\u0E40\u0E1B\u0E25\u0E35\u0E48\u0E22\u0E19\u0E44\u0E14\u0E49\u0E40\u0E2D\u0E07 (\u0E40\u0E0A\u0E48\u0E19 1-5%) \u0E40\u0E21\u0E37\u0E48\u0E2D\u0E21\u0E35\u0E04\u0E19\u0E21\u0E32\u0E43\u0E0A\u0E49\u0E15\u0E39\u0E49 \u0E23\u0E30\u0E1A\u0E1A\u0E08\u0E30\u0E2B\u0E31\u0E01\u0E2A\u0E48\u0E27\u0E19\u0E15\u0E48\u0E32\u0E07\u0E19\u0E31\u0E49\u0E19\u0E40\u0E1B\u0E47\u0E19\u0E01\u0E33\u0E44\u0E23\u0E40\u0E02\u0E49\u0E32 Wallet \u0E02\u0E2D\u0E07\u0E04\u0E38\u0E13\u0E17\u0E31\u0E19\u0E17\u0E35 \u0E16\u0E37\u0E2D\u0E40\u0E1B\u0E47\u0E19 Passive Income \u0E04\u0E23\u0E31\u0E1A"
        },
        {
          q: "CryptoClock \u0E15\u0E49\u0E2D\u0E07\u0E40\u0E0A\u0E37\u0E48\u0E2D\u0E21\u0E15\u0E48\u0E2D\u0E04\u0E2D\u0E21\u0E1E\u0E34\u0E27\u0E40\u0E15\u0E2D\u0E23\u0E4C\u0E15\u0E25\u0E2D\u0E14\u0E44\u0E2B\u0E21?",
          a: "\u0E44\u0E21\u0E48\u0E15\u0E49\u0E2D\u0E07\u0E04\u0E23\u0E31\u0E1A! CryptoClock \u0E17\u0E33\u0E07\u0E32\u0E19\u0E41\u0E22\u0E01\u0E2D\u0E34\u0E2A\u0E23\u0E30 \u0E21\u0E35\u0E0A\u0E34\u0E1B WiFi \u0E43\u0E19\u0E15\u0E31\u0E27 \u0E41\u0E04\u0E48\u0E40\u0E2A\u0E35\u0E22\u0E1A\u0E1B\u0E25\u0E31\u0E4A\u0E01 USB-C \u0E41\u0E25\u0E30\u0E15\u0E31\u0E49\u0E07\u0E04\u0E48\u0E32\u0E1C\u0E48\u0E32\u0E19\u0E21\u0E37\u0E2D\u0E16\u0E37\u0E2D\u0E04\u0E23\u0E31\u0E49\u0E07\u0E41\u0E23\u0E01\u0E04\u0E23\u0E31\u0E49\u0E07\u0E40\u0E14\u0E35\u0E22\u0E27 \u0E01\u0E47\u0E08\u0E30\u0E14\u0E36\u0E07\u0E23\u0E32\u0E04\u0E32\u0E21\u0E32\u0E41\u0E2A\u0E14\u0E07\u0E1C\u0E25\u0E44\u0E14\u0E49\u0E15\u0E25\u0E2D\u0E14 24 \u0E0A\u0E21."
        },
        {
          q: "BiTNode \u0E01\u0E34\u0E19\u0E44\u0E1F\u0E40\u0E22\u0E2D\u0E30\u0E44\u0E2B\u0E21 \u0E40\u0E1B\u0E34\u0E14\u0E17\u0E34\u0E49\u0E07\u0E44\u0E27\u0E49\u0E44\u0E14\u0E49\u0E44\u0E2B\u0E21?",
          a: "\u0E01\u0E34\u0E19\u0E44\u0E1F\u0E19\u0E49\u0E2D\u0E22\u0E21\u0E32\u0E01\u0E04\u0E23\u0E31\u0E1A (\u0E1B\u0E23\u0E30\u0E21\u0E32\u0E13 5-15W) \u0E2B\u0E23\u0E37\u0E2D\u0E40\u0E14\u0E37\u0E2D\u0E19\u0E25\u0E30\u0E1B\u0E23\u0E30\u0E21\u0E32\u0E13 30-60 \u0E1A\u0E32\u0E17 \u0E16\u0E39\u0E01\u0E01\u0E27\u0E48\u0E32\u0E40\u0E1B\u0E34\u0E14\u0E1E\u0E31\u0E14\u0E25\u0E21\u0E40\u0E1A\u0E2D\u0E23\u0E4C 1 \u0E40\u0E2A\u0E35\u0E22\u0E2D\u0E35\u0E01 \u0E2D\u0E2D\u0E01\u0E41\u0E1A\u0E1A\u0E21\u0E32\u0E43\u0E2B\u0E49\u0E40\u0E1B\u0E34\u0E14\u0E17\u0E34\u0E49\u0E07\u0E44\u0E27\u0E49\u0E44\u0E14\u0E49 24/7 \u0E15\u0E25\u0E2D\u0E14\u0E17\u0E31\u0E49\u0E07\u0E1B\u0E35\u0E04\u0E23\u0E31\u0E1A"
        },
        {
          q: "BiTPos \u0E15\u0E49\u0E2D\u0E07\u0E40\u0E2A\u0E35\u0E22\u0E23\u0E32\u0E22\u0E40\u0E14\u0E37\u0E2D\u0E19\u0E44\u0E2B\u0E21?",
          a: "\u0E44\u0E21\u0E48\u0E21\u0E35\u0E04\u0E48\u0E32\u0E23\u0E32\u0E22\u0E40\u0E14\u0E37\u0E2D\u0E19\u0E04\u0E23\u0E31\u0E1A! \u0E04\u0E38\u0E13\u0E0B\u0E37\u0E49\u0E2D\u0E40\u0E04\u0E23\u0E37\u0E48\u0E2D\u0E07\u0E02\u0E32\u0E14\u0E04\u0E23\u0E31\u0E49\u0E07\u0E40\u0E14\u0E35\u0E22\u0E27\u0E08\u0E1A \u0E0B\u0E2D\u0E1F\u0E15\u0E4C\u0E41\u0E27\u0E23\u0E4C\u0E02\u0E49\u0E32\u0E07\u0E43\u0E19\u0E40\u0E1B\u0E47\u0E19 Open Source (LNBits/BtcPay) \u0E17\u0E35\u0E48\u0E44\u0E21\u0E48\u0E21\u0E35\u0E01\u0E32\u0E23\u0E40\u0E01\u0E47\u0E1A\u0E04\u0E48\u0E32\u0E1A\u0E23\u0E34\u0E01\u0E32\u0E23\u0E41\u0E2D\u0E1A\u0E41\u0E1D\u0E07"
        },
        {
          q: "CryptoClock ePaper \u0E08\u0E2D\u0E08\u0E30\u0E40\u0E2A\u0E37\u0E48\u0E2D\u0E21\u0E44\u0E2B\u0E21?",
          a: "\u0E08\u0E2D E-Ink \u0E21\u0E35\u0E04\u0E27\u0E32\u0E21\u0E17\u0E19\u0E17\u0E32\u0E19\u0E2A\u0E39\u0E07\u0E21\u0E32\u0E01\u0E41\u0E25\u0E30\u0E1B\u0E23\u0E30\u0E2B\u0E22\u0E31\u0E14\u0E1E\u0E25\u0E31\u0E07\u0E07\u0E32\u0E19 \u0E40\u0E1E\u0E23\u0E32\u0E30\u0E44\u0E1F\u0E08\u0E30\u0E40\u0E25\u0E35\u0E49\u0E22\u0E07\u0E40\u0E09\u0E1E\u0E32\u0E30\u0E15\u0E2D\u0E19\u0E40\u0E1B\u0E25\u0E35\u0E48\u0E22\u0E19\u0E15\u0E31\u0E27\u0E40\u0E25\u0E02\u0E40\u0E17\u0E48\u0E32\u0E19\u0E31\u0E49\u0E19 \u0E44\u0E21\u0E48\u0E21\u0E35\u0E01\u0E32\u0E23 Burn-in \u0E40\u0E2B\u0E21\u0E37\u0E2D\u0E19\u0E08\u0E2D OLED \u0E2D\u0E32\u0E22\u0E38\u0E01\u0E32\u0E23\u0E43\u0E0A\u0E49\u0E07\u0E32\u0E19\u0E22\u0E32\u0E27\u0E19\u0E32\u0E19\u0E2B\u0E25\u0E32\u0E22\u0E1B\u0E35\u0E04\u0E23\u0E31\u0E1A"
        }
      ]
    },
    {
      id: "service",
      label: "Support & Warranty",
      questions: [
        {
          q: "\u0E2A\u0E34\u0E19\u0E04\u0E49\u0E32\u0E21\u0E35\u0E01\u0E32\u0E23\u0E23\u0E31\u0E1A\u0E1B\u0E23\u0E30\u0E01\u0E31\u0E19\u0E01\u0E35\u0E48\u0E1B\u0E35?",
          a: "\u0E2A\u0E34\u0E19\u0E04\u0E49\u0E32\u0E01\u0E25\u0E38\u0E48\u0E21 Hardware (BiTNode, BiTTerm, BiTPos, CryptoClock) \u0E23\u0E31\u0E1A\u0E1B\u0E23\u0E30\u0E01\u0E31\u0E19\u0E28\u0E39\u0E19\u0E22\u0E4C\u0E44\u0E17\u0E22 1 \u0E1B\u0E35\u0E40\u0E15\u0E47\u0E21 \u0E2B\u0E32\u0E01\u0E21\u0E35\u0E1B\u0E31\u0E0D\u0E2B\u0E32\u0E08\u0E32\u0E01\u0E01\u0E32\u0E23\u0E1C\u0E25\u0E34\u0E15 \u0E40\u0E23\u0E32\u0E40\u0E1B\u0E25\u0E35\u0E48\u0E22\u0E19\u0E2D\u0E30\u0E44\u0E2B\u0E25\u0E48\u0E2B\u0E23\u0E37\u0E2D\u0E40\u0E04\u0E23\u0E37\u0E48\u0E2D\u0E07\u0E43\u0E2B\u0E21\u0E48\u0E43\u0E2B\u0E49\u0E1F\u0E23\u0E35\u0E04\u0E23\u0E31\u0E1A"
        },
        {
          q: "\u0E16\u0E49\u0E32\u0E0B\u0E37\u0E49\u0E2D Node \u0E44\u0E1B\u0E41\u0E25\u0E49\u0E27\u0E17\u0E33\u0E44\u0E21\u0E48\u0E40\u0E1B\u0E47\u0E19 \u0E21\u0E35\u0E2A\u0E2D\u0E19\u0E44\u0E2B\u0E21?",
          a: "\u0E21\u0E35\u0E04\u0E23\u0E31\u0E1A! \u0E40\u0E23\u0E32\u0E21\u0E35\u0E04\u0E39\u0E48\u0E21\u0E37\u0E2D\u0E20\u0E32\u0E29\u0E32\u0E44\u0E17\u0E22\u0E41\u0E1A\u0E1A\u0E25\u0E30\u0E40\u0E2D\u0E35\u0E22\u0E14 (Video & Text) \u0E41\u0E25\u0E30\u0E21\u0E35\u0E01\u0E25\u0E38\u0E48\u0E21 Line Square \u0E2A\u0E33\u0E2B\u0E23\u0E31\u0E1A\u0E25\u0E39\u0E01\u0E04\u0E49\u0E32 \u0E40\u0E1E\u0E37\u0E48\u0E2D\u0E2A\u0E2D\u0E1A\u0E16\u0E32\u0E21\u0E1B\u0E31\u0E0D\u0E2B\u0E32\u0E01\u0E32\u0E23\u0E43\u0E0A\u0E49\u0E07\u0E32\u0E19\u0E41\u0E25\u0E30\u0E40\u0E17\u0E04\u0E19\u0E34\u0E04\u0E15\u0E48\u0E32\u0E07\u0E46 \u0E08\u0E32\u0E01\u0E17\u0E35\u0E21\u0E07\u0E32\u0E19\u0E41\u0E25\u0E30\u0E40\u0E1E\u0E37\u0E48\u0E2D\u0E19\u0E2A\u0E21\u0E32\u0E0A\u0E34\u0E01\u0E04\u0E23\u0E31\u0E1A"
        },
        {
          q: "\u0E2A\u0E31\u0E48\u0E07\u0E0B\u0E37\u0E49\u0E2D\u0E41\u0E25\u0E49\u0E27\u0E23\u0E2D\u0E19\u0E32\u0E19\u0E44\u0E2B\u0E21?",
          a: "\u0E2A\u0E34\u0E19\u0E04\u0E49\u0E32\u0E17\u0E35\u0E48\u0E21\u0E35\u0E2A\u0E16\u0E32\u0E19\u0E30 'In Stock' \u0E08\u0E31\u0E14\u0E2A\u0E48\u0E07\u0E20\u0E32\u0E22\u0E43\u0E19 1-2 \u0E27\u0E31\u0E19\u0E17\u0E33\u0E01\u0E32\u0E23 \u0E2A\u0E48\u0E27\u0E19\u0E2A\u0E34\u0E19\u0E04\u0E49\u0E32 'Pre-order' \u0E2B\u0E23\u0E37\u0E2D\u0E2A\u0E34\u0E19\u0E04\u0E49\u0E32\u0E2A\u0E31\u0E48\u0E07\u0E1B\u0E23\u0E30\u0E01\u0E2D\u0E1A (Custom Node) \u0E08\u0E30\u0E43\u0E0A\u0E49\u0E40\u0E27\u0E25\u0E32\u0E1B\u0E23\u0E30\u0E21\u0E32\u0E13 7-14 \u0E27\u0E31\u0E19\u0E04\u0E23\u0E31\u0E1A"
        },
        {
          q: "\u0E40\u0E04\u0E23\u0E37\u0E48\u0E2D\u0E07\u0E40\u0E2A\u0E35\u0E22\u0E2A\u0E48\u0E07\u0E0B\u0E48\u0E2D\u0E21\u0E17\u0E35\u0E48\u0E44\u0E2B\u0E19?",
          a: "\u0E2A\u0E48\u0E07\u0E01\u0E25\u0E31\u0E1A\u0E21\u0E32\u0E17\u0E35\u0E48\u0E28\u0E39\u0E19\u0E22\u0E4C\u0E1A\u0E23\u0E34\u0E01\u0E32\u0E23\u0E02\u0E2D\u0E07\u0E40\u0E23\u0E32\u0E43\u0E19\u0E44\u0E17\u0E22\u0E44\u0E14\u0E49\u0E40\u0E25\u0E22\u0E04\u0E23\u0E31\u0E1A \u0E44\u0E21\u0E48\u0E15\u0E49\u0E2D\u0E07\u0E2A\u0E48\u0E07\u0E44\u0E1B\u0E40\u0E04\u0E25\u0E21\u0E15\u0E48\u0E32\u0E07\u0E1B\u0E23\u0E30\u0E40\u0E17\u0E28\u0E40\u0E2D\u0E07 \u0E40\u0E23\u0E32\u0E21\u0E35\u0E0A\u0E48\u0E32\u0E07\u0E40\u0E17\u0E04\u0E19\u0E34\u0E04\u0E14\u0E39\u0E41\u0E25\u0E41\u0E25\u0E30\u0E21\u0E35\u0E2D\u0E30\u0E44\u0E2B\u0E25\u0E48\u0E2A\u0E33\u0E23\u0E2D\u0E07\u0E1E\u0E23\u0E49\u0E2D\u0E21\u0E0B\u0E48\u0E2D\u0E21"
        },
        {
          q: "\u0E21\u0E35\u0E1A\u0E23\u0E34\u0E01\u0E32\u0E23\u0E15\u0E34\u0E14\u0E15\u0E31\u0E49\u0E07\u0E19\u0E2D\u0E01\u0E2A\u0E16\u0E32\u0E19\u0E17\u0E35\u0E48\u0E44\u0E2B\u0E21?",
          a: "\u0E2A\u0E33\u0E2B\u0E23\u0E31\u0E1A BiTTerm (\u0E15\u0E39\u0E49 ATM) \u0E40\u0E23\u0E32\u0E21\u0E35\u0E1A\u0E23\u0E34\u0E01\u0E32\u0E23\u0E44\u0E1B\u0E15\u0E34\u0E14\u0E15\u0E31\u0E49\u0E07\u0E41\u0E25\u0E30 Setup \u0E43\u0E2B\u0E49\u0E16\u0E36\u0E07\u0E17\u0E35\u0E48 (\u0E43\u0E19\u0E40\u0E02\u0E15 \u0E01\u0E17\u0E21. \u0E41\u0E25\u0E30\u0E1B\u0E23\u0E34\u0E21\u0E13\u0E11\u0E25) \u0E1E\u0E23\u0E49\u0E2D\u0E21\u0E2A\u0E2D\u0E19\u0E01\u0E32\u0E23\u0E43\u0E0A\u0E49\u0E07\u0E32\u0E19\u0E2B\u0E19\u0E49\u0E32\u0E07\u0E32\u0E19\u0E04\u0E23\u0E31\u0E1A \u0E2A\u0E48\u0E27\u0E19\u0E15\u0E48\u0E32\u0E07\u0E08\u0E31\u0E07\u0E2B\u0E27\u0E31\u0E14\u0E2A\u0E32\u0E21\u0E32\u0E23\u0E16 Video Call \u0E2A\u0E2D\u0E19\u0E15\u0E34\u0E14\u0E15\u0E31\u0E49\u0E07\u0E44\u0E14\u0E49\u0E04\u0E23\u0E31\u0E1A"
        }
      ]
    }
  ];
  return renderTemplate`${maybeRenderHead()}<section class="max-w-[1000px] mx-auto px-6 md:px-12 py-32" id="faq-section" data-astro-cid-al2ca2vr> <div class="text-center mb-16 reveal" data-astro-cid-al2ca2vr> <h2 class="eng text-[#D4AF37] text-xs font-black tracking-[0.5em] uppercase mb-4" data-astro-cid-al2ca2vr>Common Questions</h2> <h2 class="text-4xl md:text-5xl font-black text-white uppercase tracking-tighter mb-8" data-astro-cid-al2ca2vr>FAQ</h2> <div class="inline-flex flex-wrap justify-center gap-2 p-1 bg-white/5 rounded-full border border-white/10 backdrop-blur-sm" data-astro-cid-al2ca2vr> ${faqCategories.map((cat, index) => renderTemplate`<button${addAttribute(`tab-btn px-6 py-2 rounded-full text-sm font-bold uppercase tracking-wider transition-all duration-300 ${index === 0 ? "bg-[#D4AF37] text-black shadow-[0_0_20px_rgba(212,175,55,0.4)] active-tab" : "text-white/60 hover:text-white hover:bg-white/5"}`, "class")}${addAttribute(cat.id, "data-target")} data-astro-cid-al2ca2vr> ${cat.label} </button>`)} </div> </div> <div class="relative min-h-[600px]" data-astro-cid-al2ca2vr> ${faqCategories.map((cat, index) => renderTemplate`<div${addAttribute(cat.id, "id")}${addAttribute(`faq-panel space-y-4 transition-all duration-500 absolute top-0 left-0 w-full ${index === 0 ? "opacity-100 z-10 translate-y-0 active-panel" : "opacity-0 z-0 translate-y-4 pointer-events-none"}`, "class")} data-astro-cid-al2ca2vr> ${cat.questions.map((item, i) => renderTemplate`<details class="group bg-[#0a0a0a] rounded-2xl border border-white/5 open:border-[#D4AF37]/50 transition-all duration-300" data-astro-cid-al2ca2vr> <summary class="flex justify-between items-center p-6 cursor-pointer list-none select-none" data-astro-cid-al2ca2vr> <span class="text-lg font-bold text-white group-hover:text-[#D4AF37] transition-colors pr-8" data-astro-cid-al2ca2vr>${item.q}</span> <span class="text-[#D4AF37] transform group-open:rotate-180 transition-transform duration-300 flex-shrink-0" data-astro-cid-al2ca2vr> <svg width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" data-astro-cid-al2ca2vr><path d="M6 9l6 6 6-6" data-astro-cid-al2ca2vr></path></svg> </span> </summary> <div class="px-6 pb-6 text-white/60 leading-relaxed font-light border-t border-white/5 pt-4 mt-2" data-astro-cid-al2ca2vr> ${item.a} </div> </details>`)} </div>`)} </div> </section> ${renderScript($$result, "/Users/natthapongsuwanjit/Desktop/CashlessThailand/cashlessthailand/src/components/FAQ.astro?astro&type=script&index=0&lang.ts")} `;
}, "/Users/natthapongsuwanjit/Desktop/CashlessThailand/cashlessthailand/src/components/FAQ.astro", void 0);

const $$Index = createComponent(($$result, $$props, $$slots) => {
  const pageTitle = "Cashless Thailand | Bitcoin & Crypto Innovation Devices";
  const pageDesc = "\u0E2A\u0E16\u0E32\u0E1A\u0E31\u0E19\u0E2A\u0E2D\u0E19\u0E41\u0E25\u0E30\u0E08\u0E31\u0E14\u0E08\u0E33\u0E2B\u0E19\u0E48\u0E32\u0E22 \u0E28\u0E39\u0E19\u0E22\u0E4C\u0E23\u0E27\u0E21\u0E19\u0E27\u0E31\u0E15\u0E01\u0E23\u0E23\u0E21 Bitcoin: CryptoClock, \u0E15\u0E39\u0E49 BiTTerm, \u0E40\u0E04\u0E23\u0E37\u0E48\u0E2D\u0E07 BiTPos \u0E41\u0E25\u0E30 BiTNode \u0E2D\u0E38\u0E1B\u0E01\u0E23\u0E13\u0E4C\u0E23\u0E31\u0E19\u0E42\u0E2B\u0E19\u0E14\u0E2A\u0E48\u0E27\u0E19\u0E15\u0E31\u0E27 \u0E1D\u0E35\u0E21\u0E37\u0E2D\u0E04\u0E19\u0E44\u0E17\u0E22";
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": pageTitle, "description": pageDesc, "data-astro-cid-j7pv25f6": true }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<div id="loader" class="fixed inset-0 bg-[#050505] z-[100000] flex items-center justify-center transition-opacity duration-500" data-astro-cid-j7pv25f6> <div class="relative flex flex-col items-center gap-6" data-astro-cid-j7pv25f6> <div class="w-20 h-20 border-4 border-[#D4AF37]/20 border-t-[#D4AF37] rounded-full animate-spin" data-astro-cid-j7pv25f6></div> <div class="flex flex-col items-center" data-astro-cid-j7pv25f6> <span class="eng text-white font-black text-2xl tracking-tighter" data-astro-cid-j7pv25f6>CASHLESS<span class="text-[#D4AF37]" data-astro-cid-j7pv25f6>.</span>TH</span> <span class="eng text-[#D4AF37] text-[10px] font-bold tracking-[0.5em] animate-pulse mt-2" data-astro-cid-j7pv25f6>INITIALIZING</span> </div> </div> </div> ${renderComponent($$result2, "CartDrawer", $$CartDrawer, { "data-astro-cid-j7pv25f6": true })} ${renderComponent($$result2, "Navbar", $$Navbar, { "data-astro-cid-j7pv25f6": true })} <main class="relative z-10 bg-[#050505] overflow-hidden" data-astro-cid-j7pv25f6> <div id="home" class="relative z-10" data-astro-cid-j7pv25f6> ${renderComponent($$result2, "Hero", $$Hero, { "data-astro-cid-j7pv25f6": true })} </div> <div class="relative z-20 -mt-8 md:-mt-10 transform -rotate-1 origin-center pointer-events-none" data-astro-cid-j7pv25f6> <div class="shadow-[0_20px_50px_rgba(0,0,0,0.8)] backdrop-blur-sm" data-astro-cid-j7pv25f6> ${renderComponent($$result2, "Marquee", $$Marquee, { "data-astro-cid-j7pv25f6": true })} </div> </div> <div id="features" class="relative z-10 bg-gradient-to-b from-[#050505] via-[#0a0a0a] to-[#050505]" data-astro-cid-j7pv25f6> ${renderComponent($$result2, "Features", $$Features, { "data-astro-cid-j7pv25f6": true })} </div> <div class="relative z-10 border-t border-white/5" data-astro-cid-j7pv25f6> ${renderComponent($$result2, "ProductGallery", $$ProductGallery, { "data-astro-cid-j7pv25f6": true })} </div> <div class="relative z-10" data-astro-cid-j7pv25f6> ${renderComponent($$result2, "ShopExplorer", $$ShopExplorer, { "data-astro-cid-j7pv25f6": true })} </div> <div id="shop" class="relative pt-32 pb-10 z-10" data-astro-cid-j7pv25f6> <div class="absolute top-0 right-0 w-[60%] h-[60%] bg-[#D4AF37]/5 blur-[180px] rounded-full pointer-events-none" data-astro-cid-j7pv25f6></div> ${renderComponent($$result2, "FeaturedGrid", $$FeaturedGrid, { "data-astro-cid-j7pv25f6": true })} </div> <div class="relative z-10 border-t border-[#D4AF37]/10" data-astro-cid-j7pv25f6> ${renderComponent($$result2, "Partners", $$Partners, { "data-astro-cid-j7pv25f6": true })} </div> <div class="relative z-10" data-astro-cid-j7pv25f6> ${renderComponent($$result2, "Testimonials", $$Testimonials, { "data-astro-cid-j7pv25f6": true })} </div> <div id="community" class="relative z-10 border-t border-[#D4AF37]/10" data-astro-cid-j7pv25f6> ${renderComponent($$result2, "CommunityEvents", $$CommunityEvents, { "data-astro-cid-j7pv25f6": true })} </div> <div id="articles" class="relative z-10 border-t border-[#D4AF37]/10" data-astro-cid-j7pv25f6> <div class="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#D4AF37]/50 to-transparent opacity-50" data-astro-cid-j7pv25f6></div> ${renderComponent($$result2, "BlogSection", $$BlogSection, { "data-astro-cid-j7pv25f6": true })} </div> <div class="relative z-10 border-b border-[#D4AF37]/10 bg-[#050505]" data-astro-cid-j7pv25f6> ${renderComponent($$result2, "FAQ", $$FAQ, { "data-astro-cid-j7pv25f6": true })} </div> </main> ${renderComponent($$result2, "Footer", $$Footer, { "data-astro-cid-j7pv25f6": true })} ` })} ${renderScript($$result, "/Users/natthapongsuwanjit/Desktop/CashlessThailand/cashlessthailand/src/pages/index.astro?astro&type=script&index=0&lang.ts")} `;
}, "/Users/natthapongsuwanjit/Desktop/CashlessThailand/cashlessthailand/src/pages/index.astro", void 0);

const $$file = "/Users/natthapongsuwanjit/Desktop/CashlessThailand/cashlessthailand/src/pages/index.astro";
const $$url = "";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
    __proto__: null,
    default: $$Index,
    file: $$file,
    url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
