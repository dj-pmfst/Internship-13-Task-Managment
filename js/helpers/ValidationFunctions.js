import { ErrorMessage } from "./ErrorMessage.js";

const isValidDate = (val) => !isNaN(Date.parse(val));

export class ValidationFunctions{
    
    static validatePositiveInteger=(val,propName,maxValue)=>{
        if(!Number.isInteger(val))
            return {valid: false, error:ErrorMessage.mustBeInteger(propName)};

        if(val<=0)
            return { valid: false, error: ErrorMessage.mustBePositive(propName)};

        if(val>maxValue)
            return { valid: false, error: ErrorMessage.maxLength(propName,0)};

        return {valid: true}        
    }

    static validateDate=(val,propName)=>{
        if(!isValidDate(val))
            return {valid: false, error: ErrorMessage.invalidDate(propName)}

        const inputTime = new Date(val).getTime();
        const now = Date.now();

        if (inputTime<now)
            return {valid: false, error: ErrorMessage.dateInPast(propName)};
       
        return {valid: true}
    }

    static validateString=(val,propName)=>{
        if(typeof val!=="string") 
            return {valid: false, error: ErrorMessage.mustBeString("description")};

        return {valid: true}        
    }
}