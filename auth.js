

const FIREBASE_CONFIG = {
  apiKey: "AIzaSyDD1E7ioioyVmqTwWycw7maYxXyyfmtSR8",
  authDomain: "wandershare-dc628.firebaseapp.com",
  projectId: "wandershare-dc628",
  storageBucket: "wandershare-dc628.firebasestorage.app",
  messagingSenderId: "1018295584186",
  appId: "1:1018295584186:web:21b0dd0bd56692d2acc983"
};

const FIREBASE_READY = !!FIREBASE_CONFIG.apiKey && !FIREBASE_CONFIG.apiKey.includes("YOUR_API_KEY");

window.AUTH_RESOLVED = false;
window.FIREBASE_READY = FIREBASE_READY;

let currentUser = null;
let isGuest = false;

function getOwnerEmail() {
  return (localStorage.getItem('ws_owner_email') || '').trim().toLowerCase();
}

function claimOwnerIfNeeded() {
  if (!currentUser || !currentUser.email) return;
  if (!getOwnerEmail()) {
    localStorage.setItem('ws_owner_email', currentUser.email.toLowerCase());
  }
}

const ADMIN_EMAIL = 'hashenf99@gmail.com';

function isAdminUser() {
  const email = String((currentUser && currentUser.email) || '').trim().toLowerCase();
  return email === ADMIN_EMAIL;
}

function isOwnerUser() {
  if (isAdminUser()) return true;
  if (!currentUser || !currentUser.email) return false;
  return currentUser.email.toLowerCase() === getOwnerEmail();
}

function registerAccountEmail(email) {
  const norm = String(email || '').trim().toLowerCase();
  if (!norm) return;
  try {
    const list = JSON.parse(localStorage.getItem('wandershare_account_emails') || '[]');
    if (!Array.isArray(list)) return;
    if (!list.includes(norm)) {
      list.push(norm);
      localStorage.setItem('wandershare_account_emails', JSON.stringify(list));
    }
  } catch { }
}

function getTotalAccounts() {
  try {
    const list = JSON.parse(localStorage.getItem('wandershare_account_emails') || '[]');
    return Array.isArray(list) ? list.length : 0;
  } catch { return 0; }
}

function rememberUser(user) {
  try {
    localStorage.setItem('ws_remembered_user', JSON.stringify({
      uid: user.uid || '',
      email: user.email || '',
      displayName: user.displayName || '',
      photoURL: user.photoURL || ''
    }));
  } catch { }
}

let auth, googleProvider;

if (FIREBASE_READY) {
  try {
    firebase.initializeApp(FIREBASE_CONFIG);
    auth = firebase.auth();
    auth.setPersistence(firebase.auth.Auth.Persistence.LOCAL).catch(() => { });

    googleProvider = new firebase.auth.GoogleAuthProvider();

    googleProvider.setCustomParameters({ prompt: 'select_account' });

    auth.onAuthStateChanged(user => {
      if (user && isEmailDeleted(user.email)) {
        auth.signOut().catch(() => { });
        return;
      }
      currentUser = user;
      if (user) {
        isGuest = false;
        localStorage.removeItem('ws_guest');
        if (user.email) registerAccountEmail(user.email);
        if (user.uid && user.email && typeof saveUserEmailToFirestore === 'function') {
          saveUserEmailToFirestore(user.uid, user.email, user.displayName || '');
        }
        claimOwnerIfNeeded();
        rememberUser(user);
      } else {
        isGuest = localStorage.getItem('ws_guest') === 'true';
      }
      window.AUTH_RESOLVED = true;
      updateNavbarAuth();
      onAuthReady();
    });

    auth.getRedirectResult()
      .then(result => {
        if (result && result.user) {
          if (isEmailDeleted(result.user.email)) {
            auth.signOut().catch(() => { });
            showAuthToast('🚫 This account was deleted and cannot be used again.', 'error');
            return;
          }
          redirectAfterLogin();
        }
      })
      .catch(err => {
        if (err.code === 'auth/credential-already-in-use') return;
        if (err.code === 'auth/operation-not-supported-in-this-environment') return;
        showAuthError(err);
      });
  } catch (err) {
    console.warn('Firebase init failed:', err);
  }
} else {

  isGuest = localStorage.getItem('ws_guest') === 'true';
  claimOwnerIfNeeded();
  window.AUTH_RESOLVED = true;
  updateNavbarAuth();
  onAuthReady();
}

function onAuthReady() {
  const run = () => {
    const page = getCurrentPage();
    if (page === 'community' && typeof initCommunityAuthGate === 'function') initCommunityAuthGate();
    if (page === 'profile' && typeof initProfileAuthGate === 'function') initProfileAuthGate();
    if (typeof syncCommunityAuthorField === 'function') syncCommunityAuthorField();
    if (typeof syncRatingsForCurrentUser === 'function') syncRatingsForCurrentUser();
    if (typeof initOwnerPanel === 'function') initOwnerPanel();
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', run, { once: true });
    return;
  }

  run();
}

function getCurrentPage() {
  const path = window.location.pathname.toLowerCase();
  if (path.includes('login')) return 'login';
  if (path.includes('community')) return 'community';
  if (path.includes('inspire')) return 'inspire';
  if (path.includes('explore')) return 'explore';
  if (path.includes('profile')) return 'profile';
  return 'home';
}

function socialButtonsHTML() {
  return `
      <button class="btn-social-nav google" onclick="signInWithGoogle()" aria-label="Continue with Google" title="Continue with Google">
        <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden="true">
          <path fill="#EA4335" d="M24 9.5c3.5 0 6.3 1.2 8.4 3.2l6.3-6.3C34.9 2.9 29.9 1 24 1 14.8 1 7 6.5 3.5 14.2l7.4 5.7C12.7 13.4 17.9 9.5 24 9.5z" />
          <path fill="#4285F4" d="M46.5 24.5c0-1.6-.1-3.1-.4-4.5H24v8.5h12.7c-.5 2.8-2.2 5.2-4.7 6.8l7.3 5.7c4.3-4 6.8-9.9 6.8-16.5z" />
          <path fill="#FBBC05" d="M10.9 28.5A14.5 14.5 0 0 1 9.5 24c0-1.6.3-3.1.7-4.5L2.8 13.8A23.8 23.8 0 0 0 0 24c0 3.8.9 7.3 2.5 10.5l7.4-5.7.8-.3z" />
          <path fill="#34A853" d="M24 47c6.5 0 11.9-2.1 15.9-5.8l-7.3-5.7c-2 1.4-4.7 2.2-7.9 2.2-6.1 0-11.3-4-13.1-9.5l-7.4 5.7C7 41.5 14.8 47 24 47z" />
        </svg>
      </button>`;
}

function updateNavbarAuth() {
  const area = document.getElementById('nav-auth-area');
  if (!area) return;

  document.body.classList.toggle('logged-in', !!(currentUser && !isGuest));

  if (currentUser) {

    const name = (typeof getDisplayName === 'function') ? getDisplayName() : (currentUser.displayName || currentUser.email?.split('@')[0] || 'Traveller');
    const photo = currentUser.photoURL;
    const initials = name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
    area.innerHTML = `
      <div class="nav-user-chip" id="user-chip" aria-label="User menu" role="button" tabindex="0">
        <div class="nav-avatar">
          ${photo ? `<img src="${photo}" alt="${name}" onerror="this.style.display='none'">` : initials}
        </div>
        <span class="nav-user-name">${name.split(' ')[0]}</span>
        <span style="font-size:0.7rem; color:var(--text-muted);">▾</span>
        <div class="nav-user-dropdown" role="menu">
          <div style="padding:0.5rem 0.8rem 0.75rem; border-bottom:1px solid var(--glass-border); margin-bottom:0.4rem;">
            <div style="font-size:0.82rem; font-weight:700; color:var(--text-primary);">${name}</div>
            <div style="font-size:0.75rem; color:var(--text-muted); margin-top:0.15rem;">${currentUser.email || 'Guest'}</div>
          </div>
          <a href="community.html" class="dropdown-item" role="menuitem">✈️ Share a Trip</a>
          <a href="profile.html" class="dropdown-item" role="menuitem">👤 Profile</a>
          <div class="dropdown-divider"></div>
          <button class="dropdown-item danger" onclick="signOut()" role="menuitem">🚪 Sign Out</button>
        </div>
      </div>`;

  } else if (isGuest) {

    area.innerHTML = `
      <div class="nav-guest-badge">👻 Guest</div>
      ${socialButtonsHTML()}
      <a href="profile.html" class="btn-login-nav">Sign In</a>`;

  } else {

    area.innerHTML = `
      ${socialButtonsHTML()}
      <a href="profile.html" class="btn-login-nav" id="btn-login-nav">🔑 Login / Sign Up</a>`;
  }

  setupUserDropdown();
}

let userDropdownBound = false;
function setupUserDropdown() {
  if (userDropdownBound) return;
  userDropdownBound = true;

  document.addEventListener('click', e => {
    const chip = document.getElementById('user-chip');
    if (!chip) return;
    const toggleClicked = e.target.closest && e.target.closest('#user-chip') && !e.target.closest('.dropdown-item');
    if (toggleClicked) {
      e.stopPropagation();
      chip.classList.toggle('open');
      return;
    }
    chip.classList.remove('open');
  });

  document.addEventListener('keydown', e => {
    const chip = document.getElementById('user-chip');
    if (!chip) return;
    if (e.key === 'Escape') chip.classList.remove('open');
    if ((e.key === 'Enter' || e.key === ' ') && e.target === chip) {
      e.preventDefault();
      chip.classList.toggle('open');
    }
  });

  window.addEventListener('scroll', () => {
    const chip = document.getElementById('user-chip');
    if (chip) chip.classList.remove('open');
  }, { passive: true });
}

function isEnvAuthError(err) {
  if (!err) return false;
  const code = String(err.code || '');
  return ['auth/operation-not-supported-in-this-environment', 'auth/unauthorized-domain', 'auth/configuration-not-found', 'auth/network-request-failed'].indexOf(code) !== -1;
}

function signInWithProvider(method, provider) {
  try {
    if (!FIREBASE_READY || !auth || !provider) {
      showAuthToast('⚙️ Google login is not available right now. Please try again later.', 'error');
      return;
    }
    auth.signInWithPopup(provider)
      .then(() => {
        const signedInUser = auth.currentUser;
        if (signedInUser && isEmailDeleted(signedInUser.email)) {
          auth.signOut().catch(() => { });
          showAuthToast('🚫 This account was deleted and cannot be used again.', 'error');
          return;
        }
        redirectAfterLogin();
      })
      .catch(err => {
        if (err && err.code === 'auth/popup-closed-by-user') return;
        if (err && (err.code === 'auth/popup-blocked' || err.code === 'auth/cancelled-popup-request')) {
          if (auth && provider && typeof auth.signInWithRedirect === 'function') {
            auth.signInWithRedirect(provider).catch(err2 => showAuthError(err2));
            return;
          }
          showAuthError(err);
          return;
        }
        showAuthError(err);
      });
  } catch (e) {
    showAuthError(e);
  }
}

function signInWithGoogle() { signInWithProvider('google', googleProvider); }

function wsConfirm(opts) {
  const o = Object.assign({
    title: 'Are you sure?',
    message: '',
    confirmText: 'Yes',
    cancelText: 'Cancel',
    danger: false
  }, opts || {});
  const esc = (s) => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

  return new Promise(resolve => {
    const prev = document.getElementById('ws-confirm-overlay');
    if (prev) prev.remove();

    const overlay = document.createElement('div');
    overlay.id = 'ws-confirm-overlay';
    overlay.className = 'ws-confirm-overlay';
    overlay.innerHTML = `
      <div class="ws-confirm-modal" role="dialog" aria-modal="true" aria-label="${esc(o.title)}">
        <div class="ws-confirm-icon">${o.danger ? '⚠️' : '❓'}</div>
        <h3 class="ws-confirm-title">${esc(o.title)}</h3>
        <p class="ws-confirm-message">${esc(o.message)}</p>
        <div class="ws-confirm-actions">
          <button type="button" class="ws-confirm-btn cancel">${esc(o.cancelText)}</button>
          <button type="button" class="ws-confirm-btn ok${o.danger ? ' danger' : ''}">${esc(o.confirmText)}</button>
        </div>
      </div>`;
    document.body.appendChild(overlay);

    let done = false;
    let onKey = null;
    const finish = (val) => {
      if (done) return;
      done = true;
      document.removeEventListener('keydown', onKey);
      overlay.classList.add('closing');
      setTimeout(() => overlay.remove(), 200);
      resolve(val);
    };
    onKey = (e) => {
      if (e.key === 'Escape') finish(false);
      if (e.key === 'Enter') finish(true);
    };

    overlay.querySelector('.cancel').addEventListener('click', () => finish(false));
    overlay.querySelector('.ok').addEventListener('click', () => finish(true));
    overlay.addEventListener('click', e => { if (e.target === overlay) finish(false); });
    document.addEventListener('keydown', onKey);

    requestAnimationFrame(() => requestAnimationFrame(() => overlay.classList.add('open')));
    setTimeout(() => overlay.classList.add('open'), 80);
  });
}

function wsPrompt(opts) {
  const o = Object.assign({
    title: 'Write a message',
    message: '',
    placeholder: 'Type here…',
    confirmText: 'Send',
    cancelText: 'Cancel'
  }, opts || {});
  const esc = (s) => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

  return new Promise(resolve => {
    const prev = document.getElementById('ws-confirm-overlay');
    if (prev) prev.remove();

    const overlay = document.createElement('div');
    overlay.id = 'ws-confirm-overlay';
    overlay.className = 'ws-confirm-overlay';
    overlay.innerHTML = `
      <div class="ws-confirm-modal" role="dialog" aria-modal="true" aria-label="${esc(o.title)}">
        <div class="ws-confirm-icon">📩</div>
        <h3 class="ws-confirm-title">${esc(o.title)}</h3>
        <p class="ws-confirm-message">${esc(o.message)}</p>
        <textarea class="ws-prompt-input" rows="3" placeholder="${esc(o.placeholder)}" maxlength="1000"></textarea>
        <div class="ws-confirm-actions">
          <button type="button" class="ws-confirm-btn cancel">${esc(o.cancelText)}</button>
          <button type="button" class="ws-confirm-btn ok">${esc(o.confirmText)}</button>
        </div>
      </div>`;
    document.body.appendChild(overlay);

    const input = overlay.querySelector('.ws-prompt-input');
    let done = false;
    let onKey = null;
    const finish = (val) => {
      if (done) return;
      done = true;
      document.removeEventListener('keydown', onKey);
      overlay.classList.add('closing');
      setTimeout(() => overlay.remove(), 200);
      resolve(val);
    };
    onKey = (e) => {
      if (e.key === 'Escape') finish(null);
      if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        const val = input.value.trim();
        finish(val ? val : '');
      }
    };

    overlay.querySelector('.cancel').addEventListener('click', () => finish(null));
    overlay.querySelector('.ok').addEventListener('click', () => {
      const val = input.value.trim();
      finish(val ? val : '');
    });
    overlay.addEventListener('click', e => { if (e.target === overlay) finish(null); });
    document.addEventListener('keydown', onKey);

    requestAnimationFrame(() => requestAnimationFrame(() => {
      overlay.classList.add('open');
      input.focus();
    }));
    setTimeout(() => overlay.classList.add('open'), 80);
  });
}

function continueAsGuest() {
  wsConfirm({
    title: 'Continue as Guest?',
    message: 'Are you sure you want to continue as a guest? You can sign up anytime later.',
    confirmText: 'Continue as Guest',
    cancelText: 'Not now'
  }).then(ok => {
    if (!ok) return;
    isGuest = true;
    currentUser = null;
    localStorage.setItem('ws_guest', 'true');
    updateNavbarAuth();
    if (typeof syncCommunityAuthorField === 'function') syncCommunityAuthorField();
    if (typeof syncRatingsForCurrentUser === 'function') syncRatingsForCurrentUser();
    window.location.href = 'index.html';
  });
}

function signOut() {
  if (FIREBASE_READY && auth) {
    auth.signOut();
  }
  currentUser = null;
  isGuest = false;
  localStorage.removeItem('ws_guest');
  localStorage.removeItem('ws_remembered_user');
  updateNavbarAuth();
  if (typeof syncCommunityAuthorField === 'function') syncCommunityAuthorField();
  if (typeof syncRatingsForCurrentUser === 'function') syncRatingsForCurrentUser();

  const page = getCurrentPage();
  if (page === 'community' || page === 'profile') {
    window.location.href = 'index.html';
  }
  showGlobalToast('👋 You have been signed out.', 'success');
}

function initCommunityAuthGate() {
  const shareForm = document.getElementById('share-page-section');
  const authGate = document.getElementById('auth-gate');
  if (!shareForm || !authGate) return;
  shareForm.style.display = 'block';
  authGate.style.display = 'none';
}

function initProfileAuthGate() {
  const profileSection = document.getElementById('profile-section');
  const authSection = document.getElementById('auth-gate-section');
  if (!profileSection || !authSection) return;

  const loggedIn = !!currentUser;

  if (loggedIn) {
    profileSection.style.display = '';
    authSection.style.display = 'none';
    document.body.classList.remove('auth-gate-mode');
    if (typeof renderProfilePage === 'function') renderProfilePage();
    if (typeof initProfileForm === 'function') initProfileForm();
    if (typeof initOwnerPanel === 'function') initOwnerPanel();
    if (typeof syncCommunityAuthorField === 'function') syncCommunityAuthorField();
    if (typeof syncRatingsForCurrentUser === 'function') syncRatingsForCurrentUser();
  } else {
    profileSection.style.display = 'none';
    authSection.style.display = '';
    document.body.classList.add('auth-gate-mode');
    if (typeof initLoginPage === 'function') initLoginPage();
  }
}

function showAuthGateOnly() {
  const profileSection = document.getElementById('profile-section');
  const authSection = document.getElementById('auth-gate-section');
  if (!profileSection || !authSection) return;
  profileSection.style.display = 'none';
  authSection.style.display = '';
  document.body.classList.add('auth-gate-mode');
  if (typeof initLoginPage === 'function') initLoginPage();
}

function redirectAfterLogin() {

  localStorage.removeItem('ws_return_to');
  window.location.href = 'index.html';
}

function requireAuth() {
  if (!currentUser && !isGuest) {
    localStorage.setItem('ws_return_to', window.location.href);
    window.location.href = 'profile.html';
  }
}

/* ============ DELETED ACCOUNTS (blocked emails) ============ */
function getDeletedEmails() {
  try {
    const list = JSON.parse(localStorage.getItem('wandershare_deleted_emails') || '[]');
    return Array.isArray(list) ? list : [];
  } catch { return []; }
}

function isEmailDeleted(email) {
  const norm = String(email || '').trim().toLowerCase();
  return getDeletedEmails().includes(norm);
}

function clearUserLocalData() {
  const userKey = (currentUser && (currentUser.uid || currentUser.email)) || null;
  const email = String((currentUser && currentUser.email) || '').toLowerCase();
  const name = (typeof getDisplayName === 'function') ? getDisplayName() : '';

  try {
    const posts = JSON.parse(localStorage.getItem('wandershare_posts') || '[]');
    if (Array.isArray(posts)) {
      const kept = posts.filter(p => {
        if (p.authorKey && userKey && p.authorKey === userKey) return false;
        if (name && p.author === name) return false;
        return true;
      });
      localStorage.setItem('wandershare_posts', JSON.stringify(kept));
    }
  } catch { }

  try {
    const saved = JSON.parse(localStorage.getItem('wandershare_saved_locations') || '{}');
    if (userKey && saved && typeof saved === 'object') {
      delete saved[userKey];
      localStorage.setItem('wandershare_saved_locations', JSON.stringify(saved));
    }
  } catch { }

  try {
    const following = JSON.parse(localStorage.getItem('wandershare_following') || '{}');
    if (userKey && following && typeof following === 'object') {
      delete following[userKey];
      localStorage.setItem('wandershare_following', JSON.stringify(following));
    }
  } catch { }

  try {
    const ratings = JSON.parse(localStorage.getItem('wandershare_ratings') || '{}');
    Object.keys(ratings).forEach(postId => {
      const entry = ratings[postId];
      if (entry && entry.userRatings && userKey) {
        delete entry.userRatings[userKey];
        const keys = Object.keys(entry.userRatings);
        if (keys.length === 0) {
          delete ratings[postId];
        } else {
          const vals = keys.map(k => Number(entry.userRatings[k])).filter(v => Number.isFinite(v));
          entry.count = vals.length;
          entry.sum = vals.reduce((a, b) => a + b, 0);
        }
      }
    });
    localStorage.setItem('wandershare_ratings', JSON.stringify(ratings));
  } catch { }

  try {
    const comments = JSON.parse(localStorage.getItem('wandershare_comments') || '{}');
    Object.keys(comments).forEach(postId => {
      const entry = comments[postId];
      if (entry && entry.commentsByUser && userKey) {
        delete entry.commentsByUser[userKey];
        if (Object.keys(entry.commentsByUser).length === 0) delete comments[postId];
      }
    });
    localStorage.setItem('wandershare_comments', JSON.stringify(comments));
  } catch { }

  try {
    const emails = JSON.parse(localStorage.getItem('wandershare_account_emails') || '[]');
    if (Array.isArray(emails)) {
      localStorage.setItem('wandershare_account_emails', JSON.stringify(emails.filter(e => String(e).toLowerCase() !== email)));
    }
  } catch { }

  if (email && (localStorage.getItem('ws_owner_email') || '').toLowerCase() === email) {
    localStorage.removeItem('ws_owner_email');
  }
}

async function deleteMyAccount() {
  const email = (currentUser && currentUser.email) || '';
  const ok = await wsConfirm({
    title: 'Delete your account?',
    message: 'This permanently deletes your account, posts, saved places and all data on this device. This email can never be used to sign up again.',
    confirmText: 'Delete Account',
    cancelText: 'Cancel',
    danger: true
  });
  if (!ok) return;

  if (email) {
    const list = getDeletedEmails();
    const norm = email.toLowerCase();
    if (!list.includes(norm)) {
      list.push(norm);
      try { localStorage.setItem('wandershare_deleted_emails', JSON.stringify(list)); } catch { }
    }
  }

  clearUserLocalData();

  if (FIREBASE_READY && auth && auth.currentUser) {
    try { await auth.currentUser.delete(); } catch (err) { /* may need recent re-auth - still removed locally */ }
  }
  try { await auth.signOut(); } catch (e) { }

  currentUser = null;
  isGuest = false;
  localStorage.removeItem('ws_guest');
  localStorage.removeItem('ws_remembered_user');
  updateNavbarAuth();
  showGlobalToast('👋 Your account has been deleted. This email cannot be used again.', 'success');
  setTimeout(() => { window.location.href = 'index.html'; }, 1400);
}

function updateLoginPageStats() {
  const travellerEl = document.getElementById('login-stat-travellers');
  const countryEl = document.getElementById('login-stat-countries');
  if (!travellerEl && !countryEl) return;

  let posts = [];
  try {
    posts = JSON.parse(localStorage.getItem('wandershare_posts') || '[]');
  } catch {
    posts = [];
  }

  const accounts = getTotalAccounts();
  const countries = new Set(posts.map(p => String(p.country || '').trim()).filter(Boolean));

  if (travellerEl) {
    travellerEl.textContent = accounts > 0
      ? `${accounts.toLocaleString()} wanderers`
      : 'a growing community of wanderers';
  }
  if (countryEl) {
    countryEl.textContent = countries.size > 0
      ? `${countries.size.toLocaleString()} countries`
      : 'countries around the world';
  }
}

let loginPageInitialized = false;

function initLoginPage() {

  if (loginPageInitialized) return;
  loginPageInitialized = true;

  if (currentUser) { redirectAfterLogin(); return; }

  updateLoginPageStats();

  const tabs = document.querySelectorAll('.auth-tab');
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      const target = tab.dataset.tab;
      document.querySelectorAll('.auth-form-section').forEach(s => s.classList.remove('active'));
      const section = document.getElementById(`form-${target}`);
      if (section) section.classList.add('active');
    });
  });

  if (!FIREBASE_READY) {
    const notice = document.getElementById('firebase-notice');
    if (notice) notice.style.display = 'block';
  }
}

let authToastTimeout = null;

function showAuthToast(msg, type) {
  const el = document.getElementById('auth-toast');
  if (!el) { showGlobalToast(msg, type); return; }
  if (authToastTimeout) clearTimeout(authToastTimeout);
  el.textContent = msg;
  el.className = `auth-toast-msg ${type}`;
  el.style.display = 'block';
  authToastTimeout = setTimeout(() => { el.style.display = 'none'; authToastTimeout = null; }, 4000);
}

function showGlobalToast(msg, type) {
  const toast = document.getElementById('toast');
  const icon = document.getElementById('toast-icon');
  const text = document.getElementById('toast-text');
  if (!toast) return;
  toast.className = `toast ${type}`;
  if (icon) icon.textContent = type === 'success' ? '✅' : '⚠️';
  if (text) text.textContent = msg;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 4000);
}

function showAuthNotConfiguredToast() {
  showAuthToast('⚙️ Firebase not set up yet. Google login and guest mode need setup first.', 'error');
}

function showAuthError(err) {
  const messages = {
    'auth/user-not-found': 'No account with that email. Please sign up.',
    'auth/wrong-password': 'Incorrect password. Please try again.',
    'auth/email-already-in-use': 'That email is already registered. Try signing in.',
    'auth/weak-password': 'Password must be at least 6 characters.',
    'auth/invalid-email': 'Please enter a valid email address.',
    'auth/popup-closed-by-user': 'Sign-in cancelled.',
    'auth/popup-blocked': 'Popup was blocked by the browser. Trying redirect sign-in…',
    'auth/cancelled-popup-request': 'Another sign-in is already in progress. Please try again.',
    'auth/network-request-failed': 'Network error. Check your connection.',
    'auth/unauthorized-domain': 'This domain isn\u2019t allowed for sign-in yet. Add it under Firebase Console \u2192 Authentication \u2192 Settings \u2192 Authorized domains.',
    'auth/operation-not-allowed': 'Google sign-in isn\u2019t enabled yet. Enable it under Firebase Console \u2192 Authentication \u2192 Sign-in method.',
    'auth/configuration-not-found': 'Firebase Authentication isn\u2019t set up for this project yet. Open Firebase Console \u2192 your project "wandershare-dc628" \u2192 Authentication \u2192 click "Get started", then enable Google under Sign-in method.',
    'auth/account-exists-with-different-credential': 'An account with this email already exists using a different sign-in method. Try signing in with that method instead.',
  };
  const msg = messages[err.code] || err.message || 'Something went wrong. Please try again.';
  showAuthToast('⚠️ ' + msg, 'error');
}