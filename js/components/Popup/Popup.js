import { UserCancelledError } from "../../error/error.js";
import { popAdd } from "../AllComponents/mainElements.js";
import { InputHelper } from "../../helpers/InputHelper.js";

export class Popup{
    static open(existingTask=null){
        return new Promise((resolve,reject)=>{
            popAdd.classList.add("active");

            const saveBtn=popAdd.querySelector("#save");
            const cancelBtn=popAdd.querySelector("#cancel");
            const editBtn=popAdd.querySelector("#edit");

            let onEdit;

            if(existingTask){
                editBtn.classList.remove("hidden");
                saveBtn.disabled=true;
                editBtn.disabled=false;

                InputHelper.fillData(existingTask);
                InputHelper.setInputsDisabled(true);

                onEdit=()=>{
                    InputHelper.setInputsDisabled(false);
                    InputHelper.addInputEventListeners(existingTask,saveBtn);
                    editBtn.disabled=true;
                }

                editBtn.addEventListener("click",onEdit);
            }

            else{
                editBtn.classList.add("hidden");
                saveBtn.disabled=false;
                InputHelper.setInputsDisabled(false);
            }

            const cleanup=()=>{
                saveBtn.removeEventListener("click",onSave);
                cancelBtn.removeEventListener("click",onCancel);
                editBtn.removeEventListener("click",onEdit);
            }

            const close=()=>{
                popAdd.classList.remove("active");   

                if(existingTask)
                    InputHelper.clearInputs();
                
                cleanup();
            }

            const onSave=()=>{
                const taskData=InputHelper.getNewTaskData();
                close();
                InputHelper.clearInputs();
                resolve(taskData);
            }            

            const onCancel=()=>{
                close();

                const userCancelledError= !existingTask ? new UserCancelledError(): new UserCancelledError("Task edit canceled");
                reject(userCancelledError);
            }

            saveBtn.addEventListener("click",onSave);
            cancelBtn.addEventListener("click",onCancel);
        });
    }

}