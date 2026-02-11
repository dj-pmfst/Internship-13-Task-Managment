const board=document.querySelector(".lists-container");
const alertDiv=document.querySelector(".alert-div");
const popAdd=document.querySelector(".pop-add");

const inputs={
    title:popAdd.querySelector("#title"),
    description:popAdd.querySelector("#description"),
    startDate:popAdd.querySelector("#start"),
    endDate:popAdd.querySelector("#end"),
    duration:popAdd.querySelector("#duration"),
    priority:popAdd.querySelector("#priority"),
    type:popAdd.querySelector("#type"),
    asignee:popAdd.querySelector("#person")
}

export {board,alertDiv,popAdd,inputs};