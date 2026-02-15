const lightModeBtn = document.querySelector('.light-mode-btn');
const darkModeBtn = document.querySelector('.dark-mode-btn');
const darkModeStylesheet = document.getElementById('dark-mode-stylesheet');

if (localStorage.getItem('darkMode') === 'enabled') {
    darkModeStylesheet.disabled = false;
    lightModeBtn.style.display = 'none';
    darkModeBtn.style.display = 'inline-block';
}

function isDarkMode() {
    return !darkModeStylesheet.disabled;
}

function toggleDarkMode() {
    if (darkModeStylesheet.disabled) {
        darkModeStylesheet.disabled = false;
        localStorage.setItem('darkMode', 'enabled');
        lightModeBtn.style.display = 'none';
        darkModeBtn.style.display = 'inline-block';
    } else {
        darkModeStylesheet.disabled = true;
        localStorage.setItem('darkMode', 'disabled');
        lightModeBtn.style.display = 'inline-block';
        darkModeBtn.style.display = 'none';
    }

    if (archivedContainer.style.display === 'flex') {
        showArchived();
    } else {
        showTodoLists();
    }
}

lightModeBtn.addEventListener('click', toggleDarkMode);
darkModeBtn.addEventListener('click', toggleDarkMode);

document.querySelector('#cancel').addEventListener('click', () => {
    document.querySelector('.pop-add').classList.remove('active');
});

document.querySelector('#save').addEventListener('click', () => {
    document.querySelector('.pop-add').classList.remove('active');
});


const confirmPopup = document.querySelector('.pop-confirm');
const confirmText = document.getElementById('confirm-text');
const confirmYes = document.getElementById('confirm-yes');
const confirmNo = document.getElementById('confirm-no');

let confirmAction = null;

function showConfirmation(message, onConfirm) {
    confirmText.textContent = message;
    confirmAction = onConfirm;
    confirmPopup.classList.add('active');
}

function hideConfirmation() {
    confirmPopup.classList.remove('active');
    confirmAction = null;
}

confirmYes.addEventListener('click', () => {
    if (confirmAction) {
        confirmAction(); 
    }
    hideConfirmation();
});

confirmNo.addEventListener('click', () => {
    hideConfirmation();
});

confirmPopup.addEventListener('click', (e) => {
    if (e.target === confirmPopup) {
        hideConfirmation();
    }
});

document.addEventListener('click', (e) => {
    if (e.target.closest('.delete-btn')) {
        const taskElement = e.target.closest('.task-archived');
        showConfirmation('Are you sure you want to delete this task?', () => {
            taskElement.remove();
            console.log('Task deleted!');
        });
    }

    if (e.target.closest('.unarchive-btn')) {
        const taskElement = e.target.closest('.task-archived');
        showConfirmation('Are you sure you want to (un)archive this task?', () => {
            taskElement.remove();
            console.log('Task unarchived!');
        });
    }
});

const todoButton = document.querySelector('.subtitle button:first-child');
const archiveButton = document.querySelector('.subtitle button.archive');
const listsContainer = document.querySelector('.lists-container');
const archivedContainer = document.querySelector('.archived');

function showTodoLists() {
    if (archivedContainer) {
        archivedContainer.style.display = 'none';
    }
    
    const todoLists = document.querySelectorAll('.list');
    todoLists.forEach(list => {
        list.style.display = 'flex';
    });

    if (isDarkMode()) {
        listsContainer.style.backgroundColor = '#27327C';
        todoButton.style.backgroundColor = '#27327C';
        archiveButton.style.backgroundColor = '#5A7FC4';
    } else {
        listsContainer.style.backgroundColor = '#C3C3E6'; 
        todoButton.style.backgroundColor = '#C3C3E6';
        archiveButton.style.backgroundColor = '#9A9ACF';
    }
}

function showArchived() {
    const todoLists = document.querySelectorAll('.list');
    todoLists.forEach(list => {
        list.style.display = 'none';
    });
    
    if (archivedContainer) {
        archivedContainer.style.display = 'flex';
    }

    if (isDarkMode()) {
        listsContainer.style.backgroundColor = '#5A7FC4'; 
        archiveButton.style.backgroundColor = '#5A7FC4';
        todoButton.style.backgroundColor = '#27327C';
    } else {
        listsContainer.style.backgroundColor = '#9A9ACF'; 
        archiveButton.style.backgroundColor = '#9A9ACF';
        todoButton.style.backgroundColor = '#C3C3E6';
    }
}

todoButton.addEventListener('click', showTodoLists);
archiveButton.addEventListener('click', showArchived);

showTodoLists();