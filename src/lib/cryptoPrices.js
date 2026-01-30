// src/lib/cryptoPrices.js
// Real-time cryptocurrency price fetching utility

let priceCache = null;
let lastFetchTime = 0;
const CACHE_DURATION = 60000; // 60 seconds

/**
 * Fetch real-time crypto prices from CoinGecko API
 * @returns {Promise<Object>} Price data in THB
 */
export async function fetchCryptoPrices() {
    const now = Date.now();

    // Return cached data if still valid
    if (priceCache && (now - lastFetchTime) < CACHE_DURATION) {
        return priceCache;
    }

    try {
        const response = await fetch(
            'https://api.coingecko.com/api/v3/simple/price?ids=ethereum,binancecoin,matic-network,tether,usd-coin&vs_currencies=thb',
            {
                method: 'GET',
                headers: { 'Accept': 'application/json' }
            }
        );

        if (!response.ok) {
            throw new Error('Failed to fetch prices');
        }

        const data = await response.json();

        priceCache = {
            eth: data.ethereum?.thb || 0,
            bnb: data.binancecoin?.thb || 0,
            matic: data['matic-network']?.thb || 0,
            usdt: data.tether?.thb || 0,
            usdc: data['usd-coin']?.thb || 0,
            timestamp: now
        };

        lastFetchTime = now;
        return priceCache;
    } catch (error) {
        console.error('Error fetching crypto prices:', error);

        // Return fallback prices if API fails
        if (priceCache) {
            return priceCache;
        }

        // Last resort fallback
        return {
            eth: 85000,
            bnb: 12000,
            matic: 25,
            usdt: 35,
            usdc: 35,
            timestamp: now,
            error: true
        };
    }
}

/**
 * Convert THB amount to crypto amount
 * @param {number} thbAmount - Amount in Thai Baht
 * @param {string} crypto - Crypto symbol (eth, bnb, matic, usdt, usdc)
 * @param {Object} prices - Price data from fetchCryptoPrices
 * @returns {number} Amount in crypto
 */
export function convertTHBToCrypto(thbAmount, crypto, prices) {
    const price = prices[crypto.toLowerCase()];
    if (!price || price === 0) {
        throw new Error(`Invalid price for ${crypto}`);
    }
    return thbAmount / price;
}

/**
 * Format crypto amount with appropriate decimals
 * @param {number} amount - Crypto amount
 * @param {string} crypto - Crypto symbol
 * @returns {string} Formatted amount
 */
export function formatCryptoAmount(amount, crypto) {
    const decimals = ['usdt', 'usdc'].includes(crypto.toLowerCase()) ? 2 : 6;
    return amount.toFixed(decimals);
}
