const mongoose = require('mongoose');

const brainrotSchema = new mongoose.Schema({
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  rarity: { type: String, enum: ['Common', 'Rare', 'Legendary', 'God', 'Secret', 'OG'], default: 'Common' },
  level: { type: Number, default: 1, min: 1, max: 200 },
  moneyPerSecond: { type: Number, default: 10 },
  position: { type: Object, default: { x: 0, y: 0, z: 0 } },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Brainrot', brainrotSchema);
