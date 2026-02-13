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
        this.countEl.textContent=this.taskCount;
        this.bindEvents();
        this.startTaskMonitor(5*6*1000);
    }

    addTask(newTask){        
        this.element.appendChild(newTask.element);
        this.taskList.append(newTask);

        newTask.updateTimeLeftClass();

        this.updateCount();
    }

    updateCount(){
        this.taskCount++;
        this.countEl.textContent=this.taskCount;
    }

    bindEvents(){
        const addBtn=this.element.querySelector(".add");

        this._onButtonClick=()=>{
            const event=new CustomEvent("requestNewTask",{
                detail: {columnTitle: this.title}
            });

            this.element.dispatchEvent(event);
        }
        addBtn.addEventListener("click",this._onButtonClick);
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