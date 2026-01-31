
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.PUBLIC_SUPABASE_ANON_KEY;
// Using service role key if available for fuller access, but anon might suffer RLS
// Ideally we need a way to list tables. If RLS blocks, we might not see them.
// But let's try to query 'blogs' or 'articles' directly if we suspect them.

if (!supabaseUrl || !supabaseKey) {
    console.error("Missing Supabase credentials");
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkTable(tableName) {
    const { data, error } = await supabase.from(tableName).select('*').limit(1);
    if (error) {
        console.log(`Table '${tableName}' check failed:`, error.message);
    } else {
        console.log(`Table '${tableName}' exists. Sample data:`, data);
    }
}

async function main() {
    console.log("Checking for 'blogs' table...");
    await checkTable('blogs');

    console.log("Checking for 'articles' table...");
    await checkTable('articles');

    console.log("Checking for 'posts' table...");
    await checkTable('posts');
}

main();
