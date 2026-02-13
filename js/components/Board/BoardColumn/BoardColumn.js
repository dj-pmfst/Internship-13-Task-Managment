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
        this.cardsContainer.appendChild(newTask);
        this.updateCount();
    }

    updateCount(){
        this.taskCount++;
        this.countEl.textContent=`${this.taskCount}`;
    }

    bindEvents(){
        const addBtn=this.element.querySelector(".add");

        this._onButtonClick=()=>{
            const event=new CustomEvent("requestNewCard",{
                detail: {columnTitle: this.title}
            });

            this.element.dispatchEvent(event);
        }
        addBtn.addEventListener("click",this._onButtonClick);
    }

};