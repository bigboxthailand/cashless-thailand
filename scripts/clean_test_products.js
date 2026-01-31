
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabase = createClient(
    process.env.PUBLIC_SUPABASE_URL,
    process.env.PUBLIC_SUPABASE_ANON_KEY
);

async function cleanTestProducts() {
    console.log('Searching for test products...');

    // Find products with "Test Product" in the name
    const { data: products, error: searchError } = await supabase
        .from('products')
        .select('id, name')
        .ilike('name', '%Test Product%');

    if (searchError) {
        console.error('Error searching products:', searchError);
        return;
    }

    if (!products || products.length === 0) {
        console.log('No test products found.');
        return;
    }

    console.log(`Found ${products.length} test products. Deleting...`);
    products.forEach(p => console.log(`- ${p.name} (${p.id})`));

    const itemsToDelete = products.map(p => p.id);

    const { error: deleteError } = await supabase
        .from('products')
        .delete()
        .in('id', itemsToDelete);

    if (deleteError) {
        console.error('Error deleting products:', deleteError);
    } else {
        console.log('Successfully deleted test products.');
    }
}

cleanTestProducts();
