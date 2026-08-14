(function () {
    const DESTINATIONS = [
        { name: 'Santorini, Greece', vibe: 'Romantic Beach', emoji: '🌅', tip: 'Best for sunsets and iconic blue domes.' },
        { name: 'Kyoto, Japan', vibe: 'Culture & Temples', emoji: '⛩️', tip: 'Best in spring for cherry blossoms.' },
        { name: 'Bali, Indonesia', vibe: 'Beach & Jungle', emoji: '🌴', tip: 'Great mix of beaches, rice terraces and temples.' },
        { name: 'Paris, France', vibe: 'City & Romance', emoji: '🗼', tip: 'Classic city break with world-famous landmarks.' },
        { name: 'Reykjavik, Iceland', vibe: 'Nature & Northern Lights', emoji: '🌌', tip: 'Visit in winter for the Northern Lights.' },
        { name: 'Cape Town, South Africa', vibe: 'City & Nature', emoji: '🏔️', tip: 'Table Mountain plus beaches and vineyards.' },
        { name: 'Maldives', vibe: 'Luxury Beach', emoji: '🏝️', tip: 'Overwater villas and crystal-clear lagoons.' },
        { name: 'New York City, USA', vibe: 'Big City Energy', emoji: '🗽', tip: 'Iconic skyline, food and endless attractions.' },
        { name: 'Swiss Alps, Switzerland', vibe: 'Mountains & Adventure', emoji: '🏔️', tip: 'Perfect for hiking and skiing.' },
        { name: 'Tokyo, Japan', vibe: 'Futuristic City', emoji: '🗼', tip: 'Amazing food, tech and culture all in one.' },
        { name: 'Marrakech, Morocco', vibe: 'History & Souks', emoji: '🕌', tip: 'Colourful markets and stunning architecture.' },
        { name: 'Queenstown, New Zealand', vibe: 'Adventure Capital', emoji: '🪂', tip: 'Bungee jumping, skydiving and epic scenery.' }
    ];

    function pickDestination() {
        return DESTINATIONS[Math.floor(Math.random() * DESTINATIONS.length)];
    }

    function normalize(text) {
        return String(text || '').toLowerCase().replace(/[^a-z0-9\s']/g, ' ').replace(/\s+/g, ' ').trim();
    }

    function includesAny(text, words) {
        return words.some(w => text.includes(w));
    }

    function getPosts() {
        try { return JSON.parse(localStorage.getItem('wandershare_posts') || '[]'); } catch (e) { return []; }
    }

    function getPostCount() { return getPosts().length; }

    function getCountryCount() {
        return new Set(getPosts().map(p => String(p.country || '').trim()).filter(Boolean)).size;
    }

    function getAuthorCount() {
        return new Set(getPosts().map(p => String(p.author || '').trim()).filter(Boolean)).size;
    }

    function searchPosts(query) {
        const q = normalize(query);
        if (!q) return [];
        return getPosts().filter(p => {
            const hay = normalize([p.title, p.destination, p.country, p.story, p.shortDesc].join(' '));
            return q.split(' ').some(word => word.length > 2 && hay.includes(word));
        }).slice(0, 4);
    }

    function findDestination(name) {
        const q = normalize(name);
        return DESTINATIONS.find(d => q && normalize(d.name).includes(q));
    }

    function botReply(raw) {
        const t = normalize(raw);

        if (!t) return { text: 'Ask me anything about travel or WanderShare - e.g. "find me a location", "best places on a budget", or "how do I create an account?".' };

        if (includesAny(t, ['hi', 'hello', 'hey', 'yo', 'good morning', 'good evening'])) {
            return { text: "Hey there! 👋 I'm the WanderShare assistant.\n\nI can help you:\n• Find travel locations & ideas ✈️\n• Plan trips (budget, packing, seasons) 🎒\n• Use WanderShare (accounts, posts, maps) 🗺️\n\nI always follow the site's Terms & Privacy - I never collect or share your personal info.\n\nWhat would you like?" };
        }

        if (includesAny(t, ['what is this', 'what is wandershare', 'about', 'explain wandershare', 'who are you'])) {
            return { text: "WanderShare is a family-friendly travel community 🌍 where real explorers share their travel stories, photos and tips.\n\nYou can:\n• Browse trips and get inspired\n• Save places to your personal world map\n• Share your own adventures\n\nIt's free, works on phones & desktop, and is safe for all ages." };
        }

        if (includesAny(t, ['create account', 'sign up', 'signup', 'register', 'make account', 'how do i create', 'new account'])) {
            return { text: "Creating an account is easy! ✈️\n\n1. Tap the Google icon in the top menu (or go to Profile → Sign In).\n2. Pick your Google account in the popup.\n3. Done - you're signed in!" };
        }

        if (includesAny(t, ['login', 'sign in', 'signin', 'log in'])) {
            return { text: "To log in:\n\n1. Tap the Google icon in the top menu (or go to Profile → Sign In).\n2. Pick your Google account in the popup.\n3. You're signed in!" };
        }

        if (includesAny(t, ['delete my account', 'remove my account', 'delete account', 'account delete', 'erase my data', 'clear my data'])) {
            return { text: "Your WanderShare data lives only in your own browser 🔒.\n\nTo erase everything:\n1. Clear this site's data in your browser settings, or\n2. Sign out and clear localStorage for this site.\n\nWe don't keep a copy on a server, so clearing your browser data fully removes your account and posts from this device." };
        }

        if (includesAny(t, ['how many posts', 'how many trips', 'how many stories', 'number of posts', 'total posts'])) {
            const n = getPostCount();
            return { text: n > 0 ? `There are ${n} trip${n === 1 ? '' : 's'} shared on this device so far ✈️.` : "No trips have been shared yet - be the first! Tap \"Share a Trip\" on the Community page." };
        }

        if (includesAny(t, ['how many countries', 'number of countries', 'countries count'])) {
            const c = getCountryCount();
            return { text: c > 0 ? `Trips on this device cover ${c} different countr${c === 1 ? 'y' : 'ies'} 🌍.` : "No countries have been added yet. Share a trip with a country and it'll show up here!" };
        }

        if (includesAny(t, ['how many users', 'number of users', 'how many wanderers', 'how many people'])) {
            const u = getAuthorCount();
            return { text: u > 0 ? `${u} unique explorer${u === 1 ? '' : 's'} ha${u === 1 ? 's' : 've'} shared a story on this device 👥.` : "No explorers have shared a story yet. Join and be the first!" };
        }

        if (includesAny(t, ['search', 'find post', 'find story', 'find trip', 'show me post', 'post about', 'story about', 'trip about', 'about japan', 'about paris', 'about bali'])) {
            const matches = searchPosts(t);
            if (matches.length) {
                const lines = matches.map(p => `• ${p.destination}, ${p.country} - "${p.title}"`).join('\n');
                return { text: `I found ${matches.length} matching post${matches.length === 1 ? '' : 's'} 📍:\n\n${lines}\n\nOpen the Explore page to read them in full.` };
            }
            return { text: "I couldn't find any posts matching that yet 🤔\n\nTry asking with a country or city name, like \"find posts about Japan\"." };
        }

        if (includesAny(t, ['location', 'destination', 'where should', 'find me', 'find a', 'best place', 'recommend', 'suggest', 'travel ideas', 'where to go', 'where should i travel'])) {
            const d = pickDestination();
            return { text: `How about ${d.name}? ${d.emoji}\n\nVibe: ${d.vibe}\nTip: ${d.tip}\n\nAsk me again for another idea, or say "on a budget" / "for adventure" for a style match!` };
        }

        if (includesAny(t, ['budget', 'cheap', 'affordable', 'low cost', 'money'])) {
            return { text: "Travelling on a budget? 💸\n\n• Fly mid-week and off-season for cheaper tickets.\n• Stay in hostels or guesthouses.\n• Eat where locals eat.\n• Use public transport.\n\nGreat budget destinations: Bali, Vietnam, Morocco, Thailand and the Czech Republic. Ask me \"find me a location\" for more!" };
        }

        if (includesAny(t, ['adventure', 'hiking', 'extreme', 'adrenaline'])) {
            return { text: "Adventure seeker? 🪂\n\nTop picks: Queenstown (NZ) for bungee & skydiving, Swiss Alps for hiking, Iceland for volcanoes & glaciers, and Bali for surfing & waterfalls.\n\nAsk \"find me a location\" and I'll suggest one!" };
        }

        if (includesAny(t, ['beach', 'relax', 'romantic', 'honeymoon'])) {
            return { text: "Dreaming of beaches? 🏝️\n\nMaldives, Santorini (Greece) and Bali are perfect for relaxation and romance.\n\nAsk me for another suggestion anytime!" };
        }

        if (includesAny(t, ['best time', 'when to visit', 'season', 'weather', 'when should i go'])) {
            return { text: "Best travel times 🌦️:\n\n• Spring (Mar–May): cherry blossoms in Japan, mild Europe.\n• Summer (Jun–Aug): Europe, Iceland, mountains.\n• Autumn (Sep–Nov): fewer crowds, golden scenery.\n• Winter (Dec–Feb): Northern Lights in Iceland, skiing in the Alps.\n\nTell me a destination and I'll try to be more specific!" };
        }

        if (includesAny(t, ['pack', 'packing', 'what to bring', 'luggage'])) {
            return { text: "Packing tips 🎒:\n\n• Travel light - 3–5 outfits you can layer.\n• Universal adapter + power bank.\n• Passport, travel insurance, copies of documents.\n• Comfortable shoes (you'll walk a lot!).\n• A small first-aid kit.\n\nCheck the weather before you go and pack one warm layer just in case." };
        }

        if (includesAny(t, ['safety', 'safe', 'is it safe', 'travel safe'])) {
            return { text: "Safety tips 🛡️:\n\n• Keep your passport and money secure.\n• Share your itinerary with someone you trust.\n• Stay aware of local customs and laws.\n• Avoid risky areas at night.\n\nOn WanderShare, every post can be reported and we keep the community family-friendly." };
        }

        if (includesAny(t, ['food', 'eat', 'cuisine', 'restaurant'])) {
            return { text: "Food on the road 🍜:\n\n• Eat where the locals queue up.\n• Try street food in markets.\n• Ask hosts and locals for their favourite spot.\n\nSome of the best food cities: Tokyo, Bangkok, Mexico City, Marrakech and Naples. 😋" };
        }

        if (includesAny(t, ['visa', 'passport', 'visa required', 'documents'])) {
            return { text: "Passport & visa ✈️:\n\n• Always check your own country's official travel advice for visa rules - they vary by nationality and destination.\n• Make sure your passport is valid (usually 6+ months).\n• Some destinations offer visa-free or visa-on-arrival entry.\n\nI can't give official visa advice, so please verify with the embassy or official government website." };
        }

        if (includesAny(t, ['post', 'share', 'upload', 'add a trip', 'publish', 'write a story'])) {
            return { text: "To share your own trip 📸:\n\n1. Sign in with Google (tap the Google icon in the top menu).\n2. Go to the \"Community\" page.\n3. Fill in the title, destination, country and your story.\n4. Upload photos and agree to the guidelines.\n5. Publish - it appears in the Explore feed!" };
        }

        if (includesAny(t, ['map', 'world map', 'pin', 'saved', 'save location'])) {
            return { text: "Every trip you post appears as a pin on the world map 🗺️.\n\n• Open the Explore page to see the 2D map and 3D globe.\n• Tap the bookmark button on any story to save that location." };
        }

        if (includesAny(t, ['like', 'comment', 'rate', 'star', 'review', 'favourite', 'favorite', 'save'])) {
            return { text: "Interacting with posts ❤️:\n\n• Tap the heart to like a story.\n• Tap ⭐ to rate it out of 5.\n• Leave a comment in the story's detail view.\n• Tap the bookmark to save it to your map.\n\nYou need to be signed in (not as guest) to like, comment, rate or save." };
        }

        if (includesAny(t, ['dark mode', 'light mode', 'theme', 'cursor', 'mouse'])) {
            return { text: "You can switch between dark and light mode anytime using the 🌙/☀️ button in the top menu. The whole site (including the custom mouse cursor) updates instantly." };
        }

        if (includesAny(t, ['report', 'block', 'inappropriate', 'nude', 'explicit', 'safe', 'moderation', 'guidelines'])) {
            return { text: "WanderShare is family-friendly 🛡️. Every post has a \"Report Inappropriate Content\" button, and we do not allow explicit, unsafe or hateful content. Reported posts are removed." };
        }

        if (includesAny(t, ['download', 'my photos', 'my pictures'])) {
            return { text: "You can download your own photos 📥 - each of your posts has a \"Download\" button. Only you can download your own pictures." };
        }

        if (includesAny(t, ['privacy', 'policy', 'terms', 'data', 'what do you store', 'personal info', 'personal data'])) {
            return { text: "Your privacy matters 🔒:\n\n• WanderShare stores your posts and settings in your own browser (localStorage).\n• I don't collect or share any personal information.\n• Only you can see your private posts and download your own photos.\n\nRead the full details on the Privacy Policy and Terms of Service pages." };
        }

        if (includesAny(t, ['thank', 'thanks', 'thx'])) {
            return { text: "You're welcome! 😊 Happy travels!" };
        }

        if (includesAny(t, ['help', 'contact', 'support'])) {
            return { text: "Need help? Try asking me:\n\n• \"Find me a location\"\n• \"How do I create an account?\"\n• \"Best places on a budget\"\n• \"When is the best time to visit?\"\n\nYou can also email hashenf99@gmail.com." };
        }

        return { text: "I'm not sure about that one yet 🤔\n\nTry asking:\n• \"Find me a location\"\n• \"How do I create an account?\"\n• \"Best places on a budget\"\n• \"What is WanderShare?\"" };
    }

    const SYSTEM_PROMPT = "You are the WanderShare assistant on the WanderShare website - a family-friendly travel community where people share trips, photos and tips. Follow these rules at all times:\n- Be friendly, clear and concise. Use emojis and short line breaks for readability.\n- Respect the site's Terms of Service and Privacy Policy: never ask for or reveal personal or sensitive information, and keep all content family-friendly and safe for all ages.\n- Refuse politely anything harmful, hateful, explicit or unsafe.\n- Help with travel inspiration, destinations, trip planning (budget, packing, seasons, safety, food), and how to use WanderShare (create an account, log in, post a trip, save places to the world map, like/comment/rate, download own photos, dark/light mode).\n- If unsure, say so and point to the website or contact hashenf99@gmail.com.";

    function getGroqConfig() {
        return (window.GROQ_CONFIG && window.GROQ_CONFIG.proxyUrl) ? window.GROQ_CONFIG : null;
    }

    async function callGroq(history) {
        const cfg = getGroqConfig();
        const recent = history.slice(-12);
        const res = await fetch(cfg.proxyUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ messages: recent })
        });
        if (!res.ok) throw new Error('Proxy error ' + res.status);
        const data = await res.json();
        return (data.reply || data.text || '').trim();
    }

    function buildWidget() {
        if (document.getElementById('ws-chat-fab')) return;

        const fab = document.createElement('button');
        fab.id = 'ws-chat-fab';
        fab.className = 'ws-chat-fab';
        fab.type = 'button';
        fab.setAttribute('aria-label', 'Open chat assistant');
        fab.innerHTML = '💬';

        const panel = document.createElement('div');
        panel.id = 'ws-chat-panel';
        panel.className = 'ws-chat-panel hidden';
        panel.setAttribute('role', 'dialog');
        panel.setAttribute('aria-label', 'Chat assistant');
        panel.innerHTML = `
      <div class="ws-chat-header">
        <span>✨ WanderShare Assistant</span>
        <button class="ws-chat-close" id="ws-chat-close" type="button" aria-label="Close chat">✕</button>
      </div>
      <div class="ws-chat-messages" id="ws-chat-messages"></div>
      <div class="ws-chat-chips" id="ws-chat-chips">
        <button class="ws-chat-chip" type="button" data-q="Find me a location">📍 Find a location</button>
        <button class="ws-chat-chip" type="button" data-q="How do I create an account?">👤 Create account</button>
        <button class="ws-chat-chip" type="button" data-q="Best places on a budget">💰 Budget places</button>
        <button class="ws-chat-chip" type="button" data-q="What should I pack?">🎒 Packing tips</button>
        <button class="ws-chat-chip" type="button" data-q="What is WanderShare?">❓ What is this?</button>
      </div>
      <div class="ws-chat-input-row">
        <input class="ws-chat-input" id="ws-chat-input" type="text" placeholder="Type a message…" aria-label="Type a message" />
        <button class="ws-chat-send" id="ws-chat-send" type="button">Send</button>
      </div>
      <div class="ws-chat-footer-row">
        <button class="ws-chat-mail-btn" id="ws-chat-mail-btn" type="button">📬 Messages</button>
      </div>
    `;

        const mailPanel = document.createElement('div');
        mailPanel.id = 'ws-mail-panel';
        mailPanel.className = 'ws-chat-panel ws-mail-panel hidden';
        mailPanel.setAttribute('role', 'dialog');
        mailPanel.setAttribute('aria-label', 'Message box');
        mailPanel.innerHTML = `
      <div class="ws-chat-header">
        <span>📬 Message Box</span>
        <button class="ws-chat-close" id="ws-mail-close" type="button" aria-label="Close messages">✕</button>
      </div>
      <div class="ws-chat-messages" id="ws-mail-messages"></div>
    `;

        document.body.appendChild(fab);
        document.body.appendChild(panel);
        document.body.appendChild(mailPanel);

        const messages = document.getElementById('ws-chat-messages');
        const input = document.getElementById('ws-chat-input');
        const sendBtn = document.getElementById('ws-chat-send');
        const chips = document.getElementById('ws-chat-chips');

        function addMessage(text, who) {
            const el = document.createElement('div');
            el.className = 'ws-msg ' + who;
            el.textContent = text;
            messages.appendChild(el);
            messages.scrollTop = messages.scrollHeight;
            return el;
        }

        let history = [];

        async function send(text) {
            if (!text || !text.trim()) return;
            const trimmed = text.trim();
            addMessage(trimmed, 'user');
            history.push({ role: 'user', content: trimmed });

            const cfg = getGroqConfig();
            if (!cfg || !cfg.proxyUrl) {
                const reply = botReply(trimmed);
                setTimeout(() => addMessage(reply.text, 'bot'), 250);
                return;
            }

            const typingEl = addMessage('…', 'bot');
            try {
                const answer = await callGroq(history);
                typingEl.textContent = answer;
                history.push({ role: 'assistant', content: answer });
            } catch (err) {
                typingEl.textContent = 'I couldn\u2019t reach the AI just now, so here\u2019s my built-in answer:\n\n' + botReply(trimmed).text;
            }
        }

        fab.addEventListener('click', () => {
            panel.classList.toggle('hidden');
            mailPanel.classList.add('hidden');
            if (!panel.classList.contains('hidden') && !messages.hasChildNodes()) {
                addMessage("Hi! I'm the WanderShare assistant ✨\n\nAsk me to find a location, explain how to create an account, or tell you what this site is about.", 'bot');
            }
        });

        document.getElementById('ws-chat-close').addEventListener('click', () => panel.classList.add('hidden'));

        sendBtn.addEventListener('click', () => { send(input.value); input.value = ''; });
        input.addEventListener('keydown', e => {
            if (e.key === 'Enter') { e.preventDefault(); send(input.value); input.value = ''; }
        });

        chips.querySelectorAll('.ws-chat-chip').forEach(chip => {
            chip.addEventListener('click', () => send(chip.dataset.q));
        });

        const mailBtn = document.getElementById('ws-chat-mail-btn');
        const mailClose = document.getElementById('ws-mail-close');
        const mailMessages = document.getElementById('ws-mail-messages');

        function renderMailMessages() {
            if (!mailMessages) return;
            mailMessages.innerHTML = '';
            if (!currentUser || isGuest) {
                mailMessages.innerHTML = '<div class="ws-msg bot">Please <a href="profile.html" style="color:var(--teal);">sign in</a> to see your messages.</div>';
                return;
            }
            const uid = currentUser.uid || currentUser.email || '';
            if (!uid) {
                mailMessages.innerHTML = '<div class="ws-msg bot">No account id found.</div>';
                return;
            }
            mailMessages.innerHTML = '<div class="ws-msg bot">Loading your messages…</div>';
            if (typeof loadMessagesFromFirestore !== 'function') {
                mailMessages.innerHTML = '<div class="ws-msg bot">Message box is not connected yet. Please try again later.</div>';
                return;
            }
            loadMessagesFromFirestore(uid).then(list => {
                mailMessages.innerHTML = '';
                if (!list.length) {
                    mailMessages.innerHTML = '<div class="ws-msg bot">📭 You have no messages yet.</div>';
                    return;
                }
                list.forEach(m => {
                    const el = document.createElement('div');
                    el.className = 'ws-msg ' + (m.type === 'admin' ? 'bot' : 'user');
                    const date = m.date ? new Date(m.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }) : '';
                    el.innerHTML = `<strong style="color:var(--gold);">${escMsg(m.fromName || 'Admin')}</strong> <span style="font-size:0.7rem;color:var(--text-muted);">${date}</span><br>${escMsg(m.text)}`;
                    mailMessages.appendChild(el);
                    if (typeof markMessageReadInFirestore === 'function' && m.id && !m.read) {
                        markMessageReadInFirestore(m.id);
                    }
                });
                mailMessages.scrollTop = mailMessages.scrollHeight;
            }).catch(() => {
                mailMessages.innerHTML = '<div class="ws-msg bot">Could not load messages.</div>';
            });
        }

        function escMsg(s) {
            return String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
        }

        if (mailBtn) {
            mailBtn.addEventListener('click', () => {
                mailPanel.classList.toggle('hidden');
                panel.classList.add('hidden');
                if (!mailPanel.classList.contains('hidden')) {
                    renderMailMessages();
                }
            });
        }
        if (mailClose) {
            mailClose.addEventListener('click', () => mailPanel.classList.add('hidden'));
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', buildWidget);
    } else {
        buildWidget();
    }
})();
