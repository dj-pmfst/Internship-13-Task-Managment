import { UserCancelledError } from "../../error/error.js";
import { popAdd } from "../AllComponents/mainElements.js";
import { inputs } from "../AllComponents/mainElements.js";
import { InputHelper } from "../../helpers/InputHelper.js";

export class Popup{

    static open(existingTask=null){
        return new Promise((resolve,reject)=>{
            popAdd.classList.add("active");

            const saveBtn=popAdd.querySelector(".save");
            const cancelBtn=popAdd.querySelector(".cancel");
            const editBtn=popAdd.querySelector(".edit");

            let onEdit;

            if(existingTask){
                editBtn.classList.remove("hidden");

                Object.entries(inputs).forEach(([key,input])=>{
                    input.value=existingTask[key];
                });
                
                InputHelper.setInputsDisabled(true);

                onEdit=()=>{
                    InputHelper.setInputsDisabled(false);
                    editBtn.disabled=true;
                }

                editBtn.addEventListener("click",onEdit);
            }

            else{
                editBtn.classList.add("hidden");
                setInputsDisabled(false);
            }

            const cleanup=()=>{
                saveBtn.removeEventListener("click",onSave);
                cancelBtn.removeEventListener("click",onCancel);
                editBtn.removeEventListener("click",onEdit);
            }

            const close=()=>{
                popAdd.classList.remove("active");   
                cleanup();
            }

            const onSave=()=>{
                const taskData=Object.fromEntries(Object.entries(inputs).map(([key,input])=>[key,input.value]));
                close();
                resolve(taskData);
            }            

            const onCancel=()=>{
                close();
                reject(new UserCancelledError());
            }

            saveBtn.addEventListener("click",onSave);
            cancelBtn.addEventListener("click",onCancel);
        });
    }

}