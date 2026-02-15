import {archiveElements,todoElements } from "../components/AllComponents/mainElements.js";
import { LocalStorage } from "./LocalStorage.js";

export class SwitchView{
    
    static showArchived(){
        todoElements.todoLists.forEach(list => {
            list.style.display = 'none';
        });

        if (archiveElements.archivedContainer)
            archiveElements.archivedContainer.style.display = 'flex';        
        
        if (LocalStorage.isDarkMode())
            SwitchView.bgColorSwitch();
        
        else SwitchView.bgColorSwitch(false);
    }    
    
    static showTodoLists(){

        if(archiveElements.archivedContainer)
            archiveElements.archivedContainer.style.display = 'none';

        todoElements.todoLists.forEach(list => {
            list.style.display = 'flex';
        });

        if (LocalStorage.isDarkMode())
            SwitchView.bgColorSwitch();
        
        else SwitchView.bgColorSwitch(false);        
    }    

    static bgColorSwitch(toDark=true){
        
        const { listsContainer, todoButton } = todoElements;
        const { archiveButton } = archiveElements;

        if(toDark){
            listsContainer.style.backgroundColor = '#27327C';
            todoButton.style.backgroundColor = '#27327C';
            archiveButton.style.backgroundColor = '#5A7FC4';
        }

        else{
            listsContainer.style.backgroundColor = '#C3C3E6'; 
            todoButton.style.backgroundColor = '#C3C3E6';
            archiveButton.style.backgroundColor = '#9A9ACF';
        }
    }    
}