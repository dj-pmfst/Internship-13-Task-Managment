
document.querySelectorAll('.add button').forEach(button => {
    button.addEventListener('click', () => {
        document.querySelector('.pop-add').classList.add('active');
    });
});

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
        showConfirmation('Are you sure you want to unarchive this task?', () => {
            taskElement.remove();
            console.log('Task unarchived!');
        });
    }
});