import { renderers } from './renderers.mjs';
import { c as createExports, s as serverEntrypointModule } from './chunks/_@astrojs-ssr-adapter_CspEtgUd.mjs';
import { manifest } from './manifest_CNv5sDT8.mjs';

const serverIslandMap = new Map();;

const _page0 = () => import('./pages/_image.astro.mjs');
const _page1 = () => import('./pages/404.astro.mjs');
const _page2 = () => import('./pages/admin/chat.astro.mjs');
const _page3 = () => import('./pages/admin/customers.astro.mjs');
const _page4 = () => import('./pages/admin/disputes.astro.mjs');
const _page5 = () => import('./pages/admin/orders.astro.mjs');
const _page6 = () => import('./pages/admin/products.astro.mjs');
const _page7 = () => import('./pages/admin/sellers.astro.mjs');
const _page8 = () => import('./pages/admin/settings.astro.mjs');
const _page9 = () => import('./pages/admin.astro.mjs');
const _page10 = () => import('./pages/api/telegram-notify.astro.mjs');
const _page11 = () => import('./pages/articles.astro.mjs');
const _page12 = () => import('./pages/blog.astro.mjs');
const _page13 = () => import('./pages/chat.astro.mjs');
const _page14 = () => import('./pages/checkout.astro.mjs');
const _page15 = () => import('./pages/course.astro.mjs');
const _page16 = () => import('./pages/knowledge/post/_slug_.astro.mjs');
const _page17 = () => import('./pages/knowledge/_id_.astro.mjs');
const _page18 = () => import('./pages/knowledge.astro.mjs');
const _page19 = () => import('./pages/learn/advanced-security.astro.mjs');
const _page20 = () => import('./pages/learn/bitcoin-101.astro.mjs');
const _page21 = () => import('./pages/learn/lightning-network.astro.mjs');
const _page22 = () => import('./pages/learn/self-custody.astro.mjs');
const _page23 = () => import('./pages/login.astro.mjs');
const _page24 = () => import('./pages/policies/privacy.astro.mjs');
const _page25 = () => import('./pages/policies/refund.astro.mjs');
const _page26 = () => import('./pages/policies/shipping.astro.mjs');
const _page27 = () => import('./pages/policies/terms.astro.mjs');
const _page28 = () => import('./pages/products/_id_.astro.mjs');
const _page29 = () => import('./pages/profile.astro.mjs');
const _page30 = () => import('./pages/seller/dashboard.astro.mjs');
const _page31 = () => import('./pages/seller/orders.astro.mjs');
const _page32 = () => import('./pages/seller/pending.astro.mjs');
const _page33 = () => import('./pages/seller/products.astro.mjs');
const _page34 = () => import('./pages/seller/register.astro.mjs');
const _page35 = () => import('./pages/seller/settings.astro.mjs');
const _page36 = () => import('./pages/seller/wallet.astro.mjs');
const _page37 = () => import('./pages/shop/_slug_.astro.mjs');
const _page38 = () => import('./pages/shop.astro.mjs');
const _page39 = () => import('./pages/shops.astro.mjs');
const _page40 = () => import('./pages/support/contact.astro.mjs');
const _page41 = () => import('./pages/thankyou.astro.mjs');
const _page42 = () => import('./pages/index.astro.mjs');
const pageMap = new Map([
    ["node_modules/astro/dist/assets/endpoint/generic.js", _page0],
    ["src/pages/404.astro", _page1],
    ["src/pages/admin/chat.astro", _page2],
    ["src/pages/admin/customers.astro", _page3],
    ["src/pages/admin/disputes.astro", _page4],
    ["src/pages/admin/orders.astro", _page5],
    ["src/pages/admin/products.astro", _page6],
    ["src/pages/admin/sellers.astro", _page7],
    ["src/pages/admin/settings.astro", _page8],
    ["src/pages/admin/index.astro", _page9],
    ["src/pages/api/telegram-notify.ts", _page10],
    ["src/pages/articles.astro", _page11],
    ["src/pages/blog.astro", _page12],
    ["src/pages/chat/index.astro", _page13],
    ["src/pages/checkout.astro", _page14],
    ["src/pages/course.astro", _page15],
    ["src/pages/knowledge/post/[slug].astro", _page16],
    ["src/pages/knowledge/[id].astro", _page17],
    ["src/pages/knowledge/index.astro", _page18],
    ["src/pages/learn/advanced-security.astro", _page19],
    ["src/pages/learn/bitcoin-101.astro", _page20],
    ["src/pages/learn/lightning-network.astro", _page21],
    ["src/pages/learn/self-custody.astro", _page22],
    ["src/pages/login.astro", _page23],
    ["src/pages/policies/privacy.astro", _page24],
    ["src/pages/policies/refund.astro", _page25],
    ["src/pages/policies/shipping.astro", _page26],
    ["src/pages/policies/terms.astro", _page27],
    ["src/pages/products/[id].astro", _page28],
    ["src/pages/profile.astro", _page29],
    ["src/pages/seller/dashboard.astro", _page30],
    ["src/pages/seller/orders.astro", _page31],
    ["src/pages/seller/pending.astro", _page32],
    ["src/pages/seller/products.astro", _page33],
    ["src/pages/seller/register.astro", _page34],
    ["src/pages/seller/settings.astro", _page35],
    ["src/pages/seller/wallet.astro", _page36],
    ["src/pages/shop/[slug].astro", _page37],
    ["src/pages/shop.astro", _page38],
    ["src/pages/shops.astro", _page39],
    ["src/pages/support/contact.astro", _page40],
    ["src/pages/thankyou.astro", _page41],
    ["src/pages/index.astro", _page42]
]);

const _manifest = Object.assign(manifest, {
    pageMap,
    serverIslandMap,
    renderers,
    actions: () => import('./noop-entrypoint.mjs'),
    middleware: () => import('./_noop-middleware.mjs')
});
const _args = {
    "middlewareSecret": "48017e1b-1293-42d6-be45-d5852f9902df",
    "skewProtection": false
};
const _exports = createExports(_manifest, _args);
const __astrojsSsrVirtualEntry = _exports.default;
const _start = 'start';
if (Object.prototype.hasOwnProperty.call(serverEntrypointModule, _start)) ;

export { __astrojsSsrVirtualEntry as default, pageMap };
