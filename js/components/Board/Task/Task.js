import { DragType } from "../../../enums/DragType.js";
import { DateTimeHelper } from "../../../helpers/DateTimeHelper.js";

export class Task{
    constructor(data){
        this.propertyMapping(data);
        this.init();
    }

    propertyMapping(data){
        this.id=data.id;
        this.title=data.title;
        this.description=data.description;
        this.assignee=data.assignee;
        this.duration=data.est_duration;
        this.startDate=DateTimeHelper.toDateTimeLocal(data.est_start_date);
        this.endDate=DateTimeHelper.toDateTimeLocal(data.est_end_date);
        this.priority=data.priority;
        this.status=data.status;
        this.type=data.type;
        this.archived = data.archived;
        this.archivedAt = data.archived_at;

        this.position=data.position;
    }

    static thresholds={
        high: 0.3,
        medium: 0.2,
        low: 0.1
    }

    init(){
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
        
        this.render();
        this.element.appendChild(this.actionsSpan); 
        this.element.draggable=true;       
        this.bindEvents(); 
    }

    render(){
        const previousContent = this.element.innerHTML;
        this.element.innerHTML = Task.markup(this);
        this.element.appendChild(this.actionsSpan); 

        const titleButton = this.element.querySelector('.task__title button');
        if (titleButton && this._onTitleClick) {
            titleButton.addEventListener("click", this._onTitleClick);
        }
    }

    static markup(task){
        return `
            <div class="task__title"><button>${task.title}</button></div>
        `;
    }

    updateTask(updatedTaskData){
        this.propertyMapping(updatedTaskData);
        this.render();
        this.updateTimeLeftClass();
    }

    getTimeLeftClass(){
        const now = new Date();
        const start = new Date(this.startDate);
        const end = new Date(this.endDate);

        if(now >= end) return "task--expired";

        const totalDuration = end - start;
        const timeLeft = end - now;
        const percentageLeft = timeLeft / totalDuration;
        const threshold = Task.thresholds[this.priority];

        return percentageLeft <= threshold ? "task--warning" : "";
    }

    updateTimeLeftClass(){
        const classes = ["task--expired", "task--warning"];
        const newClass = this.getTimeLeftClass();

        if(this.element.classList.contains(newClass)) return;

        classes.forEach(cls => this.element.classList.remove(cls));

        if(newClass) this.element.classList.add(newClass);

        this.showWarningPopup(newClass);
    }

    showWarningPopup(newClass){
        const warningBtn = this.actionsSpan.querySelector('.warning-btn');
        const hoverInfo = warningBtn?.querySelector('.hover-info');
        
        if(!warningBtn) return;
        
        if(newClass === "task--expired"){
            warningBtn.style.display = 'inline-block';
            if(hoverInfo) hoverInfo.textContent = "Deadline expired!";
        } else if(newClass === "task--warning"){
            warningBtn.style.display = 'inline-block';
            if(hoverInfo) hoverInfo.textContent = "Deadline approaching!";
        } else {
            warningBtn.style.display = 'none';
        }
    }

    bindEvents(){
        this._onButtonClick = () => {
            const event = new CustomEvent("requestTaskActions", {
                bubbles: true,
                detail: {task: this}
            });
            this.element.dispatchEvent(event);
        }

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

        this.taskActionsBtn.addEventListener("click", this._onButtonClick);
        this.element.addEventListener("dragstart",this._onDragStart);
        this.element.addEventListener("dragend",this._onDragEnd);

        this._onTitleClick = () => {
            const event = new CustomEvent("requestTaskDetails", {
                bubbles: true,
                detail: {task: this}
            });
            this.element.dispatchEvent(event);
        }

        const titleButton = this.element.querySelector('.task__title button');
        if (titleButton) {
            titleButton.addEventListener("click", this._onTitleClick);
        }
    }
    
    destroy(){
        this.taskActionsBtn.removeEventListener("click", this._onButtonClick);
        const titleButton = this.element.querySelector('.task__title button');
        if (titleButton && this._onTitleClick) {
            titleButton.removeEventListener("click", this._onTitleClick);
        }
    }
}