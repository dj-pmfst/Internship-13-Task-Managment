const board=document.querySelector(".lists-container");
const alertDiv=document.querySelector(".alertDiv");

const popAdd=document.querySelector(".pop-add");

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

export { board,alertDiv,popAdd,inputs,modeSwitchElements,archiveElements,todoElements };