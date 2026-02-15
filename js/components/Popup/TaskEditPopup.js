import { UserCancelledError } from "../../error/error.js";
import { taskEditPopupElements } from "../AllComponents/mainElements.js";
import { InputHelper } from "../../helpers/InputHelper.js";
import { validateFrontendTaskData } from "../../validation/ValidateData.js";
import { Toast } from "../Toast/Toast.js";
import { ToastTypes } from "../../enums/ToastTypes.js";


export class TaskEditPopup{

    static popAdd=taskEditPopupElements.popAdd;
    static saveBtn=taskEditPopupElements.saveBtn;
    static cancelBtn=taskEditPopupElements.cancelBtn;
    static editBtn= taskEditPopupElements.editBtn;

    static resolver=null;
    static rejecter=null;
    static isOpen=false;
    static currentTask=null;

    static{
        TaskEditPopup.saveBtn.addEventListener("click",()=>TaskEditPopup.handleSave());
        TaskEditPopup.cancelBtn.addEventListener("click",()=>TaskEditPopup.handleCancel());
        TaskEditPopup.editBtn.addEventListener("click",()=>TaskEditPopup.handleEdit());        
    }

    static open(existingTask=null){
        if (TaskEditPopup.isOpen) {
            return Promise.reject(new UserCancelledError("Popup already open"));
        }
        TaskEditPopup.popAdd.classList.add("active");

        TaskEditPopup.isOpen=true;
        TaskEditPopup.currentTask=existingTask;


        if(existingTask){
            TaskEditPopup.editBtn.classList.remove("hidden");
            TaskEditPopup.saveBtn.disabled=true;
            TaskEditPopup.editBtn.disabled=false;

            InputHelper.fillData(existingTask);
            InputHelper.setInputsDisabled(true);
        }

        else{
            TaskEditPopup.editBtn.classList.add("hidden");
            TaskEditPopup.saveBtn.disabled=false;
            InputHelper.setInputsDisabled(false);
        }

        return new Promise((resolve,reject)=>{
            TaskEditPopup.resolver=resolve;
            TaskEditPopup.rejecter=reject;
        });

    }

    static handleEdit(){
        InputHelper.setInputsDisabled(false);
        InputHelper.addInputEventListeners(TaskEditPopup.currentTask,TaskEditPopup.saveBtn);
        TaskEditPopup.editBtn.disabled=true;
    }

    static handleSave(){
        const taskData= !TaskEditPopup.currentTask ? InputHelper.getNewTaskData() : InputHelper.getUpdatedTaskData(TaskEditPopup.currentTask);

        if(!taskData) return;
                
        const validationResult=validateFrontendTaskData(taskData);

        if(validationResult.error!==null) {
            Toast.show(validationResult.error,ToastTypes.INFO);
            return;
        }

        TaskEditPopup.close();
        InputHelper.clearInputs();

        TaskEditPopup.popupResolve(taskData);
    }

    static handleCancel(){
        const userCancelledError= !TaskEditPopup.currentTask ? new UserCancelledError(): new UserCancelledError("Task edit canceled");

        TaskEditPopup.close();
        TaskEditPopup.popupReject(userCancelledError);
    }

    static close(){
        TaskEditPopup.popAdd.classList.remove("active");   

        if(TaskEditPopup.currentTask)
            InputHelper.clearInputs();
    
        TaskEditPopup.isOpen=false;
        TaskEditPopup.currentTask=null;
    }

    static popupResolve(data){
        TaskEditPopup.resolver(data);
        TaskEditPopup.clean();
    }

    static popupReject(error){
        TaskEditPopup.rejecter(error);
        TaskEditPopup.clean();
    }

    static clean(){
        TaskEditPopup.resolver=null;
        TaskEditPopup.rejecter=null;
    }


}