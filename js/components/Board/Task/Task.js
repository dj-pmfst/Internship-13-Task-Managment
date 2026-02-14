export class Task{
    constructor(data){
        Object.assign(this,data);
        this.init();
    }

    static thresholds={
        high: 0.3,
        medium: 0.2,
        low: 0.1
    }

    init(){
        this.element=document.createElement("div");        
        this.element.classList.add("task");

        this.contentEl=document.createElement("div");
        this.contentEl.classList.add("task__content");
        this.element.append(this.contentEl);

        this.render();

        const taskActionsSpan=document.createElement("span");
        this.taskActionsBtn=document.createElement("button");
        const btnImage=document.createElement("img");
        btnImage.src="media/edit-black-pencil-28048.svg";

        this.taskActionsBtn.classList.add("task__actions-button");

        this.taskActionsBtn.appendChild(btnImage);
        taskActionsSpan.appendChild(this.taskActionsBtn);
        this.element.appendChild(taskActionsSpan);

        this.bindEvents();
    }

    render(){
        this.contentEl.innerHTML=this.markup();
    }

    markup(){
        return `
            <h4 class="task__title">${this.title}</h4>
            <p class="task__description">${this.description}</p>
            <div class="task__time-info">
                <span> Duration: ${this.duration}h </span>
                <span> Start: ${this.startDate} </span>
                <span> End: ${this.endDate} </span>            
            </div>
            <span class="task__priority"> Priority: ${this.priority}</span>
            <span class="task__type"> Task type: ${this.type}</span>
            <span class="task__asignee"> Assignee: ${this.assignee}</span>        
        `;
    }

    updateTask(updatedTaskData){
        Object.assign(this,updatedTaskData);
        this.render();
        this.updateTimeLeftClass();
    }

    getTimeLeftClass(){
        const now= new Date();
        const start=new Date(this.startDate);
        const end=new Date(this.endDate);

        if(now>=end) return "task--expired";

        const totalDuration=end-start;
        const timeLeft=end-now;
        const percentageLeft=timeLeft/totalDuration;

        const threshold=Task.thresholds[this.priority];

        return percentageLeft<=threshold ? "task--warning" : "";
    }

    updateTimeLeftClass(){
        const classes = ["task--expired","task--warning"];
        const newClass=this.getTimeLeftClass();

        if(this.element.classList.contains(newClass)) return;

        classes.forEach(cls=>this.element.classList.remove(cls));

        if(newClass) this.element.classList.add(newClass);
    }

    bindEvents(){

        this._onButtonClick=()=>{
            const event=new CustomEvent("requestTaskActions",{
                bubbles: true,
                detail: {task: this}
            });

            this.element.dispatchEvent(event);
        }
        this.taskActionsBtn.addEventListener("click",this._onButtonClick);
    }

    destroy(){
        this.taskActionsBtn.removeEventListener("click",this._onButtonClick);
    }
}