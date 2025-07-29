const express = require("express");
const router = express.Router();
const Player = require("../models/Player");
const { getCryptoPrices } = require("../services/cryptoService");

// Get player balance (with USD equivalent)
router.get("/:username", async (req, res) => {
    try {
        const player = await Player.findOne({ username: req.params.username });
        if (!player) return res.status(404).json({ error: "Player not found" });

        const prices = await getCryptoPrices();
        const usdBalances = {
            BTC: player.balances.BTC * prices.BTC,
            ETH: player.balances.ETH * prices.ETH
        };

        res.json({ player, usdBalances });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
