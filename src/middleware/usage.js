import { getUserUsage, incrementUsage } from '../services/usage.js';

export async function checkUserLimit(req, res, next) {
  try {
    const usage = await getUserUsage(req.user.id);
    
    if (!req.user.isPremium && usage >= 83) {
      return res.status(429).json({
        error: 'Monthly request limit reached',
        upgrade: true
      });
    }

    await incrementUsage(req.user.id);
    next();
  } catch (error) {
    next(error);
  }
}