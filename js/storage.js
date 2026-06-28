/* ============================================
   STORAGE MODULE — localStorage Abstraction
   ============================================ */

const Storage = (function () {
    const TASKS_KEY = 'taskflow_tasks';
    const THEME_KEY = 'taskflow_theme';
    const FILTER_KEY = 'taskflow_filter';

    /**
     * Get all tasks from localStorage
     * @returns {Array} Array of task objects
     */
    function getTasks() {
        try {
            const data = window.localStorage.getItem(TASKS_KEY);
            return data ? JSON.parse(data) : [];
        } catch (error) {
            console.error('Storage: Error reading tasks:', error);
            return [];
        }
    }

    /**
     * Save tasks array to localStorage
     * @param {Array} tasks - Array of task objects
     */
    function saveTasks(tasks) {
        try {
            window.localStorage.setItem(TASKS_KEY, JSON.stringify(tasks));
        } catch (error) {
            console.error('Storage: Error saving tasks:', error);
        }
    }

    /**
     * Get saved theme preference
     * @returns {string} 'light' or 'dark'
     */
    function getTheme() {
        try {
            return window.localStorage.getItem(THEME_KEY) || 'light';
        } catch (error) {
            return 'light';
        }
    }

    /**
     * Save theme preference
     * @param {string} theme - 'light' or 'dark'
     */
    function saveTheme(theme) {
        try {
            window.localStorage.setItem(THEME_KEY, theme);
        } catch (error) {
            console.error('Storage: Error saving theme:', error);
        }
    }

    /**
     * Get saved filter preference
     * @returns {string} 'all', 'active', or 'completed'
     */
    function getFilter() {
        try {
            return window.localStorage.getItem(FILTER_KEY) || 'all';
        } catch (error) {
            return 'all';
        }
    }

    /**
     * Save filter preference
     * @param {string} filter - 'all', 'active', or 'completed'
     */
    function saveFilter(filter) {
        try {
            window.localStorage.setItem(FILTER_KEY, filter);
        } catch (error) {
            console.error('Storage: Error saving filter:', error);
        }
    }

    /**
     * Clear all app data from localStorage
     */
    function clearAll() {
        try {
            window.localStorage.removeItem(TASKS_KEY);
            window.localStorage.removeItem(THEME_KEY);
            window.localStorage.removeItem(FILTER_KEY);
        } catch (error) {
            console.error('Storage: Error clearing data:', error);
        }
    }

    // Public API
    return {
        getTasks,
        saveTasks,
        getTheme,
        saveTheme,
        getFilter,
        saveFilter,
        clearAll
    };
})();
