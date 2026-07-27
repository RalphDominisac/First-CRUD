// app.js (minimal edits: error handlers + declared dbHandle)
process.on("uncaughtException", (err) => {
  console.error("UNCAUGHT EXCEPTION", err && err.stack ? err.stack : err);
  process.exit(1);
});

process.on("unhandledRejection", (reason) => {
  console.error(
    "UNHANDLED REJECTION",
    reason && reason.stack ? reason.stack : reason,
  );
  process.exit(1);
});

const express = require("express");
const app = express();
const port = 3000;

// Enables JSON body parsing
app.use(express.json());

const initDB = require("./db");
let dbHandle = null; // <--- declare this so assignment won't throw

// In-memory task list
const tasks = [
  { id: 1, title: "Learn Express", done: false },
  { id: 2, title: "Build CRUD API", done: false },
  { id: 3, title: "Write documentation", done: true },
];

// Root endpoint - API metadata
app.get("/", (req, res) => {
  res.json({
    name: "Task API",
    version: "1.0",
    endpoints: ["/tasks"],
  });
});

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

// GET /tasks - Return all tasks
app.get("/tasks", async (req, res) => {
  try {
    const rows = await dbHandle.all("SELECT * FROM tasks");
    res.json(rows);
  } catch (err) {
    console.error("GET /tasks error:", err);
    res.status(500).json({ error: "Failed to fetch tasks" });
  }
});

// GET /tasks/:id - Return one task by ID
app.get("/tasks/:id", async (req, res) => {
  const id = Number(req.params.id);

  try {
    const task = await dbHandle.get("SELECT * FROM tasks WHERE id = ?", id);

    if (!task) {
      return res.status(404).json({ error: `Task ${id} not found` });
    }

    res.json(task);
  } catch (err) {
    console.error("GET /tasks/:id error:", err);
    res.status(500).json({ error: "Failed to fetch task" });
  }
});

// POST /tasks - Create a new task
app.post("/tasks", async (req, res) => {
  const { title } = req.body;

  if (!title || title.trim() === "") {
    return res.status(400).json({ error: "Title is required" });
  }

  try {
    const result = await dbHandle.run(
      "INSERT INTO tasks (title, done) VALUES (?, ?)",
      title.trim(),
      0,
    );

    const newTask = await dbHandle.get(
      "SELECT * FROM tasks WHERE id = ?",
      result.lastID,
    );

    res.status(201).json(newTask);
  } catch (err) {
    console.error("POST /tasks error:", err);
    res.status(500).json({ error: "Failed to create task" });
  }
});

// PUT /tasks/:id - Update a task
app.put("/tasks/:id", async (req, res) => {
  const id = Number(req.params.id);
  const { title, done } = req.body;

  if (title === undefined && done === undefined) {
    return res.status(400).json({ error: "Title or Done is required" });
  }

  if (title !== undefined && title.trim() === "") {
    return res.status(400).json({ error: "Title cannot be empty" });
  }

  if (done !== undefined && typeof done !== "boolean") {
    return res.status(400).json({ error: "Done must be true or false" });
  }

  try {
    const existing = await dbHandle.get("SELECT * FROM tasks WHERE id = ?", id);

    if (!existing) {
      return res.status(404).json({ error: `Task ${id} not found` });
    }

    const newTitle = title !== undefined ? title.trim() : existing.title;
    const newDone = done !== undefined ? (done ? 1 : 0) : existing.done;

    await dbHandle.run(
      "UPDATE tasks SET title = ?, done = ? WHERE id = ?",
      newTitle,
      newDone,
      id,
    );

    const updated = await dbHandle.get("SELECT * FROM tasks WHERE id = ?", id);

    res.json(updated);
  } catch (err) {
    console.error("PUT /tasks/:id error:", err);
    res.status(500).json({ error: "Failed to update task" });
  }
});

// DELETE /tasks/:id - Delete a task
app.delete("/tasks/:id", async (req, res) => {
  const id = Number(req.params.id);

  try {
    const existing = await dbHandle.get("SELECT * FROM tasks WHERE id = ?", id);

    if (!existing) {
      return res.status(404).json({ error: `Task ${id} not found` });
    }

    await dbHandle.run("DELETE FROM tasks WHERE id = ?", id);

    res.status(204).send();
  } catch (err) {
    console.error("DELETE /tasks/:id error:", err);
    res.status(500).json({ error: "Failed to delete task" });
  }
});

// Swagger (keep as-is)
const swaggerUi = require("swagger-ui-express");
const openapi = require("./openapi.json");

app.use("/docs", swaggerUi.serve, swaggerUi.setup(openapi));

// Initialize DB then start server
initDB()
  .then((database) => {
    dbHandle = database;
    console.log("Database initialized (tasks.db should exist now).");
    app.listen(port, () => {
      console.log(`Task API listening on port ${port}`);
    });
  })
  .catch((err) => {
    console.error(
      "Failed to initialize database:",
      err && err.stack ? err.stack : err,
    );
    process.exit(1);
  });
