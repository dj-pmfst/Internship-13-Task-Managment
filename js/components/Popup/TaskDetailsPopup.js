import { TaskDetailAction } from "../../enums/TaskDetailAction.js";
import { taskDetailsPopupElements } from "../AllComponents/mainElements.js";

export class TaskDetailsPopup{

    static elements = { ...taskDetailsPopupElements };
    static isOpen=false;
    static resolver=null;
   
    static{
        TaskDetailsPopup.elements.closeBtn.addEventListener("click",()=>TaskDetailsPopup.resolve(TaskDetailAction.CANCEL));
        TaskDetailsPopup.elements.deleteBtn.addEventListener("click",()=>TaskDetailsPopup.resolve(TaskDetailAction.DELETE));
        TaskDetailsPopup.elements.archiveBtn.addEventListener("click",()=>TaskDetailsPopup.resolve(TaskDetailAction.ARCHIVE));        
    }

    static show(task){
        if (TaskEditPopup.isOpen) {
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