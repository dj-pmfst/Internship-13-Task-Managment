import { BaseTask } from "./BaseTask.js";

export class ArchivedTask extends BaseTask{
    constructor(data){
        super(data);
        this.init();
    }

    init(){
        this.createElement();
        this.render();
        this.bindEvents();
    }

    createElement(){
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
        this.unarchiveButton=this.actionsSpan.querySelector(".unarchive-btn");
        this.deleteButton=this.actionsSpan.querySelector(".delete-btn");
    }

    render(){
        this.element.innerHTML = BaseTask.markup(this);
        this.element.appendChild(this.actionsSpan); 
        
        this.titleButton = this.element.querySelector('.task__title button');
    }


    bindEvents(){

        this._onArchiveButtonClick = () => {
            const event = new CustomEvent("requestTaskUnarchive", {
                bubbles: true,
                detail: {task: this}
            });
            this.element.dispatchEvent(event);
        }
        
        this._onDeleteButtonClick = () => {
            const event = new CustomEvent("requestTaskDelete", {
                bubbles: true,
                detail: {task: this}
            });
            this.element.dispatchEvent(event);
        }   
        
        this._onTitleClick = () => {
            const event = new CustomEvent("requestArchivedTaskDetails", {
                bubbles: true,
                detail: {task: this}
            });
            this.element.dispatchEvent(event);
        }

        this.titleButton.addEventListener("click", this._onTitleClick);        
        this.unarchiveButton.addEventListener("click",this._onArchiveButtonClick);
        this.deleteButton.addEventListener("click",this._onDeleteButtonClick);
    }

    remove(){
        this.destroy();
        this.element.remove();
    }
    
    destroy(){
        this.titleButton.removeEventListener("click", this._onTitleClick);
        this.unarchiveButton.removeEventListener("click",this._onArchiveButtonClick);
        this.deleteButton.removeEventListener("click",this._onDeleteButtonClick);
    }

}