// services/cryptoService.js
const axios = require("axios");

let cachedPrices = null;
let lastFetched = 0;

async function getCryptoPrices() {
    const now = Date.now();
    if (cachedPrices && now - lastFetched < 10000) return cachedPrices; // cache for 10s

    const url = "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum&vs_currencies=usd";
    const { data } = await axios.get(url);

    cachedPrices = {
        BTC: data.bitcoin.usd,
        ETH: data.ethereum.usd
    };
    lastFetched = now;
    return cachedPrices;
}

module.exports = { getCryptoPrices };
