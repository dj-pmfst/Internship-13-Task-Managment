export class ErrorMessage{

    static mustBeString=(propName)=>`${propName} must be a string`;

    static mustBeInteger=(propName)=>`${propName} must be an integer`;

    static mustBeBoolean=(propName)=>`${propName} must be boolean`;

    static mustBePositive(prop) {
        return `${prop} must be greater than 0`;
    }

    static invalidEnum(prop) {
        return `Invalid ${prop} value`;
    }

    static invalidDate(prop) {
        return `${prop} must be valid date`;
    }

    static minLength(propName, minLength) {
        return `${propName} must be at least ${minLength} characters long`;
    }    

    static maxValue(propName,maxValue){
        return `${propName} exceeded max value of ${maxValue}`;        
    }
}


