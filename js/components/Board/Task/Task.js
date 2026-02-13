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
        this.element.innerHTML=this.markup();
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
            <span class="task__asignee"> Asignee: ${this.asignee}</span>
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

        const treshold=Task.tresholds[this.priority];

        return percentageLeft<=treshold ? "task--warning" : "";
    }

    updateTimeLeftClass(){
        const classes = ["task--expired","task--warning"];
        const newClass=this.getTimeLeftClass();

        if(this.element.classList.contains(newClass)) return;

        classes.forEach(cls=>this.element.classList.remove(cls));

        if(newClass) this.element.classList.add(newClass);
    }
}