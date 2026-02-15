import { fieldValidators } from "../../server/validators/tasks.js";
import { DateTimeHelper } from "../helpers/DateTimeHelper.js";

export function validateFrontendTaskData(fields){
    for (const [field, value] of Object.entries(fields)) {
        if (value === undefined) continue;

        const validator = fieldValidators[field];

        if (!validator.validate(value)) {
            return { error: validator.error };
        }
    }

    const dateRangeError=DateTimeHelper.isDateRangeValid(fields);
    if(dateRangeError.error) return dateRangeError;    

    return { error: null };
}