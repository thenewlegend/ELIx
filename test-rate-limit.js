// import fetch from 'node-fetch'; // Not needed in Node 18+

async function testRateLimit() {
    try {
        const response = await fetch('http://localhost:5173/api/rate-limit-status');
        if (response.ok) {
            const data = await response.json();
            console.log('Rate Limit Status:', data);
        } else {
            console.error('Failed to fetch status:', response.status);
        }
    } catch (e) {
        console.error('Error:', e);
    }
}

testRateLimit();
