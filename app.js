

const BAD_WORDS = [
  'fuck', 'shit', 'bitch', 'asshole', 'bastard', 'cunt', 'dick', 'pussy', 'cock',
  'whore', 'slut', 'nigger', 'nigga', 'faggot', 'retard', 'damn', 'hell', 'ass',
  'piss', 'crap', 'bollocks', 'wanker', 'twat', 'motherfucker', 'fucker', 'fag',
  'jackass', 'dumbass', 'bullshit', 'horseshit', 'shitty', 'fucking', 'wtf',
  'stfu', 'kys', 'kill yourself', 'rape', 'porn', 'xxx', 'nude', 'naked'
];
function containsBadWords(text) {
  if (!text) return false;
  const lower = text.toLowerCase().replace(/[^a-z0-9\s]/g, '');
  return lower.split(/\s+/).some(w => BAD_WORDS.some(bw => w.includes(bw)));
}

function containsNonEnglish(text) {
  if (!text) return false;
  return /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\u0400-\u052F\u4E00-\u9FFF\u3040-\u30FF\uAC00-\uD7AF\u0E00-\u0E7F\u0F00-\u0FFF\u0900-\u097F\u0980-\u09FF\u0A00-\u0A7F\u0B80-\u0BFF\u0C00-\u0C7F\u0C80-\u0CFF\u0D00-\u0D7F\u0D80-\u0DFF\u0E80-\u0EFF\u10A0-\u10FF\u0590-\u05FF\uFE70-\uFEFF\uFB50-\uFDFF]/.test(String(text));
}

function containsGibberish(text) {
  if (!text) return false;
  const lower = String(text).toLowerCase();
  const words = lower.replace(/[^a-z\s]/g, ' ').split(/\s+/).filter(Boolean);
  if (!words.length) return false;
  const mashPatterns = [
    /^[asdfghjkl]{4,}$/,
    /^[qwertyuiop]{5,}$/,
    /^[zxcvbnm]{4,}$/,
    /(.)\1{3,}/,
    /^[b-df-hj-np-tv-z]{5,}$/
  ];
  let badCount = 0;
  words.forEach(w => {
    if (mashPatterns.some(p => p.test(w))) badCount++;
  });
  return badCount >= 2 && badCount >= Math.ceil(words.length / 2);
}

const EXPLICIT_DOMAINS = [
  'pornhub', 'xvideos', 'xnxx', 'xhamster', 'youporn', 'redtube', 'onlyfans',
  'chaturbate', 'bongacams', 'livejasmin', 'stripchat', 'manyvids', 'hentai',
  'rule34', 'porntrex', 'spankbang', 'tube8', 'eporner', 'nhentai', 'adultfriendfinder',
  'sex', 'porn', 'xxx', 'nude', 'naked', 'milf', 'blowjob', 'handjob', 'cumshot',
  'erotic', 'dildo', 'orgy', 'fuck', 'pussy', 'cock', 'tits', 'boobs', 'anal'
];
function containsExplicitContent(text) {
  if (!text) return false;
  const lower = String(text).toLowerCase();
  return EXPLICIT_DOMAINS.some(kw => lower.includes(kw));
}
function sanitizeText(text) { return text.trim().slice(0, 2000); }
function escHTML(str) {
  return String(str == null ? '' : str).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

const SAMPLE_POSTS = [];

const INSPIRE_DESTINATIONS = [
  { name: 'Santorini, Greece', region: 'Europe', vibe: 'Romantic Beach', image: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=800&q=80', desc: 'Iconic blue domes, volcanic cliffs, and sunsets that will take your breath away.' },
  { name: 'Kyoto, Japan', region: 'Asia', vibe: 'Culture', image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=800&q=80', desc: 'Ancient temples, geisha districts, and bamboo forests from another era.' },
  { name: 'Patagonia, Argentina', region: 'Americas', vibe: 'Adventure', image: 'https://images.unsplash.com/photo-1501854140801-50d01698950b?w=800&q=80', desc: 'The end of the world - glaciers, peaks and wilderness that humbles you.' },
  { name: 'Amalfi Coast, Italy', region: 'Europe', vibe: 'Scenic', image: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?w=800&q=80', desc: 'Cliffside villages, lemon groves and the bluest sea in the Mediterranean.' },
  { name: 'Maldives', region: 'Asia', vibe: 'Beach', image: 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=800&q=80', desc: 'Overwater bungalows, crystal lagoons and coral reefs full of colour.' },
  { name: 'Petra, Jordan', region: 'Asia', vibe: 'History', image: 'https://images.unsplash.com/photo-1587974928442-77dc3e0dba72?w=800&q=80', desc: 'The rose-red city carved into rock - a true wonder of the ancient world.' },
  { name: 'Norwegian Fjords', region: 'Europe', vibe: 'Nature', image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80', desc: 'Dramatic fjords, waterfalls and villages tucked between mountains.' },
  { name: 'Cape Town, South Africa', region: 'Africa', vibe: 'City & Nature', image: 'https://images.unsplash.com/photo-1580060839134-75a5edca2e99?w=800&q=80', desc: 'Table Mountain, beaches, vineyards and a city full of life and colour.' },
  { name: 'Queenstown, New Zealand', region: 'Oceania', vibe: 'Adventure', image: 'https://images.unsplash.com/photo-1507699622108-4be3abd695ad?w=800&q=80', desc: 'The adventure capital of the world - bungee, skydive, ski and kayak.' },
  { name: 'Havana, Cuba', region: 'Americas', vibe: 'Culture', image: 'https://images.unsplash.com/photo-1500759285222-a95626b934cb?w=800&q=80', desc: 'Vintage cars, colourful buildings, salsa music and warm Caribbean spirit.' }
];

let allPosts = [];
let activeFilter = 'All';
let activeVibe = null;
let searchQuery = '';
let selectedTags = [];
let currentInspireIndex = -1;
let ratingStore = {};
let commentStore = {};
let savedLocationsStore = {};
let followingStore = {};
let currentDetailPostId = null;

function isBuiltInPostId(id) {
  const value = String(id || '');
  return value.startsWith('sample-') || value.startsWith('generated-place-');
}

function loadPosts() {
  try {
    const saved = localStorage.getItem('wandershare_posts');
    const stored = saved ? JSON.parse(saved) : [];
    const privatePosts = stored.filter(p => !isBuiltInPostId(p.id) && (p.privacy || 'public') !== 'public');
    allPosts = [...privatePosts];
  } catch {
    allPosts = [];
  }
  loadReports();
}

function loadReports() {
  try {
    const legacy = localStorage.getItem('wandershare_reported');
    if (legacy) {
      const ids = JSON.parse(legacy);
      const reports = getReports();
      ids.forEach(id => {
        if (!reports.some(r => r.postId === id)) {
          const post = allPosts.find(p => p.id === id);
          reports.push({ id: 'report-' + Date.now() + '-' + id, postId: id, postTitle: post ? post.title : 'Post', reporter: 'Community', date: new Date().toISOString() });
        }
      });
      saveReports(reports);
      localStorage.removeItem('wandershare_reported');
    }
  } catch { }
}
function saveUserPosts() {
  try {
    const persistable = allPosts.filter(p => !String(p.id || '').startsWith('sample-') && (p.privacy || 'public') !== 'public');
    localStorage.setItem('wandershare_posts', JSON.stringify(persistable));
  } catch (err) {
    console.warn('Failed to save posts to localStorage:', err);
    if (err && err.name === 'QuotaExceededError') {
      showToast('⚠️ Storage full! Your private post may not persist after closing the browser.', 'error');
    }
  }
}

function loadLikes() {
  try {
    const saved = localStorage.getItem('wandershare_likes');
    if (saved) {
      const likes = JSON.parse(saved);
      allPosts.forEach(p => { if (likes[p.id] !== undefined) p.liked = likes[p.id]; });
    }
  } catch { }
}
function saveLikes() {
  try {
    const likes = {};
    allPosts.forEach(p => { likes[p.id] = p.liked; });
    localStorage.setItem('wandershare_likes', JSON.stringify(likes));
  } catch { }
}

function loadRatings() {
  try {
    const saved = localStorage.getItem('wandershare_ratings');
    ratingStore = saved ? JSON.parse(saved) : {};
  } catch {
    ratingStore = {};
  }
  Object.keys(ratingStore).forEach(postId => {
    const entry = ratingStore[postId];
    const userRatings = entry && typeof entry.userRatings === 'object' ? entry.userRatings : null;
    if (!userRatings || Object.keys(userRatings).length === 0) {
      delete ratingStore[postId];
      return;
    }
    const values = Object.values(userRatings).map(value => Number(value)).filter(value => Number.isFinite(value));
    if (!values.length) {
      delete ratingStore[postId];
      return;
    }
    entry.count = values.length;
    entry.sum = values.reduce((total, value) => total + value, 0);
    ratingStore[postId] = entry;
  });
  saveRatings();
  syncRatingsToPosts();
}

function saveRatings() {
  try {
    localStorage.setItem('wandershare_ratings', JSON.stringify(ratingStore));
  } catch { }
}

function loadComments() {
  try {
    const saved = localStorage.getItem('wandershare_comments');
    commentStore = saved ? JSON.parse(saved) : {};
  } catch {
    commentStore = {};
  }
}

function saveComments() {
  try {
    localStorage.setItem('wandershare_comments', JSON.stringify(commentStore));
  } catch { }
}

function loadSavedLocations() {
  try {
    const saved = localStorage.getItem('wandershare_saved_locations');
    savedLocationsStore = saved ? JSON.parse(saved) : {};
  } catch {
    savedLocationsStore = {};
  }
}

function saveSavedLocations() {
  try {
    localStorage.setItem('wandershare_saved_locations', JSON.stringify(savedLocationsStore));
  } catch { }
}

function getSavedLocationsForCurrentUser() {
  const userKey = getCurrentUserKey();
  if (!userKey) return [];
  return Array.isArray(savedLocationsStore[userKey]) ? savedLocationsStore[userKey] : [];
}

function isPostSaved(postId) {
  const userKey = getCurrentUserKey();
  if (!userKey) return false;
  return getSavedLocationsForCurrentUser().some(item => item.postId === postId);
}

function syncSavedLocationsForCurrentUser() {
  refreshCurrentView();
  if (currentDetailPostId) {
    const post = allPosts.find(p => p.id === currentDetailPostId);
    if (post) updateDetailSaveUI(post);
  }
  if (getPage() === 'profile') renderProfilePage();
}

const REGION_COORDINATES = {
  'Europe': { lat: 48.8566, lng: 2.3522 },
  'Asia': { lat: 34.0479, lng: 100.6197 },
  'Americas': { lat: 19.4326, lng: -99.1332 },
  'Africa': { lat: 0.0236, lng: 37.9062 },
  'Oceania': { lat: -25.2744, lng: 133.7751 }
};

function getLocationCoords(destination, country, region) {
  let coords = getDestinationCoordinates(destination, country);
  if (coords) return coords;
  const str = `${destination}, ${country}`;
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  const base = REGION_COORDINATES[region] || { lat: 20, lng: 0 };
  const latOffset = ((Math.abs(hash) % 120) / 10) - 6;
  const lngOffset = (((Math.abs(hash) >> 3) % 160) / 10) - 8;
  return {
    lat: Math.max(-75, Math.min(75, base.lat + latOffset)),
    lng: Math.max(-170, Math.min(170, base.lng + lngOffset))
  };
}

function getSavedLocationEntry(post) {
  const coords = getLocationCoords(post.destination, post.country, post.region);
  return {
    postId: post.id,
    title: post.title,
    destination: post.destination,
    country: post.country,
    region: post.region,
    image: post.image,
    author: post.author,
    savedAt: new Date().toISOString(),
    lat: coords.lat,
    lng: coords.lng
  };
}

function toggleSaveLocation(postId) {
  if (!currentUser || isGuest) {
    showToast('Sign in or sign up to save locations.', 'error');
    localStorage.setItem('ws_return_to', window.location.href);
    return;
  }

  const post = allPosts.find(item => item.id === postId);
  if (!post) return;

  const userKey = getCurrentUserKey();
  const saved = getSavedLocationsForCurrentUser();
  const index = saved.findIndex(item => item.postId === postId);

  if (index >= 0) {
    saved.splice(index, 1);
    showToast('Removed from saved locations.', 'success');
  } else {
    saved.unshift(getSavedLocationEntry(post));
    showToast('Saved to your profile for later.', 'success');
  }

  savedLocationsStore[userKey] = saved;
  saveSavedLocations();
  syncSavedLocationsForCurrentUser();
}

function getCurrentUserKey() {
  if (!currentUser) return null;
  return currentUser.uid || currentUser.email || currentUser.displayName || null;
}

function roundRating(value) {
  return Math.round(value * 10) / 10;
}

function formatRating(value) {
  return Number.isFinite(value) ? value.toFixed(1) : '0.0';
}

function syncRatingsToPosts() {
  const userKey = getCurrentUserKey();
  allPosts.forEach(post => {
    const entry = ratingStore[post.id];
    if (entry) {
      post.ratingCount = entry.count || 0;
      post.rating = entry.count ? roundRating(entry.sum / entry.count) : 0;
      post.userRating = userKey && entry.userRatings ? (entry.userRatings[userKey] || 0) : 0;
    } else {
      post.rating = Number(post.rating) || 0;
      post.ratingCount = Number(post.ratingCount) || 0;
      post.userRating = 0;
    }
  });
}

function refreshCurrentView() {
  const page = getPage();
  if (typeof updateDynamicHeroStats === 'function') updateDynamicHeroStats();
  if (page === 'home') renderPreviewPosts();
  if (page === 'explore') {
    renderFeed();
    if (document.getElementById('explore-world-map') && typeof initExploreWorldMap === 'function') {
      initExploreWorldMap();
    }
  }
}

function syncRatingsForCurrentUser() {
  syncRatingsToPosts();
  refreshCurrentView();
  if (currentDetailPostId) {
    const post = allPosts.find(p => p.id === currentDetailPostId);
    if (post) {
      updateDetailRatingUI(post);
      updateDetailCommentUI(post);
    }
  }
}

const $ = id => document.getElementById(id);
const qs = sel => document.querySelector(sel);
const qsa = sel => document.querySelectorAll(sel);

function getPage() {
  const path = window.location.pathname.toLowerCase();
  if (path.includes('inspire')) return 'inspire';
  if (path.includes('explore')) return 'explore';
  if (path.includes('countries')) return 'countries';
  if (path.includes('community')) return 'community';
  if (path.includes('profile')) return 'profile';
  return 'home';
}

function loadFollowing() {
  try {
    const saved = localStorage.getItem('wandershare_following');
    followingStore = saved ? JSON.parse(saved) : {};
  } catch { followingStore = {}; }
}

function saveFollowing() {
  try { localStorage.setItem('wandershare_following', JSON.stringify(followingStore)); } catch { }
}

function getFollowingAuthors() {
  const userKey = getCurrentUserKey();
  if (!userKey) return [];
  return Array.isArray(followingStore[userKey]) ? followingStore[userKey] : [];
}

function isFollowing(authorName) {
  return getFollowingAuthors().includes(authorName);
}

function getFollowersCount(authorName) {

  let count = 0;
  Object.values(followingStore).forEach(arr => {
    if (Array.isArray(arr) && arr.includes(authorName)) count++;
  });
  return count;
}

function toggleFollow(authorName) {
  if (!currentUser || isGuest) {
    showToast('Sign in to follow explorers.', 'error');
    localStorage.setItem('ws_return_to', window.location.href);
    return;
  }
  const userKey = getCurrentUserKey();
  const following = getFollowingAuthors();
  const idx = following.indexOf(authorName);
  if (idx >= 0) {
    following.splice(idx, 1);
    showToast(`Unfollowed ${authorName}.`, 'success');
  } else {
    following.push(authorName);
    showToast(`Now following ${authorName}! 🎉`, 'success');
  }
  followingStore[userKey] = following;
  saveFollowing();
  refreshCurrentView();
  if (getPage() === 'profile') renderProfilePage();
}

document.addEventListener('DOMContentLoaded', () => {
  initAntiImageSaveProtection();
  populateCountrySelects();
  loadPosts();
  loadLikes();
  loadRatings();
  loadComments();
  loadSavedLocations();
  loadFollowing();
  syncRatingsToPosts();
  initNavbar();
  initMobileNav();
  setActiveNavLink();
  initScrollAnimations();
  initTopMembersSection();
  initPostDetailModal();

  const page = getPage();
  if (page === 'home') initHomePage();
  if (page === 'inspire') initInspirePage();
  if (page === 'explore') initExplorePage();
  if (page === 'countries') initCountriesPage();
  if (page === 'community') initCommunityPage();
  if (page === 'profile') initProfilePageWhenAuthReady();
  renderHomeFeatured();
  if (typeof startFirestoreSync === 'function') startFirestoreSync();
  setTimeout(() => { if (typeof loadCustomDisplayNameFromCloud === 'function') loadCustomDisplayNameFromCloud(); }, 1200);
});

function initAntiImageSaveProtection() {

  document.addEventListener('contextmenu', e => {
    e.preventDefault();
    showToast('🔒 Right-click is disabled on WanderShare to protect content creators.', 'error');
  });
  document.addEventListener('dragstart', e => {
    if (e.target.tagName === 'IMG') {
      e.preventDefault();
    }
  });
}

function initNavbar() {
  const nav = qs('.navbar');
  if (!nav) return;
}

function initMobileNav() {
  const nav = qs('.navbar');
  const links = qs('.nav-links');
  if (!nav || !links || qs('.nav-hamburger')) return;

  const btn = document.createElement('button');
  btn.className = 'nav-hamburger';
  btn.setAttribute('aria-label', 'Open menu');
  btn.setAttribute('aria-expanded', 'false');
  btn.innerHTML = '<span></span><span></span><span></span>';
  const right = nav.querySelector('.nav-right');
  if (right) right.appendChild(btn); else nav.appendChild(btn);

  if (!links.querySelector('.nav-mobile-login')) {
    const loginItem = document.createElement('li');
    loginItem.className = 'nav-mobile-login';
    loginItem.innerHTML = '<a href="profile.html">🔑 Login / Sign Up</a>';
    links.appendChild(loginItem);
  }

  // Dark / light mode toggle inside the mobile menu
  if (!links.querySelector('.nav-mobile-theme')) {
    const themeItem = document.createElement('li');
    themeItem.className = 'nav-mobile-theme';
    themeItem.innerHTML = `
      <button type="button" class="theme-toggle" aria-label="Switch theme" title="Switch theme">
        ${document.documentElement.getAttribute('data-theme') === 'light' ? '🌙' : '☀️'}
      </button>
      <span>Dark / Light Mode</span>`;
    links.appendChild(themeItem);
  }

  btn.addEventListener('click', () => {
    const open = links.classList.toggle('mobile-open');
    btn.classList.toggle('open', open);
    btn.setAttribute('aria-expanded', open ? 'true' : 'false');
    document.body.classList.toggle('nav-open', open);
  });

  links.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      links.classList.remove('mobile-open');
      btn.classList.remove('open');
      btn.setAttribute('aria-expanded', 'false');
      document.body.classList.remove('nav-open');
    });
  });
}

function setActiveNavLink() {
  const page = getPage();
  const map = { home: 'nav-home', inspire: 'nav-inspire', explore: 'nav-explore', countries: 'nav-countries', community: 'nav-community', profile: 'nav-profile' };
  const el = $(map[page]);
  if (el) el.classList.add('nav-active');
}

function initScrollAnimations() {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('visible'); observer.unobserve(e.target); }
    });
  }, { threshold: 0.1 });
  qsa('.fade-in').forEach(el => observer.observe(el));
}

function initPageHeroParallax() {
  const content = document.querySelector('.page-hero-content');
  const section = document.querySelector('.page-hero');
  if (!content || !section) return;
  section.addEventListener('mousemove', (e) => {
    const rect = section.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    content.style.transform = `translate(${x * 8}px, ${y * 8}px)`;
  });
  section.addEventListener('mouseleave', () => {
    content.style.transform = 'translate(0, 0)';
    content.style.transition = 'transform 0.5s ease';
    setTimeout(() => { content.style.transition = ''; }, 500);
  });
}

function updateDynamicHeroStats() {
  const photoEl = $('hero-stat-photos');
  const accountEl = $('hero-stat-accounts');

  let totalPhotos = 0;
  allPosts.forEach(p => {
    const imgs = (Array.isArray(p.images) && p.images.length) ? p.images : (p.image ? [p.image] : []);
    totalPhotos += imgs.length;
  });

  const totalAccounts = (typeof getTotalAccounts === 'function') ? getTotalAccounts() : 0;

  if (photoEl) {
    photoEl.dataset.count = totalPhotos;
    photoEl.dataset.suffix = '';
    photoEl.textContent = totalPhotos.toLocaleString();
  }
  if (accountEl) {
    accountEl.dataset.count = totalAccounts;
    accountEl.dataset.suffix = '';
    accountEl.textContent = totalAccounts.toLocaleString();
  }
}

function animateStats() {
  updateDynamicHeroStats();
  const statNums = qsa('.stat-num[data-count]');
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseInt(el.dataset.count) || 0;
        const suffix = el.dataset.suffix || '';
        let current = 0;
        const step = Math.max(1, Math.ceil(target / 40));
        const timer = setInterval(() => {
          current = Math.min(current + step, target);
          el.textContent = current.toLocaleString() + suffix;
          if (current >= target) {
            el.textContent = target.toLocaleString() + suffix;
            clearInterval(timer);
          }
        }, 25);
        observer.unobserve(el);
      }
    });
  });
  statNums.forEach(el => observer.observe(el));
}

function initHomePage() {
  animateStats();
  renderPreviewPosts();
  renderTopMembers();
}

function renderPreviewPosts() {
  const grid = $('preview-grid');
  if (!grid) return;
  const posts = allPosts.filter(p => !p.reported && !(typeof isUserBanned === 'function' && isUserBanned(p.author))).slice(0, 6);
  grid.innerHTML = '';
  if (posts.length === 0) {
    grid.innerHTML = `<div class="empty-state"><div class="empty-icon">🗺️</div><p>No trips yet. <a href="community.html" style="color:var(--teal);">Share the first adventure!</a></p></div>`;
    return;
  }
  posts.forEach((post, i) => {
    const card = createPostCard(post, i);
    grid.appendChild(card);
  });
}

function initInspirePage() {
  const btn = $('inspire-btn');
  if (btn) btn.addEventListener('click', showRandomInspireCard);
  showRandomInspireCard();
  initVibeCards();
  renderFeaturedDestinations();
}

function showRandomInspireCard() {
  const img = $('inspire-img');
  const name = $('inspire-name');
  const vibe = $('inspire-vibe');
  const desc = $('inspire-desc');
  if (!img) return;

  const fromPosts = allPosts.filter(post => !post.reported);
  const pool = fromPosts.map(post => ({
    name: post.destination + ', ' + post.country,
    region: post.region,
    country: (post.tags || []).join(' · '),
    image: post.image,
    desc: post.shortDesc,
    destination: post.destination
  }));

  if (pool.length === 0) {
    img.src = 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=800&q=80';
    if (name) name.textContent = 'No destinations yet';
    if (vibe) vibe.textContent = 'Explore the community feed';
    if (desc) desc.textContent = 'Browse travel stories or share your own adventure to get started.';
    const btnLink = document.querySelector('.inspire-random-card .btn-secondary');
    if (btnLink) btnLink.style.display = 'none';
    return;
  }

  let idx;
  do { idx = Math.floor(Math.random() * pool.length); }
  while (idx === currentInspireIndex && pool.length > 1);
  currentInspireIndex = idx;
  const dest = pool[idx];
  img.style.opacity = '0';
  setTimeout(() => {
    img.src = dest.image;
    img.onload = () => { img.style.transition = 'opacity 0.5s'; img.style.opacity = '1'; };
    if (name) name.textContent = dest.name;
    if (vibe) vibe.textContent = `${dest.region}${dest.country ? ` · ${dest.country}` : ''}`;
    if (desc) desc.textContent = dest.desc;

    const btnLink = document.querySelector('.inspire-random-card .btn-secondary');
    if (btnLink) {
      btnLink.style.display = 'inline-block';
      btnLink.href = `explore.html?search=${encodeURIComponent(dest.destination)}`;
    }
  }, 250);
}

function initVibeCards() {
  qsa('.vibe-card').forEach(card => {
    card.addEventListener('click', () => {
      const vibe = card.dataset.vibe;
      qsa('.vibe-card').forEach(c => c.classList.remove('active'));
      card.classList.add('active');

      window.location.href = `explore.html?vibe=${encodeURIComponent(vibe)}`;
    });
    card.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') card.click();
    });
  });
}

function renderFeaturedDestinations() {
  const grid = $('featured-grid');
  if (!grid) return;
  const posts = allPosts.filter(post => !post.reported && !(typeof isUserBanned === 'function' && isUserBanned(post.author)));
  const featured = posts.slice(0, 6);

  grid.innerHTML = '';
  if (featured.length === 0) {
    grid.innerHTML = `<div class="empty-state"><div class="empty-icon">✨</div><p>Featured destinations will appear here once trips are shared.</p></div>`;
    return;
  }

  featured.forEach(post => {
    const card = document.createElement('div');
    card.className = 'featured-card';
    card.innerHTML = `
      <img src="${post.image}" alt="${post.destination}" loading="lazy" />
      <div class="featured-badge">${post.region}</div>
      <div class="featured-card-overlay">
        <h3>${post.destination}</h3>
        <p>${post.country}</p>
      </div>`;
    card.addEventListener('click', () => {
      window.location.href = `explore.html?search=${encodeURIComponent(post.destination)}`;
    });
    grid.appendChild(card);
  });
}

function renderHomeFeatured() {
  const grid = $('home-featured-grid');
  if (!grid) return;
  grid.innerHTML = '';
  INSPIRE_DESTINATIONS.slice(0, 6).forEach(d => {
    const card = document.createElement('a');
    card.className = 'featured-card';
    card.href = 'explore.html?search=' + encodeURIComponent(d.name.split(',')[0].trim());
    card.setAttribute('role', 'listitem');
    card.setAttribute('aria-label', 'View trips in ' + d.name);
    card.innerHTML = `
      <img src="${d.image}" alt="${d.name}" loading="lazy" />
      <div class="featured-badge">${d.region}</div>
      <div class="featured-card-overlay">
        <h3>${d.name}</h3>
        <p>${d.vibe}</p>
      </div>`;
    grid.appendChild(card);
  });
}

let exploreMapInstance = null;

function initExploreWorldMap() {
  const mapContainer = document.getElementById('explore-world-map');
  const countEl = document.getElementById('explore-map-pin-count');
  if (!mapContainer || typeof L === 'undefined') return;

  if (exploreMapInstance) {
    exploreMapInstance.remove();
    exploreMapInstance = null;
  }

  const publicPosts = allPosts.filter(p => !p.reported && p.destination && p.country && (p.privacy !== 'only-me'));

  if (countEl) {
    countEl.classList.add('loading-pulse');
    countEl.textContent = `📍 Loading map pins…`;
  }

  const maxBounds = L.latLngBounds(L.latLng(-65, -1000), L.latLng(80, 1000));

  exploreMapInstance = L.map(mapContainer, {
    center: [20, 0],
    zoom: 2,
    minZoom: 2,
    maxZoom: 10,
    maxBounds: maxBounds,
    maxBoundsViscosity: 1.0
  });

  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    maxZoom: 19
  }).addTo(exploreMapInstance);

  exploreMapInstance.on('drag', function () {
    const center = exploreMapInstance.getCenter();
    const lockedLat = Math.max(-40, Math.min(60, center.lat));
    if (center.lat !== lockedLat) {
      exploreMapInstance.panTo([lockedLat, center.lng], { animate: false });
    }
  });

  publicPosts.forEach(post => {
    const coords = getLocationCoords(post.destination, post.country, post.region);
    const customIcon = L.divIcon({
      className: 'custom-map-pin posted-pin',
      html: `<span>✈️</span>`,
      iconSize: [28, 28],
      iconAnchor: [14, 14]
    });

    const marker = L.marker([coords.lat, coords.lng], { icon: customIcon }).addTo(exploreMapInstance);

    const popupHtml = `
      <div style="font-family:'Outfit',sans-serif; width:200px;">
        <img src="${post.image}" alt="${post.title}" style="width:100%; height:110px; object-fit:cover; border-radius:8px; margin-bottom:6px;" />
        <div style="font-size:0.7rem; font-weight:700; color:#E5C878; text-transform:uppercase;">${post.region}</div>
        <h4 style="font-size:0.95rem; font-weight:700; margin:2px 0 4px; color:#EDEBE4; line-height:1.2;">${post.title}</h4>
        <div style="font-size:0.78rem; color:#A7AFC9; margin-bottom:8px;">📍 ${post.destination}, ${post.country}</div>
        <button onclick="openPostDetailById('${post.id}')" style="width:100%; padding:0.4rem; background:linear-gradient(135deg,#F3DFA5,#E5C878 50%,#C19A45); color:#241C0C; font-weight:700; font-size:0.8rem; border-radius:6px; border:none; cursor:pointer;">📖 Read Story</button>
      </div>`;

    marker.bindPopup(popupHtml);
  });

  if (countEl) {
    countEl.classList.remove('loading-pulse');
    countEl.textContent = `📍 ${publicPosts.length} Locations Pinned`;
  }
}

function initExplorePage() {
  initPageHeroParallax();

  const params = new URLSearchParams(window.location.search);
  if (params.get('vibe')) {
    activeVibe = params.get('vibe');
  }
  if (params.get('search')) {
    searchQuery = params.get('search');
    const inp = $('search-input');
    if (inp) inp.value = searchQuery;
  }

  renderFeed();
  initFilterTabs();
  initSearch();
  initExploreWorldMap();
}

function canViewPost(post) {
  const privacy = post.privacy || 'public';
  if (privacy === 'public') return true;
  const myDisplayName = currentUser ? getDisplayName() : null;
  if (privacy === 'only-me') {
    return myDisplayName && post.author === myDisplayName;
  }
  if (privacy === 'followers') {

    if (myDisplayName && post.author === myDisplayName) return true;

    return isFollowing(post.author);
  }
  return true;
}

function getFilteredPosts() {
  const followingAuthors = getFollowingAuthors();

  const filtered = allPosts.filter(post => {

    if (!canViewPost(post)) return false;

    if (activeFilter === 'Following') {
      if (!followingAuthors.includes(post.author)) return false;
    } else if (activeFilter === 'Top Rated') {
      if ((post.rating || 0) < 4.5) return false;
    } else if (activeFilter !== 'All' && post.region !== activeFilter) return false;

    if (activeVibe && !post.tags.includes(activeVibe)) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      if (!`${post.title} ${post.destination} ${post.country} ${post.shortDesc}`.toLowerCase().includes(q)) return false;
    }
    if (post.reported) return false;
    if (typeof isUserBanned === 'function' && isUserBanned(post.author)) return false;
    return true;
  });

  if (activeFilter === 'Top Rated') {
    return filtered.sort((left, right) => (right.rating || 0) - (left.rating || 0) || (right.ratingCount || 0) - (left.ratingCount || 0));
  }

  return filtered;
}

function renderFeed() {
  const grid = $('posts-grid');
  if (!grid) return;
  const filtered = getFilteredPosts();
  grid.innerHTML = '';
  if (filtered.length === 0) {
    grid.innerHTML = `<div class="empty-state"><div class="empty-icon">🗺️</div><p>No trips found. Be the first to share one!</p></div>`;
    return;
  }
  filtered.forEach((post, i) => grid.appendChild(createPostCard(post, i)));
}

function initFilterTabs() {
  qsa('.filter-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      qsa('.filter-tab').forEach(t => { t.classList.remove('active'); t.setAttribute('aria-selected', 'false'); });
      tab.classList.add('active');
      tab.setAttribute('aria-selected', 'true');
      activeFilter = tab.dataset.region;
      renderFeed();
    });
  });
}

function initSearch() {
  const input = $('search-input');
  if (!input) return;
  input.addEventListener('input', () => { searchQuery = input.value.trim(); renderFeed(); });
}

function initCommunityPage() {
  initShareForm();
  syncCommunityAuthorField();
  initOwnerPanel();
}

let sharePhotoFiles = [];

function initShareForm() {
  const form = $('share-form');
  const imgInput = $('photo-input');
  const preview = $('photo-preview');
  const gallery = $('photos-preview-gallery');
  const zone = $('upload-zone');

  if (!form) return;

  function renderPhotoGallery() {
    if (!gallery) return;
    gallery.innerHTML = '';

    sharePhotoFiles.forEach((file, index) => {
      const thumb = document.createElement('div');
      thumb.className = 'photo-thumb';
      const img = document.createElement('img');
      img.alt = `Preview ${index + 1}`;
      const reader = new FileReader();
      reader.onload = e => { img.src = e.target.result; };
      reader.readAsDataURL(file);
      const removeBtn = document.createElement('button');
      removeBtn.type = 'button';
      removeBtn.className = 'photo-thumb-remove';
      removeBtn.textContent = '✕';
      removeBtn.setAttribute('aria-label', 'Remove photo');
      removeBtn.addEventListener('click', e => {
        e.preventDefault();
        e.stopPropagation();
        sharePhotoFiles.splice(index, 1);
        renderPhotoGallery();
      });
      thumb.appendChild(img);
      thumb.appendChild(removeBtn);
      gallery.appendChild(thumb);
    });
    gallery.style.display = sharePhotoFiles.length ? 'flex' : 'none';
    if (preview) preview.classList.remove('visible');
  }

  function addPhotoFiles(files) {
    const fileList = Array.from(files);
    const images = fileList.filter(file => file.type.startsWith('image/'));

    images.forEach(file => {
      if (file.size > 5 * 1024 * 1024) {
        showToast('Each image must be under 5MB.', 'error');
        return;
      }
      if (sharePhotoFiles.length >= 6) {
        showToast('You can upload up to 6 photos per post.', 'error');
        return;
      }
      sharePhotoFiles.push(file);
    });

    if (!images.length) {
      showToast('Please upload image files only.', 'error');
      return;
    }
    renderPhotoGallery();
  }

  if (imgInput) {
    imgInput.addEventListener('change', () => {
      addPhotoFiles(imgInput.files);
      imgInput.value = '';
    });
  }

  if (zone) {
    zone.addEventListener('dragover', e => { e.preventDefault(); zone.classList.add('dragover'); });
    zone.addEventListener('dragleave', () => zone.classList.remove('dragover'));
    zone.addEventListener('drop', e => {
      e.preventDefault(); zone.classList.remove('dragover');
      addPhotoFiles(e.dataTransfer.files);
    });
  }

  qsa('.tag-toggle').forEach(btn => {
    btn.addEventListener('click', () => {
      btn.classList.toggle('selected');
      const tag = btn.dataset.tag;
      if (btn.classList.contains('selected')) { if (!selectedTags.includes(tag)) selectedTags.push(tag); }
      else { selectedTags = selectedTags.filter(t => t !== tag); }
    });
  });

  form.addEventListener('submit', handleFormSubmit);
}

function getDisplayName() {
  if (!currentUser) return '';
  const userKey = getCurrentUserKey();
  if (userKey) {
    try {
      const names = JSON.parse(localStorage.getItem('wandershare_display_names') || '{}');
      if (names[userKey]) return String(names[userKey]).trim().slice(0, 60);
    } catch { }
  }
  return currentUser.displayName || currentUser.email?.split('@')[0] || 'Traveller';
}

function getCustomDisplayName() {
  if (!currentUser) return '';
  const userKey = getCurrentUserKey();
  if (!userKey) return '';
  try {
    const names = JSON.parse(localStorage.getItem('wandershare_display_names') || '{}');
    return names[userKey] || '';
  } catch { return ''; }
}

function setCustomDisplayName(newName) {
  const userKey = getCurrentUserKey();
  if (!userKey) return false;
  const clean = String(newName || '').trim().slice(0, 60);
  if (!clean) return false;
  const oldName = getDisplayName();
  try {
    const names = JSON.parse(localStorage.getItem('wandershare_display_names') || '{}');
    names[userKey] = clean;
    localStorage.setItem('wandershare_display_names', JSON.stringify(names));
  } catch { }
  if (typeof saveDisplayNameToFirestore === 'function') {
    saveDisplayNameToFirestore(userKey, clean);
  }
  if (oldName && oldName !== clean) {
    allPosts.forEach(p => {
      if (p.authorKey === userKey || p.author === oldName) p.author = clean;
    });
    saveUserPosts();
    allPosts.forEach(p => {
      if ((p.privacy || 'public') === 'public' && typeof savePostToFirestore === 'function') {
        savePostToFirestore(p);
      }
    });
  }
  if (typeof updateNavbarAuth === 'function') updateNavbarAuth();
  refreshCurrentView();
  if (getPage() === 'profile' && typeof renderProfilePage === 'function') renderProfilePage();
  return true;
}

function loadCustomDisplayNameFromCloud() {
  const userKey = getCurrentUserKey();
  if (!userKey) return;
  if (typeof loadDisplayNameFromFirestore !== 'function') return;
  loadDisplayNameFromFirestore(userKey).then(cloudName => {
    if (!cloudName) return;
    try {
      const names = JSON.parse(localStorage.getItem('wandershare_display_names') || '{}');
      if (names[userKey] === cloudName) return;
      names[userKey] = cloudName;
      localStorage.setItem('wandershare_display_names', JSON.stringify(names));
    } catch { }
    if (typeof updateNavbarAuth === 'function') updateNavbarAuth();
    refreshCurrentView();
    if (getPage() === 'profile' && typeof renderProfilePage === 'function') renderProfilePage();
  }).catch(() => { });
}

function startEditDisplayName() {
  const nameEl = $('profile-display-name');
  if (!nameEl || !currentUser) return;
  const current = getDisplayName();
  const editRow = $('profile-name-edit-row');
  if (editRow) {
    editRow.style.display = 'flex';
    const input = $('profile-name-input');
    if (input) {
      input.value = current;
      input.focus();
      input.select();
    }
  }
}

function saveDisplayNameEdit() {
  const input = $('profile-name-input');
  if (!input) return;
  const newName = input.value.trim();
  if (!newName) {
    showToast('Please enter your name.', 'error');
    return;
  }
  if (containsNonEnglish(newName) || containsGibberish(newName)) {
    showToast('🚫 Please use a correct English name.', 'error');
    return;
  }
  const ok = setCustomDisplayName(newName);
  if (ok) {
    showToast('✅ Name updated!', 'success');
    const editRow = $('profile-name-edit-row');
    if (editRow) editRow.style.display = 'none';
  }
}

function syncCommunityAuthorField() {
  const field = $('trip-author');
  if (!field) return;

  if (currentUser && !isGuest) {
    const name = getDisplayName();
    field.value = name;
    field.readOnly = true;
    field.dataset.autofilled = 'true';
    field.placeholder = name;
    field.title = 'Your signed-in account name will be used on the post.';
  } else {
    field.readOnly = false;
    field.dataset.autofilled = 'false';
    field.placeholder = 'e.g. Sofia M.';
    field.title = '';
    if (!field.value || field.dataset.autofilled === 'true') field.value = '';
  }
}

function validatePostContent(data, guidelinesId = 'agree-guidelines') {
  const fields = [data.title, data.destination, data.country, data.author, data.shortDesc, data.story];
  for (const f of fields) {
    if (containsBadWords(f) || containsExplicitContent(f)) return { ok: false, msg: '🚫 Your post contains words or links that are not allowed on WanderShare.' };
    if (containsNonEnglish(f)) return { ok: false, msg: '🚫 Please write your post in English only.' };
    if (containsGibberish(f)) return { ok: false, msg: '🚫 Please write your post in correct English. Check your spelling.' };
  }
  if (!data.title.trim()) return { ok: false, msg: 'Please enter a trip title.' };
  if (!data.destination.trim()) return { ok: false, msg: 'Please enter a destination.' };
  if (!data.country.trim()) return { ok: false, msg: 'Please enter a country.' };
  if (!data.author.trim()) return { ok: false, msg: 'Please enter your name.' };
  if (!data.region) return { ok: false, msg: 'Please select a region.' };
  if (!data.shortDesc.trim()) return { ok: false, msg: 'Please write a short description.' };
  const guidelinesEl = $(guidelinesId);
  if (!guidelinesEl || !guidelinesEl.checked) return { ok: false, msg: 'You must agree to the Community Guidelines before posting.' };
  return { ok: true };
}

function compressImageFile(file, maxDim = 900, quality = 0.75) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = e => {
      const img = new Image();
      img.onload = () => {
        try {
          let { width, height } = img;
          const scale = Math.min(1, maxDim / Math.max(width, height));
          if (scale < 1) {
            width = Math.round(width * scale);
            height = Math.round(height * scale);
          }
          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx.fillStyle = '#fff';
          ctx.fillRect(0, 0, width, height);
          ctx.drawImage(img, 0, 0, width, height);
          resolve(canvas.toDataURL('image/jpeg', quality));
        } catch (err) {
          reject(err);
        }
      };
      img.onerror = () => reject(new Error('image load failed'));
      img.src = e.target.result;
    };
    reader.onerror = () => reject(reader.error || new Error('read failed'));
    reader.readAsDataURL(file);
  });
}

async function buildPostImages(previewEl) {
  if (sharePhotoFiles.length) {
    const images = [];
    for (const file of sharePhotoFiles.slice(0, 6)) {
      try {
        images.push(await compressImageFile(file));
      } catch (err) {
        console.warn('Failed to read image file:', err);
        showToast('⚠️ Could not read one of the images. Using fallback.', 'error');
        images.push(getRandomFallback());
      }
    }
    return images;
  }
  if (previewEl && previewEl.classList.contains('visible') && previewEl.src) {
    return [previewEl.src];
  }
  return [getRandomFallback()];
}

function isDuplicatePost({ title, story, destination, images }) {
  const norm = (s) => String(s || '').trim().toLowerCase().replace(/\s+/g, ' ');
  const newStory = norm(story);
  const newTitle = norm(title);
  const newDest = norm(destination);
  const newImages = (images || []).map(i => String(i || '').slice(0, 300));

  return allPosts.some(p => {
    const sameText = (newStory && norm(p.story) === newStory) || (newTitle && norm(p.title) === newTitle);
    if (sameText) return true;
    const existingImages = (Array.isArray(p.images) && p.images.length ? p.images : [p.image]).map(i => String(i || '').slice(0, 300));
    const samePhoto = newImages.some(ni => ni && existingImages.some(ei => ei && ei === ni));
    if (samePhoto) return true;
    if (newDest && norm(p.destination) === newDest && newTitle && norm(p.title) === newTitle) return true;
    return false;
  });
}

function handleFormSubmit(e) {
  e.preventDefault();
  if (!currentUser || isGuest) {
    showToast('Please sign in with a real account to share your adventure.', 'error');
    return;
  }
  if (typeof isUserBanned === 'function' && isUserBanned(getDisplayName())) {
    showToast('🚫 You have been banned and can no longer post.', 'error');
    return;
  }
  const title = sanitizeText($('trip-title').value);
  const destination = sanitizeText($('trip-destination').value);
  const country = sanitizeText($('trip-country').value);
  const region = $('trip-region').value;
  const authorInput = $('trip-author');
  const author = sanitizeText((currentUser && !isGuest) ? getDisplayName() : authorInput.value);
  const shortDesc = sanitizeText($('trip-short').value);
  const story = sanitizeText($('trip-story').value);
  const preview = $('photo-preview');

  const data = { title, destination, country, region, author, shortDesc, story };
  const v = validatePostContent(data);
  if (!v.ok) { showToast(v.msg, 'error'); return; }

  handleFormSubmitAsync({ title, destination, country, region, author, shortDesc, story, preview });
}

async function handleFormSubmitAsync(formData) {
  const { title, destination, country, region, author, shortDesc, story, preview } = formData;
  const images = await buildPostImages(preview);
  const image = images[0];

  if (isDuplicatePost({ title, story, destination, images })) {
    showToast('🚫 This post looks like a duplicate. Please share something new.', 'error');
    return;
  }

  const postId = 'user-' + Date.now();

  const privacyEl = document.querySelector('input[name="post-privacy"]:checked');
  const privacy = privacyEl ? privacyEl.value : 'public';

  const newPost = {
    id: postId, title, destination, country, region,
    author, shortDesc, story, image, images, privacy,
    authorKey: getCurrentUserKey() || author,
    tags: selectedTags.length ? selectedTags : ['Travel'],
    date: new Date().toISOString().split('T')[0],
    likes: 0, liked: false, reported: false
  };

  allPosts.unshift(newPost);
  saveUserPosts();
  if (typeof savePostToFirestore === 'function') savePostToFirestore(newPost);
  updateDynamicHeroStats();
  const privacyLabel = privacy === 'only-me' ? '🔒 Saved privately to your profile.' : privacy === 'followers' ? '👥 Shared with your followers!' : '🌍 Your trip has been shared with the world!';
  showToast(`✈️ ${privacyLabel}`, 'success');
  resetShareForm();

  setTimeout(() => { window.location.href = privacy === 'only-me' ? 'profile.html' : 'explore.html'; }, 1800);
}

function resetShareForm() {
  $('share-form').reset();
  const preview = $('photo-preview');
  if (preview) { preview.src = ''; preview.classList.remove('visible'); }
  sharePhotoFiles = [];
  const gallery = $('photos-preview-gallery');
  if (gallery) { gallery.innerHTML = ''; gallery.style.display = 'none'; }
  selectedTags = [];
  qsa('.tag-toggle').forEach(b => b.classList.remove('selected'));
}

function getRandomFallback() {
  const list = [
    'https://images.unsplash.com/photo-1488085061387-422e29b40080?w=800&q=80',
    'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=800&q=80',
    'https://images.unsplash.com/photo-1467269204594-9661b134dd2b?w=800&q=80',
  ];
  return list[Math.floor(Math.random() * list.length)];
}

function createPostCard(post, index) {
  const card = document.createElement('div');
  card.className = 'post-card';
  const isFeatured = (post.rating || 0) >= 4.7;
  if (isFeatured) card.classList.add('post-card--featured');
  card.style.animationDelay = `${index * 0.07}s`;
  const imgEl = card.querySelector('.post-card-img');
  if (imgEl) {
    imgEl.classList.add('shimmer');
    if (imgEl.complete && imgEl.naturalWidth) {
      imgEl.classList.add('loaded');
    } else {
      imgEl.addEventListener('load', () => imgEl.classList.add('loaded'), { once: true });
      imgEl.addEventListener('error', () => imgEl.classList.add('loaded'), { once: true });
    }
  }
  const initials = post.author.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
  const tagsHtml = (post.tags || []).slice(0, 3).map(t => `<span class="card-tag">${t}</span>`).join('');
  const ratingLabel = post.ratingCount ? `${formatRating(post.rating)} / 5 · ${post.ratingCount} rating${post.ratingCount === 1 ? '' : 's'}` : 'Be the first to rate';
  const locationLinksHtml = buildMapLinksHtml(post, 'card');
  const saved = isPostSaved(post.id);
  const myName = currentUser ? getDisplayName() : null;
  const isOwnPost = myName && post.author === myName;
  const following = !isOwnPost && isFollowing(post.author);
  const privacy = post.privacy || 'public';
  const privacyBadgeHtml = isOwnPost ? `<span class="card-privacy-badge privacy-${privacy}">${privacy === 'public' ? '🌍 Public' : privacy === 'followers' ? '👥 Followers' : '🔒 Only Me'}</span>` : '';
  const isAdmin = (typeof isAdminUser === 'function') && isAdminUser();
  const reportedBadge = isPostReported(post.id) ? '<span class="card-reported-badge">🚩 Reported</span>' : '';

  card.innerHTML = `
    <div class="post-card-img-wrap">
      ${reportedBadge}
      ${isFeatured ? '<span class="card-featured-badge">⭐ Top Rated</span>' : ''}
      <img class="post-card-img" src="${post.image}" alt="${post.destination}" loading="lazy"
           onerror="this.src='https://images.unsplash.com/photo-1488085061387-422e29b40080?w=600&q=70'">
      <span class="card-region-badge">📍 ${post.region}</span>
      ${privacyBadgeHtml}
    </div>
    <div class="post-card-body">
      <div class="card-meta">
        <div class="card-avatar">${initials}</div>
        <span class="card-author">${post.author}</span>
        <div class="card-dot"></div>
        <span class="card-date">${formatDate(post.date)}</span>
      </div>
      <h3 class="card-title">${post.title}</h3>
      <p class="card-excerpt">${post.shortDesc}</p>
      <div class="card-tags">${tagsHtml}</div>
      <div class="card-rating">⭐ <span class="card-rating-score">${ratingLabel}</span></div>
      <div class="card-footer">
        <span class="card-location"><span class="loc-icon">📍</span>${post.destination}, ${post.country}</span>
        <span class="card-read-more">Read story →</span>
      </div>
      <div class="card-actions-bar">
        <button class="card-action-btn like${post.liked ? ' liked' : ''}" data-action="like" data-id="${post.id}" aria-label="Like post" title="Like">
          <span class="action-icon">${post.liked ? '❤️' : '🤍'}</span>
          <span class="action-label">Like</span>
          <span class="action-count">${post.likes || 0}</span>
        </button>
        <button class="card-action-btn save${saved ? ' saved' : ''}" data-action="save" data-id="${post.id}" aria-label="${saved ? 'Remove saved location' : 'Save location'}" title="Save">
          <span class="action-icon">${saved ? '📌' : '📍'}</span>
          <span class="action-label">${saved ? 'Saved' : 'Save'}</span>
        </button>
        <button class="card-action-btn" data-action="share" data-id="${post.id}" aria-label="Share this post" title="Share">
          <span class="action-icon">🔗</span>
          <span class="action-label">Share</span>
        </button>
        ${!isOwnPost ? `<button class="card-action-btn follow${following ? ' following' : ''}" data-action="follow" data-author="${post.author}" aria-label="${following ? 'Unfollow' : 'Follow'} ${post.author}" title="${following ? 'Unfollow' : 'Follow'}">${following ? '✅' : '➕'}<span class="action-label">${following ? 'Following' : 'Follow'}</span></button>` : ''}
        ${isAdmin ? `<button class="card-action-btn ban" data-action="ban" data-author="${post.author}" aria-label="Ban ${post.author}" title="Ban user">🚫<span class="action-label">Ban</span></button>` : ''}
      </div>
      <div class="card-map-links">${locationLinksHtml}</div>
    </div>`;

  const saveBtn = card.querySelector('[data-action="save"]');
  if (saveBtn) {
    saveBtn.addEventListener('click', e => {
      e.stopPropagation();
      toggleSaveLocation(post.id);
    });
  }

  const shareBtn = card.querySelector('[data-action="share"]');
  if (shareBtn) {
    shareBtn.addEventListener('click', e => {
      e.stopPropagation();
      sharePost(post);
    });
  }

  const banBtn = card.querySelector('[data-action="ban"]');
  if (banBtn) {
    banBtn.addEventListener('click', e => {
      e.stopPropagation();
      adminBanUser(post.author);
    });
  }

  const followBtn = card.querySelector('[data-action="follow"]');
  if (followBtn) {
    followBtn.addEventListener('click', e => {
      e.stopPropagation();
      toggleFollow(post.author);
    });
  }

  const likeBtnBottom = card.querySelector('[data-action="like"]');
  if (likeBtnBottom) {
    likeBtnBottom.addEventListener('click', e => {
      e.stopPropagation();
      toggleLike(post.id);
      const btn = e.currentTarget;
      const icon = btn.querySelector('.action-icon');
      const count = btn.querySelector('.action-count');
      if (icon) icon.textContent = post.liked ? '❤️' : '🤍';
      if (count) count.textContent = post.likes || 0;
      if (post.liked) {
        btn.classList.add('liked');
        btn.style.animation = 'none';
        btn.offsetHeight;
        btn.style.animation = 'heartPop 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)';
      } else {
        btn.classList.remove('liked');
      }
      const page = getPage();
      if (page === 'home') renderPreviewPosts();
      else if (page === 'profile') renderProfilePage();
      else renderFeed();
    });
  }

  card.addEventListener('click', () => openPostDetail(post));
  return card;
}

function toggleLike(id) {
  const post = allPosts.find(p => p.id === id);
  if (!post) return;
  post.liked = !post.liked;
  post.likes += post.liked ? 1 : -1;
  if (post.likes < 0) post.likes = 0;
  saveLikes();
  if ((post.privacy || 'public') === 'public' && typeof updatePostLikesToFirestore === 'function') {
    updatePostLikesToFirestore(post.id, post.likes);
  }
}

function formatDate(dateStr) {
  if (!dateStr) return '';
  return new Date(dateStr).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
}

function getLocationQuery(post) {
  return [post.destination, post.country].filter(Boolean).join(', ');
}

function getGoogleMapsUrl(post) {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(getLocationQuery(post))}`;
}

function getAppleMapsUrl(post) {
  return `https://maps.apple.com/?q=${encodeURIComponent(getLocationQuery(post))}`;
}

function buildMapLinksHtml(post, context = 'detail') {
  const label = context === 'card' ? 'Open maps' : 'Open in';
  return `
    <a href="${getGoogleMapsUrl(post)}" class="map-link google" target="_blank" rel="noopener noreferrer" onclick="event.stopPropagation()">${label} Google Maps</a>
    <a href="${getAppleMapsUrl(post)}" class="map-link apple" target="_blank" rel="noopener noreferrer" onclick="event.stopPropagation()">${label} Apple Maps</a>`;
}

function initPostDetailModal() {
  const closeBtn = $('detail-close-btn');
  const overlay = $('detail-overlay');
  if (closeBtn) closeBtn.addEventListener('click', closePostDetail);
  if (overlay) overlay.addEventListener('click', e => { if (e.target === overlay) closePostDetail(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closePostDetail(); });
}

function openPostDetail(post) {
  const overlay = $('detail-overlay');
  if (!overlay) return;
  currentDetailPostId = post.id;
  const images = Array.isArray(post.images) && post.images.length ? post.images : [post.image];
  const heroImg = $('detail-img');
  heroImg.src = images[0];
  heroImg.onerror = () => { heroImg.src = 'https://images.unsplash.com/photo-1488085061387-422e29b40080?w=800&q=80'; };
  renderDetailPhotoGallery(images);
  $('detail-badge').textContent = `📍 ${post.region}`;
  $('detail-title').textContent = post.title;
  $('detail-story').textContent = post.story || post.shortDesc;
  $('detail-meta').innerHTML = `
    <span class="meta-item">👤 ${post.author}</span>
    <span class="meta-item">📍 ${post.destination}, ${post.country}</span>
    <span class="meta-item">📅 ${formatDate(post.date)}</span>
    <span class="meta-item">❤️ ${post.likes} likes</span>
    <span class="meta-item">⭐ ${post.ratingCount ? `${formatRating(post.rating)} / 5 (${post.ratingCount})` : 'No ratings yet'}</span>`;
  $('detail-tags').innerHTML = (post.tags || []).map(t => `<span class="card-tag">${t}</span>`).join('');
  ensureDetailLocationSection(post);
  updateDetailSaveUI(post);
  ensureDetailRatingSection();
  updateDetailRatingUI(post);
  ensureDetailCommentSection();
  updateDetailCommentUI(post);
  const reportBtn = $('detail-report-btn');
  if (reportBtn) reportBtn.onclick = () => reportPost(post.id);
  overlay.classList.add('open');
  document.body.classList.add('no-scroll');
}

function toggleDetailLike(postId) {
  const post = allPosts.find(p => p.id === postId);
  if (!post) return;

  toggleLike(postId);

  const meta = document.querySelector('.post-detail-modal .detail-meta');
  if (meta) {
    meta.innerHTML = `
      <span class="meta-item">👤 ${post.author}</span>
      <span class="meta-item">📍 ${post.destination}, ${post.country}</span>
      <span class="meta-item">📅 ${formatDate(post.date)}</span>
      <span class="meta-item">❤️ ${post.likes} likes</span>
      <span class="meta-item">⭐ ${post.ratingCount ? `${formatRating(post.rating)} / 5 (${post.ratingCount})` : 'No ratings yet'}</span>`;
  }

  updateDetailSaveUI(post);
}

function updateDetailSaveUI(post) {
  const body = document.querySelector('.post-detail-modal .detail-body');
  if (!body) return;

  let section = $('detail-save-section');
  if (!section) {
    section = document.createElement('div');
    section.id = 'detail-save-section';
    section.className = 'detail-save-section';
    const reportWrap = body.querySelector('div[style*="border-top"]');
    if (reportWrap) body.insertBefore(section, reportWrap);
    else body.appendChild(section);
  }

  const saved = isPostSaved(post.id);
  const ownDownload = isPostOwner(post)
    ? `<button onclick="downloadOwnImageById('${post.id}')" style="padding:0.7rem 1.2rem;border-radius:50px;font-weight:700;font-size:0.85rem;border:1px solid var(--glass-border);cursor:pointer;background:rgba(0,229,255,0.12);color:var(--teal);transition:all 0.2s;">
        📥 Download Photo
      </button>`
    : '';
  const ownDelete = isPostOwner(post)
    ? `<button onclick="deleteOwnPostFromDetail('${post.id}')" style="padding:0.7rem 1.2rem;border-radius:50px;font-weight:700;font-size:0.85rem;border:1px solid rgba(255,85,85,0.35);cursor:pointer;background:rgba(255,85,85,0.12);color:var(--coral);transition:all 0.2s;">
        🗑️ Delete My Post
      </button>`
    : '';
  const adminDelete = (typeof isAdminUser === 'function' && isAdminUser())
    ? `<button onclick="adminDeletePost('${post.id}')" style="padding:0.7rem 1.2rem;border-radius:50px;font-weight:700;font-size:0.85rem;border:1px solid rgba(255,85,85,0.35);cursor:pointer;background:rgba(255,85,85,0.12);color:var(--coral);transition:all 0.2s;">
        🗑️ Delete (Admin)
      </button>`
    : '';
  const adminBan = (typeof isAdminUser === 'function' && isAdminUser())
    ? `<button onclick="adminBanUser('${String(post.author).replace(/'/g, "\\'")}')" style="padding:0.7rem 1.2rem;border-radius:50px;font-weight:700;font-size:0.85rem;border:1px solid rgba(255,85,85,0.35);cursor:pointer;background:rgba(255,85,85,0.12);color:var(--coral);transition:all 0.2s;">
        🚫 Ban User
      </button>`
    : '';
  section.innerHTML = `
    <div style="display:flex;gap:0.75rem;align-items:center;flex-wrap:wrap;margin:1.25rem 0;">
      <button class="btn-save-detail${saved ? ' saved' : ''}" onclick="toggleSaveLocation('${post.id}')" style="padding:0.75rem 1.4rem;border-radius:50px;font-weight:700;font-size:0.9rem;border:none;cursor:pointer;display:inline-flex;align-items:center;gap:0.5rem;transition:all 0.2s;">
        ${saved ? 'Saved to Profile Map' : 'Save Location to My Map'}
      </button>
      <a href="${getGoogleMapsUrl(post)}" target="_blank" rel="noopener noreferrer" class="map-link google" style="padding:0.7rem 1.2rem;font-size:0.85rem;">
        🗺️ Open in Google World Map
      </a>
      ${ownDownload}
      ${ownDelete}
      ${adminDelete}
      ${adminBan}
      <button onclick="sharePostById('${post.id}')" style="padding:0.7rem 1.2rem;border-radius:50px;font-weight:700;font-size:0.85rem;border:1px solid rgba(255,215,0,0.3);cursor:pointer;background:rgba(255,215,0,0.12);color:var(--gold);transition:all 0.2s;">
        🔗 Share Post
      </button>
    </div>
  `;
}

async function deleteOwnPostFromDetail(postId) {
  const post = allPosts.find(p => p.id === postId);
  if (!post) return;
  if (!isPostOwner(post)) {
    showToast('🔒 You can only delete your own posts.', 'error');
    return;
  }
  await deleteUserPost(postId);
  if (typeof closePostDetail === 'function') closePostDetail();
  refreshCurrentView();
}

async function sharePost(post) {
  if (!post) return;
  const text = `✈️ ${post.title}\n📍 ${post.destination}, ${post.country} — shared by ${post.author}\n\n${post.shortDesc || post.story || ''}`;
  const shareUrl = location.origin + location.pathname.replace(/[^/]*$/, '') + 'explore.html?search=' + encodeURIComponent(post.destination);

  if (typeof navigator.share === 'function') {
    try {
      await navigator.share({ title: 'WanderShare Trip', text, url: shareUrl });
      return;
    } catch (err) {
      if (err && err.name === 'AbortError') return;
    }
  }

  try {
    await navigator.clipboard.writeText(`${text}\n\n${shareUrl}`);
    showToast('🔗 Copied — paste it anywhere to share this trip!', 'success');
  } catch (e) {
    showToast('⚠️ Could not share this post from this browser.', 'error');
  }
}

function sharePostById(postId) {
  const post = allPosts.find(p => p.id === postId);
  sharePost(post);
}

async function shareProfile() {
  if (!currentUser) {
    showToast('Please sign in to share your profile.', 'error');
    return;
  }
  const name = getDisplayName() || 'a WanderShare traveller';
  const myPosts = allPosts.filter(p => p.author === name);
  const saved = getSavedLocationsForCurrentUser();
  const countries = new Set([...saved.map(s => s.country), ...myPosts.map(p => p.country)].filter(Boolean)).size;
  const text = `🌍 Check out ${name} on WanderShare!\n✈️ ${myPosts.length} trip${myPosts.length === 1 ? '' : 's'} shared · 📌 ${saved.length} saved place${saved.length === 1 ? '' : 's'} · 🗺️ ${countries} countr${countries === 1 ? 'y' : 'ies'}`;
  const shareUrl = location.origin + location.pathname.replace(/[^/]*$/, '') + 'profile.html';

  if (typeof navigator.share === 'function') {
    try {
      await navigator.share({ title: `${name} · WanderShare`, text, url: shareUrl });
      return;
    } catch (err) {
      if (err && err.name === 'AbortError') return;
    }
  }

  try {
    await navigator.clipboard.writeText(`${text}\n\n${shareUrl}`);
    showToast('🔗 Profile link copied — paste it anywhere to share!', 'success');
  } catch (e) {
    showToast('⚠️ Could not share your profile from this browser.', 'error');
  }
}

function renderDetailPhotoGallery(images) {
  const modal = document.querySelector('.post-detail-modal');
  if (!modal) return;
  let gallery = $('detail-photo-gallery');
  if (!gallery) {
    gallery = document.createElement('div');
    gallery.id = 'detail-photo-gallery';
    gallery.className = 'detail-photo-gallery';
    const heroImg = $('detail-img');
    if (heroImg && heroImg.parentElement === modal) {
      heroImg.insertAdjacentElement('afterend', gallery);
    } else {
      modal.insertBefore(gallery, modal.firstChild);
    }
  }

  if (!images || images.length <= 1) {
    gallery.innerHTML = '';
    gallery.style.display = 'none';
    return;
  }

  gallery.style.display = 'flex';
  gallery.innerHTML = images.map((src, index) => `
    <button type="button" class="detail-photo-thumb${index === 0 ? ' active' : ''}" data-index="${index}" aria-label="View photo ${index + 1}">
      <img src="${src}" alt="Trip photo ${index + 1}" loading="lazy" />
    </button>`).join('');

  gallery.querySelectorAll('.detail-photo-thumb').forEach(btn => {
    btn.addEventListener('click', () => {
      const idx = Number(btn.dataset.index);
      const heroImg = $('detail-img');
      if (heroImg && images[idx]) heroImg.src = images[idx];
      gallery.querySelectorAll('.detail-photo-thumb').forEach(item => item.classList.remove('active'));
      btn.classList.add('active');
    });
  });
}

function closePostDetail() {
  const overlay = $('detail-overlay');
  if (overlay) { overlay.classList.remove('open'); document.body.classList.remove('no-scroll'); }
  currentDetailPostId = null;
}

function ensureDetailRatingSection() {
  const body = document.querySelector('.post-detail-modal .detail-body');
  if (!body) return null;
  const existing = $('detail-rating-section');
  if (existing) return existing;

  const section = document.createElement('div');
  section.id = 'detail-rating-section';
  section.className = 'detail-rating-section';
  section.innerHTML = `
    <div class="detail-rating-header">
      <div>
        <div class="detail-rating-label">Rate this place</div>
        <div class="detail-rating-summary" id="detail-rating-summary"></div>
      </div>
      <div class="detail-rating-average" id="detail-rating-average"></div>
    </div>
    <div class="detail-rating-stars" id="detail-rating-stars" aria-label="Rating controls"></div>
    <div class="detail-rating-note" id="detail-rating-note"></div>`;

  const tags = $('detail-tags');
  const reportWrap = body.querySelector('div[style*="border-top"]');
  if (tags && tags.parentElement === body) {
    tags.insertAdjacentElement('afterend', section);
  } else if (reportWrap) {
    body.insertBefore(section, reportWrap);
  } else {
    body.appendChild(section);
  }
  return section;
}

function ensureDetailLocationSection(post) {
  const body = document.querySelector('.post-detail-modal .detail-body');
  if (!body) return null;
  const existing = $('detail-location-section');
  if (existing) {
    existing.innerHTML = `
      <div class="detail-location-label">Location</div>
      <div class="detail-location-links">${buildMapLinksHtml(post, 'detail')}</div>`;
    return existing;
  }

  const section = document.createElement('div');
  section.id = 'detail-location-section';
  section.className = 'detail-location-section';
  section.innerHTML = `
    <div class="detail-location-label">Location</div>
    <div class="detail-location-links">${buildMapLinksHtml(post, 'detail')}</div>`;

  const tags = $('detail-tags');
  if (tags && tags.parentElement === body) {
    tags.insertAdjacentElement('afterend', section);
  } else {
    body.appendChild(section);
  }
  return section;
}

function updateDetailRatingUI(post) {
  const section = ensureDetailRatingSection();
  if (!section) return;

  const averageEl = $('detail-rating-average');
  const summaryEl = $('detail-rating-summary');
  const starsEl = $('detail-rating-stars');
  const noteEl = $('detail-rating-note');
  const canRate = !!currentUser && !isGuest;
  const hasRated = !!post.userRating;

  if (averageEl) {
    averageEl.textContent = post.ratingCount ? `${formatRating(post.rating)} / 5` : 'New';
  }
  if (summaryEl) {
    summaryEl.textContent = post.ratingCount
      ? `${post.ratingCount} rating${post.ratingCount === 1 ? '' : 's'} from travellers`
      : 'Be the first traveller to rate this place.';
  }
  if (starsEl) {
    starsEl.innerHTML = '';
    for (let value = 1; value <= 5; value++) {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = `rating-star${hasRated && value <= post.userRating ? ' selected' : ''}`;
      button.textContent = value <= (hasRated ? post.userRating : 0) ? '★' : '☆';
      button.disabled = !canRate || hasRated;
      button.setAttribute('aria-label', `${value} star${value === 1 ? '' : 's'}`);
      if (canRate && !hasRated) {
        button.addEventListener('click', () => ratePost(post.id, value));
      }
      starsEl.appendChild(button);
    }
  }
  if (noteEl) {
    if (!canRate) {
      noteEl.innerHTML = '<a href="profile.html">Sign in or sign up</a> to rate this place once.';
    } else if (hasRated) {
      noteEl.textContent = `You rated this place ${post.userRating}/5.`;
    } else {
      noteEl.textContent = 'Choose one rating. Your vote will be locked after you submit it.';
    }
  }
}

function ensureDetailCommentSection() {
  const body = document.querySelector('.post-detail-modal .detail-body');
  if (!body) return null;
  const existing = $('detail-comment-section');
  if (existing) return existing;

  const section = document.createElement('div');
  section.id = 'detail-comment-section';
  section.className = 'detail-comment-section';
  section.innerHTML = `
    <div class="detail-comment-header">
      <div>
        <div class="detail-comment-label">Comment</div>
        <div class="detail-comment-summary" id="detail-comment-summary"></div>
      </div>
    </div>
    <div class="detail-comment-box">
      <textarea id="detail-comment-input" class="detail-comment-input" rows="4" maxlength="280" placeholder="Write one comment about this place…"></textarea>
      <button type="button" id="detail-comment-submit" class="detail-comment-submit">Post Comment</button>
      <div class="detail-comment-note" id="detail-comment-note"></div>
    </div>
    <div class="detail-comment-list" id="detail-comment-list"></div>`;

  const ratingSection = $('detail-rating-section');
  if (ratingSection && ratingSection.parentElement === body) {
    ratingSection.insertAdjacentElement('afterend', section);
  } else {
    const reportWrap = body.querySelector('div[style*="border-top"]');
    if (reportWrap) body.insertBefore(section, reportWrap);
    else body.appendChild(section);
  }

  const submitBtn = $('detail-comment-submit');
  if (submitBtn) {
    submitBtn.addEventListener('click', () => {
      if (!currentDetailPostId) return;
      submitDetailComment(currentDetailPostId);
    });
  }

  return section;
}

function getCommentEntry(postId, userKey) {
  const postComments = commentStore[postId];
  if (!postComments || !userKey) return null;
  return postComments.commentsByUser?.[userKey] || null;
}

function getCommentEntries(postId) {
  const postComments = commentStore[postId];
  if (!postComments || !postComments.commentsByUser) return [];
  return Object.values(postComments.commentsByUser).sort((left, right) => new Date(right.date) - new Date(left.date));
}

function updateDetailCommentUI(post) {
  const section = ensureDetailCommentSection();
  if (!section) return;

  const userKey = getCurrentUserKey();
  const canComment = !!currentUser && !isGuest;
  const userComment = getCommentEntry(post.id, userKey);
  const comments = getCommentEntries(post.id);
  const summaryEl = $('detail-comment-summary');
  const inputEl = $('detail-comment-input');
  const noteEl = $('detail-comment-note');
  const listEl = $('detail-comment-list');
  const submitEl = $('detail-comment-submit');

  if (summaryEl) {
    summaryEl.textContent = comments.length ? `${comments.length} comment${comments.length === 1 ? '' : 's'} on this place` : 'Be the first to comment.';
  }

  if (listEl) {
    listEl.innerHTML = comments.length
      ? comments.map(entry => `
          <div class="detail-comment-item${entry.userKey === userKey ? ' mine' : ''}">
            <div class="detail-comment-meta">
              <span class="detail-comment-author">${entry.name}</span>
              <span class="detail-comment-date">${formatDate(entry.date)}</span>
            </div>
            <p>${entry.comment}</p>
          </div>`).join('')
      : '<div class="detail-comment-empty">No comments yet.</div>';
  }

  if (!canComment) {
    if (inputEl) {
      inputEl.value = '';
      inputEl.disabled = true;
      inputEl.placeholder = 'Sign in to leave one comment';
    }
    if (submitEl) submitEl.disabled = true;
    if (noteEl) noteEl.innerHTML = '<a href="profile.html">Sign in or sign up</a> to comment once on this place.';
    return;
  }

  if (userComment) {
    if (inputEl) {
      inputEl.value = userComment.comment;
      inputEl.disabled = true;
      inputEl.placeholder = 'You already commented on this place';
    }
    if (submitEl) submitEl.disabled = true;
    if (noteEl) noteEl.textContent = 'You already left your one comment for this place.';
  } else {
    if (inputEl) {
      inputEl.disabled = false;
      inputEl.value = '';
      inputEl.placeholder = 'Write one comment about this place…';
    }
    if (submitEl) submitEl.disabled = false;
    if (noteEl) noteEl.textContent = 'You can comment once after login. No edits after posting.';
  }
}

function submitDetailComment(postId) {
  if (!currentUser || isGuest) {
    showToast('Sign in or sign up to comment.', 'error');
    localStorage.setItem('ws_return_to', window.location.href);
    return;
  }

  const inputEl = $('detail-comment-input');
  const text = sanitizeText(inputEl ? inputEl.value : '');
  if (!text) {
    showToast('Write a comment before posting.', 'error');
    return;
  }
  if (containsBadWords(text) || containsExplicitContent(text)) {
    showToast('🚫 That comment contains words or links that are not allowed.', 'error');
    return;
  }
  if (containsNonEnglish(text)) {
    showToast('🚫 Please write your comment in English only.', 'error');
    return;
  }
  if (containsGibberish(text)) {
    showToast('🚫 Please write your comment in correct English.', 'error');
    return;
  }

  const userKey = getCurrentUserKey();
  if (!userKey) return;

  const postComments = commentStore[postId] || { commentsByUser: {} };
  if (postComments.commentsByUser[userKey]) {
    showToast('You can only comment once on this place.', 'error');
    updateDetailCommentUI(allPosts.find(post => post.id === postId));
    return;
  }

  postComments.commentsByUser[userKey] = {
    userKey,
    name: getDisplayName(),
    comment: text,
    date: new Date().toISOString().split('T')[0]
  };
  commentStore[postId] = postComments;
  saveComments();

  const post = allPosts.find(item => item.id === postId);
  if (post) updateDetailCommentUI(post);
  showToast('💬 Comment posted.', 'success');
}

function ratePost(id, value) {
  if (!currentUser || isGuest) {
    showToast('Sign in or sign up to rate places.', 'error');
    localStorage.setItem('ws_return_to', window.location.href);
    return;
  }

  const userKey = getCurrentUserKey();
  const post = allPosts.find(p => p.id === id);
  if (!post || !userKey) return;

  const entry = ratingStore[id] || {
    sum: (Number(post.rating) || 0) * (Number(post.ratingCount) || 0),
    count: Number(post.ratingCount) || 0,
    userRatings: {}
  };

  if (entry.userRatings[userKey]) {
    showToast('You can only rate this place once.', 'error');
    return;
  }

  entry.userRatings[userKey] = value;
  entry.sum += value;
  entry.count += 1;
  ratingStore[id] = entry;
  saveRatings();
  syncRatingsToPosts();
  refreshCurrentView();

  const updatedPost = allPosts.find(p => p.id === id);
  if (updatedPost && currentDetailPostId === id) {
    updateDetailRatingUI(updatedPost);
  }

  showToast(`⭐ Thanks! You rated ${post.destination} ${value}/5.`, 'success');
}

function getReports() {
  try {
    const list = JSON.parse(localStorage.getItem('wandershare_reports') || '[]');
    return Array.isArray(list) ? list : [];
  } catch { return []; }
}

function saveReports(list) {
  try { localStorage.setItem('wandershare_reports', JSON.stringify(list)); } catch { }
}

function isPostReported(postId) {
  return getReports().some(r => r.postId === postId);
}

function reportPost(id) {
  const post = allPosts.find(p => p.id === id);
  if (!post) return;
  const reports = getReports();
  if (reports.some(r => r.postId === id)) {
    showToast('This post is already reported and is waiting for the admin.', 'error');
    return;
  }
  const report = {
    id: 'report-' + Date.now(),
    postId: id,
    postTitle: post.title,
    reporter: currentUser ? getDisplayName() : 'Guest',
    date: new Date().toISOString()
  };
  reports.push(report);
  saveReports(reports);
  if (typeof saveReportToFirestore === 'function') saveReportToFirestore(report);
  showToast('🚩 Report sent to the admin. The post stays visible until the admin decides.', 'success');
}

window.mergeCloudReports = function (cloud) {
  const reports = getReports();
  let changed = false;
  cloud.forEach(cr => {
    if (!reports.some(r => r.id === cr.id)) { reports.push(cr); changed = true; }
  });
  if (changed) {
    saveReports(reports);
    if (typeof renderReportedPostsList === 'function') renderReportedPostsList();
  }
};

function renderReportedPostsList() {
  const list = $('reported-list');
  if (!list) return;
  const reports = getReports();
  list.innerHTML = '';
  if (!reports.length) {
    list.innerHTML = '<div style="font-size:0.82rem;color:var(--text-muted);">No reported posts. 🎉</div>';
    return;
  }
  reports.forEach(report => {
    const post = allPosts.find(p => p.id === report.postId);
    const row = document.createElement('div');
    row.className = 'report-list-item';
    row.innerHTML = `
      <div style="display:flex;justify-content:space-between;gap:0.5rem;align-items:center;flex-wrap:wrap;">
        <div style="min-width:0;flex:1;">
          <div style="font-weight:600;font-size:0.85rem;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${escHTML(report.postTitle || (post && post.title) || 'Unknown post')}</div>
          <div style="font-size:0.75rem;color:var(--text-muted);">reported by ${escHTML(report.reporter)} · ${formatDate(report.date)}</div>
        </div>
        <div style="display:flex;gap:0.4rem;flex-shrink:0;">
          <button class="btn-secondary" onclick="adminRemoveReportedPost('${report.postId}')" style="font-size:0.75rem;padding:0.4rem 0.7rem;">🗑️ Remove</button>
          <button class="btn-secondary" onclick="adminKeepReportedPost('${report.postId}')" style="font-size:0.75rem;padding:0.4rem 0.7rem;">✅ Keep</button>
        </div>
      </div>`;
    list.appendChild(row);
  });
}

async function adminRemoveReportedPost(postId) {
  if (typeof isAdminUser !== 'function' || !isAdminUser()) {
    showToast('🔒 Admin access only.', 'error');
    return;
  }
  const post = allPosts.find(p => p.id === postId);
  const author = post ? post.author : '';
  const reason = await wsPrompt({
    title: 'Remove reported post?',
    message: author ? `You are removing "${post.title}" by ${author}. Write a reason to send to the user's message box:` : 'Write a reason for removing this post:',
    placeholder: 'e.g. This post was reported and breaks our guidelines.',
    confirmText: 'Remove & Send',
    cancelText: 'Cancel'
  });
  if (reason === null) return;
  if (!reason) {
    showToast('⚠️ You must write a reason before removing.', 'error');
    return;
  }
  allPosts = allPosts.filter(p => p.id !== postId);
  saveUserPosts();
  if (typeof deletePostFromFirestore === 'function') deletePostFromFirestore(postId);
  clearReportsForPost(postId);
  if (author) {
    await sendAdminMessageToUser(author, 'Your reported post "' + (post ? post.title : '') + '" was removed by the admin.\n\nReason: ' + reason);
  }
  updateDynamicHeroStats();
  refreshCurrentView();
  showToast('🗑️ Reported post removed. Reason sent.', 'success');
}

function adminKeepReportedPost(postId) {
  if (typeof isAdminUser !== 'function' || !isAdminUser()) {
    showToast('🔒 Admin access only.', 'error');
    return;
  }
  clearReportsForPost(postId);
  showToast('✅ Report dismissed. Post stays.', 'success');
}

function clearReportsForPost(postId) {
  const reports = getReports().filter(r => r.postId !== postId);
  saveReports(reports);
  if (typeof clearReportsFromFirestore === 'function') clearReportsFromFirestore(postId);
  renderReportedPostsList();
}

async function sendAdminMessageToUser(userName, text) {
  if (!text || !text.trim()) return;
  const clean = String(text).trim().slice(0, 1000);
  if (typeof saveMessageToFirestore !== 'function') return;
  let toUid = '';
  if (typeof listUsersFromFirestore === 'function') {
    try {
      const users = await listUsersFromFirestore();
      const match = users.find(u =>
        String(u.displayName || '').toLowerCase() === String(userName || '').toLowerCase() ||
        (u.email && String(userName || '').toLowerCase() === String(u.email).toLowerCase())
      );
      if (match) toUid = match.uid || '';
    } catch (e) { }
  }
  const fromUid = currentUser ? (currentUser.uid || currentUser.email || 'admin') : 'admin';
  const fromName = currentUser ? getDisplayName() : 'Admin';
  await saveMessageToFirestore({
    toUid: toUid || 'unknown-' + String(userName || '').toLowerCase().replace(/[^a-z0-9]/g, ''),
    toName: userName,
    fromUid,
    fromName,
    text: clean,
    type: 'admin'
  });
}

function showToast(msg, type = 'success') {
  const toast = $('toast');
  const icon = $('toast-icon');
  const text = $('toast-text');
  if (!toast) return;
  toast.className = `toast ${type}`;
  icon.textContent = type === 'success' ? '✅' : '⚠️';
  text.textContent = msg;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 4500);
}

let leafletMap = null;
let leafletMarkers = [];

function initProfilePageWhenAuthReady() {
  if (window.FIREBASE_READY && window.AUTH_RESOLVED !== true) {
    setTimeout(initProfilePageWhenAuthReady, 50);
    return;
  }
  initProfilePage();
}

function initProfilePage() {
  renderProfilePage();
  initProfileForm();
  initOwnerPanel();
}

function switchProfileTab(tabName) {
  const tabs = ['saved', 'posts', 'post'];
  tabs.forEach(t => {
    const btn = $(`tab-btn-${t}`);
    const content = $(`tab-content-${t}`);
    if (btn) {
      btn.classList.toggle('active', t === tabName);
      btn.setAttribute('aria-selected', t === tabName ? 'true' : 'false');
    }
    if (content) {
      content.style.display = (t === tabName) ? 'block' : 'none';
      if (t === tabName) content.classList.add('active');
    }
  });

  if (tabName === 'saved') {
    setTimeout(() => {
      if (leafletMap) leafletMap.invalidateSize();
    }, 250);
  }
}

function renderProfilePage() {
  const nameEl = $('profile-display-name');
  const emailEl = $('profile-display-email');
  const avatarEl = $('profile-avatar');
  const badgeEl = $('profile-badge-status');

  if (!currentUser) {
    if (window.FIREBASE_READY && window.AUTH_RESOLVED !== true) {
      setTimeout(renderProfilePage, 100);
      return;
    }
    if (typeof showAuthGateOnly === 'function') { showAuthGateOnly(); return; }
    window.location.href = 'index.html';
    return;
  }

  const name = currentUser ? getDisplayName() : 'Guest Explorer';

  if (nameEl) {
    nameEl.textContent = name;
    if (emailEl) emailEl.textContent = currentUser?.email || 'Guest Mode';
    if (avatarEl) {
      if (currentUser?.photoURL) {
        avatarEl.innerHTML = `<img src="${currentUser.photoURL}" alt="${name}">`;
      } else {
        avatarEl.textContent = isGuest ? '👻' : name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
      }
    }
    if (badgeEl) badgeEl.textContent = currentUser ? 'Verified Explorer' : 'Guest';
  }

  const savedLocations = getSavedLocationsForCurrentUser();
  const myPosts = allPosts.filter(p => p.author === (currentUser ? getDisplayName() : ''));
  const uniqueCountries = new Set([...savedLocations.map(s => s.country), ...myPosts.map(p => p.country)]).size;
  const followingCount = getFollowingAuthors().length;
  const followersCount = currentUser ? getFollowersCount(getDisplayName()) : 0;

  const statPosts = $('profile-stat-posts');
  const statSaved = $('profile-stat-saved');
  const statCountries = $('profile-stat-countries');
  const statFollowing = $('profile-stat-following');
  const statFollowers = $('profile-stat-followers');

  if (statPosts) statPosts.textContent = myPosts.length;
  if (statSaved) statSaved.textContent = savedLocations.length;
  if (statCountries) statCountries.textContent = uniqueCountries;
  if (statFollowing) statFollowing.textContent = followingCount;
  if (statFollowers) statFollowers.textContent = followersCount;

  renderSavedLocationsGrid(savedLocations);
  renderMyPostsGrid(myPosts);
  initWorldMap(savedLocations, myPosts);
}

function renderSavedLocationsGrid(savedLocations) {
  const grid = $('saved-locations-grid');
  if (!grid) return;
  grid.innerHTML = '';

  if (savedLocations.length === 0) {
    grid.innerHTML = `
      <div class="empty-state" style="grid-column: 1 / -1; padding: 3rem 1.5rem; text-align: center;">
        <div class="empty-icon" style="font-size:3rem;margin-bottom:1rem;">📌</div>
        <h3 style="font-size:1.4rem;margin-bottom:0.5rem;color:var(--white);">No saved locations yet</h3>
        <p style="color:var(--text-muted);max-width:480px;margin:0 auto 1.5rem;">Explore travel stories from around the world and click <strong>📌 Save</strong> on any destination to pin it to your map and save it here!</p>
        <a href="explore.html" class="btn-primary" style="padding:0.75rem 1.6rem;display:inline-block;">🌍 Explore Destinations</a>
      </div>`;
    return;
  }

  savedLocations.forEach((item, index) => {
    const post = allPosts.find(p => p.id === item.postId) || {
      id: item.postId,
      title: item.title,
      destination: item.destination,
      country: item.country,
      region: item.region || 'World',
      image: item.image,
      author: item.author || 'Explorer',
      shortDesc: `Saved location in ${item.destination}, ${item.country}`,
      tags: ['Saved Location'],
      date: item.savedAt
    };
    const card = createPostCard(post, index);
    grid.appendChild(card);
  });
}

function renderMyPostsGrid(myPosts) {
  const grid = $('my-posts-grid');
  if (!grid) return;
  grid.innerHTML = '';

  if (myPosts.length === 0) {
    grid.innerHTML = `
      <div class="empty-state" style="grid-column: 1 / -1; padding: 3rem 1.5rem; text-align: center;">
        <div class="empty-icon" style="font-size:3rem;margin-bottom:1rem;">📸</div>
        <h3 style="font-size:1.4rem;margin-bottom:0.5rem;color:var(--white);">You haven't posted any trips yet</h3>
        <p style="color:var(--text-muted);max-width:480px;margin:0 auto 1.5rem;">Share where you've been to inspire the WanderShare community!</p>
        <button class="btn-primary" onclick="switchProfileTab('post')" style="padding:0.75rem 1.6rem;display:inline-block;">✈️ Share Your Trip</button>
      </div>`;
    return;
  }

  myPosts.forEach((post, index) => {
    const card = createPostCard(post, index);
    const imgWrap = card.querySelector('.post-card-img-wrap');

    const delBtn = document.createElement('button');
    delBtn.className = 'my-post-delete-btn';
    delBtn.innerHTML = '🗑️ Delete';
    delBtn.onclick = (e) => {
      e.stopPropagation();
      deleteUserPost(post.id);
    };
    if (imgWrap) imgWrap.appendChild(delBtn);

    const downloadBtn = document.createElement('button');
    downloadBtn.className = 'my-post-download-btn';
    downloadBtn.innerHTML = '📥 Download';
    downloadBtn.onclick = (e) => {
      e.stopPropagation();
      downloadOwnImage(post);
    };
    if (imgWrap) imgWrap.appendChild(downloadBtn);

    grid.appendChild(card);
  });
}

async function deleteUserPost(postId) {
  const ok = await wsConfirm({
    title: 'Delete this post?',
    message: 'Are you sure you want to delete this trip post? This cannot be undone.',
    confirmText: 'Delete',
    cancelText: 'Cancel',
    danger: true
  });
  if (!ok) return;
  allPosts = allPosts.filter(p => p.id !== postId);
  saveUserPosts();
  if (typeof deletePostFromFirestore === 'function') deletePostFromFirestore(postId);
  showToast('Trip post deleted.', 'success');
  renderProfilePage();
}

function isPostOwner(post) {
  if (!currentUser || isGuest) return false;
  const userKey = getCurrentUserKey();
  if (userKey && post.authorKey && post.authorKey === userKey) return true;
  return post.author === getDisplayName();
}

function downloadOwnImageById(postId) {
  const post = allPosts.find(p => p.id === postId);
  if (!post) { showToast('Post not found.', 'error'); return; }
  downloadOwnImage(post);
}

function downloadOwnImage(post) {
  if (!isPostOwner(post)) {
    showToast('🔒 You can only download your own pictures.', 'error');
    return;
  }
  downloadImageUrl(post.image, buildDownloadFilename(post));
  showToast('📥 Downloading your photo…', 'success');
}

function buildDownloadFilename(post) {
  return (String(post.title || post.destination || 'wandershare-photo')
    .replace(/[^a-z0-9-_ ]/gi, '')
    .trim()
    .slice(0, 60) || 'wandershare-photo') + '.jpg';
}

function downloadImageUrl(url, filename) {
  if (url.startsWith('data:')) {
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    return Promise.resolve(true);
  }

  return fetch(url, { mode: 'cors' })
    .then(res => {
      if (!res.ok) throw new Error('bad status');
      return res.blob();
    })
    .then(blob => {
      const objectUrl = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = objectUrl;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(() => URL.revokeObjectURL(objectUrl), 3000);
      return true;
    })
    .catch(() => {
      window.open(url, '_blank', 'noopener');
      return false;
    });
}

function downloadAllPhotos() {
  if (typeof isAdminUser !== 'function' || !isAdminUser()) {
    showToast('🔒 Admin access only.', 'error');
    return;
  }
  const posts = allPosts.filter(p => !p.reported);
  if (!posts.length) {
    showToast('No photos to download yet.', 'error');
    return;
  }
  showToast(`📥 Downloading ${posts.length} photos…`, 'success');
  posts.forEach((post, i) => {
    setTimeout(() => {
      downloadImageUrl(post.image, buildDownloadFilename(post));
    }, i * 600);
  });
}

async function adminDeletePost(postId) {
  if (typeof isAdminUser !== 'function' || !isAdminUser()) {
    showToast('🔒 Admin access only.', 'error');
    return;
  }
  const post = allPosts.find(p => p.id === postId);
  const author = post ? post.author : '';
  const reason = await wsPrompt({
    title: 'Delete this post?',
    message: author ? `You are deleting "${post.title}" by ${author}. Write a reason to send to the user's message box:` : 'Write a reason for deleting this post:',
    placeholder: 'e.g. This post breaks our community guidelines.',
    confirmText: 'Delete & Send',
    cancelText: 'Cancel'
  });
  if (reason === null) return;
  if (!reason) {
    showToast('⚠️ You must write a reason before deleting.', 'error');
    return;
  }
  allPosts = allPosts.filter(p => p.id !== postId);
  saveUserPosts();
  if (typeof deletePostFromFirestore === 'function') deletePostFromFirestore(postId);
  if (author) {
    await sendAdminMessageToUser(author, 'Your post "' + (post ? post.title : '') + '" was deleted by the admin.\n\nReason: ' + reason);
  }
  updateDynamicHeroStats();
  showToast('🗑️ Post deleted. Reason sent to ' + author + '.', 'success');
  if (typeof closePostDetail === 'function') closePostDetail();
  const page = getPage();
  if (page === 'explore' && typeof renderFeed === 'function') renderFeed();
  if (page === 'home' && typeof renderPreviewPosts === 'function') renderPreviewPosts();
  if (page === 'profile' && typeof renderProfilePage === 'function') renderProfilePage();
}

async function adminRemoveAllUsers() {
  if (typeof isAdminUser !== 'function' || !isAdminUser()) {
    showToast('🔒 Admin access only.', 'error');
    return;
  }
  const ok = await wsConfirm({
    title: 'Remove all users?',
    message: 'Remove ALL registered users from this browser? This clears the wanderers counter.',
    confirmText: 'Remove All',
    cancelText: 'Cancel',
    danger: true
  });
  if (!ok) return;
  try {
    localStorage.removeItem('wandershare_account_emails');
    updateDynamicHeroStats();
    showToast('👥 All registered users removed.', 'success');
  } catch {
    showToast('Could not remove users.', 'error');
  }
}

/* ============ ADMIN: BAN / UNBAN USERS ============ */
function getBannedUsers() {
  try {
    const list = JSON.parse(localStorage.getItem('wandershare_banned_users') || '[]');
    return Array.isArray(list) ? list : [];
  } catch { return []; }
}

function saveBannedUsers(list) {
  try { localStorage.setItem('wandershare_banned_users', JSON.stringify(list)); } catch { }
}

function isUserBanned(name) {
  const norm = String(name || '').trim().toLowerCase();
  if (!norm) return false;
  return getBannedUsers().some(b => String(b).trim().toLowerCase() === norm);
}

async function adminBanUser(name) {
  if (typeof isAdminUser !== 'function' || !isAdminUser()) {
    showToast('🔒 Admin access only.', 'error');
    return;
  }
  const target = String(name || '').trim();
  if (!target) return;
  const reason = await wsPrompt({
    title: 'Ban this user?',
    message: `You are banning "${target}". Write a reason to send to their message box:`,
    placeholder: 'e.g. Repeatedly breaking the community guidelines.',
    confirmText: 'Ban & Send',
    cancelText: 'Cancel'
  });
  if (reason === null) return;
  if (!reason) {
    showToast('⚠️ You must write a reason before banning.', 'error');
    return;
  }
  const list = getBannedUsers();
  const norm = target.toLowerCase();
  if (!list.some(b => String(b).toLowerCase() === norm)) {
    list.push(target);
    saveBannedUsers(list);
  }
  await sendAdminMessageToUser(target, 'You have been banned from WanderShare.\n\nReason: ' + reason);
  showToast(`🚫 ${target} has been banned. Reason sent.`, 'success');
  refreshCurrentView();
  renderBannedUsersList();
}

function adminUnbanUser(name) {
  if (typeof isAdminUser !== 'function' || !isAdminUser()) {
    showToast('🔒 Admin access only.', 'error');
    return;
  }
  const norm = String(name || '').trim().toLowerCase();
  const list = getBannedUsers().filter(b => String(b).trim().toLowerCase() !== norm);
  saveBannedUsers(list);
  showToast(`✅ ${name} unbanned.`, 'success');
  refreshCurrentView();
  renderBannedUsersList();
}

function renderBannedUsersList() {
  const list = $('banned-list');
  if (!list) return;
  const banned = getBannedUsers();
  list.innerHTML = '';
  if (banned.length === 0) {
    list.innerHTML = '<div style="font-size:0.82rem;color:var(--text-muted);">No banned users.</div>';
    return;
  }
  banned.forEach(name => {
    const row = document.createElement('div');
    row.style.cssText = 'display:flex;align-items:center;justify-content:space-between;gap:0.5rem;background:rgba(255,85,85,0.06);border:1px solid rgba(255,85,85,0.2);border-radius:10px;padding:0.45rem 0.7rem;';
    row.innerHTML = `<span style="font-size:0.85rem;color:var(--text-primary);">🚫 ${name}</span>
      <button type="button" class="btn-secondary" onclick="adminUnbanUser('${String(name).replace(/'/g, "\\'")}')" style="padding:0.3rem 0.8rem;font-size:0.75rem;">✅ Unban</button>`;
    list.appendChild(row);
  });
}

function initWorldMap(savedLocations, myPosts) {
  const container = $('world-map');
  if (!container || typeof L === 'undefined') return;

  if (!leafletMap) {
    leafletMap = L.map('world-map', {
      center: [20, 0],
      zoom: 2,
      minZoom: 1.5,
      maxZoom: 14,
      worldCopyJump: true,
      zoomControl: true,
      maxBounds: [[-85, -220], [85, 220]],
      maxBoundsViscosity: 0.1
    });

    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      maxZoom: 19,
      noWrap: false
    }).addTo(leafletMap);
  }

  leafletMarkers.forEach(m => leafletMap.removeLayer(m));
  leafletMarkers = [];

  const mapLocations = [];
  const counterPill = $('map-counter-pill');

  savedLocations.forEach(item => {
    const coords = (item.lat && item.lng) ? { lat: item.lat, lng: item.lng } : getLocationCoords(item.destination, item.country, item.region);
    mapLocations.push({
      id: item.postId,
      title: item.title,
      destination: item.destination,
      country: item.country,
      image: item.image,
      type: 'saved',
      lat: coords.lat,
      lng: coords.lng
    });
  });

  myPosts.forEach(post => {
    if (!mapLocations.some(l => l.id === post.id)) {
      const coords = getLocationCoords(post.destination, post.country, post.region);
      mapLocations.push({
        id: post.id,
        title: post.title,
        destination: post.destination,
        country: post.country,
        image: post.image,
        type: 'posted',
        lat: coords.lat,
        lng: coords.lng
      });
    }
  });

  if (counterPill) {
    counterPill.textContent = `📌 ${mapLocations.length} location${mapLocations.length === 1 ? '' : 's'} on map`;
  }

  const createMapPinIcon = (type) => L.divIcon({
    className: 'custom-map-pin-wrapper',
    html: `<div class="custom-map-pin ${type === 'posted' ? 'posted-pin' : 'saved-pin'}">
             <span>${type === 'posted' ? '✈️' : '📌'}</span>
           </div>`,
    iconSize: [36, 36],
    iconAnchor: [18, 36],
    popupAnchor: [0, -32]
  });

  mapLocations.forEach(loc => {
    const marker = L.marker([loc.lat, loc.lng], { icon: createMapPinIcon(loc.type) }).addTo(leafletMap);
    const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(loc.destination + ', ' + loc.country)}`;

    const popupContent = `
      <div class="map-popup-card">
        <img class="map-popup-img" src="${loc.image}" alt="${loc.destination}">
        <div class="map-popup-body">
          <span class="map-popup-type">${loc.type === 'posted' ? '✈️ My Adventure' : '📌 Saved Location'}</span>
          <h4 class="map-popup-title">${loc.title}</h4>
          <p class="map-popup-loc">📍 ${loc.destination}, ${loc.country}</p>
          <div class="map-popup-actions">
            <button class="map-popup-btn primary" onclick="openPostDetailById('${loc.id}')">📖 Read Story</button>
            <a href="${googleMapsUrl}" target="_blank" rel="noopener noreferrer" class="map-popup-btn google">🗺️ Google World Map</a>
          </div>
        </div>
      </div>
    `;

    marker.bindPopup(popupContent, { maxWidth: 280, className: 'custom-leaflet-popup' });
    leafletMarkers.push(marker);
  });

  if (mapLocations.length > 0) {
    const bounds = L.latLngBounds(mapLocations.map(l => [l.lat, l.lng]));
    leafletMap.fitBounds(bounds, { padding: [60, 60], maxZoom: 5 });
  } else {
    leafletMap.setView([20, 0], 2);
  }

  setTimeout(() => {
    if (leafletMap) leafletMap.invalidateSize();
  }, 100);
  setTimeout(() => {
    if (leafletMap) leafletMap.invalidateSize();
  }, 350);

  if (currentMapView === '3d') {
    render3DGlobe(savedLocations, myPosts);
  }
}

let currentMapView = '2d';
let globeInstance = null;

function switchMapView(mode) {
  currentMapView = mode;
  const btn2d = $('btn-view-2d');
  const btn3d = $('btn-view-3d');
  const map2d = $('world-map');
  const globe3d = $('globe-container');
  const hintText = $('map-hint-text');

  if (btn2d) btn2d.classList.toggle('active', mode === '2d');
  if (btn3d) btn3d.classList.toggle('active', mode === '3d');

  if (mode === '2d') {
    if (map2d) map2d.style.display = 'block';
    if (globe3d) globe3d.style.display = 'none';
    if (hintText) hintText.textContent = '💡 Click any pin on the 2D map to view trip details, directions, or open in Google World Map.';
    setTimeout(() => { if (leafletMap) leafletMap.invalidateSize(); }, 150);
  } else {
    if (map2d) map2d.style.display = 'none';
    if (globe3d) globe3d.style.display = 'block';
    if (hintText) hintText.textContent = '🌐 Drag in 360° to rotate the 3D Earth Globe. Click any location pin to view details!';
    const savedLocations = getSavedLocationsForCurrentUser();
    const myPosts = allPosts.filter(p => p.author === (currentUser ? getDisplayName() : ''));
    render3DGlobe(savedLocations, myPosts);
  }
}

function render3DGlobe(savedLocations, myPosts) {
  const container = $('globe-container');
  if (!container || typeof Globe === 'undefined') return;

  const mapLocations = [];
  savedLocations.forEach(item => {
    const coords = (item.lat && item.lng) ? { lat: item.lat, lng: item.lng } : getLocationCoords(item.destination, item.country, item.region);
    mapLocations.push({
      id: item.postId,
      title: item.title,
      destination: item.destination,
      country: item.country,
      image: item.image,
      type: 'saved',
      lat: Number(coords.lat),
      lng: Number(coords.lng)
    });
  });

  myPosts.forEach(post => {
    if (!mapLocations.some(l => l.id === post.id)) {
      const coords = getLocationCoords(post.destination, post.country, post.region);
      mapLocations.push({
        id: post.id,
        title: post.title,
        destination: post.destination,
        country: post.country,
        image: post.image,
        type: 'posted',
        lat: Number(coords.lat),
        lng: Number(coords.lng)
      });
    }
  });

  container.innerHTML = '';

  try {
    globeInstance = Globe()(container)
      .globeImageUrl('https://unpkg.com/three-globe/example/img/earth-night.jpg')
      .bumpImageUrl('https://unpkg.com/three-globe/example/img/earth-topology.png')
      .backgroundImageUrl('https://unpkg.com/three-globe/example/img/night-sky.png')
      .width(container.clientWidth || 800)
      .height(520)
      .atmosphereColor('#6FC4B8')
      .atmosphereAltitude(0.2)
      .htmlElementsData(mapLocations)
      .htmlLat('lat')
      .htmlLng('lng')
      .htmlElement(d => {
        const el = document.createElement('div');
        el.className = `custom-map-pin ${d.type === 'posted' ? 'posted-pin' : 'saved-pin'}`;
        el.innerHTML = `<span>${d.type === 'posted' ? '✈️' : '📌'}</span>`;
        el.style.cursor = 'pointer';
        el.style.pointerEvents = 'auto';
        el.title = `${d.title} (${d.destination}, ${d.country})`;
        el.onclick = (e) => {
          e.stopPropagation();
          openPostDetailById(d.id);
        };
        return el;
      });

    const controls = globeInstance.controls();
    if (controls) {
      controls.autoRotate = true;
      controls.autoRotateSpeed = 0.8;
      controls.enableZoom = true;
    }
    globeInstance.pointOfView({ lat: 20, lng: 0, altitude: 2.2 }, 1000);
  } catch (err) {
    console.warn('3D Globe initialization error:', err);
  }
}

function openPostDetailById(postId) {
  const post = allPosts.find(p => p.id === postId);
  if (post) openPostDetail(post);
}

function initProfileForm() {
  const form = $('profile-share-form');
  const imgInput = $('profile-photo-input');
  const preview = $('profile-photo-preview');
  const zone = $('profile-upload-zone');
  if (!form) return;

  let profileSelectedTags = [];

  if (imgInput) {
    imgInput.addEventListener('change', () => {
      const file = imgInput.files[0];
      if (!file) return;
      if (!file.type.startsWith('image/')) { showToast('Please upload an image file.', 'error'); imgInput.value = ''; return; }
      if (file.size > 5 * 1024 * 1024) { showToast('Image must be under 5MB.', 'error'); imgInput.value = ''; return; }
      compressImageFile(file).then(dataUrl => {
        preview.src = dataUrl;
        preview.classList.add('visible');
      }).catch(() => {
        const reader = new FileReader();
        reader.onload = ev => { preview.src = ev.target.result; preview.classList.add('visible'); };
        reader.readAsDataURL(file);
      });
    });
  }

  if (zone) {
    zone.addEventListener('dragover', e => { e.preventDefault(); zone.classList.add('dragover'); });
    zone.addEventListener('dragleave', () => zone.classList.remove('dragover'));
    zone.addEventListener('drop', e => {
      e.preventDefault(); zone.classList.remove('dragover');
      const file = e.dataTransfer.files[0];
      if (file && file.type.startsWith('image/')) { imgInput.files = e.dataTransfer.files; imgInput.dispatchEvent(new Event('change')); }
    });
  }

  const tagContainer = $('profile-tags-grid');
  if (tagContainer) {
    tagContainer.querySelectorAll('.tag-toggle').forEach(btn => {
      btn.addEventListener('click', () => {
        btn.classList.toggle('selected');
        const tag = btn.dataset.tag;
        if (btn.classList.contains('selected')) { if (!profileSelectedTags.includes(tag)) profileSelectedTags.push(tag); }
        else { profileSelectedTags = profileSelectedTags.filter(t => t !== tag); }
      });
    });
  }

  form.addEventListener('submit', async e => {
    e.preventDefault();
    if (!currentUser || isGuest) {
      showToast('Please sign in with a real account to share your adventure.', 'error');
      return;
    }
    if (typeof isUserBanned === 'function' && isUserBanned(getDisplayName())) {
      showToast('🚫 You have been banned and can no longer post.', 'error');
      return;
    }

    const title = sanitizeText($('profile-trip-title').value);
    const destination = sanitizeText($('profile-trip-destination').value);
    const country = sanitizeText($('profile-trip-country').value);
    const region = $('profile-trip-region').value;
    const author = currentUser ? getDisplayName() : 'Explorer';
    const shortDesc = sanitizeText($('profile-trip-short').value);
    const story = sanitizeText($('profile-trip-story').value);
    const image = (preview && preview.classList.contains('visible')) ? preview.src : getRandomFallback();

    const data = { title, destination, country, region, author, shortDesc, story };
    const v = validatePostContent(data, 'profile-agree-guidelines');
    if (!v.ok) { showToast(v.msg, 'error'); return; }

    const postId = 'user-' + Date.now();

    const privacyRadio = form.querySelector('input[name="profile-post-privacy"]:checked');
    const privacy = privacyRadio ? privacyRadio.value : 'public';

    const newPost = {
      id: postId, title, destination, country, region,
      author, shortDesc, story, image, images: [image], privacy,
      authorKey: getCurrentUserKey() || author,
      tags: profileSelectedTags.length ? profileSelectedTags : ['Adventure'],
      date: new Date().toISOString().split('T')[0],
      likes: 0, liked: false, reported: false
    };

    allPosts.unshift(newPost);
    saveUserPosts();
    if (typeof savePostToFirestore === 'function') savePostToFirestore(newPost);
    updateDynamicHeroStats();
    if (document.getElementById('explore-world-map')) {
      initExploreWorldMap();
    }

    if (currentUser && privacy !== 'only-me') {
      const userKey = getCurrentUserKey();
      const saved = getSavedLocationsForCurrentUser();
      if (!saved.some(s => s.postId === newPost.id)) {
        saved.unshift(getSavedLocationEntry(newPost));
        savedLocationsStore[userKey] = saved;
        saveSavedLocations();
      }
    }

    const privacyMsg = privacy === 'only-me' ? '🔒 Saved privately - only you can see this.' : privacy === 'followers' ? '👥 Shared with your followers!' : '✈️ Adventure published to your World Map!';
    showToast(privacyMsg, 'success');
    form.reset();
    if (preview) { preview.src = ''; preview.classList.remove('visible'); }
    profileSelectedTags = [];
    if (tagContainer) tagContainer.querySelectorAll('.tag-toggle').forEach(b => b.classList.remove('selected'));

    switchProfileTab('saved');
    renderProfilePage();
  });
}

function initOwnerPanel() {
  const panel = $('owner-panel');
  if (!panel) return;

  if (typeof isOwnerUser === 'function' && isOwnerUser()) {
    panel.style.display = 'block';
  } else {
    panel.style.display = 'none';
    return;
  }

  if (typeof isAdminUser === 'function' && isAdminUser()) {
    renderAdminControls(panel);
  }

  const form = $('owner-location-form');
  if (!form || form.dataset.bound === 'true') return;
  form.dataset.bound = 'true';

  form.addEventListener('submit', e => {
    e.preventDefault();
    const title = sanitizeText($('owner-title').value);
    const destination = sanitizeText($('owner-destination').value);
    const country = sanitizeText($('owner-country').value);
    const region = $('owner-region').value;
    const shortDesc = sanitizeText($('owner-short').value);
    const story = sanitizeText($('owner-story').value);
    const imageUrl = sanitizeText($('owner-image').value) || getRandomFallback();
    const tags = sanitizeText($('owner-tags').value)
      .split(',')
      .map(tag => tag.trim())
      .filter(Boolean)
      .slice(0, 5);

    if (!title || !destination || !country || !region || !shortDesc) {
      showToast('Fill in all required owner location fields.', 'error');
      return;
    }

    const newPost = {
      id: 'generated-place-' + Date.now(),
      title,
      destination,
      country,
      region,
      author: 'WanderShare',
      shortDesc,
      story: story || shortDesc,
      image: imageUrl,
      images: [imageUrl],
      privacy: 'public',
      tags: tags.length ? tags : ['Travel'],
      date: new Date().toISOString().split('T')[0],
      likes: 0,
      liked: false,
      reported: false
    };

    allPosts.unshift(newPost);
    saveUserPosts();
    if (typeof savePostToFirestore === 'function') savePostToFirestore(newPost);
    updateDynamicHeroStats();
    if (document.getElementById('explore-world-map')) {
      initExploreWorldMap();
    }
    form.reset();
    showToast('⭐ Featured location published to the community!', 'success');

    const page = getPage();
    if (page === 'explore') {
      renderFeed();
      initExploreWorldMap();
    } else if (page === 'home') {
      renderPreviewPosts();
    } else if (page === 'inspire') {
      renderFeaturedDestinations();
    } else if (page === 'profile') {
      renderProfilePage();
    }
  });
}

/* ============ TOP MEMBERS ============ */
const DEFAULT_TOP_MEMBERS = [
  { name: 'Hashen Fernando', title: 'Community Founder' },
  { name: 'Chanuki Marambage', title: 'Top Explorer' },
  { name: 'Ivan Tharindu', title: 'Funder & Investor' }
];

function getTopMembers() {
  try {
    const saved = localStorage.getItem('wandershare_top_members');
    if (saved) {
      const list = JSON.parse(saved);
      return Array.isArray(list) ? list : DEFAULT_TOP_MEMBERS.slice();
    }
  } catch { }
  return DEFAULT_TOP_MEMBERS.slice();
}

function saveTopMembers(list) {
  try { localStorage.setItem('wandershare_top_members', JSON.stringify(list)); } catch { }
}

function renderTopMembers() {
  const section = $('top-members-section');
  const grid = $('top-members-grid');
  if (!section || !grid) return;

  const members = getTopMembers();
  if (!members.length) {
    section.style.display = 'none';
    grid.innerHTML = '';
    return;
  }

  section.style.display = '';
  grid.innerHTML = '';
  members.slice(0, 12).forEach((member, i) => {
    const name = sanitizeText(member.name);
    const title = sanitizeText(member.title);
    const initials = name.split(/\s+/).map(w => w[0]).join('').slice(0, 2).toUpperCase() || '⭐';
    const card = document.createElement('div');
    card.className = 'top-member-card fade-in';
    card.style.transitionDelay = `${Math.min(i * 70, 420)}ms`;
    card.setAttribute('role', 'listitem');
    card.innerHTML = `
      <div class="top-member-avatar">${escHTML(initials)}</div>
      <div class="top-member-info">
        <div class="top-member-name">${escHTML(name)}</div>
        <div class="top-member-badge">⭐ Top Member</div>
        ${title ? `<div class="top-member-title">${escHTML(title)}</div>` : ''}
      </div>`;
    grid.appendChild(card);
  });
}

function initTopMembersSection() {
  let section = $('top-members-section');
  if (!section) {
    const footer = qs('footer');
    if (!footer) return;
    section = document.createElement('section');
    section.className = 'top-members-section';
    section.id = 'top-members-section';
    section.setAttribute('aria-label', 'Top community members');
    section.style.display = 'none';
    section.innerHTML = `
      <div class="container">
        <div class="section-header fade-in">
          <span class="section-eyebrow">⭐ Top Members</span>
          <h2 class="section-title">Our <em>Star</em> Travellers</h2>
          <p class="section-subtitle">Recognized by WanderShare for sharing amazing journeys with the community.</p>
        </div>
        <div class="top-members-grid" id="top-members-grid" role="list"></div>
      </div>`;
    footer.parentElement.insertBefore(section, footer);
  }
  renderTopMembers();
  initScrollAnimations();
}

function renderTopMembersList() {
  const list = $('tm-list');
  if (!list) return;
  const members = getTopMembers();
  list.innerHTML = '';
  if (!members.length) {
    list.innerHTML = '<p style="font-size:0.82rem;color:var(--text-muted);">No top members yet.</p>';
    return;
  }
  members.forEach(member => {
    const row = document.createElement('div');
    row.className = 'tm-list-item';
    row.innerHTML = `
      <span class="tm-list-name">⭐ ${escHTML(sanitizeText(member.name))}</span>
      <button type="button" class="tm-list-remove" data-name="${escHTML(sanitizeText(member.name))}" aria-label="Remove ${escHTML(sanitizeText(member.name))}">✕</button>`;
    row.querySelector('.tm-list-remove').addEventListener('click', () => adminRemoveTopMember(member.name));
    list.appendChild(row);
  });
}

function adminAddTopMember() {
  if (typeof isAdminUser !== 'function' || !isAdminUser()) {
    showToast('🔒 Admin access only.', 'error');
    return;
  }
  const nameInput = $('tm-name-input');
  const titleInput = $('tm-title-input');
  const name = sanitizeText(nameInput ? nameInput.value : '');
  const title = sanitizeText(titleInput ? titleInput.value : '');
  if (!name) { showToast('Please enter the member name.', 'error'); return; }

  const members = getTopMembers();
  if (members.some(m => String(m.name).toLowerCase() === name.toLowerCase())) {
    showToast('That person is already a top member.', 'error');
    return;
  }

  members.push({ name, title });
  saveTopMembers(members);
  if (nameInput) nameInput.value = '';
  if (titleInput) titleInput.value = '';
  renderTopMembersList();
  renderTopMembers();
  showToast(`⭐ ${name} is now a Top Member!`, 'success');
}

function adminRemoveTopMember(name) {
  if (typeof isAdminUser !== 'function' || !isAdminUser()) {
    showToast('🔒 Admin access only.', 'error');
    return;
  }
  if (typeof wsConfirm !== 'function') {
    const members = getTopMembers().filter(m => m.name !== name);
    saveTopMembers(members);
    renderTopMembersList();
    renderTopMembers();
    showToast('⭐ Top member removed.', 'success');
    return;
  }
  wsConfirm({
    title: 'Remove top member?',
    message: `Remove ${name} from the Top Members list?`,
    confirmText: 'Remove',
    cancelText: 'Cancel',
    danger: true
  }).then(ok => {
    if (!ok) return;
    const members = getTopMembers().filter(m => m.name !== name);
    saveTopMembers(members);
    renderTopMembersList();
    renderTopMembers();
    showToast('⭐ Top member removed.', 'success');
  });
}

function renderAdminControls(panel) {
  const card = panel.querySelector('.owner-panel-card');
  if (!card || card.querySelector('.admin-controls')) return;

  const controls = document.createElement('div');
  controls.className = 'admin-controls';
  controls.style.cssText = 'margin-top:1.75rem;padding-top:1.5rem;border-top:1px solid var(--glass-border);';
  controls.innerHTML = `
    <h3 style="margin-bottom:0.9rem;font-size:1.05rem;">🛡️ Admin Controls</h3>
    <div style="display:flex;gap:0.6rem;flex-wrap:wrap;">
      <button class="btn-secondary" onclick="downloadAllPhotos()">📥 Download All Photos</button>
      <button class="btn-secondary" onclick="adminRemoveAllUsers()">👥 Remove All Users</button>
    </div>
    <div class="admin-top-members" style="margin-top:1.25rem;">
      <h4 style="font-size:0.95rem;margin-bottom:0.6rem;">⭐ Top Members
        <span style="color:var(--text-muted);font-weight:400;font-size:0.78rem;">(shown on the home page)</span></h4>
      <div style="display:flex;gap:0.5rem;flex-wrap:wrap;align-items:center;">
        <input type="text" id="tm-name-input" placeholder="Member name" class="form-input" style="flex:1;min-width:140px;" />
        <input type="text" id="tm-title-input" placeholder="Title, e.g. Best Photographer" class="form-input" style="flex:1;min-width:140px;" />
        <button type="button" class="btn-secondary" onclick="adminAddTopMember()">➕ Add</button>
      </div>
      <div id="tm-list" style="display:flex;flex-direction:column;gap:0.5rem;margin-top:0.75rem;"></div>
    </div>
    <div class="admin-bans" style="margin-top:1.25rem;">
      <h4 style="font-size:0.95rem;margin-bottom:0.6rem;">🚫 Banned Users
        <span style="color:var(--text-muted);font-weight:400;font-size:0.78rem;">(their posts are hidden)</span></h4>
      <div id="banned-list" style="display:flex;flex-direction:column;gap:0.5rem;margin-top:0.75rem;"></div>
    </div>
    <div class="admin-reports" style="margin-top:1.25rem;">
      <h4 style="font-size:0.95rem;margin-bottom:0.6rem;">🚩 Reported Posts
        <span style="color:var(--text-muted);font-weight:400;font-size:0.78rem;">(you decide: remove or keep)</span></h4>
      <div id="reported-list" style="display:flex;flex-direction:column;gap:0.5rem;margin-top:0.75rem;"></div>
    </div>
    <div class="admin-users" style="margin-top:1.25rem;">
      <h4 style="font-size:0.95rem;margin-bottom:0.6rem;">👥 Registered Users
        <span style="color:var(--text-muted);font-weight:400;font-size:0.78rem;">(emails visible to admin only)</span></h4>
      <button type="button" class="btn-secondary" onclick="loadAdminUsers()" style="font-size:0.8rem;padding:0.45rem 0.9rem;">🔍 Show User Emails</button>
      <div id="admin-users-list" style="display:flex;flex-direction:column;gap:0.5rem;margin-top:0.75rem;"></div>
    </div>
    <p style="font-size:0.8rem;color:var(--text-muted);margin-top:0.75rem;">
      Signed in as admin <strong style="color:var(--gold);">hashenf99@gmail.com</strong>. You can delete any post or ban any user using the buttons on each story.
    </p>`;
  card.appendChild(controls);
  renderTopMembersList();
  renderBannedUsersList();
  renderReportedPostsList();
}

async function loadAdminUsers() {
  if (typeof isAdminUser !== 'function' || !isAdminUser()) {
    showToast('🔒 Admin access only.', 'error');
    return;
  }
  const list = $('admin-users-list');
  if (!list) return;
  if (typeof listUsersFromFirestore !== 'function') {
    list.innerHTML = '<div style="font-size:0.8rem;color:var(--text-muted);">Cloud not connected yet. Emails appear once users log in after you enable this.</div>';
    return;
  }
  list.innerHTML = '<div style="font-size:0.8rem;color:var(--text-muted);">Loading users…</div>';
  const users = await listUsersFromFirestore();
  if (!users.length) {
    list.innerHTML = '<div style="font-size:0.8rem;color:var(--text-muted);">No registered users yet. Emails appear here as people log in with Google.</div>';
    return;
  }
  list.innerHTML = '';
  users.forEach(u => {
    const row = document.createElement('div');
    row.className = 'admin-user-row';
    row.style.cssText = 'border:1px solid rgba(0,229,255,0.18);border-radius:10px;overflow:hidden;background:rgba(0,229,255,0.04);';
    const header = document.createElement('button');
    header.type = 'button';
    header.style.cssText = 'width:100%;display:flex;align-items:center;justify-content:space-between;gap:0.5rem;background:none;border:none;cursor:pointer;padding:0.55rem 0.75rem;color:inherit;font-family:inherit;text-align:left;';
    header.innerHTML = `
      <span style="display:flex;align-items:center;gap:0.5rem;min-width:0;">
        <span style="font-size:0.85rem;color:var(--text-primary);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${escHTML(u.displayName || 'User')}</span>
      </span>
      <span style="display:flex;align-items:center;gap:0.6rem;flex-shrink:0;">
        <span style="font-size:0.78rem;color:var(--text-muted);">${escHTML(u.email || '—')}</span>
        <span class="admin-user-toggle" style="font-size:0.8rem;color:var(--teal);">▸</span>
      </span>`;
    const detail = document.createElement('div');
    detail.className = 'admin-user-detail';
    detail.style.cssText = 'display:none;padding:0.6rem 0.75rem;border-top:1px solid rgba(0,229,255,0.14);';
    header.addEventListener('click', () => {
      const open = detail.style.display === 'block';
      detail.style.display = open ? 'none' : 'block';
      const toggle = header.querySelector('.admin-user-toggle');
      if (toggle) toggle.textContent = open ? '▸' : '▾';
      if (!open) renderUserDetail(detail, u);
    });
    row.appendChild(header);
    row.appendChild(detail);
    list.appendChild(row);
  });
}

function renderUserDetail(detailEl, user) {
  const userName = user.displayName || user.email?.split('@')[0] || '';
  const userKey = user.uid || user.email || '';
  const posts = allPosts.filter(p =>
    p.author === userName ||
    (p.authorKey && p.authorKey === userKey) ||
    (user.email && String(p.author || '').toLowerCase() === String(user.email).toLowerCase())
  );
  const totalLikes = posts.reduce((sum, p) => sum + (Number(p.likes) || 0), 0);
  const ratedCount = posts.filter(p => p.ratingCount > 0).length;
  const followersCount = userKey ? getFollowersCount(userName) : 0;

  let postsHtml = '';
  if (!posts.length) {
    postsHtml = '<div style="font-size:0.78rem;color:var(--text-muted);padding:0.4rem 0;">No posts found for this user.</div>';
  } else {
    postsHtml = posts.map(p => `
      <button type="button" onclick="openPostDetailById('${String(p.id).replace(/'/g, "\\'")}')" style="display:flex;align-items:center;justify-content:space-between;gap:0.5rem;width:100%;background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.08);border-radius:8px;padding:0.5rem 0.65rem;margin-bottom:0.4rem;cursor:pointer;color:inherit;font-family:inherit;text-align:left;">
        <span style="min-width:0;font-size:0.82rem;color:var(--text-primary);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${escHTML(p.title || 'Untitled')}</span>
        <span style="display:flex;gap:0.5rem;flex-shrink:0;font-size:0.72rem;color:var(--text-muted);">
          <span>❤️ ${Number(p.likes) || 0}</span>
          <span>⭐ ${p.ratingCount ? `${formatRating(p.rating)}` : '—'}</span>
          <span>📍 ${escHTML(p.destination || '')}</span>
        </span>
      </button>`).join('');
  }

  detailEl.innerHTML = `
    <div style="display:grid;grid-template-columns:repeat(2,1fr);gap:0.5rem;margin-bottom:0.7rem;">
      <div style="background:rgba(255,255,255,0.04);border-radius:8px;padding:0.45rem 0.6rem;">
        <div style="font-size:0.7rem;color:var(--text-muted);">Posts</div>
        <div style="font-size:1rem;font-weight:700;color:var(--text-primary);">${posts.length}</div>
      </div>
      <div style="background:rgba(255,255,255,0.04);border-radius:8px;padding:0.45rem 0.6rem;">
        <div style="font-size:0.7rem;color:var(--text-muted);">Total Likes</div>
        <div style="font-size:1rem;font-weight:700;color:var(--text-primary);">${totalLikes}</div>
      </div>
      <div style="background:rgba(255,255,255,0.04);border-radius:8px;padding:0.45rem 0.6rem;">
        <div style="font-size:0.7rem;color:var(--text-muted);">Rated Trips</div>
        <div style="font-size:1rem;font-weight:700;color:var(--text-primary);">${ratedCount}</div>
      </div>
      <div style="background:rgba(255,255,255,0.04);border-radius:8px;padding:0.45rem 0.6rem;">
        <div style="font-size:0.7rem;color:var(--text-muted);">Followers</div>
        <div style="font-size:1rem;font-weight:700;color:var(--text-primary);">${followersCount}</div>
      </div>
    </div>
    <div style="font-size:0.75rem;font-weight:700;color:var(--teal);margin-bottom:0.4rem;">📸 Their Posts <span style="color:var(--text-muted);font-weight:400;">(click to open full story)</span></div>
    ${postsHtml}
    <div style="display:flex;gap:0.4rem;margin-top:0.5rem;flex-wrap:wrap;">
      <button type="button" class="btn-secondary" onclick="adminBanUser('${String(userName).replace(/'/g, "\\'")}')" style="font-size:0.72rem;padding:0.35rem 0.7rem;">🚫 Ban User</button>
      <button type="button" class="btn-secondary" onclick="adminDeleteAllUserPosts('${String(userName).replace(/'/g, "\\'")}')" style="font-size:0.72rem;padding:0.35rem 0.7rem;">🗑️ Delete All Posts</button>
    </div>`;
}

async function adminDeleteAllUserPosts(name) {
  if (typeof isAdminUser !== 'function' || !isAdminUser()) {
    showToast('🔒 Admin access only.', 'error');
    return;
  }
  const target = String(name || '').trim();
  const userPosts = allPosts.filter(p => p.author === target);
  if (!userPosts.length) {
    showToast('No posts found for this user.', 'error');
    return;
  }
  const reason = await wsPrompt({
    title: 'Delete all posts?',
    message: `You are deleting all ${userPosts.length} post(s) by ${target}. Write a reason to send to their message box:`,
    placeholder: 'e.g. These posts seriously break our community guidelines.',
    confirmText: 'Delete All & Send',
    cancelText: 'Cancel'
  });
  if (reason === null) return;
  if (!reason) {
    showToast('⚠️ You must write a reason before deleting.', 'error');
    return;
  }
  for (const p of userPosts) {
    if (typeof deletePostFromFirestore === 'function') deletePostFromFirestore(p.id);
  }
  allPosts = allPosts.filter(p => p.author !== target);
  saveUserPosts();
  await sendAdminMessageToUser(target, `All your posts (${userPosts.length}) were deleted by the admin.\n\nReason: ` + reason);
  updateDynamicHeroStats();
  refreshCurrentView();
  showToast(`🗑️ Deleted all ${userPosts.length} post(s) by ${target}. Reason sent.`, 'success');
}

const PRESET_COUNTRIES = {
  'Greece': { capital: 'Athens', image: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?w=800&q=80', region: 'Europe' },
  'Japan': { capital: 'Tokyo', image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=800&q=80', region: 'Asia' },
  'Argentina': { capital: 'Buenos Aires', image: 'https://images.unsplash.com/photo-1612294037637-ec328d0e075e?w=800&q=80', region: 'Americas' },
  'Maldives': { capital: 'Malé', image: 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=800&q=80', region: 'Asia' },
  'South Africa': { capital: 'Pretoria', image: 'https://images.unsplash.com/photo-1580060839134-75a5edca2e99?w=800&q=80', region: 'Africa' },
  'New Zealand': { capital: 'Wellington', image: 'https://images.unsplash.com/photo-1507699622108-4be3abd695ad?w=800&q=80', region: 'Oceania' },
  'Italy': { capital: 'Rome', image: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=800&q=80', region: 'Europe' },
  'France': { capital: 'Paris', image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800&q=80', region: 'Europe' },
  'United Kingdom': { capital: 'London', image: 'https://images.unsplash.com/photo-1529655683826-aba9b3e77383?w=800&q=80', region: 'Europe' },
  'United States': { capital: 'Washington, D.C.', image: 'https://images.unsplash.com/photo-1485738422979-f5c462d49f74?w=800&q=80', region: 'Americas' },
  'Canada': { capital: 'Ottawa', image: 'https://images.unsplash.com/photo-1503614472-8c93d56e92ce?w=800&q=80', region: 'Americas' },
  'Brazil': { capital: 'Brasília', image: 'https://images.unsplash.com/photo-1483728642387-6c3bdd6c93e5?w=800&q=80', region: 'Americas' },
  'Australia': { capital: 'Canberra', image: 'https://images.unsplash.com/photo-1524820197278-540916411e20?w=800&q=80', region: 'Oceania' },
  'Iceland': { capital: 'Reykjavik', image: 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=800&q=80', region: 'Europe' },
  'Morocco': { capital: 'Rabat', image: 'https://images.unsplash.com/photo-1539650116574-8efeb43e2750?w=800&q=80', region: 'Africa' },
  'Peru': { capital: 'Lima', image: 'https://images.unsplash.com/photo-1526392060635-9d6019884377?w=800&q=80', region: 'Americas' },
  'Spain': { capital: 'Madrid', image: 'https://images.unsplash.com/photo-1509840841025-9088ba78a826?w=800&q=80', region: 'Europe' },
  'UAE': { capital: 'Abu Dhabi', image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800&q=80', region: 'Asia' },
  'Czech Republic': { capital: 'Prague', image: 'https://images.unsplash.com/photo-1541849546-216549ae216d?w=800&q=80', region: 'Europe' },
  'Cuba': { capital: 'Havana', image: 'https://images.unsplash.com/photo-1500759285222-a95626b934cb?w=800&q=80', region: 'Americas' },
  'Jordan': { capital: 'Amman', image: 'https://images.unsplash.com/photo-1587974928442-77dc3e0dba72?w=800&q=80', region: 'Asia' },
  'Norway': { capital: 'Oslo', image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80', region: 'Europe' },
  'Switzerland': { capital: 'Bern', image: 'https://images.unsplash.com/photo-1502784444187-359ac186c5bb?w=800&q=80', region: 'Europe' },
  'Colombia': { capital: 'Bogotá', image: 'https://images.unsplash.com/photo-1533167649158-6d508895b680?w=800&q=80', region: 'Americas' },
  'India': { capital: 'New Delhi', image: 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=800&q=80', region: 'Asia' },
  'Thailand': { capital: 'Bangkok', image: 'https://images.unsplash.com/photo-1508009603885-50cf7c579365?w=800&q=80', region: 'Asia' },
  'Egypt': { capital: 'Cairo', image: 'https://images.unsplash.com/photo-1503177119275-0aa32b3a9368?w=800&q=80', region: 'Africa' },
  'Vietnam': { capital: 'Hanoi', image: 'https://images.unsplash.com/photo-1528127269322-539801943592?w=800&q=80', region: 'Asia' },
  'Mexico': { capital: 'Mexico City', image: 'https://images.unsplash.com/photo-1512813195386-6cf811ad3542?w=800&q=80', region: 'Americas' }
};

const COUNTRY_ALIASES = {
  'uk': 'United Kingdom',
  'united kingdom': 'United Kingdom',
  'great britain': 'United Kingdom',
  'britain': 'United Kingdom',
  'england': 'United Kingdom',
  'usa': 'United States',
  'united states': 'United States',
  'united states of america': 'United States',
  'america': 'United States',
  'uae': 'UAE',
  'united arab emirates': 'UAE',
  'emirates': 'UAE'
};

function normalizeCountryName(country) {
  const trimmed = String(country || '').trim();
  const lower = trimmed.toLowerCase();
  if (COUNTRY_ALIASES[lower]) return COUNTRY_ALIASES[lower];
  return trimmed.replace(/\b\w/g, c => c.toUpperCase());
}

const CAPITAL_LOOKUP = {
  'Afghanistan': 'Kabul', 'Albania': 'Tirana', 'Algeria': 'Algiers', 'Andorra': 'Andorra la Vella', 'Angola': 'Luanda',
  'Armenia': 'Yerevan', 'Austria': 'Vienna', 'Azerbaijan': 'Baku', 'Bahamas': 'Nassau', 'Bahrain': 'Manama',
  'Bangladesh': 'Dhaka', 'Barbados': 'Bridgetown', 'Belarus': 'Minsk', 'Belgium': 'Brussels', 'Belize': 'Belmopan',
  'Bolivia': 'Sucre', 'Bosnia and Herzegovina': 'Sarajevo', 'Botswana': 'Gaborone', 'Bulgaria': 'Sofia',
  'Cambodia': 'Phnom Penh', 'Cameroon': 'Yaoundé', 'Chile': 'Santiago', 'China': 'Beijing', 'Costa Rica': 'San José',
  'Croatia': 'Zagreb', 'Cyprus': 'Nicosia', 'Denmark': 'Copenhagen', 'Ecuador': 'Quito', 'Estonia': 'Tallinn',
  'Ethiopia': 'Addis Ababa', 'Fiji': 'Suva', 'Finland': 'Helsinki', 'Georgia': 'Tbilisi', 'Germany': 'Berlin',
  'Ghana': 'Accra', 'Guatemala': 'Guatemala City', 'Honduras': 'Tegucigalpa', 'Hungary': 'Budapest', 'Indonesia': 'Jakarta',
  'Iran': 'Tehran', 'Iraq': 'Baghdad', 'Ireland': 'Dublin', 'Israel': 'Jerusalem', 'Jamaica': 'Kingston',
  'Kenya': 'Nairobi', 'Korea': 'Seoul', 'South Korea': 'Seoul', 'North Korea': 'Pyongyang', 'Kuwait': 'Kuwait City',
  'Lebanon': 'Beirut', 'Libya': 'Tripoli', 'Liechtenstein': 'Vaduz', 'Lithuania': 'Vilnius', 'Luxembourg': 'Luxembourg',
  'Madagascar': 'Antananarivo', 'Malaysia': 'Kuala Lumpur', 'Malta': 'Valletta', 'Monaco': 'Monaco', 'Mongolia': 'Ulaanbaatar',
  'Montenegro': 'Podgorica', 'Myanmar': 'Naypyidaw', 'Nepal': 'Kathmandu', 'Netherlands': 'Amsterdam', 'Nicaragua': 'Managua',
  'Nigeria': 'Abuja', 'Oman': 'Muscat', 'Pakistan': 'Islamabad', 'Panama': 'Panama City', 'Paraguay': 'Asunción',
  'Philippines': 'Manila', 'Poland': 'Warsaw', 'Portugal': 'Lisbon', 'Qatar': 'Doha', 'Romania': 'Bucharest',
  'Russia': 'Moscow', 'Saudi Arabia': 'Riyadh', 'Senegal': 'Dakar', 'Serbia': 'Belgrade', 'Singapore': 'Singapore',
  'Slovakia': 'Bratislava', 'Slovenia': 'Ljubljana', 'Sri Lanka': 'Sri Jayawardenepura Kotte', 'Sweden': 'Stockholm',
  'Taiwan': 'Taipei', 'Tanzania': 'Dodoma', 'Turkey': 'Ankara', 'Ukraine': 'Kyiv', 'Uruguay': 'Montevideo',
  'Uzbekistan': 'Tashkent', 'Vatican City': 'Vatican City', 'Venezuela': 'Caracas', 'Yemen': 'Sana\'a', 'Zimbabwe': 'Harare'
};

function getCountryCapital(countryName) {
  const norm = normalizeCountryName(countryName);
  if (PRESET_COUNTRIES[norm]) return PRESET_COUNTRIES[norm].capital;
  const key = Object.keys(CAPITAL_LOOKUP).find(k => k.toLowerCase() === norm.toLowerCase());
  return key ? CAPITAL_LOOKUP[key] : 'N/A';
}

function getCountryStats() {
  const posts = allPosts.filter(post => !post.reported);

  const countryPostsMap = {};
  posts.forEach(post => {
    const country = String(post.country || '').trim();
    if (!country) return;
    const norm = normalizeCountryName(country);
    if (!countryPostsMap[norm]) countryPostsMap[norm] = [];
    countryPostsMap[norm].push(post);
  });

  const countries = Object.keys(PRESET_COUNTRIES).map(name => {
    const postsInCountry = countryPostsMap[name] || [];
    return {
      name,
      capital: PRESET_COUNTRIES[name].capital,
      image: PRESET_COUNTRIES[name].image,
      region: PRESET_COUNTRIES[name].region || 'Europe',
      postCount: postsInCountry.length,
      featuredPost: postsInCountry[0] || null
    };
  });

  Object.keys(countryPostsMap).forEach(name => {
    if (countries.some(c => c.name.toLowerCase() === name.toLowerCase())) return;
    const postsInCountry = countryPostsMap[name];
    const firstPost = postsInCountry[0];
    countries.push({
      name,
      capital: getCountryCapital(name),
      image: firstPost.image || 'https://images.unsplash.com/photo-1506012787146-f92b2d7d6d96?w=800&q=80',
      region: firstPost.region || 'Americas',
      postCount: postsInCountry.length,
      featuredPost: firstPost
    });
  });

  countries.sort((a, b) => {
    if (b.postCount !== a.postCount) {
      return b.postCount - a.postCount;
    }
    return a.name.localeCompare(b.name);
  });

  return countries;
}

let countrySearchQuery = '';

function initCountriesPage() {
  const searchInput = $('countries-search');
  if (searchInput) {
    searchInput.addEventListener('input', () => {
      countrySearchQuery = searchInput.value.trim().toLowerCase();
      renderCountriesGrid();
    });
  }
  renderCountriesGrid();
}

function renderCountriesGrid() {
  const grid = $('countries-grid');
  if (!grid) return;

  const countries = getCountryStats();

  const filtered = countries.filter(c => {
    if (!countrySearchQuery) return true;
    return c.name.toLowerCase().includes(countrySearchQuery) || c.capital.toLowerCase().includes(countrySearchQuery);
  });

  grid.innerHTML = '';
  if (filtered.length === 0) {
    grid.innerHTML = `<div class="empty-state"><div class="empty-icon">🌍</div><p>No countries found matching your search.</p></div>`;
    return;
  }

  filtered.forEach((c, idx) => {
    const card = document.createElement('div');
    card.className = 'country-card fade-in';
    card.style.animationDelay = `${idx * 0.05}s`;

    const countLabel = c.postCount === 1
      ? '1 community story'
      : c.postCount > 1
        ? `${c.postCount} community stories`
        : 'Be the first to share a story!';

    card.innerHTML = `
      <img src="${c.image}" alt="${c.name}" loading="lazy" />
      <span class="country-region-badge">${c.region}</span>
      <div class="country-card-overlay">
        <div class="country-card-header">
          <h3>${c.name}</h3>
          <span class="country-capital-badge">🏛️ Capital: ${c.capital}</span>
        </div>
        <div class="country-card-footer">
          <span class="country-posts-count">${countLabel}</span>
          <span class="country-action-btn">Explore →</span>
        </div>
      </div>
    `;

    card.addEventListener('click', () => {
      window.location.href = `explore.html?search=${encodeURIComponent(c.name)}`;
    });

    grid.appendChild(card);
  });

  initScrollAnimations();
}

const COUNTRY_LIST = [
  "Afghanistan", "Albania", "Algeria", "Andorra", "Angola", "Argentina", "Armenia", "Australia", "Austria", "Azerbaijan",
  "Bahamas", "Bahrain", "Bangladesh", "Barbados", "Belarus", "Belgium", "Belize", "Bolivia", "Bosnia and Herzegovina",
  "Botswana", "Brazil", "Bulgaria", "Cambodia", "Cameroon", "Canada", "Chile", "China", "Colombia", "Costa Rica",
  "Croatia", "Cuba", "Cyprus", "Czech Republic", "Denmark", "Ecuador", "Egypt", "Estonia", "Ethiopia", "Fiji", "Finland",
  "France", "Georgia", "Germany", "Ghana", "Greece", "Guatemala", "Honduras", "Hungary", "Iceland", "India", "Indonesia",
  "Iran", "Iraq", "Ireland", "Israel", "Italy", "Jamaica", "Japan", "Jordan", "Kenya", "Kuwait", "Lebanon", "Libya",
  "Liechtenstein", "Lithuania", "Luxembourg", "Madagascar", "Malaysia", "Maldives", "Malta", "Mexico", "Monaco", "Mongolia",
  "Montenegro", "Morocco", "Myanmar", "Nepal", "Netherlands", "New Zealand", "Nicaragua", "Nigeria", "North Korea", "Norway",
  "Oman", "Pakistan", "Panama", "Paraguay", "Peru", "Philippines", "Poland", "Portugal", "Qatar", "Romania", "Russia",
  "Saudi Arabia", "Senegal", "Serbia", "Singapore", "Slovakia", "Slovenia", "South Africa", "South Korea", "Spain",
  "Sri Lanka", "Sweden", "Switzerland", "Taiwan", "Tanzania", "Thailand", "UAE", "Ukraine", "United Kingdom", "United States",
  "Uruguay", "Uzbekistan", "Vatican City", "Venezuela", "Vietnam", "Yemen", "Zimbabwe"
];

function populateCountrySelects() {
  document.querySelectorAll('select[data-countries]').forEach(select => {
    const current = select.value;
    select.innerHTML = '<option value="">Select country…</option>' +
      COUNTRY_LIST.map(c => `<option value="${c}"${c === current ? ' selected' : ''}>${c}</option>`).join('');
  });
}
