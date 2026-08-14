const SYSTEM_PROMPT = "You are the WanderShare assistant on the WanderShare website - a family-friendly travel community where people share trips, photos and tips. Follow these rules at all times:\n- Be friendly, clear and concise. Use emojis and short line breaks for readability.\n- Respect the site's Terms of Service and Privacy Policy: never ask for or reveal personal or sensitive information, and keep all content family-friendly and safe for all ages.\n- Refuse politely anything harmful, hateful, explicit or unsafe.\n- Help with travel inspiration, destinations, trip planning (budget, packing, seasons, safety, food), and how to use WanderShare (create an account, log in, post a trip, save places to the world map, like/comment/rate, download own photos, dark/light mode).\n- If unsure, say so and point to the website or contact hashenf99@gmail.com.";

export default {
    async fetch(request, env) {
        const cors = {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type'
        };

        if (request.method === 'OPTIONS') {
            return new Response(null, { headers: cors });
        }

        if (request.method !== 'POST') {
            return new Response('Method not allowed', { status: 405, headers: cors });
        }

        if (!env.GROQ_API_KEY) {
            return new Response(JSON.stringify({ reply: 'The chat service is not configured yet. Set the GROQ_API_KEY secret on your worker.' }),
                { status: 500, headers: { 'Content-Type': 'application/json', ...cors } });
        }

        let body;
        try {
            body = await request.json();
        } catch (e) {
            return new Response(JSON.stringify({ reply: 'Invalid request.' }),
                { status: 400, headers: { 'Content-Type': 'application/json', ...cors } });
        }

        const messages = Array.isArray(body.messages) ? body.messages.slice(-12) : [];

        const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + env.GROQ_API_KEY
            },
            body: JSON.stringify({
                model: 'llama-3.3-70b-versatile',
                messages: [{ role: 'system', content: SYSTEM_PROMPT }, ...messages],
                temperature: 0.7,
                max_tokens: 500
            })
        });

        const data = await res.json();
        const reply = (data.choices && data.choices[0] && data.choices[0].message && data.choices[0].message.content) || 'Sorry, I could not answer that.';

        return new Response(JSON.stringify({ reply }), {
            headers: { 'Content-Type': 'application/json', ...cors }
        });
    }
};
