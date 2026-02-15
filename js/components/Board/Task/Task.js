import { DragType } from "../../../enums/DragType.js";
import { BaseTask } from "./BaseTask.js";

export class Task extends BaseTask{
    constructor(data){
        super(data);
        this.init();
    }

    init(){       
        this.createElement(); 
        this.render();
        this.element.draggable=true;       
        this.bindEvents(); 
    }

    createElement(){
        this.element = document.createElement("div");        
        this.element.classList.add("task");

        this.actionsSpan = document.createElement("span");
        this.actionsSpan.classList.add("task__actions");
        this.actionsSpan.innerHTML = `
            <button class="warning-btn" style="display: none;">
                <img src="media/exclamation-mark-9765.svg">
                <div class="hover-info">Deadline approaching!</div>
            </button>
            <button class="edit-btn"><img src="media/edit-black-pencil-28048.svg"></button>
        `;

        this.taskActionsBtn = this.actionsSpan.querySelector('.edit-btn');
    }

    render(){
        this.element.innerHTML = BaseTask.markup(this);
        this.element.appendChild(this.actionsSpan); 
        
        this.titleButton = this.element.querySelector('.task__title button');
    }

    bindEvents(){
        this.enableTaskActions();
        this.enableDrag();
    }

    enableTaskActions(){
        this._onButtonClick = () => {
            const event = new CustomEvent("requestTaskActions", {
                bubbles: true,
                detail: {task: this}
            });
            this.element.dispatchEvent(event);
        }

        this._onTitleClick = () => {
            const event = new CustomEvent("requestTaskDetails", {
                bubbles: true,
                detail: {task: this}
            });
            this.element.dispatchEvent(event);
        }

        this.titleButton.addEventListener("click", this._onTitleClick);
        this.taskActionsBtn.addEventListener("click", this._onButtonClick);
    }

    enableDrag(){

        this._onDragStart=(e)=>{
            console.log("Start");
            e.dataTransfer.effectAllowed="move";
            e.currentTarget.classList.add("dragging");

            const columnEl=e.currentTarget.closest(".list");
            const sourceColumnTitle=columnEl.querySelector(".title__text").textContent;

            const dragData={
                data: this.id,
                dragType: DragType.TASK,
                sourceColumnTitle
            }
            e.dataTransfer.setData("text/plain",JSON.stringify(dragData)); 
        }

        this._onDragEnd=(e)=>{
            this.element.classList.remove("dragging");
        }

        this.element.addEventListener("dragstart",this._onDragStart);
        this.element.addEventListener("dragend",this._onDragEnd);        
    }
    
    remove(){
        this.destroy();
        this.element.remove();
    }
    destroy(){
        this.taskActionsBtn.removeEventListener("click", this._onButtonClick);

        this.titleButton.removeEventListener("click", this._onTitleClick);

        this.element.removeEventListener("dragstart",this._onDragStart);
        this.element.removeEventListener("dragend",this._onDragEnd);

    }
}