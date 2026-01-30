
import { createClient } from '@supabase/supabase-js';
import { readFile } from 'fs/promises';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));

async function loadEnv() {
    try {
        const envFile = await readFile(join(__dirname, '../.env'), 'utf-8');
        const env = {};
        for (const line of envFile.split('\n')) {
            const match = line.match(/^([^=]+)=(.*)$/);
            if (match) {
                env[match[1].trim()] = match[2].trim().replace(/^['"]|['"]$/g, '');
            }
        }
        return env;
    } catch (e) {
        console.error("Error loading .env file:", e);
        return {};
    }
}

async function updateProduct() {
    const env = await loadEnv();

    if (!env.PUBLIC_SUPABASE_URL || !env.PUBLIC_SUPABASE_ANON_KEY) {
        console.error("Missing Supabase credentials in .env");
        return;
    }

    const supabase = createClient(env.PUBLIC_SUPABASE_URL, env.PUBLIC_SUPABASE_ANON_KEY);

    const productData = {
        id: "cryptoclock-basic",
        category: "clock",
        meta: {
            title: "CryptoClock Basic",
            description: "นาฬิกาคริปโตยอดนิยม รุ่นเริ่มต้น ขนาดกะทัดรัด เหมาะสำหรับตั้งโต๊ะทำงาน เชื่อมต่อ WiFi แสดงราคาได้ทั่วโลก",
            tags: ["BEST SELLER", "STARTER"]
        },
        pricing: {
            basePrice: 980,
            currency: "THB"
        },
        media: {
            mainImage: "/images/products/cryptoclock-basic/Basic_White_Center.webp",
            gallery: [
                "/images/products/cryptoclock-basic/Basic_White_Center.webp",
                "/images/products/cryptoclock-basic/Basic_Black_Center.webp",
                "/images/products/cryptoclock-basic/Basic_Tran_Center.webp"
            ]
        },
        config: {
            variantType: "color",
            variants: [
                { name: "White", price: 980, value: "#F0F0F0", image: "/images/products/cryptoclock-basic/Basic_White_Center.webp" },
                { name: "Black", price: 980, value: "#111111", image: "/images/products/cryptoclock-basic/Basic_Black_Center.webp" },
                { name: "Transparent", price: 980, value: "#E5E5E5", image: "/images/products/cryptoclock-basic/Basic_Tran_Center.webp" }
            ]
        },
        marketing: {
            headline: "Why Basic?",
            subheadline: "จุดเริ่มต้นของการเป็น Bitcoiner",
            benefits: [
                { title: "Minimal Design", desc: "ดีไซน์มินิมอล เข้าได้กับทุกโต๊ะทำงาน", icon: "gift" },
                { title: "Real-time Data", desc: "เชื่อมต่อ API โดยตรง ไม่ดีเลย์", icon: "chart" },
                { title: "Plug & Play", desc: "เสียบปลั๊ก ตั้งค่า WiFi จบใน 1 นาที", icon: "shop" }
            ]
        },
        tech_specs: [ // Note: Supabase likely uses tech_specs (snake_case) based on previous files. 
            // I will send both or check schema. Actually, I'll send tech_specs to be safe or check if I can update JSON column.
            // If the column in DB is 'tech_specs' (jsonb), then I should send strict JSON.
            // The user's JSON had "techSpecs". I'll use "tech_specs" key for the DB column if that's the column name, 
            // BUT wait, earlier `products/[id].astro` used `tech_specs` from `product` which came from Supabase.
            // So the column name in DB is likely `tech_specs`.
            { label: "CPU", value: "Dual-core 32-bit (240MHz)" },
            { label: "RAM/Flash", value: "520KB SRAM / 32Mbit Flash" },
            { label: "Display", value: "LED Matrix (Adjustable Brightness)" },
            { label: "Connectivity", value: "WiFi 802.11 b/g/n (2.4GHz)" },
            { label: "Power Input", value: "USB-C (4.75-5.25V)" },
            { label: "Dimension", value: "DIP-16 Form Factor" }
        ],
        manual_link: "/knowledge/cryptoclock-basic" // DB uses manual_link
    };

    // We need to map the camelCase keys from JSON to snake_case keys for the DB columns if they are separate columns.
    // However, looking at `shop.astro`, it selected `*`.
    // If Supabase columns match the JSON structure exactly, I can just update.
    // BUT `products/[id].astro` had `tech_specs` and `manual_link`.
    // So the DB columns are definitely `tech_specs` and `manual_link`.

    // The Update Object
    const updatePayload = {
        category: productData.category,
        meta: productData.meta,
        pricing: productData.pricing,
        media: productData.media,
        config: productData.config,
        marketing: productData.marketing,
        tech_specs: productData.tech_specs,
        manual_link: productData.manual_link
    };

    console.log("Updating product...");
    const { data, error } = await supabase
        .from('products')
        .update(updatePayload)
        .eq('id', 'cryptoclock-basic')
        .select();

    if (error) {
        console.error("Error updating product:", error);
    } else {
        console.log("Product updated successfully:", data);
    }
}

updateProduct();
