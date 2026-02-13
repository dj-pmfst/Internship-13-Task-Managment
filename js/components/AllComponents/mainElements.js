const board=document.querySelector(".lists-container");
const alertDiv=document.querySelector(".alert-div");
const popAdd=document.querySelector(".pop-add");

const inputs={
    title:popAdd.querySelector("#title input"),
    description:popAdd.querySelector("#description input"),
    startDate:popAdd.querySelector("#start input"),
    endDate:popAdd.querySelector("#end input"),
    duration:popAdd.querySelector("#duration input"),
    priority:popAdd.querySelector("#priority input"),
    type:popAdd.querySelector("#type input"),
    asignee:popAdd.querySelector("#person input")
}

export {board,alertDiv,popAdd,inputs};