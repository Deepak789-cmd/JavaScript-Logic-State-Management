/* ============================================
   UI MODULE — DOM Manipulation & Rendering
   ============================================ */

const UI = (function () {
    // DOM Element References (cached once)
    const elements = {};

    /**
     * Cache all DOM element references
     */
    function cacheElements() {
        elements.taskForm = document.getElementById('task-form');
        elements.taskInput = document.getElementById('task-input');
        elements.taskPriority = document.getElementById('task-priority');
        elements.btnAddTask = document.getElementById('btn-add-task');
        elements.taskList = document.getElementById('task-list');
        elements.emptyState = document.getElementById('empty-state');
        elements.filterGroup = document.getElementById('filter-group');
        elements.btnClearCompleted = document.getElementById('btn-clear-completed');
        elements.themeToggle = document.getElementById('theme-toggle');

        // Stats
        elements.statTotal = document.getElementById('stat-total');
        elements.statActive = document.getElementById('stat-active');
        elements.statCompleted = document.getElementById('stat-completed');
        elements.progressRingFill = document.getElementById('progress-ring-fill');
        elements.progressText = document.getElementById('progress-text');

        // Edit Modal
        elements.editModal = document.getElementById('edit-modal');
        elements.editForm = document.getElementById('edit-form');
        elements.editTaskId = document.getElementById('edit-task-id');
        elements.editTaskText = document.getElementById('edit-task-text');
        elements.editTaskPriority = document.getElementById('edit-task-priority');
        elements.modalClose = document.getElementById('modal-close');
        elements.modalCancel = document.getElementById('modal-cancel');

        // Toast
        elements.toastContainer = document.getElementById('toast-container');
    }

    /**
     * Get cached elements
     * @returns {Object} DOM elements
     */
    function getElements() {
        return elements;
    }

    /**
     * Render the task list based on current state and filter
     */
    function renderTasks() {
        const allTasks = Tasks.getAll();
        const filteredTasks = Filter.apply(allTasks);

        elements.taskList.innerHTML = '';

        if (filteredTasks.length === 0) {
            elements.emptyState.classList.add('visible');
            updateEmptyMessage();
        } else {
            elements.emptyState.classList.remove('visible');
            const fragment = document.createDocumentFragment();
            filteredTasks.forEach((task, index) => {
                const li = createTaskElement(task, index);
                fragment.appendChild(li);
            });
            elements.taskList.appendChild(fragment);
        }

        updateStats();
        updateFilterButtons();
    }

    /**
     * Create a task list item element
     * @param {Object} task - Task object
     * @param {number} index - Index for stagger animation
     * @returns {HTMLElement} li element
     */
    function createTaskElement(task, index) {
        const li = document.createElement('li');
        li.className = `task-item${task.completed ? ' completed' : ''}`;
        li.dataset.id = task.id;
        li.style.animationDelay = `${index * 0.04}s`;

        const dateStr = formatDate(task.createdAt);

        li.innerHTML = `
            <label class="task-checkbox">
                <input type="checkbox" ${task.completed ? 'checked' : ''} data-action="toggle" data-id="${task.id}">
                <span class="checkmark">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                </span>
            </label>
            <div class="task-content">
                <span class="task-text">${escapeHTML(task.text)}</span>
                <div class="task-meta">
                    <span class="priority-badge ${task.priority}">${task.priority}</span>
                    <span class="task-date">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <circle cx="12" cy="12" r="10"></circle>
                            <polyline points="12 6 12 12 16 14"></polyline>
                        </svg>
                        ${dateStr}
                    </span>
                </div>
            </div>
            <div class="task-actions">
                <button class="btn-task-action edit" data-action="edit" data-id="${task.id}" title="Edit task" aria-label="Edit task">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                    </svg>
                </button>
                <button class="btn-task-action delete" data-action="delete" data-id="${task.id}" title="Delete task" aria-label="Delete task">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <polyline points="3 6 5 6 21 6"></polyline>
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                        <line x1="10" y1="11" x2="10" y2="17"></line>
                        <line x1="14" y1="11" x2="14" y2="17"></line>
                    </svg>
                </button>
            </div>
        `;

        return li;
    }

    /**
     * Update the stats bar
     */
    function updateStats() {
        const stats = Tasks.getStats();

        elements.statTotal.textContent = stats.total;
        elements.statActive.textContent = stats.active;
        elements.statCompleted.textContent = stats.completed;
        elements.progressText.textContent = stats.percentage + '%';

        // Update progress ring
        const circumference = 2 * Math.PI * 16; // r = 16
        const offset = circumference - (stats.percentage / 100) * circumference;
        elements.progressRingFill.style.strokeDashoffset = offset;
    }

    /**
     * Update filter button active states
     */
    function updateFilterButtons() {
        const current = Filter.getCurrent();
        const buttons = elements.filterGroup.querySelectorAll('.filter-btn');
        buttons.forEach(btn => {
            btn.classList.toggle('active', btn.dataset.filter === current);
        });
    }

    /**
     * Update empty state message based on current filter
     */
    function updateEmptyMessage() {
        const filter = Filter.getCurrent();
        const h3 = elements.emptyState.querySelector('h3');
        const p = elements.emptyState.querySelector('p');

        switch (filter) {
            case 'active':
                h3.textContent = 'No active tasks';
                p.textContent = 'All tasks are completed! Great job! 🎉';
                break;
            case 'completed':
                h3.textContent = 'No completed tasks';
                p.textContent = 'Complete a task to see it here.';
                break;
            default:
                h3.textContent = 'No tasks yet';
                p.textContent = 'Add a task above to get started!';
        }
    }

    /**
     * Open the edit modal for a task
     * @param {string} taskId - Task ID
     */
    function openEditModal(taskId) {
        const task = Tasks.getById(taskId);
        if (!task) return;

        elements.editTaskId.value = task.id;
        elements.editTaskText.value = task.text;
        elements.editTaskPriority.value = task.priority;

        elements.editModal.classList.add('active');
        // Focus input after transition
        setTimeout(() => elements.editTaskText.focus(), 200);
    }

    /**
     * Close the edit modal
     */
    function closeEditModal() {
        elements.editModal.classList.remove('active');
        elements.editForm.reset();
    }

    /**
     * Show a toast notification
     * @param {string} message - Notification message
     * @param {string} type - 'success', 'error', or 'info'
     */
    function showToast(message, type = 'success') {
        const icons = {
            success: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>',
            error: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>',
            info: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>'
        };

        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.innerHTML = `${icons[type] || icons.info}<span>${escapeHTML(message)}</span>`;

        elements.toastContainer.appendChild(toast);

        // Auto-remove after 3 seconds
        setTimeout(() => {
            toast.classList.add('removing');
            toast.addEventListener('animationend', () => toast.remove());
        }, 3000);
    }

    /**
     * Clear the task input form
     */
    function clearForm() {
        elements.taskInput.value = '';
        elements.taskPriority.value = 'medium';
        elements.taskInput.focus();
    }

    // --- Private Helpers ---

    /**
     * Escape HTML to prevent XSS
     * @param {string} str - Raw string
     * @returns {string} Escaped string
     */
    function escapeHTML(str) {
        const div = document.createElement('div');
        div.appendChild(document.createTextNode(str));
        return div.innerHTML;
    }

    /**
     * Format ISO date string to readable format
     * @param {string} isoString - ISO date string
     * @returns {string} Formatted date
     */
    function formatDate(isoString) {
        const date = new Date(isoString);
        const now = new Date();
        const diff = now - date;

        // Less than 1 minute
        if (diff < 60000) return 'Just now';
        // Less than 1 hour
        if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
        // Less than 24 hours
        if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
        // Less than 7 days
        if (diff < 604800000) return `${Math.floor(diff / 86400000)}d ago`;

        // Otherwise show date
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
        });
    }

    // Public API
    return {
        cacheElements,
        getElements,
        renderTasks,
        updateStats,
        updateFilterButtons,
        openEditModal,
        closeEditModal,
        showToast,
        clearForm
    };
})();
