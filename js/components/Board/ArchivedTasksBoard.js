import { Storage } from "../../api.js";
import { ArchivedTask } from "./Task/ArchivedTask.js";
import { Toast } from "../Toast/Toast.js";
import { ToastTypes } from "../../enums/ToastTypes.js";
import { DateTimeHelper } from "../../helpers/DateTimeHelper.js";
import { ConfirmPopup } from "../Popup/ConfirmPopup.js";
import { titleToStatusMap } from "../../helpers/Map.js";
import { TaskDetailsPopup } from "../Popup/TaskDetailsPopup.js";

export class ArchivedTasksBoard{

    constructor(boardEl, mainBoard){
        this.boardEl = boardEl;
        this.mainBoard = mainBoard;
        this.init();
    }

    init(){
        this.taskContainer = this.boardEl.querySelector(".tasks");
        this.initFilterControls();
        this.bindEvents();
    }

    initFilterControls() {
        const dateInputs = this.boardEl.querySelectorAll('.date-input');
        this.filterStartInput = dateInputs[0];
        this.filterEndInput = dateInputs[1];
        
        const filterButtons = this.boardEl.querySelectorAll('.filters button');
        this.applyFilterBtn = filterButtons[0];
        this.clearFilterBtn = filterButtons[1];
        
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

    async showAddedTasks(){
        await this.loadArchivedTasks();
    }

    async loadArchivedTasks(startDate = null, endDate = null) {
        this.taskContainer.innerHTML = "";
        this.taskList = [];

        try {
            if (startDate && endDate) {
                const validation = DateTimeHelper.isDateRangeValid({ 
                    startDate, 
                    endDate 
                });
                
                if (validation.error) {
                    Toast.show(validation.error, ToastTypes.DANGER);
                    return;
                }
            }

            const archivedTasks = await Storage.getArchivedTasks(startDate, endDate);

            if (archivedTasks.length === 0) {
                this.taskContainer.innerHTML = '<p style="padding: 20px; text-align: center;">No archived tasks found</p>';
                return;
            }

            archivedTasks.forEach(task => {
                task.startDate = DateTimeHelper.toDateTimeLocal(task.est_start_date, true);
                task.endDate = DateTimeHelper.toDateTimeLocal(task.est_end_date, true);
                this.addTask(task);
            });

        } catch (error) {
            Toast.show(error.message, ToastTypes.DANGER);
        }
    }

    applyArchivedFilter() {
        const startDate = this.filterStartInput.value;
        const endDate = this.filterEndInput.value;

        if (!startDate && !endDate) {
            Toast.show("Please select at least one date", ToastTypes.INFO);
            return;
        }

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

    addTask(task){
        const newTask = new ArchivedTask(task);
        this.taskList.push(newTask);
        this.taskContainer.append(newTask.element);
    }

    bindEvents(){
        this.addOnTaskRequestListeners();
    }

    addOnTaskRequestListeners(){

        this._onTaskUnarchiveRequest = async (e) => {
            const targetTask = e.detail.task;
            await this.handleUnarchiveTask(targetTask);
        }

        this._onTaskDeleteRequest = async (e) => {
            const targetTask = e.detail.task;
            await this.handleDeleteTask(targetTask);
        }

        this.boardEl.addEventListener("requestTaskUnarchive", this._onTaskUnarchiveRequest);
        this.boardEl.addEventListener("requestTaskDelete", this._onTaskDeleteRequest);
    }

    async handleUnarchiveTask(task){
        const text = `Unarchive task "${task.title}"?`;
        const isConfirmed = await ConfirmPopup.show(text);      
        
        if(isConfirmed){
            try{
                const column = this.mainBoard.columns.find(col => titleToStatusMap[col.title] === task.status);

                if(column){
                    const newPosition = column.taskList.length + 1;                    
                    await Storage.updateTask(task.id, { archived: false, position: newPosition});

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
    
    async showTaskDetails(task){
        return await TaskDetailsPopup.show(task,true);
    }
}