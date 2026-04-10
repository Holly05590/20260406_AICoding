document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const taskForm = document.getElementById('taskForm');
    const taskInput = document.getElementById('taskInput');
    const taskDate = document.getElementById('taskDate');
    const taskTime = document.getElementById('taskTime');
    const pendingList = document.getElementById('pendingList');
    const completedList = document.getElementById('completedList');
    const pendingCount = document.getElementById('pendingCount');
    const completedCount = document.getElementById('completedCount');
    const currentDateDisplay = document.getElementById('currentDateDisplay');

    // Initialize State
    let tasks = JSON.parse(localStorage.getItem('aurora_tasks')) || [];

    // Set Default Date to Today
    const today = new Date();
    taskDate.value = today.toISOString().split('T')[0];
    
    // Display header date
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    currentDateDisplay.innerHTML = `<div>${today.toLocaleDateString('zh-TW', options)}</div>`;

    // Render Initial Tasks
    renderTasks();

    // Add Task Event
    taskForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const text = taskInput.value.trim();
        const date = taskDate.value;
        const time = taskTime.value;

        if (!text || !date) return;

        const newTask = {
            id: Date.now().toString(),
            text,
            date,
            time,
            completed: false,
            createdAt: new Date().toISOString()
        };

        tasks.push(newTask);
        saveAndRender();

        // Reset form but keep date
        taskInput.value = '';
        taskTime.value = '';
        taskInput.focus();
    });

    // Handle Global Clicks (Delegation for toggle, delete, calendar)
    document.addEventListener('click', (e) => {
        const item = e.target.closest('.task-item');
        if (!item) return;

        const id = item.dataset.id;

        // Toggle Status
        if (e.target.closest('.checkbox-label')) {
            toggleTaskStatus(id);
        }

        // Delete Task
        if (e.target.closest('.btn-delete')) {
            deleteTask(id);
        }

        // Add to Google Calendar
        if (e.target.closest('.btn-calendar')) {
            addToCalendar(id);
        }
    });

    function toggleTaskStatus(id) {
        tasks = tasks.map(task => {
            if (task.id === id) {
                return { ...task, completed: !task.completed };
            }
            return task;
        });
        saveAndRender();
    }

    function deleteTask(id) {
        // Add animation class before removing
        const element = document.querySelector(`.task-item[data-id="${id}"]`);
        if (element) {
            element.style.transform = 'scale(0.9)';
            element.style.opacity = '0';
            setTimeout(() => {
                tasks = tasks.filter(task => task.id !== id);
                saveAndRender();
            }, 300);
        } else {
            tasks = tasks.filter(task => task.id !== id);
            saveAndRender();
        }
    }

    function addToCalendar(id) {
        const task = tasks.find(t => t.id === id);
        if (!task) return;

        // Construct Google Calendar URL
        const title = encodeURIComponent(`行動: ${task.text}`);
        
        // Format dates: YYYYMMDDTHHmmSS
        let startStr = task.date.replace(/-/g, '');
        let endStr = task.date.replace(/-/g, '');
        
        if (task.time && task.time !== '') {
            const timeStr = task.time.replace(/:/g, '') + '00';
            startStr += `T${timeStr}`;

            // Calculate end time (assuming 1 hour duration)
            const [hours, minutes] = task.time.split(':');
            let endDate = new Date(task.date);
            endDate.setHours(parseInt(hours) + 1, parseInt(minutes), 0);
            
            // Format end time properly avoiding timezone shift offset issues with simple replacement
            const endY = endDate.getFullYear();
            const endM = String(endDate.getMonth() + 1).padStart(2, '0');
            const endD = String(endDate.getDate()).padStart(2, '0');
            const endH = String(endDate.getHours()).padStart(2, '0');
            const endMin = String(endDate.getMinutes()).padStart(2, '0');
            const endSec = '00';

            endStr = `${endY}${endM}${endD}T${endH}${endMin}${endSec}`;
        }

        let datesStr = '';
        if (startStr.includes('T')) {
            datesStr = `${startStr}/${endStr}`;
        } else {
            // All day event, needs to supply next day for end day
            let nextDay = new Date(task.date);
            nextDay.setDate(nextDay.getDate() + 1);
            let nY = nextDay.getFullYear();
            let nM = String(nextDay.getMonth() + 1).padStart(2, '0');
            let nD = String(nextDay.getDate()).padStart(2, '0');
            endStr = `${nY}${nM}${nD}`;
            datesStr = `${startStr}/${endStr}`;
        }
        
        const details = encodeURIComponent("從 Aurora Todo 自動生成");
        const url = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${datesStr}&details=${details}`;
        
        window.open(url, '_blank');
    }

    function saveAndRender() {
        localStorage.setItem('aurora_tasks', JSON.stringify(tasks));
        renderTasks();
    }

    function renderTasks() {
        pendingList.innerHTML = '';
        completedList.innerHTML = '';
        
        let pCount = 0;
        let cCount = 0;

        // Sort by date and time (ascending)
        const sortedTasks = [...tasks].sort((a, b) => {
            const dateA = new Date(`${a.date}T${a.time || '23:59:59'}`);
            const dateB = new Date(`${b.date}T${b.time || '23:59:59'}`);
            return dateA - dateB;
        });

        sortedTasks.forEach((task, index) => {
            const li = document.createElement('li');
            li.className = `task-item ${task.completed ? 'completed' : ''}`;
            li.dataset.id = task.id;
            li.style.animationDelay = `${index * 0.05}s`;

            const dateObj = new Date(task.date);
            const displayDate = dateObj.toLocaleDateString('zh-TW', { month: 'short', day: 'numeric' });
            let timeOutput = '';
            if (task.time && task.time !== '') {
                timeOutput = `<span><i class="fa-regular fa-clock"></i> ${task.time}</span>`;
            }

            li.innerHTML = `
                <div class="task-content">
                    <label class="checkbox-label">
                        <input type="checkbox" ${task.completed ? 'checked' : ''}>
                        <div class="checkmark"></div>
                    </label>
                    <div class="task-details">
                        <span class="task-text">${task.text}</span>
                        <div class="task-meta">
                            <span><i class="fa-regular fa-calendar-alt"></i> ${displayDate}</span>
                            ${timeOutput}
                        </div>
                    </div>
                </div>
                <div class="task-actions">
                    <button class="action-btn btn-calendar" title="加入 Google 行事曆" type="button">
                        <i class="fa-brands fa-google"></i>
                    </button>
                    <button class="action-btn btn-delete" title="刪除任務" type="button">
                        <i class="fa-solid fa-trash-can"></i>
                    </button>
                </div>
            `;

            if (task.completed) {
                completedList.appendChild(li);
                cCount++;
            } else {
                pendingList.appendChild(li);
                pCount++;
            }
        });

        pendingCount.textContent = pCount;
        completedCount.textContent = cCount;
        
        // Show/hide completed section based on count
        const completedSection = document.querySelector('.completed-header');
        if (cCount === 0) {
            completedSection.style.display = 'none';
        } else {
            completedSection.style.display = 'flex';
        }
    }
});
