import { TaskEditPopup } from "../Popup/TaskEditPopup.js";
import { Toast } from "../Toast/Toast.js";
import { BoardColumn } from "./BoardColumn/BoardColumn.js";
import { Task } from "./Task/Task.js";
import { Storage } from "../../api.js";
import { UserCancelledError } from "../../error/error.js";
import { ToastTypes } from "../../enums/ToastTypes.js";
import { titleToStatusMap } from "../../helpers/Map.js";
import { DateTimeHelper } from "../../helpers/DateTimeHelper.js";
import { ConfirmPopup } from "../Popup/ConfirmPopup.js";
import { TaskDetailsPopup } from "../Popup/TaskDetailsPopup.js";
import { TaskDetailAction } from "../../enums/TaskDetailAction.js";
import { ArchivedTask } from "./Task/ArchivedTask.js";

export class Board{
    constructor(boardEl){
        this.boardEl=boardEl;        
        this.init();
    }

    init(){
        this.initColumns();
        this.bindEvents();
        this.initArchivedView();
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

                const targetColumn= this.columns.find(col=>titleToStatusMap[col.title]===task.status);
                targetColumn?.addTask(new Task(task));                
            });

        }
        catch(error){
            Toast.show(error.message,ToastTypes.DANGER);
        }
    }   

    clearBoard(){
        this.columns.forEach(c=>{
            c.clear();
        });
    }

    bindEvents(){
        this.addOnTaskRequestListeners();
        this.addOnMoveRequestListener();
        this.addOnColumnDropListener();
        this.addOnTaskDropListener();
        this.addOnArchiveAllListener(); 
        this.addOnDeleteAllListener();

        this.boardEl.addEventListener("requestNewTask", this._onTaskRequest);
        this.boardEl.addEventListener("requestTaskActions", this._onTaskActionsRequest);
        this.boardEl.addEventListener("requestTaskDetails", this._onTaskDetailsRequest); 
        this.boardEl.addEventListener("requestColumnMove", this._onMoveColumnRequest);
        this.boardEl.addEventListener("columnDrop", this._onColumnDrop);
        this.boardEl.addEventListener("requestArchiveAll", this._onArchiveAll); 
        this.boardEl.addEventListener("requestDeleteAll", this._onDeleteAll);
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
                const newTaskData=await TaskEditPopup.open();
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
                const updatedData=await TaskEditPopup.open(task);
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

        this._onTaskDetailsRequest = async (e) => {
            const task = e.detail.task;

            try{
                const action=await this.showTaskDetails(task);

                if (action === TaskDetailAction.DELETE) {
                    await this.handleDeleteTask(task);
                } else if (action === TaskDetailAction.ARCHIVE) {
                    await this.handleArchiveTask(task);
                }
            }

            catch(error){
                    Toast.show(error.message,ToastTypes.DANGER);
            }
        }
    }

    addOnArchiveAllListener(){
        this._onArchiveAll = async (e) => {
            const column = e.detail.column;
            
            if(column.taskList.length === 0){
                Toast.show("No tasks to archive", ToastTypes.INFO);
                return;
            }

            const text=`Archive all ${column.taskList.length} tasks from "${column.title}"?`;
            const isConfirmed=await ConfirmPopup.show(text);
            
            if(isConfirmed){
                try{
                    for (const task of column.taskList) {
                        await Storage.archiveTask(task.id, { archived: true });
                        task.remove();                     
                    }

                    column.reset();
                    Toast.show("All tasks archived successfully", ToastTypes.SUCCESS);                                       
                }
                catch (error) {
                    ConfirmPopup.popup.classList.remove('active');
                    Toast.show(error.message, ToastTypes.DANGER);
                }   
            }              
        } 
    }
    
    addOnDeleteAllListener(){
        this._onDeleteAll = async (e) => {
            const column = e.detail.column;
            
            if(column.taskList.length === 0){
                Toast.show("No tasks to delete", ToastTypes.INFO);
                return;
            }

            const text=`DELETE all ${column.taskList.length} tasks from "${column.title}"? This cannot be undone!`;
            const isConfirmed=await ConfirmPopup.show(text);
            
            if(isConfirmed){
                try {
                    for (const task of column.taskList) {
                        await Storage.deleteTask(task.id);
                        task.remove();
                    }
                    
                    column.reset();
                    Toast.show("All tasks deleted successfully", ToastTypes.SUCCESS);

                } catch (error) {
                    ConfirmPopup.popup.classList.remove('active');
                    Toast.show(error.message, ToastTypes.DANGER);
                }
            }
        }
    }

    async showTaskDetails(task) {
        return await TaskDetailsPopup.show(task);
    }

    async handleDeleteTask(task) {
        const text = `Delete task "${task.title}"? This cannot be undone!`;
        const isConfirmed = await ConfirmPopup.show(text);
        
        if (isConfirmed) {
            try {
                await Storage.deleteTask(task.id);
    
                const column = this.columns.find(col => 
                    col.taskList.some(t => t.id === task.id)
                );
                
                if (column) {
                    const taskIndex = column.taskList.findIndex(t => t.id === task.id);
                    const deletedTask = column.taskList.splice(taskIndex, 1)[0];
                    deletedTask.remove(); 
                    column.updateCount(false);
                }
                
                Toast.show("Task deleted successfully", ToastTypes.SUCCESS);
            } catch (error) {
                Toast.show(error.message, ToastTypes.DANGER);
            }
        }
    }
    
    async handleArchiveTask(task) {
        const text = `Archive task "${task.title}"?`;
        const isConfirmed = await ConfirmPopup.show(text);
        
        if (isConfirmed) {
            try {
                await Storage.archiveTask(task.id,{ archived: true }); 
    
                const column = this.columns.find(col => 
                    col.taskList.some(t => t.id === task.id)
                );
                
                if (column) {
                    const taskIndex = column.taskList.findIndex(t => t.id === task.id);
                    const archivedTask = column.taskList.splice(taskIndex, 1)[0];
                    archivedTask.remove(); 
                    column.updateCount(false);
                }
                
                Toast.show("Task archived successfully", ToastTypes.SUCCESS);
            } catch (error) {
                Toast.show(error.message, ToastTypes.DANGER);
            }
        }
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
            draggedEl.classList.remove("draggable");   

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

                const addDiv = targetColumn.element.querySelector('.add');
                if (afterElement) {
                    targetColumn.element.insertBefore(draggedTask.element, afterElement);
                } else if (addDiv) {
                    targetColumn.element.insertBefore(draggedTask.element, addDiv);
                } else {
                    targetColumn.element.appendChild(draggedTask.element);
                }

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
            console.log("new position: ",task.position);
            await Storage.updateTask(task.id,{position: task.position});
        }

    };

    initArchivedView() {
        this.archivedContainer = document.querySelector('.archived');
        this.archivedTasksContainer = this.archivedContainer?.querySelector('.tasks');
        
        if (!this.archivedContainer) return; 

        const dateInputs = this.archivedContainer.querySelectorAll('.date-input');
        this.filterStartInput = dateInputs[0];
        this.filterEndInput = dateInputs[1];
        
        const filterButtons = this.archivedContainer.querySelectorAll('.filters button');
        this.applyFilterBtn = filterButtons[0];
        this.clearFilterBtn = filterButtons[1];
        
        this.allArchivedTasks = [];

        if (this.applyFilterBtn) {
            this.applyFilterBtn.addEventListener('click', () => {
                this.applyArchivedFilter();
            });
        }
        
        if (this.clearFilterBtn) {
            this.clearFilterBtn.addEventListener('click', () => {
                this.clearArchivedFilter();
            });
        }
    }

    async loadArchivedTasks(startDate = null, endDate = null) {
        try {
            const archivedTasks = await Storage.getArchivedTasks(startDate, endDate);
            this.allArchivedTasks = archivedTasks;
            this.renderArchivedTasks(this.allArchivedTasks);
        } catch (error) {
            Toast.show(error.message, ToastTypes.DANGER);
        }
    }
    
    applyArchivedFilter() {
        const startDate = this.filterStartInput.value;
        const endDate = this.filterEndInput.value;

        let startISO = null;
        let endISO = null;
        
        if (startDate) {
            startISO = new Date(startDate).toISOString();
        }
        
        if (endDate) {
            endISO = new Date(endDate).toISOString();
        }
    
        console.log('Filtering with:', { startISO, endISO });
        
        this.loadArchivedTasks(startISO, endISO);
    }
    
    async clearArchivedFilter() {
        this.filterStartInput.value = '';
        this.filterEndInput.value = '';
        await this.loadArchivedTasks();
        Toast.show("Filter cleared", ToastTypes.INFO);
    }

    renderArchivedTasks(tasks) {
        if (!this.archivedTasksContainer) return;
        
        this.archivedTasksContainer.innerHTML = '';
    
        if (tasks.length === 0) {
            this.archivedTasksContainer.innerHTML = '<p style="padding: 20px; text-align: center;">No archived tasks found</p>';
            return;
        }
    
        tasks.forEach(taskData => {
            const task = new ArchivedTask(taskData);
            this.archivedTasksContainer.appendChild(task.element);
        });
    }
}