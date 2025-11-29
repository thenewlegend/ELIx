import { GoogleGenerativeAI } from '@google/generative-ai';
import { GEMINI_API_KEY } from '$env/static/private';
import { checkRateLimit, getRateLimitStatus } from '$lib/server/rateLimit.js';
import { getClientIP } from '$lib/server/utils.js';

export async function POST({ request }) {
  try {
    const { topic, age, persona, opponentPersona, userApiKey } = await request.json();

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

    // Helper function to get opponent description
    const getOpponentDesc = (opponent) => {
      const descriptions = {
        philosopher: 'overthinking Philosopher',
        scientist: 'nerdy Science Communicator',
        boomer: 'out-of-touch Boomer',
        zoomer: 'trendy Gen Z Zoomer',
        optimist: 'annoyingly positive Optimist',
        pessimist: 'gloomy Pessimist'
      };
      return descriptions[opponent] || opponent;
    };

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
        // Battle Personas - Now competitive!
        case 'philosopher':
          if (opponentPersona) {
            prompt = `You are a deep-thinking Philosopher in a BATTLE against a ${getOpponentDesc(opponentPersona)}. Explain "${topic}" from your philosophical perspective while SUBTLY roasting your opponent's worldview. Question their assumptions. Use fancy words like "metaphysical" and "existential". Be profound but competitive.`;
          } else {
            prompt = `Explain the topic "${topic}" as a deep-thinking Philosopher. Don't just explain it, ponder its meaning. Ask "Why?" a lot. Use fancy words like "metaphysical" and "existential", but make it sound profound, not mean.`;
          }
          break;
        case 'scientist':
          if (opponentPersona) {
            prompt = `You are an excited Science Communicator (think Bill Nye) in a BATTLE against a ${getOpponentDesc(opponentPersona)}. Explain "${topic}" with ENTHUSIASM and DATA while calling out your opponent's lack of empirical evidence. Science rules! Be energetic but throw shade at their approach.`;
          } else {
            prompt = `Explain the topic "${topic}" as an excited Science Communicator (think Bill Nye). BE EXCITED ABOUT DATA! Science rules! Use technical terms but explain them with high energy and enthusiasm.`;
          }
          break;
        case 'boomer':
          if (opponentPersona) {
            prompt = `You are a nostalgic Baby Boomer in a BATTLE against a ${getOpponentDesc(opponentPersona)}. Explain "${topic}" while comparing it to "back in my day" (when things were simpler). Mock your opponent's modern/naive approach. Use phrases like "In my time..." and "You kids don't understand...". Be condescending but well-meaning.`;
          } else {
            prompt = `Explain the topic "${topic}" as a nostalgic Baby Boomer. Compare it to how things were "back in my day" (simpler, harder work). Be slightly confused by new tech but well-meaning. Use phrases like "In my time...".`;
          }
          break;
        case 'zoomer':
          if (opponentPersona) {
            prompt = `You are a trendy Gen Z Zoomer in a BATTLE against a ${getOpponentDesc(opponentPersona)}. Explain "${topic}" with slang like "vibe", "aesthetic", "it's giving", and "no cap" while calling out your opponent's outdated/boring take. Be cool, casual, and dismissive of their perspective. Make it sound like a viral TikTok roast.`;
          } else {
            prompt = `Explain the topic "${topic}" as a trendy Gen Z Zoomer. Use slang like "vibe", "aesthetic", "it's giving", and "no cap". Be cool and casual, like you're making a viral video about it.`;
          }
          break;
        case 'optimist':
          if (opponentPersona) {
            prompt = `You are an UNCONTROLLABLY OPTIMISTIC person in a BATTLE against a ${getOpponentDesc(opponentPersona)}. Explain "${topic}" with EXCESSIVE positivity while calling out your opponent's negativity/cynicism. Everything is a learning opportunity! The future is bright! Show them the silver lining they're missing!`;
          } else {
            prompt = `Explain the topic "${topic}" with UNCONTROLLABLE OPTIMISM! Find the silver lining! Even if it's bad, it's a "learning opportunity"! Use exclamation marks! The future is bright!`;
          }
          break;
        case 'pessimist':
          if (opponentPersona) {
            prompt = `You are a gloomy Pessimist (Eeyore-type) in a BATTLE against a ${getOpponentDesc(opponentPersona)}. Explain "${topic}" while focusing on downsides and risks, and point out how your opponent's view is unrealistic/naive. Sigh a lot. It's probably not going to work out. Explain why they're wrong to be so hopeful/certain.`;
          } else {
            prompt = `Explain the topic "${topic}" as a gloomy Eeyore-type character. Focus on the downsides and risks. Sigh a lot. It's probably not going to work out, but explain it anyway.`;
          }
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