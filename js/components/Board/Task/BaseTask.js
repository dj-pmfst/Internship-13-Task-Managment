import { DateTimeHelper } from "../../../helpers/DateTimeHelper.js";

export class BaseTask{
    constructor(data){
        this.propertyMapping(data);
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

    static markup(task){
        return `
            <div class="task__title"><button>${task.title}</button></div>
        `;
    }    

    static thresholds = {
        high: 0.3,
        medium: 0.2,
        low: 0.1
    }
    
    updateTask(updatedTaskData){
        this.propertyMapping(updatedTaskData);
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
        const threshold = BaseTask.thresholds[this.priority];

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
    
}