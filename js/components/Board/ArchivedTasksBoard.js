import { Storage } from "../../api.js";
import { ArchivedTask } from "./Task/ArchivedTask.js";
import { Toast } from "../Toast/Toast.js";
import { ToastTypes } from "../../enums/ToastTypes.js";
import { DateTimeHelper } from "../../helpers/DateTimeHelper.js";

export class ArchivedTasksBoard{

    constructor(boardEl){
        this.boardEl=boardEl;
        this.init();
    }

    init(){
        this.taskContainer=this.boardEl.querySelector(".tasks");
        this.taskList=[];
    }

    async showAddedTasks(){
        console.log("Shoow");
        try{
            const archivedTasks=await Storage.getArchivedTasks();

            archivedTasks.forEach(task=>{
                    task.startDate=DateTimeHelper.toDateTimeLocal(task.startDate,true);
                    task.endDate=DateTimeHelper.toDateTimeLocal(task.endDate,true);

                    this.addTask(task);
            });
        }

        catch(error){
            Toast.show(error.message,ToastTypes.DANGER);
        }        
    }

    addTask(task){
        const newTask=new ArchivedTask(task);
        this.taskList.push(newTask);
        
        this.taskContainer.append(newTask.element);
    }
}