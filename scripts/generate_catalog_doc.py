
import json
import os

# Path to the source JSON file
source_file = "src/data/products.json"
output_file = "src/pages/manual/PRODUCT_CATALOG.md"

def generate_catalog():
    print(f"Reading product data from {source_file}...")
    
    try:
        with open(source_file, 'r', encoding='utf-8') as f:
            products = json.load(f)
    except FileNotFoundError:
        print(f"Error: Source file {source_file} not found.")
        return
    except json.JSONDecodeError:
        print(f"Error: Failed to decode JSON from {source_file}.")
        return

    content = "# Cashless Thailand Product Catalog\n\n"
    content += "> รวมข้อมูลสินค้า (Hardware & Solutions) ทั้งหมดที่มีจำหน่ายในระบบ พร้อมรายละเอียดทางเทคนิคและราคา\n\n"
    content += "*Generated from source: src/data/products.json*\n\n"
    content += "---\n\n"

    for product in products:
        # Header
        title = product.get('meta', {}).get('title', 'Unknown Product')
        pid = product.get('id', 'unknown-id')
        category = product.get('category', 'Hardware').upper()
        
        content += f"## {title}\n"
        content += f"**ID:** `{pid}` | **Category:** {category}\n\n"
        
        # Tags
        tags = product.get('meta', {}).get('tags', [])
        if tags:
            tag_str = " ".join([f"`#{tag}`" for tag in tags])
            content += f"{tag_str}\n\n"

        # Description
        desc = product.get('meta', {}).get('description', '')
        if desc:
            content += f"{desc}\n\n"
            
        # Pricing
        pricing = product.get('pricing', {})
        base_price = pricing.get('basePrice', 0)
        currency = pricing.get('currency', 'THB')
        content += f"**Base Price:** {base_price:,.2f} {currency}\n\n"

        # Marketing Highlights
        marketing = product.get('marketing', {})
        headline = marketing.get('headline')
        subhead = marketing.get('subheadline')
        
        if headline or subhead:
            content += "### Highlights\n"
            if headline: content += f"**{headline}**\n"
            if subhead: content += f"_{subhead}_\n"
            content += "\n"
        
        benefits = marketing.get('benefits', [])
        if benefits:
            for b in benefits:
                b_title = b.get('title', '')
                b_desc = b.get('desc', '')
                content += f"- **{b_title}**: {b_desc}\n"
            content += "\n"

        # Technical Specs
        specs = product.get('techSpecs', [])
        if specs:
            content += "### Technical Specifications\n"
            content += "| Feature | Specification |\n"
            content += "| :--- | :--- |\n"
            for s in specs:
                label = s.get('label', '-')
                val = s.get('value', '-')
                content += f"| {label} | {val} |\n"
            content += "\n"
            
        # Variants / Config
        config = product.get('config', {})
        variants = config.get('variants', [])
        options = config.get('options', []) # For composite types
        
        if variants or options:
            content += "### Configuration Options\n"
            
            if variants:
                content += "Available Variants:\n"
                for v in variants:
                    v_name = v.get('name', 'Standard')
                    v_price = v.get('price', base_price)
                    content += f"- **{v_name}**: {v_price:,.2f} {currency}\n"
            
            if options:
                # Handle composite options (like BitTerm or POS)
                for opt in options:
                    opt_name = opt.get('name', 'Option')
                    opt_vals = opt.get('values', [])
                    val_names = [ov.get('name') for ov in opt_vals]
                    content += f"- **{opt_name}**: {', '.join(val_names)}\n"
        
        content += "\n---\n\n"

    # Write file
    with open(output_file, "w", encoding="utf-8") as f:
        f.write(content)

    print(f"Successfully generated catalog with {len(products)} products at {output_file}")

if __name__ == "__main__":
    generate_catalog()
