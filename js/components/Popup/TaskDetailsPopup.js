import { taskDetailsPopupElements } from "../AllComponents/mainElements.js";

export class TaskDetailsPopup{
    static elements = { ...taskDetailsPopupElements };
   
    static{
        TaskDetailsPopup.elements.closeBtn.addEventListener("click",()=>TaskDetailsPopup.closePopup());

        TaskDetailsPopup.elements.popup.addEventListener('click',e=>{
            if (e.target===TaskDetailsPopup.popup) 
                TaskDetailsPopup.close();
        });
    }

    static show(task){

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
    }

    static closePopup(){
        TaskDetailsPopup.elements.popup.classList.remove("active");
    }
}