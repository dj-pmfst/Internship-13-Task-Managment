import fs from "fs/promises";
import path from "path";
import { Pool } from "pg";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const db = new Pool({
    connectionString: process.env.DATABASE_URL
})

const initDb = async () => {
    try {
        const sqlFilePath = path.join(__dirname, "initDb.sql");
        const sqlConnect = await fs.readFile(sqlFilePath, "utf-8");
        await db.query(sqlConnect);
    } catch (error) {
        console.error("Failed to initialize database:", error);
        throw error;
    }
}

export { db, initDb };