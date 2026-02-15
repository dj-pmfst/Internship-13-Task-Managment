import { confirmPopupElements } from "../AllComponents/mainElements.js";

export class ConfirmPopup{

    static popup = confirmPopupElements.confirmPopup;
    static textEl = confirmPopupElements.confirmText;
    static yesBtn = confirmPopupElements.confirmYes;
    static noBtn = confirmPopupElements.confirmNo;

    static isOpen=false;
    static resolver=null;

    static{

        ConfirmPopup.yesBtn.addEventListener("click",()=>ConfirmPopup.resolve(true));
        ConfirmPopup.noBtn.addEventListener("click",()=>ConfirmPopup.resolve(false));
    }

    static show(text){
        if(this.isOpen)
            return Promise.resolve(false);

        ConfirmPopup.isOpen=true;

        ConfirmPopup.textEl.textContent=text;
        ConfirmPopup.popup.classList.add("active");

        return new Promise(resolve=>{
            ConfirmPopup.resolver=resolve;
        });
    }

    static resolve(result){

        if(!ConfirmPopup.resolver) return;

        ConfirmPopup.resolver(result);
        ConfirmPopup.resolver=null;

        ConfirmPopup.popup.classList.remove("active");
        ConfirmPopup.isOpen=false;
    }
}