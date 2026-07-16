const express = require("express");
const app = express();
const port = 3000;

// Enables JSON body parsing
app.use(express.json());

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

// -----------------------------------------------------------------------------------------------------

// GET /tasks - Return all tasks
app.get("/tasks", (req, res) => {
  res.json(tasks);
});

// -----------------------------------------------------------------------------------------------------

// GET /tasks/:id - Return one task by ID
app.get("/tasks/:id", (req, res) => {
  const id = Number(req.params.id);
  const task = tasks.find((t) => t.id === id);

  if (!task) {
    return res.status(404).json({ error: `Task ${id} not found` });
  }

  res.json(task);
});

// -----------------------------------------------------------------------------------------------------
// POST /tasks - Create a new task
app.post("/tasks", (req, res) => {
  const { title } = req.body;

  // Validation: Title must exist and not be empty
  if (!title || title.trim() === "") {
    return res.status(400).json({ error: "Title is required" });
  }

  // Generate next free ID
  const nextId = tasks.length > 0 ? tasks[tasks.length - 1].id + 1 : 1;

  // Create new task
  const newTask = {
    id: nextId,
    title: title.trim(),
    done: false,
  };

  // Add to list
  tasks.push(newTask);

  // Return created task with status 201
  res.status(201).json(newTask);
});

// -----------------------------------------------------------------------------------------------------
// PUT /tasks/:id - Update a task
app.put("/tasks/:id", (req, res) => {
  const id = Number(req.params.id);
  const task = tasks.find((t) => t.id === id);

  if (!task) {
    return res.status(404).json({ error: `Task ${id} not found` });
  }

  const { title, done } = req.body;

  // Validate: at least one field must be provided
  if (title === undefined && done === undefined) {
    return res.status(400).json({ error: "Title or Done is required" });
  }

  // Validate title if provided
  if (title !== undefined && title.trim() === "") {
    return res.status(400).json({ error: "Title cannot be empty" });
  }

  // Validate done if provided
  if (done !== undefined && typeof done !== "boolean") {
    return res.status(400).json({ error: "Done must be true or false" });
  }

  //  Apply updates
  if (title !== undefined) task.title = title.trim();
  if (done !== undefined) task.done = done;

  res.json(task);
});

// -----------------------------------------------------------------------------------------------------
// DELETE /tasks/:id - Delete a task
app.delete("/tasks/:id", (req, res) => {
  const id = Number(req.params.id);
  const index = tasks.findIndex((t) => t.id === id);

  if (index === -1) {
    return res.status(404).json({ error: `Task ${id} not found` });
  }

  tasks.splice(index, 1);

  res.status(204).send();
});

// -----------------------------------------------------------------------------------------------------

const swaggerUi = require("swagger-ui-express");
const openapi = require("./openapi.json");

app.use("/docs", swaggerUi.serve, swaggerUi.setup(openapi));

app.listen(port, () => {
  console.log(`Task API listening on port ${port}`);
});
