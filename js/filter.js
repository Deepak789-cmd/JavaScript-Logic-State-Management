/* ============================================
   FILTER MODULE — Filter Logic
   ============================================ */

const Filter = (function () {
    // Current active filter
    let currentFilter = 'all';

    /**
     * Initialize filter from localStorage
     */
    function init() {
        currentFilter = Storage.getFilter() || 'all';
    }

    /**
     * Get the current filter value
     * @returns {string} 'all', 'active', or 'completed'
     */
    function getCurrent() {
        return currentFilter;
    }

    /**
     * Set the current filter
     * @param {string} filter - 'all', 'active', or 'completed'
     */
    function setCurrent(filter) {
        const validFilters = ['all', 'active', 'completed'];
        if (!validFilters.includes(filter)) {
            console.warn('Filter: Invalid filter value:', filter);
            return;
        }
        currentFilter = filter;
        Storage.saveFilter(filter);
    }

    /**
     * Apply the current filter to a list of tasks
     * @param {Array} tasks - Array of task objects
     * @returns {Array} Filtered tasks
     */
    function apply(tasks) {
        switch (currentFilter) {
            case 'active':
                return tasks.filter(task => !task.completed);
            case 'completed':
                return tasks.filter(task => task.completed);
            case 'all':
            default:
                return tasks;
        }
    }

    /**
     * Filter tasks by a specific filter value (without changing state)
     * @param {Array} tasks - Array of task objects
     * @param {string} filter - Filter to apply
     * @returns {Array} Filtered tasks
     */
    function filterBy(tasks, filter) {
        switch (filter) {
            case 'active':
                return tasks.filter(task => !task.completed);
            case 'completed':
                return tasks.filter(task => task.completed);
            case 'all':
            default:
                return tasks;
        }
    }

    // Public API
    return {
        init,
        getCurrent,
        setCurrent,
        apply,
        filterBy
    };
})();
