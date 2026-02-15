import { DateTimeHelper } from "../../js/helpers/DateTimeHelper.js";
import { fieldToDbColumn } from "../../js/helpers/Map.js";

const allowedStatus = ["blocked", "todo", "in_progress", "in_review", "done"];
const allowedPriority = ["low", "mid", "high"];
const allowedType = ["feature", "bugfix", "improvement"];

const isValidDate = (val) => !isNaN(Date.parse(val)) && (new Date(val).getTime()>=new Date().getTime());

const fieldValidators = {
    title: {
        validate: (val) => typeof val === "string" && val.trim().length > 0,
        transform: (val) => val.trim(),
        error: "Title must be a non-empty string"
    },
    description: {
        validate: (val) => typeof val === "string",
        transform: (val) => val.trim(),
        error: "Description must be a string"
    },
    assignee: {
        validate: (val) => typeof val === "string",
        transform: (val) => val.trim(),
        error: "Assignee must be a string"
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
        error: "Start date must be a valid date and cannot be in the past"
    },
    endDate: {
        validate: (val) => isValidDate(val),
        error: "End date must be a valid date and cannot be in the past"
    },
    duration: {
        validate: (val) => Number.isInteger(val) && val > 0,
        error: "Duration must be a positive integer"
    },
    position: {
        validate: (val)=> Number.isInteger(val) && val>0,
        error: "Position must be a positive integer"
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

    const dateRangeError=DateTimeHelper.isDateRangeValid(fields);
    if(dateRangeError.error) return dateRangeError;

    console.log("New date: ",new Date(fields.startDate).getTime()<=new Date().getTime());
    console.log("Novi: ",new Date());

    return { attributes, updates, values };
};

export { fieldValidators, validateAndBuildData}