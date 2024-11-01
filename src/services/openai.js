import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export async function analyzeWithGPT(product) {
  try {
    const prompt = `
      Analyze this product from ${product.source}:
      Title: ${product.title}
      Price: $${product.price}
      Rating: ${product.rating}
      Reviews: ${product.reviews}

      Please provide:
      1. A brief summary of the product
      2. Key features and benefits
      3. Value for money assessment
      4. Recommendation based on ratings and reviews
      5. Any potential concerns or considerations
    `;

    const completion = await openai.chat.completions.create({
      messages: [{
        role: "system",
        content: "You are a knowledgeable shopping assistant providing detailed product analysis."
      }, {
        role: "user",
        content: prompt
      }],
      model: "gpt-3.5-turbo",
      temperature: 0.7,
      max_tokens: 300
    });

    return completion.choices[0].message.content;
  } catch (error) {
    console.error('OpenAI API error:', error);
    return 'Analysis unavailable';
  }
}