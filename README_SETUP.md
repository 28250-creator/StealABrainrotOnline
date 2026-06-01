# Steal a Brainrot Online - Setup Guide

## 🎮 Playing Online (GitHub Pages - Browser Only)

Go to: **https://28250-creator.github.io/StealABrainrotOnline**

Just click and play! No downloads needed.

### Features (Browser Version):
- ✅ 3D gameplay with Three.js
- ✅ Account system (register/login)
- ✅ Money collection
- ✅ Brainrot purchase system
- ✅ Data saved in browser
- ❌ No multiplayer (local only)

---

## 🚀 Local Server Setup (For Development)

### Requirements:
- Node.js
- MongoDB

### Steps:

1. **Clone repository**
   ```bash
   git clone https://github.com/28250-creator/StealABrainrotOnline.git
   cd StealABrainrotOnline
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Setup MongoDB**
   - Install MongoDB Community Edition
   - Make sure MongoDB is running

4. **Create .env file**
   ```
   PORT=3000
   MONGO_URI=mongodb://localhost:27017/steal-a-brainrot
   NODE_ENV=development
   OWNER_USERNAME=Owner
   OWNER_PASSWORD=itsmerobloxviP4446
   ```

5. **Start server**
   ```bash
   npm start
   ```

6. **Open in browser**
   ```
   http://localhost:3000
   ```

### Features (Server Version):
- ✅ All browser features
- ✅ Real multiplayer with Socket.IO
- ✅ Persistent database
- ✅ Admin panel
- ✅ Leaderboard

---

## 👤 Owner Account

**Username:** `Owner`
**Password:** `itsmerobloxviP4446`

---

## 📂 Folder Structure

```
StealABrainrotOnline/
├── index.html          # Main game file
├── css/
│   └── style.css       # Game styles
├── js/
│   ├── game.js         # Game logic (Three.js)
│   └── ui.js           # UI & authentication
├── server/             # Backend files (Node.js)
├── .gitignore
└── package.json
```

---

## 🎯 Next Steps

1. Try the online version first
2. Create an account
3. Collect money by clicking the green spheres
4. Buy Brainrots from the red spawner
5. Upgrade them and earn more money!

Enjoy! 🚀
