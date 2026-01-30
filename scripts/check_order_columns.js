
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabaseUrl = process.env.PUBLIC_SUPABASE_URL || 'https://euavftppzicwjhbugiys.supabase.co';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'sb_secret_pPB5HmRxQRJFK3k9JmrJFA_2NxQapaw';

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkColumns() {
    const { data, error } = await supabase
        .from('orders')
        .select('*')
        .limit(1);

    if (error) {
        console.error('Error checking orders table:', error);
    } else if (data && data.length > 0) {
        const columns = Object.keys(data[0]);
        console.log('Orders columns:', columns);
        console.log('Has coupon_code:', columns.includes('coupon_code'));
        console.log('Has discount_amount:', columns.includes('discount_amount'));
    } else {
        console.log('No orders to check columns.');
    }
}

checkColumns();
