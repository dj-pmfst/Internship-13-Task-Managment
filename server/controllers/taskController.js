import { db } from "../db/db.js";
import { validateAndBuildData } from "../validators/tasks.js";

const getTasks = async (_req, res) => {
    try {
        const result = await db.query(
            `SELECT
                id, 
                title,
                description,
                assignee,
                status,
                priority, 
                type,
                est_start_date AS "startDate",
                est_end_date AS "endDate",
                est_duration AS duration,
                archived,
                archived_at
            FROM tasks
            WHERE archived=false
            ORDER BY created_at ASC`
        );

        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ error: "Failed to load tasks" });
    }
}

const getArchivedTasks = async (_req, res) => {
    try {
        const result = await db.query(
            `SELECT
                id, 
                title,
                description,
                assignee,
                status,
                priority, 
                type,
                est_start_date,
                est_end_date,
                est_duration,
                archived,
                archived_at
            FROM tasks
            WHERE archived = true
            ORDER BY archived_at DESC`
        );
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ error: "Failed to load tasks" });
    }
}

const createTask = async (req, res) => {
    const { title, description, assignee, status, priority, type, est_start_date, est_end_date, est_duration, archived } = req.body;

    const { attributes, values, error } = validateAndBuildData({
            title,
            description,
            assignee,
            status,
            priority, 
            type,
            est_start_date,
            est_end_date,
            est_duration,
            archived
    });

    if (attributes.length === 0) {
        return res.status(400).json({ error: "No data available" });
    }

    if (error) {
        return res.status(400).json({ error });
    }

    const placeholders = attributes.map((_, i) => `$${i + 1}`)

    try {
        const result = await db.query(
            `INSERT INTO
                tasks (${attributes.join(", ")})
            VALUES
                (${placeholders.join(", ")})
            RETURNING *`,
            values
        );

        res.status(201).json(result.rows);
    } catch (error) {
        res.status(500).json({ error: "Failed to create task" });
    }
};

const updateTask = async (req, res) => {
    const { title, description, assignee, status, priority, type, est_start_date, est_end_date, est_duration, archived } = req.body;

    const { updates, values, error } = validateAndBuildData({
            title,
            description,
            assignee,
            status,
            priority, 
            type,
            est_start_date,
            est_end_date,
            est_duration,
            archived
    });

    if (updates.length === 0) {
        return res.status(400).json({ error: "No fields to update" });
    }

    if (error) {
        return res.status(400).json({ error });
    }

    values.push(req.params.id);
    const idIndex = updates.length + 1;

    try {
        const result = await db.query(
            `UPDATE tasks
                SET ${updates.join(", ",)}
            WHERE id = $${idIndex}
            RETURNING *`,
            values
        );

        if (result.rowCount === 0) {
            return res.status(404).json({ error: "Task not found" });
        }
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ error: "Failed to update task" });
    }
};

const archiveTask = async (req, res) => {
    try {
        const { archived } = req.body;

        if (typeof archived !== "boolean") {
            return res.status(400).json({ error: "archived must be boolean" })
        }
        
        const result = await db.query(
            `UPDATE tasks
            SET archived = $1,
                archived_at = CASE
                    WHEN $1 = true THEN NOW()
                    ELSE NULL
                END
            WHERE id = $2
            RETURNING id, archived, archived_at`,
            [archived, req.params.id]
        );

        if (result.rowCount === 0) {
            return res.status(404).json({ error: "Task not found" });
        }

        res.json(result.rows)
    } catch (error) {
        res.status(500).json({ error: "Failed to archive task" });
    }
}

const deleteTask = async (req, res) => {
    try {
        const result = await db.query(
            `DELETE
            FROM tasks
            WHERE id = $1 RETURNING id`,
            [req.params.id]
        );

        if (result.rowCount === 0) {
            return res.status(404).json({ error: "Task not found" });
        }

        res.json({ deleted: true })
    } catch (error) {
        res.status(500).json({ error: "Failed to delete task" });
    }
}

const clearTasks = async (_req, res) => {
    try {
        await db.query(
            `DELETE
            FROM tasks`
        )
        res.json({ cleared: true })
    } catch (error) {
        res.status(500).json({ error: "Failed to clear tasks" });
    }
}

export { getTasks, getArchivedTasks, createTask, updateTask, archiveTask, deleteTask, clearTasks };