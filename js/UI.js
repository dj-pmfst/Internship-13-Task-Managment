import { Board } from "./components/Board/Board.js";
import { board,archiveBoard,modeSwitchElements,archiveElements,todoElements } from "./components/AllComponents/mainElements.js";
import { ModeSwitch } from "./components/ModeSwitch/ModeSwitch.js";
import { SwitchView } from "./helpers/SwitchView.js";
import { ArchivedTasksBoard } from "./components/Board/ArchivedTasksBoard.js";

export class UI{
    constructor(){
        this.board=new Board(board);
        this.archiveBoard=new ArchivedTasksBoard(archiveBoard,this.board);
        this.modeSwitch=new ModeSwitch(modeSwitchElements,(isDark)=>SwitchView.bgColorSwitch(isDark)); 
        this.needsRefresh = {
            todo: false,    
            archive: true
        };       
        this.init();
    }

    init(){
        this.bindEvents();
        SwitchView.showTodoLists();
    }

    bindEvents(){
        archiveElements.archiveButton.addEventListener("click", async () => {
            if(this.needsRefresh.archive){
                console.log("Arhiv");
                SwitchView.showArchived(); 
                await this.loadArchivedTasks(); 
                
                this.needsRefresh.todo = true;
                this.needsRefresh.archive = false;                   
            }
        });
        todoElements.todoButton.addEventListener("click",async ()=>{
            if(this.needsRefresh.todo){
                this.board.clearBoard();
                await this.loadTasks();
                SwitchView.showTodoLists();

                this.needsRefresh.todo=false;
                this.needsRefresh.archive=true;                
            }

        });
    }

    async loadTasks(){
        await this.board.showAddedTasks();
    }

    async loadArchivedTasks(){
        await this.archiveBoard.showAddedTasks();     
    }
}