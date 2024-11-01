import axios from 'axios';
import cheerio from 'cheerio';
import { delay } from '../utils.js';

export async function scrapeAmazon(searchTerm) {
  try {
    const response = await axios.get(`https://www.amazon.com/s?k=${encodeURIComponent(searchTerm)}`, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
        'Connection': 'keep-alive'
      }
    });
    
    const $ = cheerio.load(response.data);
    const products = [];

    $('.s-result-item[data-component-type="s-search-result"]').each((i, el) => {
      const title = $(el).find('h2 span').text().trim();
      const priceWhole = $(el).find('.a-price-whole').first().text().trim();
      const priceFraction = $(el).find('.a-price-fraction').first().text().trim();
      const rating = $(el).find('.a-icon-star-small .a-icon-alt').first().text().trim();
      const reviews = $(el).find('.a-size-base.s-underline-text').first().text().trim();
      const imageUrl = $(el).find('img.s-image').attr('src');
      const productUrl = 'https://www.amazon.com' + $(el).find('a.a-link-normal.s-no-outline').attr('href');
      
      if (title && (priceWhole || priceFraction)) {
        const price = `${priceWhole}.${priceFraction}`;
        products.push({
          title,
          price,
          rating: rating.split(' ')[0],
          reviews: reviews.replace(/[^0-9]/g, ''),
          imageUrl,
          productUrl,
          source: 'amazon'
        });
      }
    });

    await delay(1000); // Respect rate limiting
    return products;
  } catch (error) {
    console.error('Amazon scraping error:', error);
    return [];
  }
}