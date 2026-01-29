import { supabase } from "./supabase";

export async function initSellerAuth() {
    const walletAddress = localStorage.getItem("user_wallet");
    const { data: { session } } = await supabase.auth.getSession();

    // If no Supabase session AND no wallet, redirect to login
    // we give it a tiny delay to ensure localStorage is read correctly if just set
    if (!session && !walletAddress) {
        // Double check if we are in a middle of a wallet connection (can happen if redirect is too fast)
        await new Promise(r => setTimeout(r, 100));
        const recheckWallet = localStorage.getItem("user_wallet");
        if (!recheckWallet) {
            window.location.href = "/login?redirect=" + encodeURIComponent(window.location.pathname);
            return;
        }
    }

    let currentShop = null;

    // Show loading
    const loadingEl = document.getElementById("wallet-loading");
    if (loadingEl) loadingEl.style.display = "flex";

    try {
        if (session) {
            // Fetch shop for session user
            const { data: shop } = await supabase
                .from("shops")
                .select("*")
                .eq("owner_id", session.user.id)
                .single();
            currentShop = shop;
        } else if (walletAddress) {
            // Find profile by wallet
            const { data: profile } = await supabase
                .from("profiles")
                .select("id")
                .eq("wallet_address", walletAddress)
                .single();

            if (profile) {
                // Fetch shop for wallet user
                const { data: shop } = await supabase
                    .from("shops")
                    .select("*")
                    .eq("owner_id", profile.id)
                    .single();
                currentShop = shop;
            }
        }

        if (!currentShop) {
            // If we are already on registration or pending page, don't redirect
            if (window.location.pathname !== "/seller/register" && window.location.pathname !== "/seller/pending") {
                window.location.href = "/seller/register";
            }
            return;
        }

        // Check shop status - redirect to pending if not active
        if (currentShop.status !== "active") {
            // If current page is already pending, don't redirect (avoid loop)
            if (window.location.pathname !== "/seller/pending") {
                window.location.href = "/seller/pending";
                return;
            }
        } else if (window.location.pathname === "/seller/pending") {
            // If approved and on pending page, go to dashboard
            window.location.href = "/seller/dashboard";
            return;
        }

        // Update UI elements if they exist
        const shopNameSidebar = document.getElementById("shop-name-sidebar");
        const shopNameHeader = document.getElementById("shop-name-header");
        const sidebarRoot = document.getElementById("seller-sidebar-root");

        if (shopNameSidebar) shopNameSidebar.textContent = currentShop.name;
        if (shopNameHeader) shopNameHeader.textContent = `${currentShop.name} Overview`;

        // Unhide sidebar for wallet users/lazy loading
        if (sidebarRoot) {
            sidebarRoot.style.display = "flex";
            sidebarRoot.classList.remove("sm:hidden");
            sidebarRoot.classList.remove("hidden");
        }

        // Fetch Stats (Products Count)
        const { count: productCount } = await supabase
            .from("products")
            .select("*", { count: "exact", head: true })
            .eq("shop_id", currentShop.id);

        // Update Stats in Dashboard
        const statProductsFn = document.getElementById("stat-products");
        if (statProductsFn) statProductsFn.textContent = productCount || 0;

    } catch (error) {
        console.error("Error loading dashboard:", error);
        // Fallback for missing shop
        if (error.code === 'PGRST116' || error.message?.includes('PGRST116')) {
            if (window.location.pathname !== "/seller/register") {
                window.location.href = "/seller/register";
            }
        }
    } finally {
        // Always hide loading overlay at the end
        if (loadingEl) loadingEl.style.display = "none";
    }
}
