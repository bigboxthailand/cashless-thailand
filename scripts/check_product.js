
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabase = createClient(
    process.env.PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function checkProduct() {
    // Try to find the product by title in meta
    const { data, error } = await supabase
        .from('products')
        .select('id, meta, config')
        .textSearch('meta->>title', 'Meta001', { config: 'english', type: 'websearch' })
        // Since textSearch might be tricky without index, let's just fetch all and filter in JS if needed, 
        // OR use filter on json col if possible. Supabase support ->> operator?
        // Actually, let's just use data-fetching logic similar to shop page logic if possible.
        // But "meta->>title" ilike is standard Postgres.
        // supabase-js supports .ilike('meta->>title', '%Meta001%')? No, column name must be real column.

        // Let's trying fetching all for the specific shop if we knew the shop.
        // Or just fetch a few and log them.
        .limit(10);

    // Standard supabase-js filter for json is .filter('meta->>title', 'ilike', '%Meta001%')

    const { data: searchData, error: searchError } = await supabase
        .from('products')
        .select('id, meta, config')
        //.filter('meta->>title', 'ilike', '%Meta001%'); // This syntax might be wrong/wrapper specific.
        // Let's use raw query syntax if needed, but for now let's try to just get the last created product
        // since the image shows it might be a recent one.
        .order('created_at', { ascending: false })
        .limit(5);

    if (searchError) {
        console.error('Error:', searchError);
    } else {
        const product = searchData.find(p => p.meta?.title?.includes('Meta001'));
        if (product) {
            console.log('Found Product:', JSON.stringify(product, null, 2));
        } else {
            console.log('Product Meta001 not found in last 5 products. Dumping last product:', JSON.stringify(searchData[0], null, 2));
        }
    }
}

checkProduct();
