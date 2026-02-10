export class BoardColumn{
    constructor(title){
        this.title=title;
        this.taskCount=0;
        this.init();
    }

    init(){
        this.render();
        this.bindEvents();
    }

    render(){
        this.element=document.createElement("div");
        this.element.classList.add("board-column");

        this.element.innerHTML=BoardColumn.markup(this.title,this.taskCount);

        this.countEl=this.element.querySelector(".board-column__count");
        this.cardsContainer=this.element.querySelector(".board-column__cards");
    }

    static markup(title,taskCount){
        return `
            <div class="board-column__header">
                <h2 class="board-column__title">${title}</h2>
                <span class="board-column__count">${taskCount}</span>
            </div>

            <div class="board-column__cards"></div>
            <div class="board-column__footer">
                <button class="board-column__add-btn">
                    <img src="plus-icon.svg" alt="plus"/>
                    <span>Add a card</span>
                </button>
            </div>
            `
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