import { popAdd } from "../AllComponents/mainElements.js";

export class Popup{

    static open(){
        return new Promise((resolve,reject)=>{
            popAdd.classList.remove(".idden");

            const saveBtn=popAdd.querySelector(".save");
            const cancelBtn=popAdd.querySelector(".cancel");

            const onSave=()=>{
                const newTaskData={
                    title: popAdd.querySelector("#title").value,
                    description: popAdd.querySelector("#description").value,
                    startDate: popAdd.querySelector("#start").value,
                    endDate: popAdd.querySelector("#end").value,
                    duration: popAdd.querySelector("#duration").value,
                    priority: popAdd.querySelector("#priority").value,
                    type: popAdd.querySelector("#type").value,
                    asignee: popAdd.querySelector("#person").value
                }   
                
            popAdd.classList.add("hidden");
            }
        });
    }
}