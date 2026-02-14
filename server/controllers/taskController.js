import { db } from "../db/db.js";

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

export { getTasks, getArchivedTasks, archiveTask, deleteTask, clearTasks };