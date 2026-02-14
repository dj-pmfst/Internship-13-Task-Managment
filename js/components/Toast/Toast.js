import { alertDiv } from "../AllComponents/mainElements.js";

export class Toast{
    static show(message, type, timeout = 2000){
        alertDiv.textContent = message;

        alertDiv.classList.add(`alert-${type}`);
        alertDiv.classList.add('show');

        setTimeout(() => {
            alertDiv.classList.remove(`alert-${type}`);
            alertDiv.classList.remove('show'); 
            alertDiv.textContent = ''; 
        }, timeout);
    }
}