import { inputs } from "../components/AllComponents/mainElements.js";
import { DateTimeHelper } from "./DateTimeHelper.js";
import { inputToKeyMap } from "./Map.js";

export class InputHelper{
    
    static inputList=Object.values(inputs);

    static setInputsDisabled=(disable)=>InputHelper.inputList.forEach(input=>input.disabled=disable);

    static getNewTaskData=()=>{
        return Object.fromEntries(InputHelper.inputList.map(input=>[inputToKeyMap[input.id],input.value]));
    }

    static fillData=(existingTask)=>{

         InputHelper.inputList.forEach(input=>{

            let value=existingTask[inputToKeyMap[input.id]];

            if(input.type==="datetime-local")
                value=DateTimeHelper.toDateTimeLocal(value);

            input.value=value;

        });    
    } 
    
    static hasChanges=(existingTask)=>{
        return InputHelper.inputList.some(input=>input.value!==existingTask[inputToKeyMap[input.id]]);
    };

    static addInputEventListeners=(existingTask,saveBtn)=>{

        InputHelper.inputList.forEach(input=>
            input.oninput=()=>{
                saveBtn.disabled=!InputHelper.hasChanges(existingTask);
            });
    }

    static clearInputs=()=>{
        InputHelper.inputList.forEach(input=>{

            console.log("Tag name: ",input.tagName);
            if(input.tagName.toLowerCase()==="select")
                input.selectedIndex=0;

            else input.value="";
        });
    }
}

