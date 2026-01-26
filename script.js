// Data storage - using localStorage with GitHub Pages compatibility
let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
let updates = JSON.parse(localStorage.getItem('updates')) || [];
let currentFilter = 'all';

// Initialize the app
document.addEventListener('DOMContentLoaded', function() {
    renderTasks();
    renderUpdates();
    updateStatistics();
    
    // Simulate real-time updates by checking localStorage periodically
    setInterval(checkForUpdates, 3000); // Check every 3 seconds
    
    // Add enter key support for inputs
    document.getElementById('taskInput').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') addTask();
    });
    
    document.getElementById('updateInput').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') addUpdate();
    });
});

// Check for updates from other tabs/windows
function checkForUpdates() {
    const storedTasks = JSON.parse(localStorage.getItem('tasks')) || [];
    const storedUpdates = JSON.parse(localStorage.getItem('updates')) || [];
    
    // Check if data has changed
    if (JSON.stringify(storedTasks) !== JSON.stringify(tasks)) {
        tasks = storedTasks;
        renderTasks();
        updateStatistics();
    }
    
    if (JSON.stringify(storedUpdates) !== JSON.stringify(updates)) {
        updates = storedUpdates;
        renderUpdates();
        updateStatistics();
    }
}

// Task Management Functions
function addTask() {
    const taskInput = document.getElementById('taskInput');
    const assigneeSelect = document.getElementById('assigneeSelect');
    const taskText = taskInput.value.trim();
    const assignee = assigneeSelect.value;
    
    if (!taskText) {
        showNotification('Please enter a task', 'error');
        return;
    }
    
    const task = {
        id: Date.now(),
        text: taskText,
        assignee: assignee || 'Unassigned',
        completed: false,
        createdAt: new Date().toISOString()
    };
    
    tasks.unshift(task);
    saveTasks();
    renderTasks();
    updateStatistics();
    
    taskInput.value = '';
    assigneeSelect.value = '';
    
    showNotification('Task added successfully', 'success');
}

function toggleTask(id) {
    const task = tasks.find(t => t.id === id);
    if (task) {
        task.completed = !task.completed;
        saveTasks();
        renderTasks();
        updateStatistics();
    }
}

function deleteTask(id) {
    tasks = tasks.filter(t => t.id !== id);
    saveTasks();
    renderTasks();
    updateStatistics();
    showNotification('Task deleted', 'info');
}

function filterTasks(filter) {
    currentFilter = filter;
    renderTasks();
    
    // Update filter button styles
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.remove('ring-2', 'ring-indigo-500');
    });
    event.target.classList.add('ring-2', 'ring-indigo-500');
}

function confirmWipeAllTasks() {
    if (tasks.length === 0) {
        showNotification('No tasks to wipe', 'info');
        return;
    }
    
    // Create confirmation dialog
    const confirmed = confirm(
        `⚠️ WARNING: This will permanently delete ALL ${tasks.length} tasks!\n\n` +
        `This action cannot be undone.\n\n` +
        `Are you sure you want to continue?`
    );
    
    if (confirmed) {
        wipeAllTasks();
    }
}

function wipeAllTasks() {
    const taskCount = tasks.length;
    tasks = [];
    saveTasks();
    renderTasks();
    updateStatistics();
    showNotification(`Successfully wiped ${taskCount} tasks`, 'success');
}

function renderTasks() {
    const container = document.getElementById('tasksContainer');
    
    let filteredTasks = tasks;
    if (currentFilter === 'completed') {
        filteredTasks = tasks.filter(t => t.completed);
    } else if (currentFilter === 'pending') {
        filteredTasks = tasks.filter(t => !t.completed);
    }
    
    if (filteredTasks.length === 0) {
        container.innerHTML = `
            <div class="text-center py-8 text-gray-500">
                <i class="fas fa-inbox text-4xl mb-2"></i>
                <p>No tasks found</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = filteredTasks.map(task => `
        <div class="task-item p-4 border rounded-lg ${task.completed ? 'bg-gray-50 border-gray-200' : 'bg-white border-gray-300 hover:border-indigo-300'}">
            <div class="flex items-center justify-between">
                <div class="flex items-center flex-1">
                    <input 
                        type="checkbox" 
                        ${task.completed ? 'checked' : ''} 
                        onchange="toggleTask(${task.id})"
                        class="mr-3 w-5 h-5 text-indigo-600 rounded focus:ring-indigo-500"
                    >
                    <div class="flex-1">
                        <p class="${task.completed ? 'line-through text-gray-500' : 'text-gray-800'} font-medium">
                            ${task.text}
                        </p>
                        <div class="flex items-center gap-2 mt-1">
                            <span class="text-xs px-2 py-1 bg-indigo-100 text-indigo-700 rounded-full">
                                <i class="fas fa-user mr-1"></i>${task.assignee}
                            </span>
                            <span class="text-xs text-gray-500">
                                <i class="fas fa-clock mr-1"></i>${formatDate(task.createdAt)}
                            </span>
                        </div>
                    </div>
                </div>
                <button 
                    onclick="deleteTask(${task.id})"
                    class="ml-3 text-red-500 hover:text-red-700 transition-colors"
                >
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        </div>
    `).join('');
}

// Update Log Functions
function addUpdate() {
    const updateInput = document.getElementById('updateInput');
    const authorSelect = document.getElementById('updateAuthorSelect');
    const updateText = updateInput.value.trim();
    const author = authorSelect.value;
    
    if (!updateText || !author) {
        showNotification('Please enter an update and select author', 'error');
        return;
    }
    
    const update = {
        id: Date.now(),
        text: updateText,
        author: author,
        timestamp: new Date().toISOString()
    };
    
    updates.unshift(update);
    saveUpdates();
    renderUpdates();
    updateStatistics();
    
    updateInput.value = '';
    authorSelect.value = '';
    
    showNotification('Update added successfully', 'success');
}

function deleteUpdate(id) {
    updates = updates.filter(u => u.id !== id);
    saveUpdates();
    renderUpdates();
    updateStatistics();
    showNotification('Update deleted', 'info');
}

function renderUpdates() {
    const container = document.getElementById('updatesContainer');
    
    if (updates.length === 0) {
        container.innerHTML = `
            <div class="text-center py-8 text-gray-500">
                <i class="fas fa-history text-4xl mb-2"></i>
                <p>No updates yet</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = updates.map(update => `
        <div class="p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg border border-gray-200">
            <div class="flex justify-between items-start">
                <div class="flex-1">
                    <div class="flex items-center gap-2 mb-2">
                        <span class="font-semibold text-gray-800">
                            <i class="fas fa-user-circle text-indigo-500 mr-1"></i>${update.author}
                        </span>
                        <span class="text-xs text-gray-500">
                            <i class="fas fa-clock mr-1"></i>${formatDateTime(update.timestamp)}
                        </span>
                    </div>
                    <p class="text-gray-700">${update.text}</p>
                </div>
                <button 
                    onclick="deleteUpdate(${update.id})"
                    class="ml-3 text-red-500 hover:text-red-700 transition-colors"
                >
                    <i class="fas fa-times"></i>
                </button>
            </div>
        </div>
    `).join('');
}

// Statistics Functions
function updateStatistics() {
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(t => t.completed).length;
    const pendingTasks = totalTasks - completedTasks;
    const totalUpdates = updates.length;
    
    document.getElementById('totalTasks').textContent = totalTasks;
    document.getElementById('completedTasks').textContent = completedTasks;
    document.getElementById('pendingTasks').textContent = pendingTasks;
    document.getElementById('totalUpdates').textContent = totalUpdates;
}

// Utility Functions
function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function saveUpdates() {
    localStorage.setItem('updates', JSON.stringify(updates));
}

function formatDate(dateString) {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (date.toDateString() === today.toDateString()) {
        return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
        return 'Yesterday';
    } else {
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }
}

function formatDateTime(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);
    
    if (diffMins < 1) {
        return 'Just now';
    } else if (diffMins < 60) {
        return `${diffMins}m ago`;
    } else if (diffHours < 24) {
        return `${diffHours}h ago`;
    } else if (diffDays < 7) {
        return `${diffDays}d ago`;
    } else {
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    }
}

function showNotification(message, type) {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `fixed top-4 right-4 px-6 py-3 rounded-lg shadow-lg z-50 fade-in ${
        type === 'success' ? 'bg-green-500 text-white' :
        type === 'error' ? 'bg-red-500 text-white' :
        'bg-blue-500 text-white'
    }`;
    notification.innerHTML = `
        <div class="flex items-center">
            <i class="fas ${
                type === 'success' ? 'fa-check-circle' :
                type === 'error' ? 'fa-exclamation-circle' :
                'fa-info-circle'
            } mr-2"></i>
            ${message}
        </div>
    `;
    
    document.body.appendChild(notification);
    
    // Remove notification after 3 seconds
    setTimeout(() => {
        notification.remove();
    }, 3000);
}
