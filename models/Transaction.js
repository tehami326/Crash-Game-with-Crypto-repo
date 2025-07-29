const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema({
    player: { type: String, required: true },
    usdAmount: { type: Number, required: true },
    cryptoAmount: { type: Number, required: true },
    currency: { type: String, enum: ["BTC", "ETH"], required: true },
    transactionType: { type: String, enum: ["bet", "cashout"], required: true },
    transactionHash: { type: String, required: true },
    priceAtTime: { type: Number, required: true },
    timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Transaction", transactionSchema);
