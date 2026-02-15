import { Storage } from "../../api.js";
import { ArchivedTask } from "./Task/ArchivedTask.js";
import { Toast } from "../Toast/Toast.js";
import { ToastTypes } from "../../enums/ToastTypes.js";
import { DateTimeHelper } from "../../helpers/DateTimeHelper.js";
import { ConfirmPopup } from "../Popup/ConfirmPopup.js";
import { titleToStatusMap } from "../../helpers/Map.js";

export class ArchivedTasksBoard{

    constructor(boardEl,mainBoard){
        this.boardEl=boardEl;
        this.mainBoard=mainBoard;
        this.init();
    }

    init(){
        this.taskContainer=this.boardEl.querySelector(".tasks");
        this.bindEvents();
    }

    async showAddedTasks(){
        this.boardEl.querySelector(".tasks").innerHTML = "";
        this.taskList=[];        

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

    bindEvents(){
        this.addOnTaskRequestListeners();
    }

    addOnTaskRequestListeners(){

        this._onTaskUnarchiveRequest=async (e)=>{
            const targetTask=e.detail.task;
            await this.handleUnarchiveTask(targetTask);
        }

        this._onTaskDeleteRequest=async (e)=>{
            const targetTask=e.detail.task;
            await this.handleDeleteTask(targetTask);
        }

        this.boardEl.addEventListener("requestTaskUnarchive",this._onTaskUnarchiveRequest);
        this.boardEl.addEventListener("requestTaskDelete",this._onTaskDeleteRequest);

    }

    async handleUnarchiveTask(task){

        const text = `Unarchive task "${task.title}"?`;
        const isConfirmed = await ConfirmPopup.show(text);      
        
        if(isConfirmed){
            try{
                const column=this.mainBoard.columns.find(col=>titleToStatusMap[col.title]===task.status);

                if(column){
                    const newPosition =column.taskList.length+1;                    
                    await Storage.updateTask(task.id,{ archived: false, position: newPosition});

                    const taskIndex = this.taskList.findIndex(t => t.id === task.id);
                    this.taskList.splice(taskIndex, 1);
                    task.remove();
                }

                Toast.show("Task unarchived successfully", ToastTypes.SUCCESS);
            }
            catch (error) {
                Toast.show(error.message, ToastTypes.DANGER);
            }                   
        }
    }

    async handleDeleteTask(task){

        const text = `Delete task "${task.title}"? This cannot be undone!`;
        const isConfirmed = await ConfirmPopup.show(text);
        
        if (isConfirmed) {
            try {
                await Storage.deleteTask(task.id);
    
                const taskIndex = this.taskList.findIndex(t => t.id === task.id);
                this.taskList.splice(taskIndex, 1);
                task.remove();
                
                Toast.show("Task deleted successfully", ToastTypes.SUCCESS);
            } catch (error) {
                Toast.show(error.message, ToastTypes.DANGER);
            }       
        }
    }    
}