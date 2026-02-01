/**
 * Shipping Estimation Helper
 * Estimates delivery time based on seller and customer locations
 */

// Thailand provinces grouped by region
const REGIONS = {
    CENTRAL: ['กรุงเทพมหานคร', 'นนทบุรี', 'ปทุมธานี', 'สมุทรปราการ', 'สมุทรสาคร', 'นครปฐม', 'สมุทรสงคราม', 'พระนครศรีอยุธยา', 'อ่างทอง', 'ลพบุรี', 'สิงห์บุรี', 'ชัยนาท', 'สระบุรี', 'ชลบุรี', 'ระยอง', 'จันทบุรี', 'ตราด', 'ฉะเชิงเทรา', 'ปราจีนบุรี', 'นครนายก', 'สระแก้ว'],
    NORTH: ['เชียงใหม่', 'เชียงราย', 'ลำปาง', 'ลำพูน', 'แม่ฮ่องสอน', 'น่าน', 'พะเยา', 'แพร่', 'อุตรดิตถ์', 'ตาก', 'สุโขทัย', 'พิษณุโลก', 'พิจิตร', 'เพชรบูรณ์', 'กำแพงเพชร', 'นครสวรรค์', 'อุทัยธานี'],
    NORTHEAST: ['นครราชสีมา', 'บุรีรัมย์', 'สุรินทร์', 'ศรีสะเกษ', 'อุบลราชธานี', 'ยโสธร', 'ชัยภูมิ', 'อำนาจเจริญ', 'หนองบัวลำภู', 'ขอนแก่น', 'อุดรธานี', 'เลย', 'หนองคาย', 'มหาสารคาม', 'ร้อยเอ็ด', 'กาฬสินธุ์', 'สกลนคร', 'นครพนม', 'มุกดาหาร', 'บึงกาฬ'],
    SOUTH: ['สุราษฎร์ธานี', 'ชุมพร', 'นครศรีธรรมราช', 'กระบี่', 'พังงา', 'ภูเก็ต', 'ระนอง', 'สงขลา', 'สตูล', 'ตรัง', 'พัทลุง', 'ปัตตานี', 'ยะลา', 'นราธิวาส'],
    WEST: ['ราชบุรี', 'กาญจนบุรี', 'สุพรรณบุรี', 'เพชรบุรี', 'ประจวบคีรีขันธ์']
};

/**
 * Get region of a province
 */
function getRegion(province) {
    if (!province) return null;

    for (const [region, provinces] of Object.entries(REGIONS)) {
        if (provinces.includes(province)) {
            return region;
        }
    }
    return 'OTHER';
}

/**
 * Check if same province
 */
function isSameProvince(province1, province2) {
    return province1 === province2;
}

/**
 * Check if same region
 */
function isSameRegion(province1, province2) {
    const region1 = getRegion(province1);
    const region2 = getRegion(province2);
    return region1 === region2;
}

/**
 * Estimate shipping days based on locations
 * @param {string} sellerProvince - Seller's province
 * @param {string} sellerDistrict - Seller's district
 * @param {string} customerProvince - Customer's province
 * @param {string} customerDistrict - Customer's district
 * @returns {object} { minDays, maxDays, description }
 */
export function estimateShipping(sellerProvince, sellerDistrict, customerProvince, customerDistrict) {
    // Default if no location data
    if (!sellerProvince || !customerProvince) {
        return {
            minDays: 2,
            maxDays: 5,
            description: 'ประมาณ 2-5 วันทำการ'
        };
    }

    // Same province
    if (isSameProvince(sellerProvince, customerProvince)) {
        // Same district - very fast
        if (sellerDistrict && customerDistrict && sellerDistrict === customerDistrict) {
            return {
                minDays: 1,
                maxDays: 2,
                description: 'ประมาณ 1-2 วันทำการ (พื้นที่ใกล้เคียง)'
            };
        }
        // Same province, different district
        return {
            minDays: 1,
            maxDays: 3,
            description: 'ประมาณ 1-3 วันทำการ (จังหวัดเดียวกัน)'
        };
    }

    // Same region
    if (isSameRegion(sellerProvince, customerProvince)) {
        return {
            minDays: 2,
            maxDays: 4,
            description: 'ประมาณ 2-4 วันทำการ (ภูมิภาคเดียวกัน)'
        };
    }

    // Different region
    const sellerRegion = getRegion(sellerProvince);
    const customerRegion = getRegion(customerProvince);

    // Bangkok to anywhere or anywhere to Bangkok (faster)
    if (sellerProvince === 'กรุงเทพมหานคร' || customerProvince === 'กรุงเทพมหานคร') {
        return {
            minDays: 2,
            maxDays: 4,
            description: 'ประมาณ 2-4 วันทำการ'
        };
    }

    // Far regions (e.g., North to South)
    if ((sellerRegion === 'NORTH' && customerRegion === 'SOUTH') ||
        (sellerRegion === 'SOUTH' && customerRegion === 'NORTH')) {
        return {
            minDays: 3,
            maxDays: 6,
            description: 'ประมาณ 3-6 วันทำการ (ระยะไกล)'
        };
    }

    // Default for different regions
    return {
        minDays: 2,
        maxDays: 5,
        description: 'ประมาณ 2-5 วันทำการ'
    };
}

/**
 * Format location for display
 */
export function formatLocation(district, province) {
    if (!province) return 'ไม่ระบุ';
    if (!district) return province;
    return `${district}, ${province}`;
}

/**
 * Get shipping badge color based on days
 */
export function getShippingBadgeColor(days) {
    if (days <= 2) return 'green';
    if (days <= 4) return 'blue';
    return 'orange';
}
