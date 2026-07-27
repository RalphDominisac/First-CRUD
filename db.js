// db.js
const sqlite3 = require("sqlite3").verbose();
const { open } = require("sqlite");

async function initDB() {
  console.log("initDB: opening tasks.db");
  const db = await open({
    filename: "tasks.db",
    driver: sqlite3.Database,
  });

  console.log("initDB: creating table if not exists");
  await db.exec(`
    CREATE TABLE IF NOT EXISTS tasks (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      done INTEGER NOT NULL DEFAULT 0
    );
  `);

  console.log("initDB: checking row count");
  const row = await db.get("SELECT COUNT(*) AS count FROM tasks");
  console.log("initDB: current count =", row.count);

  if (row.count === 0) {
    console.log("initDB: seeding initial tasks");
    await db.exec(`
      INSERT INTO tasks (title, done) VALUES
        ('Learn Express', 0),
        ('Build CRUD API', 0),
        ('Write documentation', 1);
    `);
    console.log("initDB: seed complete");
  } else {
    console.log("initDB: seed skipped");
  }

  return db;
}

module.exports = initDB;
