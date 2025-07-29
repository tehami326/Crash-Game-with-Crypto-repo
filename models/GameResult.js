const mongoose = require("mongoose");

const gameResultSchema = new mongoose.Schema({
    player: { type: String, required: true },
    betAmount: { type: Number, required: true },
    multiplier: { type: Number, required: true },
    result: { type: String, enum: ["win", "lose"], required: true },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("GameResult", gameResultSchema);
