/* ============================================
   THEME MODULE — Dark/Light Mode Toggle
   ============================================ */

const Theme = (function () {
    let currentTheme = 'light';

    /**
     * Initialize theme from localStorage or system preference
     */
    function init() {
        // Check localStorage first
        const savedTheme = Storage.getTheme();

        if (savedTheme) {
            currentTheme = savedTheme;
        } else {
            // Fall back to system preference
            const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            currentTheme = prefersDark ? 'dark' : 'light';
        }

        applyTheme(currentTheme);

        // Listen for system preference changes
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
            // Only auto-switch if user hasn't manually set a preference
            if (!Storage.getTheme()) {
                const newTheme = e.matches ? 'dark' : 'light';
                setTheme(newTheme);
            }
        });
    }

    /**
     * Toggle between light and dark theme
     */
    function toggle() {
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        setTheme(newTheme);
    }

    /**
     * Set a specific theme
     * @param {string} theme - 'light' or 'dark'
     */
    function setTheme(theme) {
        currentTheme = theme;
        applyTheme(theme);
        Storage.saveTheme(theme);
    }

    /**
     * Get the current theme
     * @returns {string} 'light' or 'dark'
     */
    function getCurrent() {
        return currentTheme;
    }

    /**
     * Apply theme to the DOM
     * @param {string} theme - 'light' or 'dark'
     */
    function applyTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
    }

    // Public API
    return {
        init,
        toggle,
        setTheme,
        getCurrent
    };
})();
