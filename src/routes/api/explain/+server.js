import { GoogleGenerativeAI } from '@google/generative-ai';
import { GEMINI_API_KEY } from '$env/static/private';

export async function POST({ request }) {
  try {
    const { topic, age } = await request.json();

    if (!topic || !age) {
      return new Response(JSON.stringify({ error: 'Topic and Age are required.' }), { status: 400 });
    }

    const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash"});

    const prompt = `Explain the topic "${topic}" like I am ${age} years old. Provide a concise explanation.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const explanation = response.text();

    return new Response(JSON.stringify({ explanation }), { status: 200 });
  } catch (e) {
    console.error("API Error:", e);
    return new Response(JSON.stringify({ error: e.message || 'Failed to generate explanation.' }), { status: 500 });
  }
}