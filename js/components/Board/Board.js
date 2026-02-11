import { Popup } from "../Popup/Popup.js";
import { BoardColumn } from "./BoardColumn/BoardColumn.js";
import { Task } from "./Task/Task.js";

export class Board{
    constructor(boardEl){
        this.boardEl=boardEl;        
        this.init();
    }

    init(){
        this.initColumns();
        this.bindEvents();
    }

    initColumns(){
        const columnElements=this.boardEl.querySelectorAll(".list");
        this.columns=Array.from(columnElements).map(column=>new BoardColumn(column));
    }

    bindEvents(){
        this.boardContentEl.addEventListener("requestNewCard",e=>{
        });

    }
}