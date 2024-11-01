import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true
  },
  isPremium: {
    type: Boolean,
    default: false
  },
  monthlyUsage: {
    type: Number,
    default: 0
  },
  lastUsageReset: {
    type: Date,
    default: Date.now
  },
  stripeCustomerId: {
    type: String,
    sparse: true
  }
}, {
  timestamps: true
});

export default mongoose.model('User', userSchema);