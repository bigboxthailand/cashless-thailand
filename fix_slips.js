import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
    'https://bgdvcydqscpwfuhxyzdk.supabase.co',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJnZHZjeWRxc2Nwd2Z1aHh5emRrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzY4MjY0MjksImV4cCI6MjA1MjQwMjQyOX0.N0Kqy0UQwCKCnkXIjIJ3gqOgxK64DcQxRGVPIehvSN0'
);

async function fixSlipImages() {
    console.log('🔄 Updating all slip images...');

    const { data, error } = await supabase
        .from('orders')
        .update({ slip_image: '/payment_slip.png' })
        .or('slip_image.like.%via.placeholder%,slip_image.like.%placeholder%,slip_image.like.%placehold.co%')
        .select('id');

    if (error) {
        console.error('❌ Error:', error);
        return;
    }

    console.log(`✅ Updated ${data.length} orders`);
    console.log('Sample IDs:', data.slice(0, 5).map(o => o.id));
}

fixSlipImages();
