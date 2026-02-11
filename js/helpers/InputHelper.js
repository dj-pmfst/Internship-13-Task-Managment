import { inputs } from "../components/AllComponents/mainElements.js";

export class InputHelper{
    
    static setInputsDisabled=(disable)=>Object.values(inputs).forEach(input=>input.disabled=disable);

    static getNewTaskData=()=>{
        return Object.fromEntries(Object.entries(inputs).map(([key,input])=>[key,input.value]));
    }

    static fillData=(existingTask)=>{
         Object.entries(inputs).forEach(([key,input])=>{
            input.value=existingTask[key];
        });    
    } 
    

}

