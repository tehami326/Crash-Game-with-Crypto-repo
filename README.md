# 💥 Crypto Crash Backend

This is the backend for the "Crypto Crash" game — a real-time crash betting game with cryptocurrency integration and WebSocket-based multiplayer support.

---

## 🚀 Features

- 🕹️ Game loop: new round every 10 seconds, random crash multiplier
- 🧮 USD to BTC/ETH conversion with real-time CoinGecko prices
- 💼 Crypto wallet balances per player
- 🟢 Place bets & 🟡 Cash out anytime before crash
- 🔄 Real-time updates via WebSocket (Socket.IO)

---

## 🧰 Tech Stack

- Node.js + Express.js
- MongoDB + Mongoose
- Socket.IO (WebSockets)
- CoinGecko API for real-time prices
- HTML (for testing client)

---

## 🛠️ Setup

1. Clone repo & install dependencies
   ```bash
   git clone https://github.com/your-username/crypto-crash-backend.git
   cd crypto-crash-backend
   npm install


Create .env:
PORT=5000
MONGO_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/?retryWrites=true&w=majority



Seed players:
node scripts/seed.js

Start server:
npm run dev

API Endpoints
Method	                Route	                  Description
GET	                  /api/prices	         Get BTC & ETH prices
POST	              /api/games/bet	      Place a bet in USD
POST	              /api/games/cashout	   Cash out current bet
GET	                  /api/players/:username	Get player balances


🔌 WebSocket Events
Client → Server

cashout: { player: "alice", multiplier: 2.4 }

Server → Client

round_start: { round, crashPoint }

multiplier: { multiplier }

player_cashout: { player, multiplier, usd }

crash: { crashPoint }