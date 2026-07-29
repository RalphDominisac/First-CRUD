import express from "express";
import dotenv from "dotenv";

// Node 24+ JSON import fix
import { createRequire } from "module";
const require = createRequire(import.meta.url);

const swaggerUi = require("swagger-ui-express");
const openapi = require("./openapi.json");

import {
  initDB,
  getAllTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
} from "./db.js";

dotenv.config();

const app = express();
const port = 3000;

app.use(express.json());

// Root endpoint
app.get("/", (req, res) => {
  res.json({
    name: "Task API",
    version: "1.0",
    endpoints: ["/tasks"],
  });
});

// Health check
app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

// GET /tasks
app.get("/tasks", async (req, res) => {
  try {
    const tasks = await getAllTasks();
    res.json(tasks);
  } catch (err) {
    console.error("GET /tasks error:", err);
    res.status(500).json({ error: "Failed to fetch tasks" });
  }
});

// GET /tasks/:id
app.get("/tasks/:id", async (req, res) => {
  const id = Number(req.params.id);

  try {
    const task = await getTaskById(id);

    if (!task) {
      return res.status(404).json({ error: `Task ${id} not found` });
    }

    res.json(task);
  } catch (err) {
    console.error("GET /tasks/:id error:", err);
    res.status(500).json({ error: "Failed to fetch task" });
  }
});

// POST /tasks
app.post("/tasks", async (req, res) => {
  const { title } = req.body;

  if (!title || title.trim() === "") {
    return res.status(400).json({ error: "Title is required" });
  }

  try {
    const newTask = await createTask(title.trim());
    res.status(201).json(newTask);
  } catch (err) {
    console.error("POST /tasks error:", err);
    res.status(500).json({ error: "Failed to create task" });
  }
});

// PUT /tasks/:id
app.put("/tasks/:id", async (req, res) => {
  const id = Number(req.params.id);
  const { title, done } = req.body;

  try {
    // Fetch existing task
    const existing = await getTaskById(id);
    if (!existing) {
      return res.status(404).json({ error: `Task ${id} not found` });
    }

    // Use existing values if not provided
    const newTitle = title !== undefined ? title.trim() : existing.title;
    const newDone = done !== undefined ? done : existing.done;

    const updated = await updateTask(id, newTitle, newDone);
    res.json(updated);
  } catch (err) {
    console.error("PUT /tasks/:id error:", err);
    res.status(500).json({ error: "Failed to update task" });
  }
});

// DELETE /tasks/:id
app.delete("/tasks/:id", async (req, res) => {
  const id = Number(req.params.id);

  try {
    const deleted = await deleteTask(id);

    if (!deleted) {
      return res.status(404).json({ error: `Task ${id} not found` });
    }

    res.status(204).send();
  } catch (err) {
    console.error("DELETE /tasks/:id error:", err);
    res.status(500).json({ error: "Failed to delete task" });
  }
});

// Swagger
app.use("/docs", swaggerUi.serve, swaggerUi.setup(openapi));

// Start server after DB init
initDB()
  .then(() => {
    console.log("Database ready.");
    app.listen(port, () => {
      console.log(`Task API listening on port ${port}`);
    });
  })
  .catch((err) => {
    console.error("Failed to initialize database:", err);
    process.exit(1);
  });
