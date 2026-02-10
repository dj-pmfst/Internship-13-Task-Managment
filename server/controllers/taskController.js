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
                est_start_date,
                est_end_date,
                est_duration,
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

export { getTasks };