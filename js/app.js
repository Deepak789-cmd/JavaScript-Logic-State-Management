/* ============================================
   APP MODULE — Entry Point & Event Binding
   ============================================ */

const App = (function () {
    /**
     * Initialize the entire application
     */
    function init() {
        // 1. Cache DOM elements
        UI.cacheElements();

        // 2. Initialize modules
        Theme.init();
        Tasks.init();
        Filter.init();

        // 3. Bind all event listeners
        bindEvents();

        // 4. Initial render
        UI.renderTasks();

        console.log('TaskFlow initialized successfully.');
    }

    /**
     * Bind all event listeners using delegation where appropriate
     */
    function bindEvents() {
        const el = UI.getElements();

        // --- Form: Add Task ---
        el.taskForm.addEventListener('submit', handleAddTask);

        // --- Task List: Delegated Event Listeners ---
        el.taskList.addEventListener('click', handleTaskListClick);
        el.taskList.addEventListener('change', handleTaskListChange);

        // --- Filter Buttons: Delegated ---
        el.filterGroup.addEventListener('click', handleFilterClick);

        // --- Clear Completed ---
        el.btnClearCompleted.addEventListener('click', handleClearCompleted);

        // --- Theme Toggle ---
        el.themeToggle.addEventListener('click', handleThemeToggle);

        // --- Edit Modal ---
        el.editForm.addEventListener('submit', handleEditSubmit);
        el.modalClose.addEventListener('click', () => UI.closeEditModal());
        el.modalCancel.addEventListener('click', () => UI.closeEditModal());
        el.editModal.addEventListener('click', (e) => {
            if (e.target === el.editModal) UI.closeEditModal();
        });

        // --- Keyboard: Escape to close modal ---
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                UI.closeEditModal();
            }
        });
    }

    // ==========================================
    //  Event Handlers
    // ==========================================

    /**
     * Handle adding a new task
     * @param {Event} e - Submit event
     */
    function handleAddTask(e) {
        e.preventDefault();
        const el = UI.getElements();
        const text = el.taskInput.value.trim();
        const priority = el.taskPriority.value;

        if (!text) {
            UI.showToast('Please enter a task description.', 'error');
            el.taskInput.focus();
            return;
        }

        try {
            Tasks.create(text, priority);
            UI.clearForm();
            UI.renderTasks();
            UI.showToast('Task added successfully!', 'success');
        } catch (error) {
            UI.showToast(error.message, 'error');
        }
    }

    /**
     * Handle clicks within the task list (delegated)
     * @param {Event} e - Click event
     */
    function handleTaskListClick(e) {
        const actionBtn = e.target.closest('[data-action]');
        if (!actionBtn) return;

        const action = actionBtn.dataset.action;
        const taskId = actionBtn.dataset.id;

        switch (action) {
            case 'edit':
                UI.openEditModal(taskId);
                break;

            case 'delete':
                handleDeleteTask(taskId);
                break;
        }
    }

    /**
     * Handle checkbox changes within the task list (delegated)
     * @param {Event} e - Change event
     */
    function handleTaskListChange(e) {
        if (e.target.type === 'checkbox' && e.target.dataset.action === 'toggle') {
            const taskId = e.target.dataset.id;
            const task = Tasks.toggleComplete(taskId);

            if (task) {
                UI.renderTasks();
                UI.showToast(
                    task.completed ? 'Task completed! ✓' : 'Task marked active.',
                    task.completed ? 'success' : 'info'
                );
            }
        }
    }

    /**
     * Handle deleting a task
     * @param {string} taskId - Task ID
     */
    function handleDeleteTask(taskId) {
        const taskItem = document.querySelector(`.task-item[data-id="${taskId}"]`);

        if (taskItem) {
            taskItem.classList.add('removing');
            taskItem.addEventListener('animationend', () => {
                Tasks.remove(taskId);
                UI.renderTasks();
                UI.showToast('Task deleted.', 'info');
            });
        } else {
            Tasks.remove(taskId);
            UI.renderTasks();
            UI.showToast('Task deleted.', 'info');
        }
    }

    /**
     * Handle filter button clicks
     * @param {Event} e - Click event
     */
    function handleFilterClick(e) {
        const btn = e.target.closest('.filter-btn');
        if (!btn) return;

        const filter = btn.dataset.filter;
        Filter.setCurrent(filter);
        UI.renderTasks();
    }

    /**
     * Handle clearing completed tasks
     */
    function handleClearCompleted() {
        const stats = Tasks.getStats();
        if (stats.completed === 0) {
            UI.showToast('No completed tasks to clear.', 'info');
            return;
        }

        const count = Tasks.clearCompleted();
        UI.renderTasks();
        UI.showToast(`Cleared ${count} completed task${count !== 1 ? 's' : ''}.`, 'success');
    }

    /**
     * Handle theme toggle
     */
    function handleThemeToggle() {
        Theme.toggle();
        const current = Theme.getCurrent();
        UI.showToast(
            `Switched to ${current} mode.`,
            'info'
        );
    }

    /**
     * Handle edit form submission
     * @param {Event} e - Submit event
     */
    function handleEditSubmit(e) {
        e.preventDefault();
        const el = UI.getElements();

        const taskId = el.editTaskId.value;
        const newText = el.editTaskText.value.trim();
        const newPriority = el.editTaskPriority.value;

        if (!newText) {
            UI.showToast('Task description cannot be empty.', 'error');
            el.editTaskText.focus();
            return;
        }

        try {
            Tasks.update(taskId, {
                text: newText,
                priority: newPriority
            });

            UI.closeEditModal();
            UI.renderTasks();
            UI.showToast('Task updated successfully!', 'success');
        } catch (error) {
            UI.showToast(error.message, 'error');
        }
    }

    // Start the application when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // Public API
    return { init };
})();
