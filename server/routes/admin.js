const express = require('express');
const User = require('../models/User');
const router = express.Router();

// Verify admin
const verifyAdmin = async (req, res, next) => {
  try {
    const user = await User.findById(req.body.userId);
    if (!user || (!user.isAdmin && !user.isOwner)) {
      return res.status(403).json({ error: 'Not authorized' });
    }
    next();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Give money
router.post('/givemoney', verifyAdmin, async (req, res) => {
  try {
    const { targetUsername, amount } = req.body;
    const targetUser = await User.findOneAndUpdate(
      { username: targetUsername },
      { $inc: { money: amount } },
      { new: true }
    );
    res.json({ success: true, user: targetUser });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Make admin
router.post('/makeadmin', verifyAdmin, async (req, res) => {
  try {
    const { userId, targetUsername } = req.body;
    const admin = await User.findById(userId);
    if (!admin.isOwner) {
      return res.status(403).json({ error: 'Only Owner can make admins' });
    }

    const targetUser = await User.findOneAndUpdate(
      { username: targetUsername },
      { isAdmin: true },
      { new: true }
    );
    res.json({ success: true, user: targetUser });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Kick player
router.post('/kick', verifyAdmin, async (req, res) => {
  try {
    const { targetUsername } = req.body;
    res.json({ success: true, message: `${targetUsername} has been kicked` });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Ban player
router.post('/ban', verifyAdmin, async (req, res) => {
  try {
    const { userId, targetUsername } = req.body;
    const admin = await User.findById(userId);
    if (!admin.isOwner) {
      return res.status(403).json({ error: 'Only Owner can ban' });
    }

    await User.findOneAndUpdate(
      { username: targetUsername },
      { isBanned: true },
      { new: true }
    );
    res.json({ success: true, message: `${targetUsername} has been banned` });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
