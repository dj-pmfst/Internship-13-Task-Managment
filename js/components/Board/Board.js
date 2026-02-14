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

        this.boardEl.addEventListener("requestNewTask", this._onTaskRequest);
        this.boardEl.addEventListener("requestTaskActions", this._onTaskActionsRequest);
        this.boardEl.addEventListener("requestTaskDetails", this._onTaskDetailsRequest); 
        this.boardEl.addEventListener("requestColumnMove", this._onMoveColumnRequest);
        this.boardEl.addEventListener("columnDrop", this._onColumnDrop);
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

        this._onTaskDetailsRequest = (e) => {
            const task = e.detail.task;
            this.showTaskDetails(task);
        }
    }

    showTaskDetails(task) {
        const popup = document.querySelector('.pop-details');

        document.getElementById('detail-title').textContent = task.title || 'N/A';
        document.getElementById('detail-description').textContent = task.description || 'N/A';
        document.getElementById('detail-start').textContent = task.startDate || 'N/A';
        document.getElementById('detail-end').textContent = task.endDate || 'N/A';
        document.getElementById('detail-duration').textContent = task.duration ? `${task.duration}h` : 'N/A';
        document.getElementById('detail-priority').textContent = task.priority || 'N/A';
        document.getElementById('detail-type').textContent = task.type || 'N/A';
        document.getElementById('detail-assignee').textContent = task.assignee || 'N/A';
        document.getElementById('detail-status').textContent = task.status || 'N/A';

        popup.classList.add('active');

        const closeBtn = popup.querySelector('.close-details');
        const closeBottomBtn = document.getElementById('close-details-btn');
        
        const closePopup = () => {
            popup.classList.remove('active');
        };
        
        closeBtn.onclick = closePopup;
        closeBottomBtn.onclick = closePopup;

        popup.onclick = (e) => {
            if (e.target === popup) {
                closePopup();
            }
        };
    }
    
    addOnMoveRequestListener(){
        this._onMoveColumnRequest=(e)=>{
            const {column,direction}=e.detail;
            this.moveColumn(column,direction);
        }       
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
    }
}