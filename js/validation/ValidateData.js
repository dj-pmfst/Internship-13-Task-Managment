import { fieldValidators } from "../../server/validators/tasks.js";
import { DateTimeHelper } from "../helpers/DateTimeHelper.js";

export function validateFrontendTaskData(fields){
    for (const [field, value] of Object.entries(fields)) {
        if (value === undefined) continue;

        const validator = fieldValidators[field];
        const result = validator.validate(value);

        if (!result.valid) {
            return { error: result.error };
        }

        const dateRangeError=DateTimeHelper.isDateRangeValid(fields.startDate,fields.endDate);
        if(dateRangeError.error) return dateRangeError;          
    }
    return { error: null };
}