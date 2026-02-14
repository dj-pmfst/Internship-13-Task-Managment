import { DragType } from "../../../enums/DragType.js";

export class BoardColumn{
    constructor(element){
        this.element=element;
        this.title=this.element.querySelector(".title__text").textContent;
        this.countEl=this.element.querySelector(".counter");
        this.taskCount=0;
        this.taskList=[];
        this.init();
    }

    init(){
        this.element.draggable=true;
        this.countEl.textContent=this.taskCount;
        this.bindEvents();
        this.startTaskMonitor(5*6*1000);
    }

    addTask(newTask){        
        this.element.appendChild(newTask.element);
        this.taskList.push(newTask);

        newTask.updateTimeLeftClass();

        this.updateCount();
    }

    updateCount(isIncrement=true){
        isIncrement ? this.taskCount++ : this.taskCount--;
        this.countEl.textContent=this.taskCount;
    }


    bindEvents(){
        const addBtn=this.element.querySelector(".add button");
        const leftBtn=this.element.querySelector(".move-left");
        const rightBtn=this.element.querySelector(".move-right");

        this._onAddButtonClick=()=>{
            const event=new CustomEvent("requestNewTask",{
                bubbles: true,
                detail: {columnTitle: this.title}
            });

            this.element.dispatchEvent(event);
        }

        this._onLeftButtonClick=()=>{
            const event=new CustomEvent("requestColumnMove",{
                bubbles: true,
                detail: {
                    column: this,
                    direction: -1
                }
            });

            this.element.dispatchEvent(event);
        }


        this._onRightButtonClick=()=>{
            const event=new CustomEvent("requestColumnMove",{
                bubbles: true,
                detail: {
                    column: this,
                    direction: 1
                }
            });

            this.element.dispatchEvent(event);
        }        

        this._onDragStart=(e)=>{

            const fetchedDragDataString=e.dataTransfer.getData("text/plain");
            let fetchDragData;

            if(fetchedDragDataString){
                fetchDragData=JSON.parse(fetchedDragDataString);
                if(fetchDragData.dragType===DragType.TASK) return;                
            }

            e.dataTransfer.effectAllowed="move";

            const dragData={
                data: this.title,
                dragType: DragType.COLUMN
            }
            e.dataTransfer.setData("text/plain",JSON.stringify(dragData)); 

        }

        this._onDragOver=(e)=>{
            e.preventDefault();

            document.querySelectorAll(".drag-over").forEach(el=>el.classList.remove("drag-over"));
            e.currentTarget.classList.add("drag-over");

            const dragDataStr=e.dataTransfer.getData("text/plain");
            if (!dragDataStr) return;

            const dragData = JSON.parse(dragDataStr);

            console.log(dragData.dragType);

            if(dragData.dragType===DragType.TASK){
                const afterElement=this.getDragAfterElement(e.clientY);
                const draggedElement=document.querySelector(".dragging");

                if(afterElement===null)
                    this.element.appendChild(draggedElement);

                else
                    this.element.insertBefore(draggedElement,afterElement);
            }
        }

        this._onDrop=(e)=>{

            const dragDataStr=e.dataTransfer.getData("text/plain");
            if (!dragDataStr) return;

            const dragData = JSON.parse(dragDataStr);

            let event;

            if(dragData.dragType===DragType.COLUMN){
                event=new CustomEvent("columnDrop",{
                    bubbles: true,
                    detail: {
                        targetColumn: this,
                        draggedColumnTitle: dragData.data
                    }
                });
            }

            else if(dragData.dragType===DragType.TASK){
                event=new CustomEvent("taskDrop",{
                    bubbles: true,
                    detail: {
                        targetColumn: this,
                        draggedTaskId: dragData.data,
                        sourceColumnTitle: dragData.sourceColumnTitle,
                        afterElement: this.getDragAfterElement(e.clientY)
                    }
                });                   
            }
            this.element.dispatchEvent(event);
        }

        
        addBtn.addEventListener("click",this._onAddButtonClick);
        leftBtn.addEventListener("click",this._onLeftButtonClick);
        rightBtn.addEventListener("click",this._onRightButtonClick);

        this.element.addEventListener("dragstart",this._onDragStart);
        this.element.addEventListener("dragover",this._onDragOver);
        this.element.addEventListener("drop",this._onDrop);
    }

    startTaskMonitor(interval){

        this._taskMonitorInterval=setInterval(()=>{
            this.taskList.forEach(task=>task.updateTimeLeftClass());
        },interval);
    }

    stopInterval(){
        clearInterval(this._taskMonitorInterval);
    }

    getDragAfterElement(y){

        const draggableElements = [...this.element.querySelectorAll('.task:not(.dragging)')];
        return draggableElements.reduce((closest, child) => {

            const box = child.getBoundingClientRect();
            const offset = y - box.top - box.height / 2;

            if (offset < 0 && offset > closest.offset)
                return { offset: offset, element: child };
        
            else return closest;

        }, { offset: Number.NEGATIVE_INFINITY }).element;

    }

}