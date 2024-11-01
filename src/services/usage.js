import User from '../models/User.js';

export async function getUserUsage(userId) {
  const user = await User.findById(userId);
  
  // Reset monthly usage if it's a new month
  const lastReset = new Date(user.lastUsageReset);
  const now = new Date();
  
  if (lastReset.getMonth() !== now.getMonth() || 
      lastReset.getFullYear() !== now.getFullYear()) {
    user.monthlyUsage = 0;
    user.lastUsageReset = now;
    await user.save();
  }
  
  return user.monthlyUsage;
}

export async function incrementUsage(userId) {
  await User.findByIdAndUpdate(userId, {
    $inc: { monthlyUsage: 1 }
  });
}