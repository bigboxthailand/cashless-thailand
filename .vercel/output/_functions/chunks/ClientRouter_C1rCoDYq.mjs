import { e as createComponent, f as createAstro, h as addAttribute, l as renderScript, r as renderTemplate } from './astro/server_Bu8JVBjn.mjs';
import 'piccolore';
import 'clsx';
/* empty css                        */

const $$Astro = createAstro();
const $$ClientRouter = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$ClientRouter;
  const { fallback = "animate" } = Astro2.props;
  return renderTemplate`<meta name="astro-view-transitions-enabled" content="true"><meta name="astro-view-transitions-fallback"${addAttribute(fallback, "content")}>${renderScript($$result, "/Users/natthapongsuwanjit/Desktop/CashlessThailand/cashlessthailand/node_modules/astro/components/ClientRouter.astro?astro&type=script&index=0&lang.ts")}`;
}, "/Users/natthapongsuwanjit/Desktop/CashlessThailand/cashlessthailand/node_modules/astro/components/ClientRouter.astro", void 0);

export { $$ClientRouter as $ };
