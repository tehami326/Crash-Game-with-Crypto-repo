const axios = require("axios");

let cache = {};
let lastFetch = 0;

async function getCryptoPrices() {
    const now = Date.now();
    if (now - lastFetch < 10000 && Object.keys(cache).length > 0) {
        return cache;
    }

    const { data } = await axios.get("https://api.coingecko.com/api/v3/simple/price", {
        params: { ids: "bitcoin,ethereum", vs_currencies: "usd" }
    });

    cache = {
        BTC: data.bitcoin.usd,
        ETH: data.ethereum.usd
    };
    lastFetch = now;
    return cache;
}

module.exports = { getCryptoPrices };
