import "dotenv/config";
import path from "path";
import cors from "cors";
import { fileURLToPath } from "url";
import express from "express";
import { initDb } from "./db/db.js";
import { archiveTask, clearTasks, createTask, deleteTask, getArchivedTasks, getTasks, updateTask } from "./controllers/taskController.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 3000;
const rootDir = path.resolve(__dirname,"..");

console.log("Root dir: ",rootDir);

app.use(cors({
  methods: ["GET", "POST", "PATCH", "DELETE"],
  allowedHeaders: ["Content-Type"]
}));

app.use(express.json());
app.use(express.static(rootDir));

app.get("/api/tasks", getTasks);
app.get("/api/tasks/archived", getArchivedTasks);
app.post("/api/tasks", createTask);
app.patch("/api/tasks/:id", updateTask);
app.patch("/api/tasks/:id/archive", archiveTask);
app.delete("/api/tasks/:id", deleteTask);
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