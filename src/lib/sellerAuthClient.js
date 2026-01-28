import { supabase } from "./supabase";

export async function initSellerAuth() {
    const walletAddress = localStorage.getItem("user_wallet");
    const { data: { session } } = await supabase.auth.getSession();

    // If no Supabase session AND no wallet, redirect to login
    if (!session && !walletAddress) {
        window.location.href = "/login";
        return;
    }

    // If wallet user, fetch their shop
    if (!session && walletAddress) {
        const loadingEl = document.getElementById("wallet-loading");
        if (loadingEl) loadingEl.style.display = "flex";

        try {
            // Find profile by wallet
            const { data: profile } = await supabase
                .from("profiles")
                .select("id")
                .eq("wallet_address", walletAddress)
                .single();

            if (!profile) {
                window.location.href = "/login";
                return;
            }

            // Fetch shop
            const { data: shop } = await supabase
                .from("shops")
                .select("*")
                .eq("owner_id", profile.id)
                .single();

            if (!shop) {
                window.location.href = "/seller/register";
                return;
            }

            // Check shop status - redirect to pending if not active
            if (shop.status !== "active") {
                window.location.href = "/seller/pending";
                return;
            }

            // Update UI elements if they exist
            const shopNameSidebar = document.getElementById("shop-name-sidebar");
            const shopNameHeader = document.getElementById("shop-name-header");

            if (shopNameSidebar) shopNameSidebar.textContent = shop.name;
            if (shopNameHeader) shopNameHeader.textContent = `${shop.name} Overview`;

            // Fetch Stats (Products Count)
            const { count: productCount } = await supabase
                .from("products")
                .select("*", { count: "exact", head: true })
                .eq("shop_id", shop.id);

            // Update Stats in Dashboard
            const statProductsFn = document.getElementById("stat-products");
            if (statProductsFn) statProductsFn.textContent = productCount || 0;

            // TODO: Fetch Orders & Sales (requires complex joins or new schema support)
            // For now, these remain 0 as per current capability without heavy client-side processing

            // Hide loading
            if (loadingEl) loadingEl.style.display = "none";

        } catch (error) {
            console.error("Error loading dashboard:", error);
            window.location.href = "/login";
        }
    }
}
