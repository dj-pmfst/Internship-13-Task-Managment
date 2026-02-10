import { columnTypes } from "../../enums/ColumnTypes.js";
import { BoardColumn } from "./BoardColumn/BoardColumn.js";

export class Board{
    constructor(container){
        this.init(container);
    }

    init(container){
        this.container=container;
        this.render();
        this.initColumns();
        this.bindEvents();
    }

    render(){
        this.container.innerHTML=Board.markup();
        this.boardContentEl=this.container.querySelector(".board__content");
    }

    static markup(){
        return `
            <h1 class="board__header">My Board</h1>
            <div class="board__content"></div>
        `;
    }

    initColumns(){
        this.columns=Object.values(columnTypes).map(type=>new BoardColumn(type));
        this.columns.forEach(col=>this.boardContentEl.append(col.element));
    }

    bindEvents(){
        this.boardContentEl.addEventListener("requestNewCard",e=>{
            const columnTitle=e.detail.columnTitle;

            const targetColumn=this.columns.find(col=>col.title===columnTitle);
        });

    }
}