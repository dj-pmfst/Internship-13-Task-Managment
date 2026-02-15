import { fieldToDbColumn } from "../../js/helpers/Map.js";

const allowedStatus = ["blocked", "todo", "in_progress", "in_review", "done"];
const allowedPriority = ["low", "mid", "high"];
const allowedType = ["feature", "bugfix", "improvement"];

const isValidDate = (val) => !isNaN(Date.parse(val));

const fieldValidators = {
    title: {
        validate: (val) => typeof val === "string" && val.trim().length > 0,
        transform: (val) => val.trim(),
        error: "title must be a non-empty string"
    },
    description: {
        validate: (val) => typeof val === "string",
        transform: (val) => val.trim(),
        error: "description must be a string"
    },
    assignee: {
        validate: (val) => typeof val === "string",
        transform: (val) => val.trim(),
        error: "assignee must be a string"
    },
    status: {
        validate: (val) => allowedStatus.includes(val),
        error: "Invalid status value"
    },
    priority: {
        validate: (val) => allowedPriority.includes(val),
        error: "Invalid priority value" 
    },
    type: {
        validate: (val) => allowedType.includes(val),
        error: "Invalid type value"
    },
    startDate: {
        validate: (val) => isValidDate(val),
        error: "est_start_date must be a valid date"
    },
    endDate: {
        validate: (val) => isValidDate(val),
        error: "est_end_date must be a valid date"
    },
    duration: {
        validate: (val) => Number.isInteger(val) && val > 0,
        error: "est_duration must be a positive integer"
    },
    position: {
        validate: (val)=> Number.isInteger(val) && val>0,
        error: "position must be a positive integer"
    },
    
    archived: {
        validate: (val)=>typeof val==="boolean",
        error: "archived flag must be boolean"
    }

}

const validateAndBuildData = (fields) => {
    const attributes = [];
    const updates = [];
    const values = [];

    for (const [field, value] of Object.entries(fields)) {
        if (value === undefined) continue;

        const validator = fieldValidators[field];

        if (!validator.validate(value)) {
            return { error: validator.error };
        }

        attributes.push(fieldToDbColumn[field]);
        updates.push(`${fieldToDbColumn[field]} = $${updates.length + 1}`);
        values.push(validator.transform ? validator.transform(value) : value);
    }

    return { attributes, updates, values };
};

export { fieldValidators, validateAndBuildData}