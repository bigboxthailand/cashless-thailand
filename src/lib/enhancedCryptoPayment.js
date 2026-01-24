// Enhanced Crypto Payment Script for checkout.astro
// This replaces the old METAMASK LOGIC section

// --- REAL-TIME PRICE FETCHING ---
let cryptoPrices = null;
let priceCache = null;
let lastFetchTime = 0;
const CACHE_DURATION = 60000;

async function fetchCryptoPrices() {
    const now = Date.now();
    if (priceCache && (now - lastFetchTime) < CACHE_DURATION) {
        return priceCache;
    }

    try {
        const response = await fetch(
            'https://api.coingecko.com/api/v3/simple/price?ids=ethereum,binancecoin,matic-network,tether,usd-coin&vs_currencies=thb'
        );
        const data = await response.json();
        priceCache = {
            eth: data.ethereum?.thb || 85000,
            bnb: data.binancecoin?.thb || 12000,
            matic: data['matic-network']?.thb || 25,
            usdt: data.tether?.thb || 35,
            usdc: data['usd-coin']?.thb || 35
        };
        lastFetchTime = now;
        return priceCache;
    } catch (error) {
        console.error('Error fetching prices:', error);
        return priceCache || { eth: 85000, bnb: 12000, matic: 25, usdt: 35, usdc: 35 };
    }
}

// --- METAMASK DETECTION & UI SETUP ---
const networkSelect = document.getElementById("network-select");
const currencySelect = document.getElementById("currency-select");
const metamaskPayBtn = document.getElementById("metamask-pay-btn-text");
const cryptoAmountDisplay = document.getElementById("crypto-amount-display");
const exchangeRateDisplay = document.getElementById("exchange-rate-display");
const metamaskSection = document.getElementById("metamask-payment-section");
const qrSection = document.getElementById("qr-payment-section");

const isMetamaskUser = localStorage.getItem('user_wallet') !== null;

if (isMetamaskUser) {
    metamaskSection?.classList.remove('hidden');
    qrSection?.classList.add('hidden');
} else {
    metamaskSection?.classList.add('hidden');
    qrSection?.classList.remove('hidden');
}

// --- UPDATE PRICE DISPLAY ---
async function updatePriceDisplay() {
    if (!networkSelect || !currencySelect) return;

    const network = networkSelect.value;
    const currency = currencySelect.value;
    const config = NETWORKS[network];

    if (!cryptoPrices) {
        cryptoPrices = await fetchCryptoPrices();
    }

    let priceKey = currency === 'native' ? config.priceKey : currency;
    let price = cryptoPrices[priceKey];
    let amount = total / price;
    let symbol = currency === 'native' ? config.nativeCurrency.symbol : currency.toUpperCase();

    const decimals = ['usdt', 'usdc'].includes(currency) ? 2 : 6;
    const formattedAmount = amount.toFixed(decimals);

    if (cryptoAmountDisplay) {
        cryptoAmountDisplay.innerHTML = `${formattedAmount} ${symbol}`;
    }
    if (exchangeRateDisplay) {
        exchangeRateDisplay.textContent = `1 ${symbol} = ${price.toLocaleString()} THB`;
    }
    if (metamaskPayBtn) {
        const networkName = config.chainName.split(' ')[0];
        metamaskPayBtn.textContent = `ชำระ ${formattedAmount} ${symbol} (${networkName})`;
    }
}

networkSelect?.addEventListener("change", updatePriceDisplay);
currencySelect?.addEventListener("change", updatePriceDisplay);

// Initial load
(async () => {
    cryptoPrices = await fetchCryptoPrices();
    await updatePriceDisplay();
})();
