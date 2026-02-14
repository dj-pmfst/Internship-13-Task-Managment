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
        const addDiv = this.element.querySelector('.add');
        
        if (addDiv) {
            this.element.insertBefore(newTask.element, addDiv);
        } else {
            this.element.appendChild(newTask.element);
        }
        
        this.taskList.push(newTask);
        newTask.updateTimeLeftClass();
        this.updateCount();
    }
    
    updateCount(){
        this.taskCount++;
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
            e.dataTransfer.effectAllowed="move";
            e.dataTransfer.setData("text/plain", this.title); 
        }
        this._onDragOver=(e)=>{
            e.preventDefault();
            e.currentTarget.classList.add("drag-over");
        }
        this._onDragLeave=(e)=>{
            e.currentTarget.classList.remove("drag-over");
        }
        this._onDrop=(e)=>{
            const draggedColumnTitle=e.dataTransfer.getData("text/plain");
            const event=new CustomEvent("columnDrop",{
                bubbles: true,
                detail: {
                    targetColumn: this,
                    draggedColumnTitle}
            });
            this.element.dispatchEvent(event);
        }
        
        addBtn.addEventListener("click",this._onAddButtonClick);
        leftBtn.addEventListener("click",this._onLeftButtonClick);
        rightBtn.addEventListener("click",this._onRightButtonClick);
        this.element.addEventListener("dragstart",this._onDragStart);
        this.element.addEventListener("dragover",this._onDragOver);
        this.element.addEventListener("drop",this._onDrop);
        this.element.addEventListener("dragleave",this._onDragLeave);
    }
    startTaskMonitor(interval){
        this._taskMonitorInterval=setInterval(()=>{
            this.taskList.forEach(task=>task.updateTimeLeftClass());
        },interval);
    }
    stopInterval(){
        clearInterval(this._taskMonitorInterval);
    }
    
};