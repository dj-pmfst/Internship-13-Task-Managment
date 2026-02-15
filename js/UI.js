import { Board } from "./components/Board/Board.js";
import { board,archiveBoard,modeSwitchElements,archiveElements,todoElements } from "./components/AllComponents/mainElements.js";
import { ModeSwitch } from "./components/ModeSwitch/ModeSwitch.js";
import { SwitchView } from "./helpers/SwitchView.js";
import { ArchivedTasksBoard } from "./components/Board/ArchivedTasksBoard.js";

export class UI{
    constructor(){
        this.board=new Board(board);
        this.archiveBoard=new ArchivedTasksBoard(archiveBoard);
        this.modeSwitch=new ModeSwitch(modeSwitchElements,(isDark)=>SwitchView.bgColorSwitch(isDark));        
        this.init();
    }

    init(){
        this.bindEvents();
        SwitchView.showTodoLists();
    }

    bindEvents(){
        archiveElements.archiveButton.addEventListener("click",()=>SwitchView.showArchived());
        todoElements.todoButton.addEventListener("click",()=>SwitchView.showTodoLists());
    }

    async loadTasks(){
        await this.board.showAddedTasks();
    }

    async loadArchivedTasks(){
        await this.archiveBoard.showAddedTasks();
    }
}