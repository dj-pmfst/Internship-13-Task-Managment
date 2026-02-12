import { Popup } from "../Popup/Popup.js";
import { Toast } from "../Toast/Toast.js";
import { BoardColumn } from "./BoardColumn/BoardColumn.js";
import { Task } from "./Task/Task.js";
import { Storage } from "../../api.js";
import { UserCancelledError } from "../../error/error.js";
import { ToastTypes } from "../../enums/ToastTypes.js";
import { titleToStatusMap } from "../../helpers/Map.js";

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

    async showAddedTasks(){
        try{
            const taskList=await Storage.getTask();

            taskList.forEach(task=>{
                const targetColumn= this.columns.find(col=>titleToStatusMap[col.title]===task.status);

                targetColumn?.addTask(new Task(task));
            });

        }
        catch(error){
            Toast.show(error.message,ToastTypes.DANGER);
        }
    }   

    bindEvents(){

        this._onTaskRequest=async (e)=>{
            const columnTitle=e.detail.columnTitle;

            const targetColumn=this.columns.find(col=>col.title===columnTitle);

            try{
                const newTaskData=await Popup.open();
                newTaskData.status=titleToStatusMap[columnTitle];

                const savedTask=await Storage.createTask(newTaskData);

                const task=new Task(savedTask);
                targetColumn.addTask(task);

                Toast.show("New task successfuly added",ToastTypes.SUCCESS);
            }

            catch(error){
                if(error instanceof UserCancelledError)
                    Toast.show(error.message,ToastTypes.INFO);
                else
                    Toast.show(error.message,ToastTypes.DANGER);
            }
        };

        this.boardEl.addEventListener("requestNewTask",this._onTaskRequest);
    }
}