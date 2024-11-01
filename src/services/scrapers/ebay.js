import axios from 'axios';
import cheerio from 'cheerio';
import { delay } from '../utils.js';

export async function scrapeEbay(searchTerm) {
  try {
    const response = await axios.get(`https://www.ebay.com/sch/i.html?_nkw=${encodeURIComponent(searchTerm)}`, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5'
      }
    });
    
    const $ = cheerio.load(response.data);
    const products = [];

    $('.s-item').each((i, el) => {
      const title = $(el).find('.s-item__title').text().trim();
      const price = $(el).find('.s-item__price').text().trim().replace('$', '');
      const rating = $(el).find('.x-star-rating').text().trim();
      const reviews = $(el).find('.s-item__reviews-count').text().trim();
      const imageUrl = $(el).find('.s-item__image-img').attr('src');
      const productUrl = $(el).find('.s-item__link').attr('href');
      
      if (title && price && !title.includes('Shop on eBay')) {
        products.push({
          title,
          price,
          rating: rating ? rating.split(' ')[0] : '0',
          reviews: reviews ? reviews.replace(/[^0-9]/g, '') : '0',
          imageUrl,
          productUrl,
          source: 'ebay'
        });
      }
    });

    await delay(1000); // Respect rate limiting
    return products;
  } catch (error) {
    console.error('eBay scraping error:', error);
    return [];
  }
}