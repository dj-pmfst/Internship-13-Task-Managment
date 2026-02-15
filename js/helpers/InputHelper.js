import { inputs } from "../components/AllComponents/mainElements.js";
import { DateTimeHelper } from "./DateTimeHelper.js";
import { inputToKeyMap } from "./Map.js";

export class InputHelper{
    
    static inputList=Object.values(inputs);

    static setInputsDisabled=(disable)=>InputHelper.inputList.forEach(input=>input.disabled=disable);

    static getNewTaskData=()=>{
        return Object.fromEntries(InputHelper.inputList.map(input=>{
            
            const key=inputToKeyMap[input.id];
            let value=input.value;

            if(key==="duration")
                value=parseInt(value,10);

            if(input.type==="datetime-local"){
                value=DateTimeHelper.toDateTimeLocal(value);
            }

            return [key,value];
        }));
    }

    static getUpdatedTaskData=(existingTask)=>{

        const dateKeys=["startDate","endDate"];
        let isDateChanged={[dateKeys[0]]: false, [dateKeys[1]]: false}

        let updatedTask= InputHelper.inputList.reduce((acc,input)=>{

            const key=inputToKeyMap[input.id];
            let newValue=input.value

            if(key==="duration"){
                console.log("new value: ",newValue);
                newValue=parseInt(newValue,10);
            }

            else if(dateKeys.includes(key)){
                const oldValue=DateTimeHelper.toDateTimeLocal(existingTask[key]);
                newValue=DateTimeHelper.toDateTimeLocal(newValue);

                if(oldValue!==newValue){
                    acc[key]=newValue;
                    isDateChanged[key]=true;
                }
            }

            else if(existingTask[key]!==newValue)
                acc[key]=newValue;

            return acc;
        },{});

        if(isDateChanged.startDate && !isDateChanged.endDate)
            updatedTask.endDate=DateTimeHelper.toDateTimeLocal(existingTask.endDate);

        if(!isDateChanged.startDate && isDateChanged.endDate)
            updatedTask.startDate=DateTimeHelper.toDateTimeLocal(existingTask.startDate);

        return updatedTask;
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

            if(input.tagName.toLowerCase()==="select")
                input.selectedIndex=0;

            else input.value="";
        });
    }
}

