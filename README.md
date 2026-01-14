# 🛡️ Safe Deploy

> **AI-Powered Smart Contract Security & Deployment Platform**  
> Built on Mantle Sepolia Testnet | Infrastructure × AI Track

![Mantle](https://img.shields.io/badge/Built%20on-Mantle-00D395?style=for-the-badge)
![AI Powered](https://img.shields.io/badge/Powered%20by-Gemini%20AI-4285F4?style=for-the-badge)
![Next.js](https://img.shields.io/badge/Next.js-16-000000?style=for-the-badge)

---

## 🎯 Problem Statement

Deploying smart contracts is risky:
- **Security vulnerabilities** can drain millions
- **Gas estimation errors** lead to failed transactions
- **No real-time infrastructure health** visibility
- **Manual code review** is slow and error-prone

## 💡 Solution

**Safe Deploy** is an all-in-one platform that combines **AI-powered security analysis** with **real-time infrastructure monitoring** to ensure safe, optimized contract deployments on Mantle Network.

---

## 🚀 Features

### 🤖 AI-Powered Security Analysis
- **Gemini Flash AI** analyzes your Solidity code in real-time
- Detects vulnerabilities: reentrancy, overflow, access control issues
- Provides actionable optimization suggestions
- Gas efficiency recommendations

### ⚡ Real-Time Infrastructure Monitoring
- Live RPC latency monitoring for Mantle Sepolia
- Network health indicators before deployment
- Instant feedback on infrastructure status

### 💰 Gas Estimation & Cost Preview
- Accurate deployment cost estimation in MNT
- USD conversion via CoinGecko API
- Contract size analysis (24KB limit check)

### 🎁 Daily Token Faucet
- Claim **20 GUARD tokens** daily
- 24-hour cooldown with live countdown
- Treasury-funded (users pay zero gas)

### 📂 Contract History (MongoDB)
- ChatGPT-style collapsible sidebar
- Save deployed contracts with names
- Click to load code instantly
- Delete on hover

### 🔐 Token-Gated Analysis
- Pay **1 GUARD** to run security analysis
- Prevents spam and ensures quality usage
- RainbowKit wallet integration

---

## 🏗️ Infrastructure × AI

This project demonstrates the powerful synergy of **blockchain infrastructure** and **AI**:

| Layer | Technology | Purpose |
|-------|------------|---------|
| **Network** | Mantle Sepolia | Fast, low-cost L2 transactions |
| **AI Engine** | Google Gemini Flash | Real-time code analysis & suggestions |
| **Storage** | MongoDB Atlas | Persistent user data & contract history |
| **RPC Monitoring** | Custom Health Monitor | Infrastructure reliability checks |
| **Token Economics** | $GUARD ERC-20 | Usage gating & incentive alignment |

### Why Mantle?
- ⚡ **Low gas costs** - Affordable for frequent deployments
- 🚀 **Fast finality** - Quick transaction confirmations
- 🔧 **EVM compatible** - Seamless Solidity support
- 🌐 **Growing ecosystem** - Active developer community

---

## 📜 Smart Contracts

| Contract | Address | Network |
|----------|---------|---------|
| **$GUARD Token** | `0x04965fcdc275cce9dbeea4e6b938edcdcdff0d86` | Mantle Sepolia |

[View on Explorer →](https://sepolia.mantlescan.xyz/address/0x04965fcdc275cce9dbeea4e6b938edcdcdff0d86)

---

## 🛠️ Tech Stack

- **Frontend**: Next.js 16, React, TailwindCSS, Shadcn UI
- **Web3**: Wagmi, Viem, RainbowKit
- **AI**: Google Gemini Flash API
- **Database**: MongoDB Atlas
- **Editor**: Monaco Editor (VS Code engine)
- **Package Manager**: Bun

---

## 🚀 Quick Start

```bash
# Clone the repository
git clone https://github.com/your-username/mantle-deploy-guard.git
cd mantle-deploy-guard

# Install dependencies
bun install

# Configure environment
cp .env.example .env
# Add your keys: GEMINI_API_KEY, MONGODB_URI, TREASURY_PRIVATE_KEY

# Run development server
bun run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

---

## 📱 User Flow

```
1. Connect Wallet (MetaMask via RainbowKit)
         ↓
2. Claim 20 GUARD tokens (daily faucet)
         ↓
3. Paste your Solidity code
         ↓
4. Pay 1 GUARD to analyze
         ↓
5. Review AI security suggestions
         ↓
6. Check gas estimates & network health
         ↓
7. Deploy to Mantle Sepolia
         ↓
8. Contract saved to history!
```

---

## 🏆 Hackathon Highlights

- ✅ **Live on Mantle Sepolia Testnet**
- ✅ **AI-Powered Security Analysis** (Gemini Flash)
- ✅ **Real-Time Infrastructure Monitoring**
- ✅ **Token-Gated Access** (Custom ERC-20)
- ✅ **Persistent User Data** (MongoDB)
- ✅ **Production-Ready UI/UX**

---

## 👥 Team

Built with ❤️ for the Mantle Hackathon

---

## 📄 License

MIT License - feel free to use and modify!
