import { GoogleGenerativeAI } from '@google/generative-ai';

export async function POST({ request }) {
    try {
        const { apiKey } = await request.json();

        if (!apiKey) {
            return new Response(JSON.stringify({ valid: false, error: 'API key is required' }), { status: 400 });
        }

        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

        // Try a very simple, cheap generation to validate the key
        const result = await model.generateContent("Hello");
        await result.response;

        return new Response(JSON.stringify({ valid: true }), { status: 200 });
    } catch (e) {
        console.error("Key Validation Error:", e);
        return new Response(JSON.stringify({ valid: false, error: 'Invalid API key' }), { status: 200 });
    }
}
