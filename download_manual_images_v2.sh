#!/bin/bash

# Base directory
BASE_DIR="public/images/manuals/bitterm"

# Create mapping of "relative_path:keywords"
# We use .jpg extension now
IMAGES=(
    "core/industrial.jpg:server,rack,industrial"
    "core/hybrid.jpg:payment,terminal,cafe"
    "core/alerts.jpg:dashboard,analytics,dark"
    "core/scalable.jpg:network,map,connections"
    "install/site.jpg:empty,office,room"
    "install/lock.jpg:padlock,security,metal"
    "install/wifi.jpg:wifi,router,internet"
    "merchant/settings.jpg:settings,ui,mobile"
    "merchant/api.jpg:cloud,api,diagram"
    "merchant/cashout.jpg:money,graph,business"
    "user/step1.jpg:payment,kiosk,screen"
    "user/step2.jpg:money,hand,cash"
    "user/step3.jpg:qrcode,scanning,phone"
    "firmware/fw.jpg:technology,loading,code"
    "firmware/lifecycle.jpg:timeline,calendar,plan"
    "support/critical.jpg:siren,red,warning"
    "support/general.jpg:headset,support,help"
    "roadmap/multichain.jpg:bitcoin,coins,crypto"
    "roadmap/loyalty.jpg:gift,card,reward"
)

echo "Starting download of ${#IMAGES[@]} images (JPG format)..."

for entry in "${IMAGES[@]}"; do
    path="${entry%%:*}"
    keywords="${entry#*:}"
    
    full_path="$BASE_DIR/$path"
    parent_dir=$(dirname "$full_path")
    
    # Ensure directory exists
    mkdir -p "$parent_dir"
    
    # Delete conflicting webp if exists (cleanup)
    webp_path="${full_path%.jpg}.webp"
    if [ -f "$webp_path" ]; then
        rm "$webp_path"
        echo "Deleted old webp: $webp_path"
    fi
    
    # Force delete target if exists to ensure freshness
    if [ -f "$full_path" ]; then
        rm "$full_path"
    fi

    echo "Downloading $path (Keywords: $keywords)..."
    
    # Download directly from loremflickr as jpg
    # Use random param to avoid caching
    rand=$RANDOM
    curl -L -s "https://loremflickr.com/800/600/$keywords/all?random=$rand" -o "$full_path"
    
    if [ -f "$full_path" ]; then
        size=$(wc -c < "$full_path")
        if [ $size -ge 1000 ]; then
             echo "✓ Saved $full_path ($size bytes)"
        else
            echo "✗ Error: Downloaded file is too small."
            rm "$full_path"
        fi
    else
        echo "✗ Error: Download failed."
    fi
    
    sleep 1
done

echo "Done! All images refreshed."
