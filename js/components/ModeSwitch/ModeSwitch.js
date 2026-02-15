import { LocalStorage } from "../../helpers/LocalStorage.js";

export class ModeSwitch{
    constructor(modeSwitchElements,onToggleCallback){
        this.lightModeBtn=modeSwitchElements.lightModeBtn;
        this.darkModeBtn=modeSwitchElements.darkModeBtn;
        this.darkModeStylesheet=modeSwitchElements.darkModeStylesheet;
        this.onToggleCallback=onToggleCallback;
        this.init();
    }

    init(){
        this.bindEvents();
    }

    bindEvents(){
        this.lightModeBtn.addEventListener('click', ()=>this.toggleDarkMode());
        this.darkModeBtn.addEventListener('click', ()=>this.toggleDarkMode());
    }

    toggleDarkMode() {
        if(this.darkModeStylesheet.disabled)
            this.switchToDark();

        else this.switchToLight();

        if(this.onToggleCallback)
            this.onToggleCallback(this.isDarkMode());
    }

    elementStyleSwitch(toDark=true){
        if(toDark){
            this.darkModeStylesheet.disabled = false;
            this.lightModeBtn.style.display = 'none';
            this.darkModeBtn.style.display = 'inline-block';
        }

        else{
            this.darkModeStylesheet.disabled = true;
            this.lightModeBtn.style.display = 'inline-block';
            this.darkModeBtn.style.display = 'none';
        }
    }

    switchToDark(){
        LocalStorage.enableDarkMode();
        this.elementStyleSwitch();
    }

    switchToLight(){
        LocalStorage.disableDarkMode();
        this.elementStyleSwitch(false);
    }

    isDarkMode() {
        return !this.darkModeStylesheet.disabled;
    }    

}