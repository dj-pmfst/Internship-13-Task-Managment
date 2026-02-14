export const titleToStatusMap=Object.freeze({
        "Blocked": "blocked",
        "To do": "todo",
        "In progress": "in_progress",
        "In review": "in_review",
        "Done": "done"
});

export const inputToKeyMap=Object.freeze({
        "title-input": "title",
        "description-input": "description",
        "start-input": "startDate",
        "end-input": "endDate",
        "duration-input": "duration",
        "priority-select": "priority",
        "type-select": "type",
        "person-input": "assignee",
});

export const fieldToDbColumn = {
    title: "title",
    description: "description",
    assignee: "assignee",
    status: "status",
    priority: "priority",
    type: "type",
    startDate: "est_start_date",
    endDate: "est_end_date",
    duration: "est_duration",
    archived: "archived"
};

