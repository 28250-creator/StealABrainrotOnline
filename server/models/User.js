const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  money: { type: Number, default: 100 },
  slots: { type: Number, default: 1 },
  rebirths: { type: Number, default: 0 },
  brainrots: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Brainrot' }],
  isAdmin: { type: Boolean, default: false },
  isOwner: { type: Boolean, default: false },
  isBanned: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  lastLogin: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', userSchema);
