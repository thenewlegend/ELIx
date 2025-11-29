import { GoogleGenerativeAI } from '@google/generative-ai';
import { GEMINI_API_KEY } from '$env/static/private';
import { checkRateLimit, getRateLimitStatus } from '$lib/server/rateLimit.js';
import { getClientIP } from '$lib/server/utils.js';

export async function POST({ request }) {
  try {
    const { topic, age, persona, userApiKey } = await request.json();

    // Determine which API key to use
    const apiKey = userApiKey || GEMINI_API_KEY;
    const isUsingDefaultKey = !userApiKey;

    // Apply rate limiting only when using default API key
    if (isUsingDefaultKey) {
      const clientIP = getClientIP(request);
      // Check status WITHOUT incrementing first
      const status = getRateLimitStatus(clientIP);

      if (status.remaining <= 0) {
        const resetDate = new Date(status.resetTime);
        const minutesUntilReset = Math.ceil((status.resetTime - Date.now()) / 60000);

        return new Response(
          JSON.stringify({
            error: 'Rate limit exceeded',
            message: `You've reached the limit of ${status.limit} queries per 15 minutes. Please try again in ${minutesUntilReset} minutes or use your own API key.`,
            resetTime: resetDate.toISOString(),
            remaining: 0,
            limit: status.limit
          }),
          {
            status: 429,
            headers: {
              'X-RateLimit-Limit': status.limit.toString(),
              'X-RateLimit-Remaining': '0',
              'X-RateLimit-Reset': resetDate.toISOString(),
              'Retry-After': (status.resetTime - Date.now()).toString()
            }
          }
        );
      }
    }

    if (!topic) {
      return new Response(JSON.stringify({ error: 'Topic is required.' }), { status: 400 });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    let prompt = '';

    if (persona) {
      switch (persona) {
        case 'caveman':
          prompt = `Explain the topic "${topic}" as a CAVEMAN. Use ONLY primitive words, grunts (UGH, OOG), and references to rocks/fire/mammoths. Use ALL CAPS. Do NOT use big words. Keep it simple.`;
          break;
        case 'genz':
          prompt = `Explain the topic "${topic}" as a Gen Z teenager with "brainrot". Use excessive slang (skibidi, rizz, fanum tax, no cap, bet, fr fr). Be chaotic, dramatic, and use lowercase.`;
          break;
        case 'shakespeare':
          prompt = `Explain the topic "${topic}" as William Shakespeare. Use flowery Early Modern English, iambic pentameter if possible, 'thee/thou', and dramatic metaphors. Be poetic and verbose.`;
          break;
        case 'conspiracy':
          prompt = `Explain the topic "${topic}" as a paranoid conspiracy theorist. Connect it to the Illuminati, aliens, or "Them". Use phrases like "Wake up sheeple!" and "It's all connected!". Be frantic.`;
          break;
        case 'ramsay':
          prompt = `Explain the topic "${topic}" as an angry Gordon Ramsay. Yell about how "RAW" or "PATHETIC" the concept is. Use cooking insults. Be aggressive but informative.`;
          break;
        case 'programmer':
          prompt = `Explain the topic "${topic}" using ONLY software engineering analogies. Relate everything to code, bugs, deployment, git, or servers. Assume the user is a junior dev.`;
          break;
        // Battle Personas
        case 'philosopher':
          prompt = `Explain the topic "${topic}" as a deep-thinking Philosopher. Don't just explain it, ponder its meaning. Ask "Why?" a lot. Use fancy words like "metaphysical" and "existential", but make it sound profound, not mean.`;
          break;
        case 'scientist':
          prompt = `Explain the topic "${topic}" as an excited Science Communicator (think Bill Nye). BE EXCITED ABOUT DATA! Science rules! Use technical terms but explain them with high energy and enthusiasm.`;
          break;
        case 'boomer':
          prompt = `Explain the topic "${topic}" as a nostalgic Baby Boomer. Compare it to how things were "back in my day" (simpler, harder work). Be slightly confused by new tech but well-meaning. Use phrases like "In my time...".`;
          break;
        case 'zoomer':
          prompt = `Explain the topic "${topic}" as a trendy Gen Z Zoomer. Use slang like "vibe", "aesthetic", "it's giving", and "no cap". Be cool and casual, like you're making a viral video about it.`;
          break;
        case 'optimist':
          prompt = `Explain the topic "${topic}" with UNCONTROLLABLE OPTIMISM! Find the silver lining! Even if it's bad, it's a "learning opportunity"! Use exclamation marks! The future is bright!`;
          break;
        case 'pessimist':
          prompt = `Explain the topic "${topic}" as a gloomy Eeyore-type character. Focus on the downsides and risks. Sigh a lot. It's probably not going to work out, but explain it anyway.`;
          break;
        default:
          prompt = `Explain the topic "${topic}" like I am 5 years old.`;
      }
    } else {
      // Default Age-based
      prompt = `Explain the topic "${topic}" like I am ${age || 5} years old. Provide a concise explanation.`;
    }

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const explanation = response.text();

    const headers = { 'Content-Type': 'application/json' };

    // Add rate limit headers if using default key
    // AND increment the count now that we have a success
    if (isUsingDefaultKey) {
      const clientIP = getClientIP(request);
      const status = checkRateLimit(clientIP); // This increments the count

      headers['X-RateLimit-Limit'] = status.limit.toString();
      headers['X-RateLimit-Remaining'] = status.remaining.toString();
      headers['X-RateLimit-Reset'] = new Date(status.resetTime).toISOString();
    }

    return new Response(JSON.stringify({ explanation }), { status: 200, headers });
  } catch (e) {
    console.error("API Error:", e);
    return new Response(JSON.stringify({ error: e.message || 'Failed to generate explanation.' }), { status: 500 });
  }
}