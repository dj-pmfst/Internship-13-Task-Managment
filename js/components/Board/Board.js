import { Popup } from "../Popup/Popup.js";
import { Toast } from "../Toast/Toast.js";
import { BoardColumn } from "./BoardColumn/BoardColumn.js";
import { Task } from "./Task/Task.js";
import { Storage } from "../../api.js";
import { UserCancelledError } from "../../error/error.js";
import { ToastTypes } from "../../enums/ToastTypes.js";
import { titleToStatusMap } from "../../helpers/Map.js";
import { DateTimeHelper } from "../../helpers/DateTimeHelper.js";

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
            const taskList=await Storage.getTasks();

            taskList.forEach(task=>{
                task.startDate=DateTimeHelper.toDateTimeLocal(task.startDate,true);
                task.endDate=DateTimeHelper.toDateTimeLocal(task.endDate,true);
            });

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

        this.addOnTaskRequestListeners();
        this.addOnMoveRequestListener();
        this.addOnColumnDropListener();
        this.addOnTaskDropListener();
    }

    moveColumn(column,direction){
        const oldIndex=this.columns.indexOf(column);

        const newIndex=(oldIndex+direction+this.columns.length) % this.columns.length;

        this.columns.splice(oldIndex,1);
        this.columns.splice(newIndex,0,column);

        const referenceNode= this.columns[newIndex+1]?.element || null;

        this.boardEl.insertBefore(column.element,referenceNode);

    }

    addOnTaskRequestListeners(){

        this._onTaskRequest=async (e)=>{
            const columnTitle=e.detail.columnTitle;

            const targetColumn=this.columns.find(col=>col.title===columnTitle);

            try{
                const newTaskData=await Popup.open();
                newTaskData.status=titleToStatusMap[columnTitle];
                newTaskData.position=targetColumn.taskList.length+1;

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

        this._onTaskActionsRequest= async (e)=>{
            const task=e.detail.task;

            try{
                const updatedData=await Popup.open(task);
                
                const updatedTask=await Storage.updateTask(task.id,updatedData);

                task.updateTask(updatedTask);

                Toast.show("Task successfuly updated",ToastTypes.SUCCESS);               
            }

            catch(error){
                if(error instanceof UserCancelledError)
                    Toast.show(error.message,ToastTypes.INFO);
                else
                    Toast.show(error.message,ToastTypes.DANGER);
            }            
        }

        this.boardEl.addEventListener("requestNewTask",this._onTaskRequest);
        this.boardEl.addEventListener("requestTaskActions",this._onTaskActionsRequest);        
    }
    
    addOnMoveRequestListener(){
        this._onMoveColumnRequest=(e)=>{
            const {column,direction}=e.detail;
            this.moveColumn(column,direction);
        }    
        
        this.boardEl.addEventListener("requestColumnMove",this._onMoveColumnRequest);        
    }

    addOnColumnDropListener(){

        this._onColumnDrop=(e)=>{
            const {draggedColumnTitle,targetColumn}=e.detail;

            const draggedColumn=this.columns.find(c=>c.title===draggedColumnTitle);

            const draggedEl=draggedColumn.element;
            const targetEl=targetColumn.element;

            targetEl.classList.remove("drag-over");         

            if (!draggedColumn || draggedColumn === targetColumn) return;

            const oldIndex=this.columns.indexOf(draggedColumn);
            const newIndex=this.columns.indexOf(targetColumn);

            [this.columns[oldIndex], this.columns[newIndex]] =
                [this.columns[newIndex], this.columns[oldIndex]];            

            const draggedNext=draggedEl.nextSibling;
            const targetNext=targetEl.nextSibling;

            this.boardEl.insertBefore(draggedEl,targetNext);
            this.boardEl.insertBefore(targetEl,draggedNext);
        }

        this.boardEl.addEventListener("columnDrop",this._onColumnDrop);        
    }

    addOnTaskDropListener(){
        this._onTaskDrop=async (e)=>{
            const {draggedTaskId,targetColumn,sourceColumnTitle,afterElement }=e.detail;

            const sourceColumn=this.columns.find(c=>c.title===sourceColumnTitle);
            const draggedTaskIndex=sourceColumn.taskList.findIndex(t=>t.id===draggedTaskId);

            const draggedTask=sourceColumn.taskList.splice(draggedTaskIndex,1)[0];

            const targetEl=targetColumn.element;
            targetEl.classList.remove("drag-over"); 
                        
            try{
                const statusPayload= {status:titleToStatusMap[targetColumn.title]};
                const updatedTaskData=await Storage.updateTask(draggedTaskId,statusPayload);

                draggedTask.updateTask(updatedTaskData);
                const insertIndex= afterElement 
                    ? targetColumn.taskList.findIndex(t=>t.element===afterElement) 
                    : targetColumn.taskList.length;

                targetColumn.taskList.splice(insertIndex,0,draggedTask);

                await this.updateTaskPositions(sourceColumn.taskList);
                await this.updateTaskPositions(targetColumn.taskList);

                if(sourceColumn.element!=targetColumn.element){
                    sourceColumn.updateCount(false);
                    targetColumn.updateCount(true);
                }

                Toast.show("Task successfuly updated",ToastTypes.SUCCESS);                 
            }
            catch(error){
                Toast.show(error.message,ToastTypes.DANGER);
            }    

        }

       this.boardEl.addEventListener("taskDrop",this._onTaskDrop);        
    }

    async updateTaskPositions(taskList){

        for(const [index,task] of taskList.entries()){
            task.position=index+1;
            await Storage.updateTask(task.id,{position: task.position});
        }

          
    };
}