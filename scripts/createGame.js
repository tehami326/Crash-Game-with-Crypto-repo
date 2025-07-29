require("dotenv").config();
const mongoose = require("mongoose");
const Game = require("../models/Game");

async function createActiveGame() {
    await mongoose.connect(process.env.MONGO_URI);

    // Optional: End all other games
    await Game.updateMany({ isActive: true }, { isActive: false, endedAt: new Date() });

    const game = new Game({
        crashPoint: 3.5, // arbitrary crash value
        isActive: true,
        startedAt: new Date(),
        bets: []
    });

    await game.save();
    console.log("✅ Active game created:", game._id);

    mongoose.disconnect();
}

createActiveGame();
