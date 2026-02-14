export class Task{
    constructor(data){
        Object.assign(this,data);
        this.init();
    }

    init(){
        this.element=document.createElement("div");        
        this.element.classList.add("task");
        this.render();
    }
    render(){
        this.element.innerHTML=Task.markup(this);
    }

    static markup(){
        return `
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
            <span class="task__actions">
            <button class="warning-btn" style="display: none;">
                <img src="media/exclamation-mark-9765.svg">
                <div class="hover-info">Deadline approaching!</div>
            </button>
            <button><img src="media/edit-black-pencil-28048.svg"></button>
        </span>
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
        const warningBtn = this.element.querySelector('.warning-btn');
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
}