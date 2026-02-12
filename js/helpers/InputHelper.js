import { inputs } from "../components/AllComponents/mainElements.js";

export class InputHelper{
    
    static inputList=Object.values(inputs);

    static setInputsDisabled=(disable)=>InputHelper.inputList.forEach(input=>input.disabled=disable);

    static getNewTaskData=()=>{
        return Object.fromEntries(InputHelper.inputList.map(input=>[input.id,input.value]));
    }

    static fillData=(existingTask)=>{
         InputHelper.inputList.forEach(input=>{
            input.value=existingTask[input.id];
        });    
    } 
    
    static hasChanges=(existingTask)=>{
        return InputHelper.inputList.some(input=>input.value!==existingTask[input.id]);
    };

    static addInputEventListeners=(existingTask,saveBtn)=>{

        InputHelper.inputList.forEach(input=>
            input.oninput=()=>{
                saveBtn.disabled=!InputHelper.hasChanges(existingTask);
            });
    }

}    

