import { Board } from "./components/Board/Board.js";
import { board,modeSwitchElements,archiveElements,todoElements } from "./components/AllComponents/mainElements.js";
import { ModeSwitch } from "./components/ModeSwitch/ModeSwitch.js";
import { SwitchView } from "./helpers/SwitchView.js";

export class UI{
    constructor(){
        this.board=new Board(board);
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
}