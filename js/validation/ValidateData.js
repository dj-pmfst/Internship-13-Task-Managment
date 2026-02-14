import { fieldValidators } from "../../server/validators/tasks.js";

export function validateFrontendTaskData(fields){
      for (const [field, value] of Object.entries(fields)) {
        if (value === undefined) continue;

        const validator = fieldValidators[field];

        if (!validator.validate(value)) {
            return { error: validator.error };
        }
    }

    return { error: null };
}