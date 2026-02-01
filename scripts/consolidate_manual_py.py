import os
import re

files = [
    "src/pages/manual/index.astro",
    "src/pages/manual/system-workflow.astro",
    "src/pages/manual/visual-flows.astro",
    "src/pages/manual/page-index.astro",
    "src/pages/manual/page-shop.astro",
    "src/pages/manual/page-product.astro",
    "src/pages/manual/page-profile.astro",
    "src/pages/manual/module-cart.astro",
    "src/pages/manual/module-checkout.astro",
    "src/pages/manual/module-auth.astro",
    "src/pages/manual/module-btc.astro",
    "src/pages/manual/course-system.astro",
    "src/pages/manual/learn-track.astro",
    "src/pages/manual/blog-system.astro",
    "src/pages/manual/admin-interface.astro",
    "src/pages/manual/seller-guide.astro"
]

outfile = "src/pages/manual/MANUAL_CONSOLIDATED.md"

def extract_content(file_path):
    print(f"Processing {file_path}...")
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    # Extract Title (h1)
    title_match = re.search(r'<h1[^>]*>\s*(.*?)\s*</h1>', content, re.DOTALL)
    title = ""
    if title_match:
        # Remove spans and tags inside h1
        title = re.sub(r'<[^>]+>', '', title_match.group(1))
        title = " ".join(title.split())
    else:
        title = os.path.basename(file_path)

    # Extract Description (p in header)
    desc_match = re.search(r'<header[^>]*>.*?<p[^>]* class="text-white/50[^>]*>\s*(.*?)\s*</p>.*?</header>', content, re.DOTALL)
    description = ""
    if desc_match:
        description = re.sub(r'<[^>]+>', '', desc_match.group(1))
        description = " ".join(description.split())

    output = f"# {title}\n\n"
    if description:
        output += f">{description}\n\n"

    # Extract Structured Data (sections, steps, featuredModules)
    keywords = ['sections', 'steps', 'featuredModules']
    
    for kw in keywords:
        pattern = r"const\s+" + kw + r"\s*=\s*\[(.*?)\];"
        match = re.search(pattern, content, re.DOTALL)
        if match:
            output += f"## {kw.capitalize()} Items\n\n"
            block = match.group(1)
            lines = block.split('\n')
            
            item = {}
            details = []
            in_details = False
            
            for line in lines:
                line = line.strip()
                if not line: continue
                
                # Check for start of main item
                if line.endswith('{') and not in_details:
                     item = {}
                     details = []
                     
                # Key-Value parsing
                kv_match = re.match(r'(\w+):\s*["`\'(](.*?)["`\')]?,?$', line)
                if kv_match:
                    key = kv_match.group(1)
                    val = kv_match.group(2)
                    
                    # Clean trailing comma/quote
                    if val.endswith('",'): val = val[:-2]
                    elif val.endswith(','): val = val[:-1]
                    elif val.endswith('"'): val = val[:-1]
                    elif val.endswith("'"): val = val[:-1]
                    
                    if in_details:
                        if key == 'label': item['current_label'] = val
                        if key == 'desc': 
                            details.append(f"- **{item.get('current_label', 'Feature')}**: {val}")
                    else:
                        item[key] = val
                
                # Handling details array start/end
                if 'details: [' in line:
                    in_details = True
                if '],' in line:
                    in_details = False
                
                # Handling end of item object }, or }
                if (line.startswith('},') or line.startswith('}')) and not in_details:
                    header = item.get('title') or item.get('name') or item.get('id')
                    subtitle = item.get('subtitle') or item.get('role')
                    desc = item.get('description') or item.get('desc')
                    
                    if header:
                        output += f"### {header}\n"
                        if subtitle: output += f"**{subtitle}**\n\n"
                        if desc and not in_details: output += f"{desc}\n\n"
                        
                        if 'source' in item:
                            output += f"*Source: {item['source']}*\n\n"
                        if 'technical' in item:
                            output += f"*Technical Stack: {item['technical']}*\n\n"
                            
                        if details:
                            output += "\n".join(details) + "\n\n"
    
    # Extract Additional Static HTML (Headers and Paragraphs)
    # matching non-dynamic content (no {})
    
    output += "## Additional Static Content\n\n"
    
    # Regex to find Headers (h2-h6) and Paragraphs that don't look like code/templated
    # We ignore standard sidebar/nav items or very short text often found in UIs
    
    html_pattern = re.compile(r'<(h[2-6]|p)[^>]*>(.*?)</\1>', re.DOTALL | re.IGNORECASE)
    
    found_static = []
    
    # We look specifically inside the <main> tag to avoid navbar/sidebar noise
    main_match = re.search(r'<main[^>]*>(.*?)</main>', content, re.DOTALL)
    search_area = main_match.group(1) if main_match else content
    
    for match in html_pattern.finditer(search_area):
        tag = match.group(1)
        text = match.group(2).strip()
        
        # Cleanup HTML tags inside the text (e.g. spans, br)
        clean_text = re.sub(r'<[^>]+>', ' ', text)
        clean_text = " ".join(clean_text.split())
        
        # Skip if it contains Astro template syntax
        if '{' in text or '}' in text:
            continue
            
        # Skip common UI non-content
        if clean_text.lower() in ['directory', '/', 'next:', 'overview', 'explore index', 'explore full documentation']:
            continue
            
        # Skip if it's likely a captured variable title we already got (heuristic)
        # (This is hard to do perfectly, but duplicate info is better than missing info)
        
        if tag.lower().startswith('h'):
            found_static.append(f"### {clean_text}\n")
        else:
            # Paragraph
            if len(clean_text) > 20: # Skip very short snippets
                found_static.append(f"{clean_text}\n\n")
                
    if found_static:
        output += "".join(found_static)
                            
    return output

full_doc = ""
for fpath in files:
    if os.path.exists(fpath):
        try:
            full_doc += extract_content(fpath) + "\n---\n\n"
        except Exception as e:
            full_doc += f"\nError processing {fpath}: {str(e)}\n\n"
    else:
        full_doc += f"# {os.path.basename(fpath)} (Missing File)\n\n"

with open(outfile, "w", encoding="utf-8") as f:
    f.write(full_doc)

print(f"Successfully wrote {len(full_doc)} characters to {outfile}")
