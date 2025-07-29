require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const { Server } = require("socket.io");
const http = require("http");
const gameRoutes = require("./routes/gameroutes");
const playerRoutes = require("./routes/playerRoutes");

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static("public"));
app.use("/api/games", gameRoutes);
app.use("/api/players", playerRoutes);

const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

const PORT = process.env.PORT || 5000;
const BASE_URL = process.env.BASE_URL || `http://localhost:${PORT}`;

// 🧠 WebSocket connection handler
io.on("connection", (socket) => {
    console.log("🧠 New WebSocket client connected");

    socket.on("cashout", async (data) => {
        const { player, multiplier } = data;
        const axios = require("axios");

        try {
            const res = await axios.post(`${BASE_URL}/api/games/cashout`, {
                player,
                multiplier,
            });
            io.emit("player_cashout", {
                player,
                multiplier,
                usd: res.data.usdPayout,
            });
        } catch (err) {
            socket.emit("error", {
                message: err?.response?.data?.error || "Cashout failed",
            });
        }
    });
});

// ✅ Connect to MongoDB and start the game loop once
mongoose.connect(process.env.MONGO_URI).then(() => {
    console.log("✅ MongoDB connected");

    server.listen(PORT, () =>
        console.log("🚀 Server running on port " + PORT)
    );

    const startGameLoop = require("./gameEngine");
    startGameLoop(io); // Only one instance runs ✅
});
