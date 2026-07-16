const express = require("express");
const app = express();
const port = 3000;

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
app.get("/tasks", (req, res) => {
  res.json(tasks);
});

// GET /tasks/:id - Return one task by ID
app.get("/tasks/:id", (req, res) => {
  const id = Number(req.params.id);
  const task = tasks.find((t) => t.id === id);

  if (!task) {
    return res.status(404).json({ error: `Task ${id} not found` });
  }

  res.json(task);
});

app.listen(port, () => {
  console.log(`Task API listening on port ${port}`);
});
