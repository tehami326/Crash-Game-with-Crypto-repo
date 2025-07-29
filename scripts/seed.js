require("dotenv").config();
const mongoose = require("mongoose");
const Player = require("../models/Player");

async function seed() {
    await mongoose.connect(process.env.MONGO_URI);
    await Player.deleteMany();

    await Player.insertMany([
        { username: "alice", balances: { BTC: 0.01, ETH: 0.5 } },
        { username: "bob", balances: { BTC: 0.02, ETH: 0.3 } },
        { username: "carol", balances: { BTC: 0.005, ETH: 1.0 } },
    ]);

    console.log("✅ Players seeded.");
    mongoose.disconnect();
}

seed();
