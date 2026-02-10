export class BoardColumn{
    constructor(element){
        this.element=element;
        this.title=this.element.querySelector(".board-column__title").textContent;
        this.countEl=this.element.querySelector(".board-column__count");
        this.cardsContainer=this.element.querySelector(".board-column__cards");
        this.taskCount=0;
        this.init();
    }

    init(){
        this.bindEvents();
    }

    addCard(newCard){
        this.cardsContainer.appendChild(newCard);
        this.updateCount();
    }

    updateCount(){
        this.taskCount++;
        this.countEl.textContent=`${this.taskCount}`;
    }

    bindEvents(){
        const addBtn=this.element.querySelector(".board-column__add-btn");

        this._onButtonClick=()=>{
            const event=new CustomEvent("requestNewCard",{
                bubbles: true,
                detail: {columnTitle: this.title}
            });

            this.element.dispatchEvent(event);
        }
        addBtn.addEventListener("click",this._onButtonClick);
    }

};