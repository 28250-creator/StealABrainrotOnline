const express = require('express');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const router = express.Router();

// Register
router.post('/register', async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password required' });
    }

    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ error: 'Username already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      username,
      password: hashedPassword,
      money: 100,
      slots: 1,
      rebirths: 0,
      isAdmin: false,
      isOwner: false
    });

    await newUser.save();
    res.status(201).json({ 
      success: true, 
      message: 'Account created!',
      user: { username: newUser.username, id: newUser._id }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ error: 'User not found' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Wrong password' });
    }

    res.json({
      success: true,
      message: 'Logged in!',
      user: {
        id: user._id,
        username: user.username,
        money: user.money,
        slots: user.slots,
        rebirths: user.rebirths,
        isAdmin: user.isAdmin,
        isOwner: user.isOwner
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get user data
router.get('/user/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
