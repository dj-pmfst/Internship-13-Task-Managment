import "dotenv/config";
import path from "path";
import { fileURLToPath } from "url";
import express from "express";
import { initDb } from "./db/db.js";
import { clearTasks, getTasks } from "./controllers/taskController.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 3000;
const rootDir = path.resolve(__dirname, "");

app.use(express.json());
app.use(express.static(rootDir));

app.get("/api/tasks", getTasks);
app.delete("/api/tasks", clearTasks);

const startServer = async () => {
    await initDb();
    app.listen(port, () => {
        console.log(`Connected to DB, server listening on port ${port}`);
    });
}

startServer().catch((error) => {
  console.error("Failed to start server", error);
  process.exit(1);
});