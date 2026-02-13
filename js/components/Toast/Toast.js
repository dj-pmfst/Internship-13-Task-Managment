import { alertDiv } from "../AllComponents/mainElements.js";

export class Toast{

    static show(message,type,timeout=2000){
        alertDiv.textContent=message;
        alertDiv.classList.add(`alert-${type}`);

        setTimeout(()=>{
            alertDiv.classList.remove(`alert-${type}`);
        });
    }
}