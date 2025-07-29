const router = require("express").Router();
const Game = require("../models/Game");
const Player = require("../models/Player");
const Transaction = require("../models/Transaction");
const { getCryptoPrices } = require("../utils/priceCache");

// 🟢 Place a bet
router.post("/bet", async (req, res) => {
    try {
        const { player, amount, currency } = req.body;
        if (!["BTC", "ETH"].includes(currency)) {
            return res.status(400).json({ error: "Invalid currency" });
        }

        const prices = await getCryptoPrices();
        const price = prices[currency];
        const cryptoAmount = amount / price;

        const playerData = await Player.findOne({ username: player });
        if (!playerData) return res.status(404).json({ error: "Player not found" });

        if (playerData.balances[currency] < cryptoAmount) {
            return res.status(400).json({ error: "Insufficient balance" });
        }

        const activeGame = await Game.findOne({ isActive: true });
        if (!activeGame) return res.status(400).json({ error: "No active game round" });

        playerData.balances[currency] -= cryptoAmount;
        await playerData.save();

        activeGame.bets.push({ player, amount, currency, cryptoAmount });
        await activeGame.save();

        const transaction = new Transaction({
            player,
            usdAmount: amount,
            cryptoAmount,
            currency,
            transactionType: "bet",
            transactionHash: `tx_${Date.now()}`,
            priceAtTime: price,
        });
        await transaction.save();

        res.json({ message: "Bet placed", cryptoAmount, price, game: activeGame });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 🟡 Cash out
router.post("/cashout", async (req, res) => {
    try {
        const { player, multiplier } = req.body;
        const activeGame = await Game.findOne({ isActive: true });
        if (!activeGame) return res.status(400).json({ error: "No active game round" });

        const bet = activeGame.bets.find(b => b.player === player && !b.cashedOut);
        if (!bet) return res.status(400).json({ error: "No active bet for this player" });

        const cryptoPayout = bet.cryptoAmount * multiplier;

        // 🧠 Debug info (for development only)
        console.log("DEBUG CASHOUT:");
        console.log("Player:", player);
        console.log("Multiplier:", multiplier);
        console.log("Bet:", bet);
        console.log("cryptoAmount:", bet.cryptoAmount);
        console.log("Payout:", cryptoPayout);

        if (!cryptoPayout || isNaN(cryptoPayout)) {
            return res.status(400).json({ error: "Invalid crypto payout" });
        }

        bet.cashedOut = true;
        bet.cashoutMultiplier = multiplier;
        await activeGame.save();

        const playerData = await Player.findOne({ username: player });
        playerData.balances[bet.currency] += cryptoPayout;
        await playerData.save();

        const prices = await getCryptoPrices();
        const transaction = new Transaction({
            player,
            usdAmount: cryptoPayout * prices[bet.currency],
            cryptoAmount: cryptoPayout,
            currency: bet.currency,
            transactionType: "cashout",
            transactionHash: `tx_${Date.now()}`,
            priceAtTime: prices[bet.currency],
        });
        await transaction.save();

        res.json({
            message: "Cashed out successfully",
            cryptoPayout,
            usdPayout: cryptoPayout * prices[bet.currency]
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
