import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
    'https://bgdvcydqscpwfuhxyzdk.supabase.co',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJnZHZjeWRxc2Nwd2Z1aHh5emRrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzY4MjY0MjksImV4cCI6MjA1MjQwMjQyOX0.N0Kqy0UQwCKCnkXIjIJ3gqOgxK64DcQxRGVPIehvSN0'
);

async function testShipOrder() {
    console.log('🧪 Testing Ship Order Update...\n');

    // 1. Get a PAID order
    const { data: orders, error: fetchError } = await supabase
        .from('orders')
        .select('id, payment_status, shipping_status')
        .eq('payment_status', 'paid')
        .limit(1);

    if (fetchError) {
        console.error('❌ Error fetching orders:', fetchError);
        return;
    }

    if (!orders || orders.length === 0) {
        console.log('⚠️  No PAID orders found');
        return;
    }

    const testOrder = orders[0];
    console.log('📦 Test Order:', testOrder);

    // 2. Try to update it
    console.log('\n📝 Attempting to update shipping_status to "shipped"...');

    const { data, error } = await supabase
        .from('orders')
        .update({
            shipping_status: 'shipped',
            payment_status: 'paid'
        })
        .eq('id', testOrder.id)
        .select();

    if (error) {
        console.error('\n❌ UPDATE FAILED!');
        console.error('Error:', error);
        console.error('\n💡 This might be due to RLS policies!');
    } else {
        console.log('\n✅ UPDATE SUCCESS!');
        console.log('Updated order:', data);
    }
}

testShipOrder();
