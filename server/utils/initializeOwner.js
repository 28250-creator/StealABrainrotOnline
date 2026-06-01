const User = require('../models/User');
const bcrypt = require('bcryptjs');

async function initializeOwner() {
  try {
    const existingOwner = await User.findOne({ isOwner: true });
    if (existingOwner) {
      console.log('✅ Owner account already exists');
      return;
    }

    const hashedPassword = await bcrypt.hash(process.env.OWNER_PASSWORD || 'itsmerobloxviP4446', 10);
    const owner = new User({
      username: process.env.OWNER_USERNAME || 'Owner',
      password: hashedPassword,
      money: 999999,
      slots: 48,
      rebirths: 20,
      isOwner: true,
      isAdmin: true
    });

    await owner.save();
    console.log('✅ Owner account created successfully');
  } catch (err) {
    console.log('❌ Error creating owner account:', err);
  }
}

module.exports = initializeOwner;
