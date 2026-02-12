export class BoardColumn{
    constructor(element){
        this.element=element;
        this.title=this.element.querySelector(".title").textContent;
        this.countEl=this.element.querySelector(".counter");
        this.taskCount=0;
        this.init();
    }

    init(){
        this.bindEvents();
    }

    addTask(newTask){

        const taskEl=document.createElement("div");

        taskEl.innerHTML=`
            <h4>${newTask.title}</h4>
            <p>${newTask.description}</p>
            <div class="task__time-info">
                <span> Duration: ${newTask.duration}h </span>
                <strong> Start: ${newTask.startDate} </strong>
                <strong> End: ${newTask.endDate} </string>            
            </div>
            <span> Priority: ${newTask.priority}</span>
            <span> Task type: ${newTask.type}</span>
            <span> Asignee: ${newTask.asignee}</span>
        `
        
        this.element.appendChild(taskEl);
        this.updateCount();
    }

    updateCount(){
        this.taskCount++;
        this.countEl.textContent=`${this.taskCount}`;
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