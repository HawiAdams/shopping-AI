export function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export function extractPrice(priceString) {
  const match = priceString.match(/[\d,.]+/);
  return match ? parseFloat(match[0].replace(/,/g, '')) : 0;
}

export function normalizeRating(rating, source) {
  const numericRating = parseFloat(rating);
  
  switch (source) {
    case 'amazon':
      return numericRating; // Amazon ratings are already out of 5
    case 'ebay':
      return (numericRating / 100) * 5; // eBay ratings are percentage based
    default:
      return numericRating;
  }
}