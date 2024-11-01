import axios from 'axios';
import cheerio from 'cheerio';
import { analyzeWithGPT } from './openai.js';
import { scrapeEbay } from './scrapers/ebay.js';
import { scrapeAmazon } from './scrapers/amazon.js';

const CACHE = new Map();
const CACHE_DURATION = 3600000; // 1 hour

export async function scrapeProducts(searchTerm, sort, priceRange) {
  const cacheKey = `${searchTerm}-${sort}-${priceRange}`;
  
  if (CACHE.has(cacheKey)) {
    const { data, timestamp } = CACHE.get(cacheKey);
    if (Date.now() - timestamp < CACHE_DURATION) {
      return data;
    }
  }

  const [amazonProducts, ebayProducts] = await Promise.all([
    scrapeAmazon(searchTerm),
    scrapeEbay(searchTerm)
  ]);

  const allProducts = [...amazonProducts, ...ebayProducts];
  
  // Apply price range filter if specified
  const filteredProducts = priceRange 
    ? filterByPriceRange(allProducts, priceRange)
    : allProducts;

  // Sort products
  const sortedProducts = sortProducts(filteredProducts, sort);

  const analyzedProducts = await Promise.all(
    sortedProducts.map(async (product) => ({
      ...product,
      analysis: await analyzeWithGPT(product)
    }))
  );

  CACHE.set(cacheKey, {
    data: analyzedProducts,
    timestamp: Date.now()
  });

  return analyzedProducts;
}

export async function analyzeProduct(productId) {
  const product = await fetchProductDetails(productId);
  return await analyzeWithGPT(product);
}

function filterByPriceRange(products, range) {
  const [min, max] = range.split('-').map(Number);
  return products.filter(p => {
    const price = parseFloat(p.price);
    return price >= min && price <= max;
  });
}

function sortProducts(products, sortBy) {
  switch (sortBy) {
    case 'price-asc':
      return [...products].sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
    case 'price-desc':
      return [...products].sort((a, b) => parseFloat(b.price) - parseFloat(a.price));
    case 'rating-desc':
      return [...products].sort((a, b) => parseFloat(b.rating) - parseFloat(a.rating));
    default:
      return products;
  }
}

async function fetchProductDetails(productId) {
  // Implementation for fetching detailed product information
  throw new Error('Not implemented');
}