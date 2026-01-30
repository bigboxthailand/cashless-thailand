import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const supabase = createClient(
    'https://bgdvcydqscpwfuhxyzdk.supabase.co',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJnZHZjeWRxc2Nwd2Z1aHh5emRrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzY4MjY0MjksImV4cCI6MjA1MjQwMjQyOX0.N0Kqy0UQwCKCnkXIjIJ3gqOgxK64DcQxRGVPIehvSN0'
);

const CORE_DIR = path.join(__dirname, '_CORE');

// Ensure _CORE directory exists
if (!fs.existsSync(CORE_DIR)) {
    fs.mkdirSync(CORE_DIR, { recursive: true });
}

const tables = [
    'products',
    'profiles',
    'addresses',
    'orders',
    'order_items',
    'carts',
    'store_settings'
];

async function backupTable(tableName) {
    console.log(`📦 Backing up ${tableName}...`);

    try {
        const { data, error } = await supabase
            .from(tableName)
            .select('*');

        if (error) {
            console.error(`❌ Error backing up ${tableName}:`, error.message);
            return;
        }

        const filename = path.join(CORE_DIR, `${tableName}_backup.json`);
        fs.writeFileSync(filename, JSON.stringify(data, null, 2));

        console.log(`✅ ${tableName}: ${data?.length || 0} records → ${filename}`);
    } catch (err) {
        console.error(`❌ Failed to backup ${tableName}:`, err.message);
    }
}

async function backupAllTables() {
    console.log('🚀 Starting full database backup...\n');

    for (const table of tables) {
        await backupTable(table);
    }

    console.log('\n✨ Backup complete! All files saved to _CORE/');
    console.log(`📁 Location: ${CORE_DIR}`);
}

backupAllTables();
