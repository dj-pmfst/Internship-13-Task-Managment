import { TaskDetailAction } from "../../enums/TaskDetailAction.js";
import { taskDetailsPopupElements } from "../AllComponents/mainElements.js";

export class TaskDetailsPopup{

    static elements = { ...taskDetailsPopupElements };
    static isOpen=false;
    static resolver=null;
    static _listenersBound=false
   
    static init(){

        if(TaskDetailsPopup._listenersBound) return;

        TaskDetailsPopup.elements.closeBtn.addEventListener("click",()=>TaskDetailsPopup.resolve(TaskDetailAction.CANCEL));
        TaskDetailsPopup.elements.deleteBtn.addEventListener("click",()=>TaskDetailsPopup.resolve(TaskDetailAction.DELETE));
        TaskDetailsPopup.elements.archiveBtn.addEventListener("click",()=>TaskDetailsPopup.resolve(TaskDetailAction.ARCHIVE));   
        
        TaskDetailsPopup._listenersBound=true;
    }

    static show(task,isArchived=false){
        if (TaskDetailsPopup.isOpen) {
            return Promise.resolve("cancel");
        }

        TaskDetailsPopup.isOpen=true;
        const e=TaskDetailsPopup.elements;

        e.title.textContent = task.title || 'N/A';
        e.description.textContent = task.description || 'N/A';
        e.start.textContent = task.startDate || 'N/A';
        e.end.textContent = task.endDate || 'N/A';
        e.duration.textContent = task.duration ? `${task.duration}h` : 'N/A';
        e.priority.textContent = task.priority || 'N/A';
        e.type.textContent = task.type || 'N/A';
        e.assignee.textContent = task.assignee || 'N/A';
        e.status.textContent = task.status || 'N/A';
        
        if(isArchived){
            e.deleteBtn.style.display="none";
            e.archiveBtn.style.display="none";            
        }
        else{
            e.deleteBtn.style.display="inline-block";
            e.archiveBtn.style.display="inline-block";           
        }

        e.popup.classList.add("active");

        return new Promise(resolve=>{
            TaskDetailsPopup.resolver=resolve;
        })
    }

    static closePopup(){
        TaskDetailsPopup.elements.popup.classList.remove("active");
    }

    static resolve(action){
        TaskDetailsPopup.closePopup();
        TaskDetailsPopup.resolver(action);
        TaskDetailsPopup.clean();
    }

    static clean(){
        TaskDetailsPopup.isOpen=false;
        TaskDetailsPopup.resolver=null;
    }
}

TaskDetailsPopup.init();