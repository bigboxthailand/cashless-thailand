import { e as createComponent, f as createAstro, k as renderComponent, l as renderScript, r as renderTemplate, m as maybeRenderHead, u as unescapeHTML, h as addAttribute } from '../../../chunks/astro/server_Bu8JVBjn.mjs';
import 'piccolore';
import { $ as $$Layout, a as $$Navbar } from '../../../chunks/Navbar_DWavSQqS.mjs';
import { $ as $$Footer } from '../../../chunks/Footer_BP6qeS3w.mjs';
import { createClient } from '@supabase/supabase-js';
export { renderers } from '../../../renderers.mjs';

const $$Astro = createAstro();
const $$slug = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$slug;
  const { slug } = Astro2.params;
  if (!slug) return Astro2.redirect("/404");
  const supabase = createClient(
    "https://euavftppzicwjhbugiys.supabase.co",
    "sb_publishable_poJ-NobQZpARz_G4cWG96Q_vxIPZkrE"
  );
  const { data: article, error } = await supabase.from("articles").select("*").eq("slug", slug).single();
  if (error || !article) {
    return Astro2.redirect("/404");
  }
  const { data: reviews } = await supabase.from("article_reviews").select("*, user:profiles(full_name, avatar_url)").eq("article_id", article.id).order("created_at", { ascending: false });
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("th-TH", {
      day: "numeric",
      month: "long",
      year: "numeric"
    });
  };
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": article.title, "description": article.excerpt }, { "default": async ($$result2) => renderTemplate` ${renderComponent($$result2, "Navbar", $$Navbar, {})} ${maybeRenderHead()}<main class="min-h-screen bg-[#050505] text-white pt-32 pb-20">  <article class="max-w-3xl mx-auto px-6"> <div class="mb-8 text-center space-y-4"> <div class="flex items-center justify-center gap-4"> <span class="px-3 py-1 border border-[#D4AF37] text-[#D4AF37] text-[10px] font-black tracking-[0.2em] rounded uppercase"> ${article.category} </span> <span class="text-white/40 text-xs tracking-widest uppercase"> ${formatDate(article.created_at)} </span> </div> <h1 class="text-3xl md:text-5xl font-bold leading-tight text-transparent bg-clip-text bg-gradient-to-br from-white via-white to-white/60"> ${article.title} </h1> <div class="flex items-center justify-center gap-3 text-sm text-white/60"> <span>By <span class="text-[#D4AF37]">${article.author}</span></span> <span>•</span> <span>${article.views_count} Views</span> </div> </div> ${article.cover_image && renderTemplate`<div class="rounded-3xl overflow-hidden border border-white/10 mb-12 shadow-2xl shadow-[#D4AF37]/5"> <img${addAttribute(article.cover_image, "src")}${addAttribute(article.title, "alt")} class="w-full h-auto object-cover"> </div>`}  <div class="prose prose-invert prose-lg max-w-none prose-headings:font-bold prose-headings:text-white prose-a:text-[#D4AF37] prose-img:rounded-2xl"> <div>${unescapeHTML(article.content)}</div> </div>  <div class="mt-16 pt-8 border-t border-white/10 flex items-center justify-between"> <div class="flex gap-4">  </div> <button id="like-btn"${addAttribute(article.id, "data-id")} class="group flex items-center gap-3 px-6 py-3 bg-white/5 hover:bg-[#D4AF37]/20 border border-white/10 hover:border-[#D4AF37] rounded-full transition-all"> <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6 text-white/60 group-hover:text-[#D4AF37] group-hover:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"> <path stroke-linecap="round" stroke-linejoin="round" d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5"></path> </svg> <span class="font-bold group-hover:text-white" id="like-count">${article.likes_count}</span> </button> </div> </article>  <section class="max-w-3xl mx-auto px-6 mt-20"> <h3 class="text-2xl font-bold mb-8 flex items-center gap-3"> <span class="w-1 h-6 bg-[#D4AF37]"></span>
Community Reviews
</h3>  <div id="review-form-container" class="mb-12 p-6 bg-[#111] rounded-2xl border border-white/10 hidden"> <h4 class="text-lg font-bold mb-4">Leave a Review</h4> <form id="review-form" class="space-y-4"> <div class="flex gap-2"> ${[1, 2, 3, 4, 5].map((star) => renderTemplate`<button type="button" class="star-btn text-2xl text-white/20 hover:text-yellow-500 transition-colors"${addAttribute(star, "data-val")}>
★
</button>`)} <input type="hidden" name="rating" id="rating-input" value="5"> </div> <textarea name="comment" rows="3" class="w-full bg-black/50 border border-white/10 rounded-xl p-4 text-white focus:border-[#D4AF37] outline-none" placeholder="Share your thoughts..."></textarea> <button type="submit" class="px-6 py-2 bg-[#D4AF37] text-black font-bold rounded-lg hover:brightness-110">Submit Review</button> </form> </div> <div id="login-prompt" class="mb-12 p-6 bg-[#111] rounded-2xl border border-white/10 text-center hidden"> <p class="text-white/60 mb-4">
Please login to write a review.
</p> <a href="/login" class="inline-block px-6 py-2 border border-white/20 hover:border-[#D4AF37] rounded-full text-sm font-bold uppercase">Login</a> </div>  <div class="space-y-6"> ${(reviews || []).map((review) => renderTemplate`<div class="p-6 rounded-2xl bg-white/5 border border-white/5"> <div class="flex items-center justify-between mb-4"> <div class="flex items-center gap-3"> <div class="w-10 h-10 rounded-full bg-gradient-to-br from-[#D4AF37] to-black p-[2px]"> <div class="w-full h-full rounded-full bg-black flex items-center justify-center overflow-hidden"> ${review.user?.avatar_url ? renderTemplate`<img${addAttribute(review.user.avatar_url, "src")} class="w-full h-full object-cover">` : renderTemplate`<span class="text-[#D4AF37] font-bold"> ${review.user?.full_name?.charAt(
    0
  ) || "U"} </span>`} </div> </div> <div> <h5 class="font-bold text-sm text-white"> ${review.user?.full_name || "Anonymous"} </h5> <span class="text-white/30 text-xs"> ${formatDate(review.created_at)} </span> </div> </div> <div class="flex text-yellow-500 text-sm"> ${Array(review.rating).fill("★").join("")} </div> </div> <p class="text-white/80 leading-relaxed"> ${review.comment} </p> </div>`)} </div> </section> </main> ${renderComponent($$result2, "Footer", $$Footer, {})} ` })} ${renderScript($$result, "/Users/natthapongsuwanjit/Desktop/CashlessThailand/cashlessthailand/src/pages/knowledge/post/[slug].astro?astro&type=script&index=0&lang.ts")}`;
}, "/Users/natthapongsuwanjit/Desktop/CashlessThailand/cashlessthailand/src/pages/knowledge/post/[slug].astro", void 0);
const $$file = "/Users/natthapongsuwanjit/Desktop/CashlessThailand/cashlessthailand/src/pages/knowledge/post/[slug].astro";
const $$url = "/knowledge/post/[slug]";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
    __proto__: null,
    default: $$slug,
    file: $$file,
    url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
