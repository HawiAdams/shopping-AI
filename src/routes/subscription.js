import express from 'express';
import Stripe from 'stripe';
import { authenticateToken } from '../middleware/auth.js';
import User from '../models/User.js';

const router = express.Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

router.post('/create-subscription', authenticateToken, async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    
    if (user.isPremium) {
      return res.status(400).json({ error: 'User already has premium subscription' });
    }

    const session = await stripe.checkout.sessions.create({
      customer_email: user.email,
      payment_method_types: ['card'],
      line_items: [{
        price: process.env.STRIPE_PRICE_ID,
        quantity: 1,
      }],
      mode: 'subscription',
      success_url: `${process.env.CLIENT_URL}/subscription/success`,
      cancel_url: `${process.env.CLIENT_URL}/subscription/cancel`,
    });

    res.json({ sessionId: session.id });
  } catch (error) {
    next(error);
  }
});

router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    await User.findOneAndUpdate(
      { email: session.customer_email },
      { 
        isPremium: true,
        stripeCustomerId: session.customer
      }
    );
  }

  res.json({ received: true });
});

export default router;