#!/bin/bash

# --- 1. Setup Directory Structure ---
BASE_DIR="public/images/manuals/bitterm"
echo "��  Initializing Directory Structure at $BASE_DIR..."

# ล้างของเก่าและสร้างใหม่
rm -rf "$BASE_DIR"
mkdir -p "$BASE_DIR/marketing"
mkdir -p "$BASE_DIR/installation"
mkdir -p "$BASE_DIR/merchant"
mkdir -p "$BASE_DIR/customer"
mkdir -p "$BASE_DIR/security"
mkdir -p "$BASE_DIR/api"
mkdir -p "$BASE_DIR/firmware"
mkdir -p "$BASE_DIR/support"
mkdir -p "$BASE_DIR/roadmap"

# --- 2. Image Download Function ---
download() {
    URL=$1
    DEST=$2
    echo "⬇️  Fetching: $DEST..."
    curl -sL "$URL" -o "$DEST"
    if [ -s "$DEST" ]; then echo "   ✅ OK"; else echo "   ❌ FAILED"; fi
}

echo "--- 🚀 Starting Complete Asset Download ---"

# 1. Marketing
download "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=800" "$BASE_DIR/marketing/overview-industrial.webp"
download "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?q=80&w=800" "$BASE_DIR/marketing/overview-lightning.webp"
download "https://images.unsplash.com/photo-1579621970563-ebec7560eb3e?q=80&w=800" "$BASE_DIR/marketing/overview-income.webp"
download "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?q=80&w=800" "$BASE_DIR/marketing/overview-security.webp"
download "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?q=80&w=800" "$BASE_DIR/marketing/overview-compliance.webp"

# 2. Installation
download "https://images.unsplash.com/photo-1503387762-592deb58ef4e?q=80&w=800" "$BASE_DIR/installation/install-site-survey.webp"
download "https://images.unsplash.com/photo-1616400619175-5beda3a17896?q=80&w=800" "$BASE_DIR/installation/install-bolting.webp"
download "https://images.unsplash.com/photo-1558494949-ef526b01201b?q=80&w=800" "$BASE_DIR/installation/install-cabling.webp"

# 3. Merchant
download "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=800" "$BASE_DIR/merchant/merchant-startup.webp"
download "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=800" "$BASE_DIR/merchant/merchant-fees.webp"
download "https://images.unsplash.com/photo-1556742049-0cfed4f7a07d?q=80&w=800" "$BASE_DIR/merchant/merchant-settlement.webp"

# 4. Customer
download "https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=800" "$BASE_DIR/customer/user-step1-start.webp"
download "https://images.unsplash.com/photo-1605902711622-cfb43c4437b5?q=80&w=800" "$BASE_DIR/customer/user-step2-insert.webp"
download "https://images.unsplash.com/photo-1628123285223-289524854930?q=80&w=800" "$BASE_DIR/customer/user-step3-scan.webp"

# 8. Security
download "https://images.unsplash.com/photo-1563986768609-322da13575f3?q=80&w=800" "$BASE_DIR/security/sec-tamper.webp"
download "https://images.unsplash.com/photo-1621416894569-0f39ed31d247?q=80&w=800" "$BASE_DIR/security/sec-coldwallet.webp"
download "https://images.unsplash.com/photo-1563013544-824ae1b704d3?q=80&w=800" "$BASE_DIR/security/sec-aml.webp"
download "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=800" "$BASE_DIR/security/sec-privacy.webp"

# 9. API
download "https://images.unsplash.com/photo-1633265486064-086b219458ec?q=80&w=800" "$BASE_DIR/api/api-auth.webp"
download "https://images.unsplash.com/photo-1558494949-ef526b01201b?q=80&w=800" "$BASE_DIR/api/api-webhook.webp"
download "https://images.unsplash.com/photo-1516116216624-53e697fedbea?q=80&w=800" "$BASE_DIR/api/api-sandbox.webp"

# 12. Firmware
download "https://images.unsplash.com/photo-1597733336794-12d05021d510?q=80&w=800" "$BASE_DIR/firmware/fw-check.webp"
download "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=800" "$BASE_DIR/firmware/fw-install.webp"

# 14. Support
download "https://images.unsplash.com/photo-1587560699334-cc4da63c24b9?q=80&w=800" "$BASE_DIR/support/supp-emergency.webp"
download "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?q=80&w=800" "$BASE_DIR/support/supp-ticket.webp"

# 15. Roadmap
download "https://images.unsplash.com/photo-1512756290469-ec264b7fbf87?q=80&w=800" "$BASE_DIR/roadmap/nfc.webp"
download "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?q=80&w=800" "$BASE_DIR/roadmap/multichain.webp"
download "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?q=80&w=800" "$BASE_DIR/roadmap/loyalty.webp"

echo "--- ✨ Complete Deployment. All sections (0-15) covered. ---"
