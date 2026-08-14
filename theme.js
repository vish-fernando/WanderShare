

(function () {
    const STORAGE_KEY = 'ws_theme';

    function getSavedTheme() {
        try {
            const t = localStorage.getItem(STORAGE_KEY);
            if (t === 'light' || t === 'dark') return t;
        } catch (e) { }
        return 'dark';
    }

    function applyTheme(theme, persist) {
        document.documentElement.setAttribute('data-theme', theme);
        if (persist !== false) {
            try { localStorage.setItem(STORAGE_KEY, theme); } catch (e) { }
        }
        updateButtonIcon(theme);
    }

    function updateButtonIcon(theme) {
        const isLight = theme === 'light';
        document.querySelectorAll('.theme-toggle').forEach(btn => {
            btn.textContent = isLight ? '🌙' : '☀️';
            btn.title = isLight ? 'Switch to dark mode' : 'Switch to light mode';
            btn.setAttribute('aria-label', btn.title);
        });
    }

    function bindButton() {
        document.addEventListener('click', function (e) {
            const btn = e.target && e.target.closest ? e.target.closest('.theme-toggle') : null;
            if (!btn) return;
            const current = document.documentElement.getAttribute('data-theme') === 'light' ? 'light' : 'dark';
            applyTheme(current === 'light' ? 'dark' : 'light');
        });
        updateButtonIcon(document.documentElement.getAttribute('data-theme'));
    }

    applyTheme(getSavedTheme(), false);

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', bindButton);
    } else {
        bindButton();
    }
})();
