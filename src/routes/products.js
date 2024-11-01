import express from 'express';
import { scrapeProducts, analyzeProduct } from '../services/scraper.js';
import { authenticateToken } from '../middleware/auth.js';
import { checkUserLimit } from '../middleware/usage.js';

const router = express.Router();

router.get('/search', authenticateToken, checkUserLimit, async (req, res, next) => {
  try {
    const { searchTerm, sort, priceRange } = req.query;
    const products = await scrapeProducts(searchTerm, sort, priceRange);
    res.json(products);
  } catch (error) {
    next(error);
  }
});

router.get('/analyze/:productId', authenticateToken, checkUserLimit, async (req, res, next) => {
  try {
    const analysis = await analyzeProduct(req.params.productId);
    res.json(analysis);
  } catch (error) {
    next(error);
  }
});

export default router;