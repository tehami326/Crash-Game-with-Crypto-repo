const mongoose = require("mongoose");

const betSchema = new mongoose.Schema({
    player: { type: String, required: true },
    amount: { type: Number, required: true },
    currency: { type: String, required: true },
    cryptoAmount: { type: Number, required: true }, // ✅ Add this
    cashedOut: { type: Boolean, default: false },
    cashoutMultiplier: { type: Number, default: null }
});

const gameSchema = new mongoose.Schema({
    crashPoint: { type: Number, required: true },
    isActive: { type: Boolean, default: true },
    bets: [betSchema],
    startedAt: { type: Date, default: Date.now },
    endedAt: { type: Date }
});

module.exports = mongoose.model("Game", gameSchema);
