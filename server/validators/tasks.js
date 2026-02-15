import { ErrorMessage } from "../../js/helpers/ErrorMessage.js";
import { fieldToDbColumn } from "../../js/helpers/Map.js";
import { ValidationFunctions } from "../../js/helpers/ValidationFunctions.js";

const allowedStatus = ["blocked", "todo", "in_progress", "in_review", "done"];
const allowedPriority = ["low", "mid", "high"];
const allowedType = ["feature", "bugfix", "improvement"];

const titleMinLength=1;
const MAX_DURATION = 2147483647;

const fieldValidators = {
    title: {
        validate: (val) =>{
            if(typeof val !== "string" ) 
                return {valid: false, error: ErrorMessage.mustBeString("title")};

            if(val.trim().length<=titleMinLength) 
                return {valid: false, error: ErrorMessage.minLength("title",titleMinLength)};

            return {valid: true}
        },
        transform: (val) => val.trim(),
    },

    description: {
        validate: (val) =>{
            return ValidationFunctions.validateString(val,"description");
        },
        transform: (val) => val.trim()
    },

    assignee: {
        validate: (val) =>{
            return ValidationFunctions.validateString(val,"assignee");
        },
        transform: (val) => val.trim()
    },

    status: {
        validate: (val) =>{
            if(!allowedStatus.includes(val))
                return {valid: false, error: ErrorMessage.invalidEnum("status")}

            return {valid: true}
        }
    },

    priority: {
        validate: (val) =>{
            if(!allowedPriority.includes(val))
                return {valid: false, error: ErrorMessage.invalidEnum("priority")}

            return {valid: true}
        }
    },

    type: {
        validate: (val) =>{
            if(!allowedType.includes(val))
                return {valid: false, error: ErrorMessage.invalidEnum("type")}

            return {valid: true}
        } 
    },

    startDate: {
        validate: (val) =>{
            return ValidationFunctions.validateDate(val,"start date");
        }
    },
    
    endDate: {
        validate: (val) =>{
            return ValidationFunctions.validateDate(val,"end date");
        }
    },

    duration: {
        validate: (val) =>{
            return ValidationFunctions.validatePositiveInteger(val,"duration",MAX_DURATION);
        }
    },

    position: {
        validate: (val) =>{
            return ValidationFunctions.validatePositiveInteger(val,"position",MAX_DURATION);
        }
    },
        
    archived: {
        validate: (val)=>{
            if(typeof val!=="boolean")
                return {valid: false, error:ErrorMessage.mustBeBoolean("archived")}; 
            
            return {valid:true}
        }
    }
}

const validateAndBuildData = (fields) => {
    const attributes = [];
    const updates = [];
    const values = [];

    for (const [field, value] of Object.entries(fields)) {
        if (value === undefined) continue;

        const validator = fieldValidators[field];
        const result = validator.validate(value);

        if (!result.valid) {
            return { error: result.error };
        }
        attributes.push(fieldToDbColumn[field]);
        updates.push(`${fieldToDbColumn[field]} = $${updates.length + 1}`);
        values.push(validator.transform ? validator.transform(value) : value);
    }

    return { attributes, updates, values };
};

export { fieldValidators, validateAndBuildData}