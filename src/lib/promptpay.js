


function formatField(id, value) {
    const valStr = value.toString();
    const len = valStr.length.toString().padStart(2, '0');
    return `${id}${len}${valStr}`;
}

function crc16(data) {
    let crc = 0xFFFF;
    for (let i = 0; i < data.length; i++) {
        let x = ((crc >> 8) ^ data.charCodeAt(i)) & 0xFF;
        x ^= x >> 4;
        crc = ((crc << 8) ^ (x << 12) ^ (x << 5) ^ x) & 0xFFFF;
    }
    return crc.toString(16).toUpperCase().padStart(4, '0');
}

export function generatePromptPayPayload(phoneNumber, amount = 0) {
    // 1. Payload Format Indicator (00)
    let payload = formatField('00', '01');

    // 2. Point of Initiation Method (01)
    // 11 = Static (Reusable), 12 = Dynamic (One-time)
    const method = amount > 0 ? '12' : '11';
    payload += formatField('01', method);

    // 3. Merchant Account Information (29)
    // AID (00) + Phone (01)
    // Phone: 090-987-9566 -> 66909879566
    const cleanPhone = phoneNumber.replace(/^0/, '66').replace(/-/g, '');
    const merchantInfo = formatField('00', 'A000000677010111') +
        formatField('01', '00' + cleanPhone); // 00 prefix for mobile
    payload += formatField('29', merchantInfo);

    // 4. Country Code (58)
    payload += formatField('58', 'TH');

    // 5. Currency (53) - THB (764)
    payload += formatField('53', '764');

    // 6. Transaction Amount (54) - Optional
    if (amount > 0) {
        payload += formatField('54', amount.toFixed(2));
    }

    // 7. Checksum (63)
    payload += '6304'; // ID + Length

    // Calculate CRC16
    payload += crc16(payload);

    return payload;
}
