export class BoardColumn{
    constructor(element){
        this.element=element;
        this.title=this.element.querySelector(".title__text").textContent;
        this.countEl=this.element.querySelector(".counter");
        this.taskCount=0;
        this.init();
    }

    init(){
        this.countEl.textContent=this.taskCount;
        this.bindEvents();
    }

    addTask(newTask){

        const taskEl=document.createElement("div");
        taskEl.classList.add("task");

        taskEl.innerHTML=`
            <h4 class="task__title">${newTask.title}</h4>
            <p class="task__description">${newTask.description}</p>
            <div class="task__time-info">
                <span> Duration: ${newTask.duration}h </span>
                <span> Start: ${newTask.startDate} </span>
                <span> End: ${newTask.endDate} </span>            
            </div>
            <span class="task__priority"> Priority: ${newTask.priority}</span>
            <span class="task__type"> Task type: ${newTask.type}</span>
            <span class="task__asignee"> Asignee: ${newTask.asignee}</span>
        `
        
        this.element.appendChild(taskEl);
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

};