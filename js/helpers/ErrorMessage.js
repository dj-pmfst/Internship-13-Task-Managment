export class ErrorMessage{

    static mustBeString=(propName)=>`${propName} must be a string`;

    static mustBeInteger=(propName)=>`${propName} must be an integer`;

    static mustBeBoolean=(propName)=>`${propName} must be boolean`;

    static mustBePositive=(prop)=>`${prop} must be greater than 0`;

    static invalidEnum=(propName)=>`Invalid ${propName} value`;

    static invalidDate=(prop)=>`${prop} must be valid date`;
    
    static dateInPast=(prop)=>`${prop} can't be in the past`;

    static minLength=(propName, minLength)=> `${propName} must be at least ${minLength} characters long`;

    static maxValue=(propName,maxValue)=>`${propName} exceeded max value of ${maxValue}`;       
}


