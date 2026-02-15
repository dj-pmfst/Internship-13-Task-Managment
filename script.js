
(function () {
    const darkEnabled = localStorage.getItem("darkMode") === "enabled";
    const darkSheet = document.getElementById("dark-mode-stylesheet");

    if (darkSheet) {
        darkSheet.disabled = !darkEnabled;
    }
})();


// let confirmAction = null;

// function showConfirmation(message, onConfirm) {
//     confirmText.textContent = message;
//     confirmAction = onConfirm;
//     confirmPopup.classList.add('active');
// }

// function hideConfirmation() {
//     confirmPopup.classList.remove('active');
//     confirmAction = null;
// }

// confirmYes.addEventListener('click', () => {
//     if (confirmAction) {
//         confirmAction(); 
//     }
//     hideConfirmation();
// });

// confirmNo.addEventListener('click', () => {
//     hideConfirmation();
// });

// confirmPopup.addEventListener('click', (e) => {
//     if (e.target === confirmPopup) {
//         hideConfirmation();
//     }
// });

// document.addEventListener('click', (e) => {
//     if (e.target.closest('.delete-btn')) {
//         const taskElement = e.target.closest('.task-archived');
//         showConfirmation('Are you sure you want to delete this task?', () => {
//             taskElement.remove();
//             console.log('Task deleted!');
//         });
//     }

//     if (e.target.closest('.unarchive-btn')) {
//         const taskElement = e.target.closest('.task-archived');
//         showConfirmation('Are you sure you want to unarchive this task?', () => {
//             taskElement.remove();
//             console.log('Task unarchived!');
//         });
//     }
// });
