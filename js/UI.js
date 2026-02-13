
import { Board } from "./components/Board/Board.js";
import { board } from "./components/AllComponents/mainElements.js";

export class UI{
    constructor(){
        this.init();
    }

    init(){
        this.board=new Board(board);
    }

    async loadTasks(){
        await this.board.showAddedTasks();
    }
}