// src/lib/qrGenerator.js
// QR Code generation utility for crypto payments

import QRCode from 'qrcode';

/**
 * Generate EIP-681 payment URI
 * @param {string} address - Recipient address
 * @param {string} chainId - Chain ID (decimal)
 * @param {string} tokenAddress - Token contract address (optional, for ERC20)
 * @param {string} amount - Amount in smallest unit (wei for ETH, token decimals for ERC20)
 * @returns {string} Payment URI
 */
export function generatePaymentURI(address, chainId, tokenAddress = null, amount = null) {
    let uri = `ethereum:${address}@${chainId}`;

    if (tokenAddress && amount) {
        uri += `/transfer?address=${tokenAddress}&uint256=${amount}`;
    } else if (amount) {
        uri += `?value=${amount}`;
    }

    return uri;
}

/**
 * Generate QR code as data URL
 * @param {string} paymentURI - EIP-681 payment URI
 * @param {Object} options - QR code options
 * @returns {Promise<string>} Data URL of QR code image
 */
export async function generateQRCode(paymentURI, options = {}) {
    const defaultOptions = {
        errorCorrectionLevel: 'M',
        type: 'image/png',
        quality: 0.92,
        margin: 1,
        width: 300,
        color: {
            dark: '#000000',
            light: '#FFFFFF'
        }
    };

    const finalOptions = { ...defaultOptions, ...options };

    try {
        const dataURL = await QRCode.toDataURL(paymentURI, finalOptions);
        return dataURL;
    } catch (error) {
        console.error('Error generating QR code:', error);
        throw error;
    }
}

/**
 * Generate payment QR code for crypto transaction
 * @param {Object} params - Payment parameters
 * @param {string} params.merchantAddress - Merchant wallet address
 * @param {string} params.chainId - Chain ID (decimal)
 * @param {string} params.tokenAddress - Token contract address (null for native coin)
 * @param {string} params.amount - Amount in smallest unit
 * @returns {Promise<string>} QR code data URL
 */
export async function generatePaymentQR({ merchantAddress, chainId, tokenAddress, amount }) {
    const uri = generatePaymentURI(merchantAddress, chainId, tokenAddress, amount);
    return await generateQRCode(uri);
}
