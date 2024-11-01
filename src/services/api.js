import { Configuration, OpenAIApi } from 'openai';

const DEMO_PRODUCTS = [
  {
    id: '1',
    title: 'Smartphone X',
    price: '699.99',
    rating: '4.5',
    reviews: '1250',
    imageUrl: 'https://via.placeholder.com/200',
    source: 'demo'
  },
  // Add more demo products...
];

const openai = new OpenAIApi(new Configuration({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
}));

export async function searchProducts(searchTerm, filters) {
  // In a real app, this would call an API
  // For demo, we'll filter the demo products
  let products = [...DEMO_PRODUCTS];
  
  if (filters.priceRange !== 'all') {
    const [min, max] = filters.priceRange.split('-').map(Number);
    products = products.filter(p => {
      const price = parseFloat(p.price);
      return price >= min && price <= max;
    });
  }

  if (filters.sort === 'price-asc') {
    products.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
  } else if (filters.sort === 'price-desc') {
    products.sort((a, b) => parseFloat(b.price) - parseFloat(a.price));
  }

  return products;
}

export async function analyzeProduct(product) {
  try {
    const completion = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [{
        role: "system",
        content: "You are a helpful shopping assistant providing product analysis."
      }, {
        role: "user",
        content: `Analyze this product: ${product.title}`
      }],
    });

    return completion.data.choices[0].message.content;
  } catch (error) {
    console.error('OpenAI API error:', error);
    return 'Analysis unavailable';
  }
}