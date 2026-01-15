// Data storage
let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
let updates = JSON.parse(localStorage.getItem('updates')) || [];
let currentFilter = 'all';
let currentAssignment = JSON.parse(localStorage.getItem('currentAssignment')) || null;
let uploadedFileContent = null;
let geminiApiKey = ''; // Clear old key to force using new one

// Initialize the app
document.addEventListener('DOMContentLoaded', function() {
    renderTasks();
    renderUpdates();
    updateStatistics();
    
    // Initialize assignment display
    if (currentAssignment) {
        displayCurrentAssignment();
        document.getElementById('assignmentSelect').value = currentAssignment.number;
    }
    
    // Initialize API key
    if (geminiApiKey) {
        document.getElementById('geminiApiKey').value = geminiApiKey;
    }
    
    // Add enter key support for inputs
    document.getElementById('taskInput').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') addTask();
    });
    
    document.getElementById('updateInput').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') addUpdate();
    });
    
    // Add API key input listener
    document.getElementById('geminiApiKey').addEventListener('input', function() {
        checkGenerateButton();
    });
});

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

function filterTasks(filter) {
    currentFilter = filter;
    renderTasks();
    
    // Update filter button styles
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.remove('ring-2', 'ring-indigo-500');
    });
    event.target.classList.add('ring-2', 'ring-indigo-500');
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

// Assignment Management Functions
function handleFileUpload(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    // Check file size (10MB limit)
    if (file.size > 10 * 1024 * 1024) {
        showNotification('File size exceeds 10MB limit', 'error');
        event.target.value = '';
        return;
    }
    
    // Display file info
    const fileInfo = document.getElementById('fileInfo');
    fileInfo.innerHTML = `
        <div class="flex items-center text-green-600">
            <i class="fas fa-file mr-2"></i>
            <span>${file.name} (${(file.size / 1024).toFixed(1)} KB)</span>
        </div>
    `;
    
    // Read file content
    const reader = new FileReader();
    reader.onload = function(e) {
        uploadedFileContent = e.target.result;
        checkGenerateButton();
        showNotification('File uploaded successfully', 'success');
    };
    
    reader.onerror = function() {
        showNotification('Error reading file', 'error');
        uploadedFileContent = null;
        checkGenerateButton();
    };
    
    // Read based on file type
    if (file.type === 'text/plain') {
        reader.readAsText(file);
    } else {
        // For PDF, DOC, DOCX - we'll need to handle these differently
        // For now, we'll read as text and handle errors gracefully
        reader.readAsText(file);
    }
}

function updateAssignment() {
    const select = document.getElementById('assignmentSelect');
    const assignmentNumber = select.value;
    
    if (!assignmentNumber) {
        currentAssignment = null;
        hideCurrentAssignment();
        checkGenerateButton();
        return;
    }
    
    currentAssignment = {
        number: assignmentNumber,
        name: `Assignment ${assignmentNumber}`,
        fileContent: uploadedFileContent
    };
    
    saveCurrentAssignment();
    displayCurrentAssignment();
    checkGenerateButton();
}

function displayCurrentAssignment() {
    if (!currentAssignment) return;
    
    const display = document.getElementById('currentAssignmentDisplay');
    const text = document.getElementById('currentAssignmentText');
    
    display.classList.remove('hidden');
    text.textContent = currentAssignment.name;
}

function hideCurrentAssignment() {
    const display = document.getElementById('currentAssignmentDisplay');
    display.classList.add('hidden');
}

function clearAssignment() {
    currentAssignment = null;
    uploadedFileContent = null;
    document.getElementById('assignmentSelect').value = '';
    document.getElementById('assignmentFile').value = '';
    document.getElementById('fileInfo').innerHTML = '';
    hideCurrentAssignment();
    checkGenerateButton();
    saveCurrentAssignment();
    showNotification('Assignment cleared', 'info');
}

function checkGenerateButton() {
    const btn = document.getElementById('generateTasksBtn');
    const apiKey = document.getElementById('geminiApiKey').value.trim();
    btn.disabled = !(currentAssignment && uploadedFileContent && apiKey);
}

function generateTasksFromAssignment() {
    if (!currentAssignment || !uploadedFileContent) {
        showNotification('Please upload a file and select an assignment first', 'error');
        return;
    }
    
    const apiKey = document.getElementById('geminiApiKey').value.trim();
    if (!apiKey) {
        showNotification('Please enter your Gemini API key', 'error');
        document.getElementById('geminiApiKey').focus();
        return;
    }
    
    // Validate API key format
    if (!apiKey.startsWith('AIza')) {
        showNotification('Invalid API key format. Gemini keys start with "AIza"', 'error');
        return;
    }
    
    // Save API key
    geminiApiKey = apiKey;
    localStorage.setItem('geminiApiKey', geminiApiKey);
    
    // Show processing state
    setGenerateButtonState('processing');
    
    // Call Gemini API
    callGeminiAPI(uploadedFileContent, currentAssignment.number);
}

async function callGeminiAPI(fileContent, assignmentNumber) {
    // Limit content to first 5000 characters to prevent token issues
    const truncatedContent = fileContent.length > 5000 ? fileContent.substring(0, 5000) + "..." : fileContent;
    
    const prompt = `You are analyzing an assignment document to create a manageable set of tasks for a 4-person team.

Assignment Number: ${assignmentNumber}

Document Content (truncated if too long):
${truncatedContent}

CRITICAL INSTRUCTIONS:
1. Generate ONLY 5-10 meaningful tasks total
2. Each task must be a complete, actionable activity
3. DO NOT create tasks for individual letters, words, or sentences
4. Focus on major assignment components, sections, or requirements
5. Group related work into single tasks

Examples of GOOD tasks:
- "Write the introduction section (Assignment 1.1)"
- "Complete research for literature review"
- "Create PowerPoint slides for presentation"
- "Review and edit final draft"

Examples of BAD tasks (DO NOT create these):
- "Write letter 'a'"
- "Read word 'the'"
- "Complete sentence one"
- "Process paragraph 2"

Please:
1. Identify the main assignment requirements
2. Break down into 5-10 major tasks (not micro-tasks)
3. Assign each task to one team member (distribute workload evenly)
4. Include assignment references where applicable
5. Make tasks specific but comprehensive

Return ONLY this JSON format (no extra text):
{
  "tasks": [
    {
      "description": "Complete research and literature review for Assignment 1",
      "assignee": "Tristan",
      "priority": "high"
    },
    {
      "description": "Write introduction and methodology sections",
      "assignee": "Aidan", 
      "priority": "high"
    }
  ]
}`;

    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiApiKey}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                contents: [{
                    parts: [{
                        text: prompt
                    }]
                }]
            })
        });

        if (!response.ok) {
            throw new Error(`API Error: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        const generatedText = data.candidates[0].content.parts[0].text;
        
        // Parse JSON from response
        const jsonMatch = generatedText.match(/\{[\s\S]*\}/);
        if (!jsonMatch) {
            throw new Error('Could not parse AI response');
        }
        
        const aiResponse = JSON.parse(jsonMatch[0]);
        
        // Validate and limit tasks
        if (!aiResponse.tasks || !Array.isArray(aiResponse.tasks)) {
            throw new Error('Invalid AI response format');
        }
        
        // Limit to maximum 10 tasks
        const limitedTasks = aiResponse.tasks.slice(0, 10);
        
        // Convert to our task format
        const generatedTasks = limitedTasks.map((task, index) => ({
            id: Date.now() + index,
            text: `[Assignment ${assignmentNumber}] ${task.description}`,
            assignee: task.assignee || 'Unassigned',
            completed: false,
            createdAt: new Date().toISOString(),
            isGenerated: true,
            priority: task.priority || 'medium'
        }));
        
        // Add tasks to the list
        generatedTasks.forEach(task => {
            tasks.unshift(task);
        });
        
        saveTasks();
        renderTasks();
        updateStatistics();
        
        showNotification(`AI generated ${generatedTasks.length} meaningful tasks for Assignment ${assignmentNumber}`, 'success');
        setGenerateButtonState('ready');
        
    } catch (error) {
        console.error('Gemini API Error Details:', {
            message: error.message,
            status: error.status,
            apiKey: geminiApiKey ? `${geminiApiKey.substring(0, 10)}...` : 'missing',
            endpoint: `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent`
        });
        
        let errorMessage = error.message;
        if (error.message.includes('404')) {
            errorMessage = 'API endpoint not found. Check if the API key is valid and has Gemini API access.';
        } else if (error.message.includes('403')) {
            errorMessage = 'API key is invalid or lacks permissions. Please check your API key.';
        } else if (error.message.includes('429')) {
            errorMessage = 'API rate limit exceeded. Please try again later.';
        }
        
        showNotification(`AI Error: ${errorMessage}`, 'error');
        setGenerateButtonState('ready');
    }
}

function setGenerateButtonState(state) {
    const btn = document.getElementById('generateTasksBtn');
    const btnText = document.getElementById('generateBtnText');
    
    switch(state) {
        case 'processing':
            btn.disabled = true;
            btnText.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>AI Processing...';
            break;
        case 'ready':
            btn.disabled = !(currentAssignment && uploadedFileContent && geminiApiKey);
            btnText.innerHTML = '<i class="fas fa-brain mr-2"></i>Generate Tasks with AI';
            break;
    }
}

function toggleApiKeyVisibility() {
    const input = document.getElementById('geminiApiKey');
    const icon = document.getElementById('apiKeyToggleIcon');
    
    if (input.type === 'password') {
        input.type = 'text';
        icon.classList.remove('fa-eye');
        icon.classList.add('fa-eye-slash');
    } else {
        input.type = 'password';
        icon.classList.remove('fa-eye-slash');
        icon.classList.add('fa-eye');
    }
}

function parseAssignmentContent(content, assignmentNumber) {
    const generatedTasks = [];
    const teamMembers = ['Tristan', 'Aidan', 'Micheala', 'Leandro'];
    
    // Split content into lines and clean up
    const lines = content.split('\n').filter(line => line.trim().length > 0);
    
    // Common assignment task patterns
    const taskPatterns = [
        /(?:task|requirement|deliverable|step|part)\s*(\d+)[.:]?\s*(.+)/i,
        /(\d+)[.)]\s*(.+)/,
        /(?:complete|create|implement|design|develop|write|build|test)\s+(.+)/i,
        /(?:section|chapter|module)\s*(\d+)[.:]?\s*(.+)/i
    ];
    
    lines.forEach((line, index) => {
        let taskText = null;
        
        // Try to match task patterns
        for (const pattern of taskPatterns) {
            const match = line.match(pattern);
            if (match) {
                taskText = match[2] || match[1];
                break;
            }
        }
        
        // If no pattern matched, use the line as a task if it's substantial
        if (!taskText && line.trim().length > 10) {
            taskText = line.trim();
        }
        
        if (taskText) {
            // Clean up the task text
            taskText = taskText.replace(/^\d+[.)]\s*/, '').trim();
            
            // Assign to team member (round-robin)
            const assignee = teamMembers[index % teamMembers.length];
            
            generatedTasks.push({
                id: Date.now() + index,
                text: `[Assignment ${assignmentNumber}] ${taskText}`,
                assignee: assignee,
                completed: false,
                createdAt: new Date().toISOString(),
                isGenerated: true
            });
        }
    });
    
    // If no tasks were found from patterns, create some generic tasks
    if (generatedTasks.length === 0 && content.trim().length > 50) {
        const genericTasks = [
            'Review assignment requirements',
            'Create initial draft',
            'Complete research phase',
            'Finalize submission',
            'Review and edit'
        ];
        
        genericTasks.forEach((taskText, index) => {
            generatedTasks.push({
                id: Date.now() + index,
                text: `[Assignment ${assignmentNumber}] ${taskText}`,
                assignee: teamMembers[index % teamMembers.length],
                completed: false,
                createdAt: new Date().toISOString(),
                isGenerated: true
            });
        });
    }
    
    return generatedTasks;
}

function saveCurrentAssignment() {
    localStorage.setItem('currentAssignment', JSON.stringify(currentAssignment));
}
