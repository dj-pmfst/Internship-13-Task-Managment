import { Task } from "./Task.js";

export class ArchivedTask extends Task{
    constructor(data){
        super(data);
    }

    init(){
        this.element = document.createElement("div");        
        this.element.classList.add("task-archived");

        this.actionsSpan = document.createElement("span");
        this.actionsSpan.classList.add("task__actions");

        this.actionsSpan.innerHTML=`
        <button class="unarchive-btn">
            <img src="media/upload-folder-11494.svg">
        </button>
        <button class="delete-btn">
            <img src="media/trash-can-10416.svg">
        </button>
        `
    }
}