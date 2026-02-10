import { columnTypes } from "../../enums/ColumnTypes.js";
import { BoardColumn } from "./BoardColumn/BoardColumn.js";

export class Board{
    constructor(container){
        this.init(container);
        this.boardContentEl = boardEl.querySelector(".board__content");
    }

    init(container){
        this.container=container;
        this.render();
        this.initColumns();
        this.bindEvents();
    }

    initColumns(){
        const columnElements=this.boardContentEl.querySelectorAll(".board-column");
        this.columns=Array.from(columnElements).map(column=>new BoardColumn(el));
    }

    bindEvents(){
        this.boardContentEl.addEventListener("requestNewCard",e=>{
            const columnTitle=e.detail.columnTitle;

            const targetColumn=this.columns.find(col=>col.title===columnTitle);

            //logic for adding new card into target column
            //targetColumn.addCard(newCard)
        });

    }
}