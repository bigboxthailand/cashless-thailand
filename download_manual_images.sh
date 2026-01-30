#!/bin/bash

# Base directory
BASE_DIR="public/images/manuals/bitterm"

# Create mapping of "relative_path:prompt"
# We escape spaces with %20 for the URL
IMAGES=(
    "core/industrial.webp:industrial%20server%20rack%20metal%20enclosure%20cyberpunk%20style%20dark%20lighting"
    "core/hybrid.webp:bitcoin%20payment%20terminal%20on%20cafe%20counter%20neon%20lights%20futuristic"
    "core/alerts.webp:digital%20dashboard%20screen%20analytics%20charts%20dark%20mode%20ui"
    "core/scalable.webp:global%20network%20map%20digital%20connections%20glowing%20nodes"
    "install/site.webp:empty%20office%20corner%20modern%20interior%20ready%20for%20machine%20installation"
    "install/lock.webp:heavy%20duty%20padlock%20security%20steel%20protection%20close%20up"
    "install/wifi.webp:wifi%20router%20setup%20smartphone%20app%20pairing%20screen"
    "merchant/settings.webp:mobile%20app%20settings%20ui%20dark%20theme%20config"
    "merchant/api.webp:api%20Cloud%20server%20integration%20diagram%20schematic%20glowing"
    "merchant/cashout.webp:financial%20report%20graph%20growth%20profit%20money%20concept"
    "user/step1.webp:touchscreen%20kiosk%20interface%20language%20selection%20menu"
    "user/step2.webp:hand%20inserting%20cash%20money%20into%20machine%20slot%20close%20up"
    "user/step3.webp:scanning%20qr%20code%20with%20smartphone%20payment%20success"
    "firmware/fw.webp:software%20update%20progress%20bar%20loader%20on%20screen%20futuristic"
    "firmware/lifecycle.webp:product%20lifecycle%20timeline%20infinity%20loop%20tech%20icon"
    "support/critical.webp:red%20emergency%20alarm%20light%20siren%203d%20render"
    "support/general.webp:customer%20support%20headset%20tech%20service%20agent%20abstract"
    "roadmap/multichain.webp:bitcoin%20ethereum%20cryptocurrency%20coins%20heap%203d%20gold"
    "roadmap/loyalty.webp:loyalty%20reward%20card%20gift%20gold%20vip%20member"
)

echo "Starting download of ${#IMAGES[@]} generated images from Pollinations.ai..."

for entry in "${IMAGES[@]}"; do
    path="${entry%%:*}"
    prompt="${entry#*:}"
    
    full_path="$BASE_DIR/$path"
    parent_dir=$(dirname "$full_path")
    
    # Ensure directory exists
    mkdir -p "$parent_dir"
    
    echo "Generating $path..."
    
    # Download to temp file (Pollinations returns JPG)
    # Added 'nologo=true' if supported, or just hope for best. 
    # Added timestamp to prompt to ensure uniqueness if run again? No, seed depends on prompt.
    # To vary slightly we can add $RANDOM
    
    curl -L -s "https://image.pollinations.ai/prompt/$prompt?width=800&height=600&seed=$RANDOM&nologo=true" -o "temp.jpg"
    
    if [ -f "temp.jpg" ]; then
        # Check size
        size=$(wc -c < "temp.jpg")
        if [ $size -ge 1000 ]; then
             # Convert to webp using sips
             sips -s format webp "temp.jpg" --out "$full_path" &>/dev/null
             
             # Fallback if sips fails
             if [ ! -f "$full_path" ]; then
                 mv "temp.jpg" "${full_path%.webp}.jpg" # fallback format
             fi
             
             rm "temp.jpg"
             echo "✓ Saved $full_path"
        else
            echo "✗ Error: Downloaded file is too small."
            rm "temp.jpg"
        fi
    else
        echo "✗ Error: Download failed."
    fi
    
    # Sleep gently
    sleep 2
done

echo "Done! All images regenerated."
