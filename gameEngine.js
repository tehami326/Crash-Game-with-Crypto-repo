const Game = require("./models/Game");
const { Server } = require("socket.io");
const crypto = require("crypto");

let currentMultiplier = 1;
let gameInterval;

// Provably fair crash point generator
function generateCrashPoint(seed, round) {
    const hash = crypto.createHash("sha256").update(seed + round).digest("hex");
    const intVal = parseInt(hash.substring(0, 8), 16);
    return (Math.floor((intVal % 10000) + 100) / 100).toFixed(2); // Example: 1.00 to 100.00
}

async function startGameLoop(io) {
    let round = 1;
    const seed = "secret_seed";

    setInterval(async () => {
        // End previous active games
        await Game.updateMany({ isActive: true }, { isActive: false, endedAt: new Date() });

        // Start new round
        const crashPoint = generateCrashPoint(seed, round);
        const game = new Game({ crashPoint, isActive: true });
        await game.save();

        io.emit("round_start", { round, crashPoint });
        console.log(`🎮 Round ${round} started | Crash at: ${crashPoint}x`);

        currentMultiplier = 1;
        let elapsed = 0;
        const growthRate = 0.02;

        // Start multiplier increment every 100ms
        gameInterval = setInterval(async () => {
            currentMultiplier = +(1 + elapsed * growthRate).toFixed(2);
            io.emit("multiplier", { multiplier: currentMultiplier });
            elapsed += 0.1;

            // Crash check
            if (currentMultiplier >= Number(crashPoint)) {
                clearInterval(gameInterval);
                const endGame = await Game.findById(game._id);
                endGame.isActive = false;
                endGame.endedAt = new Date();
                await endGame.save();

                io.emit("crash", { crashPoint });
                console.log(`💥 Crashed at ${crashPoint}x\n`);
                round++;
            }
        }, 100);
    }, 10000); // New round every 10 seconds
}

module.exports = startGameLoop;
