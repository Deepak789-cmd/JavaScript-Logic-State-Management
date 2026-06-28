/* ============================================
   TASKS MODULE — CRUD Operations
   ============================================ */

const Tasks = (function () {
    // In-memory state (source of truth synced with localStorage)
    let tasks = [];

    /**
     * Initialize tasks from localStorage
     */
    function init() {
        tasks = Storage.getTasks();
    }

    /**
     * Get all tasks
     * @returns {Array} Copy of tasks array
     */
    function getAll() {
        return [...tasks];
    }

    /**
     * Get a task by ID
     * @param {string} id - Task ID
     * @returns {Object|undefined} Task object
     */
    function getById(id) {
        return tasks.find(task => task.id === id);
    }

    /**
     * Create a new task
     * @param {string} text - Task description
     * @param {string} priority - 'low', 'medium', or 'high'
     * @returns {Object} The newly created task
     */
    function create(text, priority) {
        const trimmedText = text.trim();
        if (!trimmedText) {
            throw new Error('Task text cannot be empty');
        }

        const task = {
            id: generateId(),
            text: trimmedText,
            priority: priority || 'medium',
            completed: false,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };

        tasks.unshift(task); // Add to beginning
        persist();
        return task;
    }

    /**
     * Update an existing task
     * @param {string} id - Task ID
     * @param {Object} updates - Object with properties to update
     * @returns {Object|null} Updated task or null
     */
    function update(id, updates) {
        const index = tasks.findIndex(task => task.id === id);
        if (index === -1) return null;

        // Only allow updating specific fields
        const allowedFields = ['text', 'priority', 'completed'];
        const sanitizedUpdates = {};

        for (const key of allowedFields) {
            if (updates.hasOwnProperty(key)) {
                if (key === 'text') {
                    const trimmed = updates.text.trim();
                    if (!trimmed) throw new Error('Task text cannot be empty');
                    sanitizedUpdates.text = trimmed;
                } else {
                    sanitizedUpdates[key] = updates[key];
                }
            }
        }

        tasks[index] = {
            ...tasks[index],
            ...sanitizedUpdates,
            updatedAt: new Date().toISOString()
        };

        persist();
        return tasks[index];
    }

    /**
     * Toggle task completed status
     * @param {string} id - Task ID
     * @returns {Object|null} Updated task or null
     */
    function toggleComplete(id) {
        const task = getById(id);
        if (!task) return null;
        return update(id, { completed: !task.completed });
    }

    /**
     * Delete a task by ID
     * @param {string} id - Task ID
     * @returns {boolean} True if deleted
     */
    function remove(id) {
        const index = tasks.findIndex(task => task.id === id);
        if (index === -1) return false;

        tasks.splice(index, 1);
        persist();
        return true;
    }

    /**
     * Delete all completed tasks
     * @returns {number} Number of tasks removed
     */
    function clearCompleted() {
        const initialLength = tasks.length;
        tasks = tasks.filter(task => !task.completed);
        persist();
        return initialLength - tasks.length;
    }

    /**
     * Get task statistics
     * @returns {Object} Stats object
     */
    function getStats() {
        const total = tasks.length;
        const completed = tasks.filter(t => t.completed).length;
        const active = total - completed;
        const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

        return { total, active, completed, percentage };
    }

    // --- Private Helpers ---

    /**
     * Generate a unique ID
     * @returns {string} Unique identifier
     */
    function generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substring(2, 9);
    }

    /**
     * Persist current tasks state to localStorage
     */
    function persist() {
        Storage.saveTasks(tasks);
    }

    // Public API
    return {
        init,
        getAll,
        getById,
        create,
        update,
        toggleComplete,
        remove,
        clearCompleted,
        getStats
    };
})();
