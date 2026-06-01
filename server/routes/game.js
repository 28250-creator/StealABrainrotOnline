const express = require('express');
const User = require('../models/User');
const Brainrot = require('../models/Brainrot');
const router = express.Router();

// Get user inventory
router.get('/inventory/:userId', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).populate('brainrots');
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json({
      money: user.money,
      slots: user.slots,
      maxSlots: 16 + (user.rebirths * 16), // 16 slots per floor, max 3 floors (48)
      brainrots: user.brainrots,
      rebirths: user.rebirths
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Add money
router.post('/addmoney', async (req, res) => {
  try {
    const { userId, amount } = req.body;
    const user = await User.findByIdAndUpdate(
      userId,
      { $inc: { money: amount } },
      { new: true }
    );
    res.json({ money: user.money });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Buy Brainrot
router.post('/buybrainrot', async (req, res) => {
  try {
    const { userId, rarityLevel, cost } = req.body;
    const user = await User.findById(userId);

    if (user.money < cost) {
      return res.status(400).json({ error: 'Not enough money' });
    }

    if (user.brainrots.length >= user.slots) {
      return res.status(400).json({ error: 'No slots available' });
    }

    const newBrainrot = new Brainrot({
      owner: userId,
      rarity: rarityLevel,
      level: 1,
      moneyPerSecond: 10
    });

    await newBrainrot.save();
    user.money -= cost;
    user.brainrots.push(newBrainrot._id);
    await user.save();

    res.json({ success: true, money: user.money, brainrot: newBrainrot });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Upgrade Brainrot
router.post('/upgradebrainrot', async (req, res) => {
  try {
    const { userId, brainrotId, cost } = req.body;
    const user = await User.findById(userId);

    if (user.money < cost) {
      return res.status(400).json({ error: 'Not enough money' });
    }

    const brainrot = await Brainrot.findById(brainrotId);
    if (brainrot.level >= 200) {
      return res.status(400).json({ error: 'Already max level' });
    }

    brainrot.level += 1;
    brainrot.moneyPerSecond = 10 + (brainrot.level * 9.95);
    await brainrot.save();

    user.money -= cost;
    await user.save();

    res.json({ success: true, brainrot, money: user.money });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Rebirth
router.post('/rebirth', async (req, res) => {
  try {
    const { userId } = req.body;
    const user = await User.findById(userId);

    if (user.rebirths >= 2) {
      return res.status(400).json({ error: 'Max rebirths reached' });
    }

    user.rebirths += 1;
    user.money = 100;
    user.slots = 1 + (user.rebirths * 1);
    await user.save();

    res.json({ success: true, rebirths: user.rebirths, slots: user.slots });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
