const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true, select: false },
  role: { type: String, enum: ['patient', 'doctor'], default: 'patient' },
  hospitalId: { type: String, required: true, unique: true },
  phoneNumber: { type: String, default: '' },
  dateOfBirth: { type: String, default: '' },
  loginAttempts: { type: Number, default: 0 },
  lockUntil: { type: Date, default: null },
  isLocked: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

// Encrypt password before saving
UserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare password method
UserSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Check if account is locked
UserSchema.methods.isAccountLocked = function() {
  return this.isLocked && this.lockUntil > Date.now();
};

// Increment login attempts
UserSchema.methods.incrementLoginAttempts = async function() {
  this.loginAttempts += 1;
  if (this.loginAttempts >= 5) {
    this.isLocked = true;
    this.lockUntil = Date.now() + 15 * 60 * 1000; // 15 minutes
  }
  await this.save();
};

// Reset login attempts
UserSchema.methods.resetLoginAttempts = async function() {
  this.loginAttempts = 0;
  this.isLocked = false;
  this.lockUntil = null;
  await this.save();
};

module.exports = mongoose.model('User', UserSchema);