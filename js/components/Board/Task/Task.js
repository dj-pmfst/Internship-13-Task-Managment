export class Task{
    constructor(data){
        Object.assign(this,data);
        this.init();
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
        
        this.bindEvents(); 
        this.render();
    }

    render(){
        this.element.innerHTML = Task.markup(this);
        this.element.appendChild(this.actionsSpan); 
    }

    static markup(task){
        return `
            <h4 class="task__title">${task.title}</h4>
            <p class="task__description">${task.description}</p>
            <div class="task__time-info">
                <span> Duration: ${task.duration}h </span>
                <span> Start: ${task.startDate} </span>
                <span> End: ${task.endDate} </span>            
            </div>
            <span class="task__priority"> Priority: ${task.priority}</span>
            <span class="task__type"> Task type: ${task.type}</span>
            <span class="task__asignee"> Asignee: ${task.asignee}</span>
        `;
    }

    static tresholds={
        high: 0.3,
        medium: 0.2,
        low: 0.1
    }

    getTimeLeftClass(){
        const now= new Date();
        const start=new Date(this.startDate);
        const end=new Date(this.endDate);

        if(now>=end) return "task--expired";

        const totalDuration=end-start;
        const timeLeft=end-now;
        const percentageLeft=timeLeft/totalDuration;

        const treshold=Storage.tresholds[this.task.priority];

        return percentageLeft<=treshold ? "task--warning" : "";
    }

    updateTimeLeftClass(){
        const classes = ["task--expired","task--warning"];
        const newClass=this.getTimeLeftClass();

        if(this.element.classList.contains(newClass)) return;

        classes.forEach(cls=>this.element.classList.remove(cls));

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
        this.taskActionsBtn.addEventListener("click", this._onButtonClick);
    }
    
    destroy(){
        this.taskActionsBtn.removeEventListener("click", this._onButtonClick);
    }
}