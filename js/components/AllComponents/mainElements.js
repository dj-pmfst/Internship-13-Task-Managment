const board=document.querySelector(".lists-container");
const alertDiv=document.querySelector(".alertDiv");
const popAdd = document.querySelector(".pop-add");

const inputs={
    title:popAdd.querySelector("#title-input"),
    description:popAdd.querySelector("#description-input"),
    startDate:popAdd.querySelector("#start-input"),
    endDate:popAdd.querySelector("#end-input"),
    duration:popAdd.querySelector("#duration-input"),
    priority:popAdd.querySelector(".priority select"),
    type:popAdd.querySelector(".type select"),
    asignee:popAdd.querySelector("#person-input")
}

const modeSwitchElements={
    lightModeBtn: document.querySelector('.light-mode-btn'),
    darkModeBtn:document.querySelector('.dark-mode-btn'),
    darkModeStylesheet: document.getElementById('dark-mode-stylesheet')
}

const archiveElements={
    archiveButton:document.querySelector('.subtitle button.archive'),
    archivedContainer: document.querySelector('.archived')
}

const todoElements={
    todoButton: document.querySelector('.subtitle button:first-child'),
    listsContainer: document.querySelector('.lists-container'),
    todoLists: document.querySelectorAll('.list')
}

const taskEditPopupElements={
    popAdd,
    saveBtn: popAdd.querySelector("#save"),
    cancelBtn: popAdd.querySelector("#cancel"),
    editBtn: popAdd.querySelector("#edit"),
}

const confirmPopupElements={
    confirmPopup: document.querySelector('.pop-confirm'),
    confirmText: document.getElementById('confirm-text'),
    confirmYes: document.getElementById('confirm-yes'),
    confirmNo: document.getElementById('confirm-no')
}

const taskDetailsPopupElements = {
    popup: document.querySelector('.pop-details'),
    closeBtn: document.querySelector('.pop-details .close-details'),
    deleteBtn: document.querySelector(".pop-details #delete-btn"),
    archiveBtn: document.querySelector(".pop-details #archive"),
    title: document.getElementById('detail-title'),
    description: document.getElementById('detail-description'),
    start: document.getElementById('detail-start'),
    end: document.getElementById('detail-end'),
    duration: document.getElementById('detail-duration'),
    priority: document.getElementById('detail-priority'),
    type: document.getElementById('detail-type'),
    assignee: document.getElementById('detail-assignee'),
    status: document.getElementById('detail-status')
};

export { board,alertDiv,inputs,modeSwitchElements,archiveElements,todoElements,confirmPopupElements, taskEditPopupElements, taskDetailsPopupElements };