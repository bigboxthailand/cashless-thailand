import { initSellerAuth } from "./sellerAuthClient";

// Run immediately
initSellerAuth();

// Run on view transitions
document.addEventListener("astro:page-load", initSellerAuth);
