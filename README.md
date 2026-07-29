# Task API — Express + Postgres (Dockerized CRUD Project)

![Node.js](https://img.shields.io/badge/Node.js-24.18.0-green?style=for-the-badge&logo=node.js)
![Express](https://img.shields.io/badge/Framework-Express.js-lightgrey?style=for-the-badge&logo=express)
![PostgreSQL](https://img.shields.io/badge/Database-PostgreSQL-blue?style=for-the-badge&logo=postgresql)
![Docker](https://img.shields.io/badge/Container-Docker-2496ED?style=for-the-badge&logo=docker)
![OpenAPI](https://img.shields.io/badge/OpenAPI-3.0-blue?style=for-the-badge&logo=openapiinitiative)
![Status](https://img.shields.io/badge/Status-Active-brightgreen?style=for-the-badge)

A clean, fully‑documented CRUD API for managing tasks, built with Node.js, Express, PostgreSQL, and Docker Compose.

---

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Environment Variables](#environment-variables)
- [Running the Project](#running-the-project)
- [API Endpoints](#api-endpoints)
- [Example cURL Commands](#example-curl-commands)
- [Clean Clone Test](#clean-clone-test)
- [Roadmap](#roadmap)
- [Author](#author)

---

## Overview

This API manages tasks using a PostgreSQL database running inside Docker. The entire stack starts with one command:
docker compose up

---

## Features

- Full CRUD
- PostgreSQL with persistent storage
- Docker Compose multi-service stack
- Repository pattern
- OpenAPI documentation
- Zero manual DB setup

---

## Tech Stack

-Node.js
-Express.js
-PostgreSQL
-Docker Compose
-OpenAPI 3.0

---

## Project Structure

```text
├── app.js
├── db.js
├── Dockerfile
├── compose.yaml
├── openapi.json
├── package.json
├── .env.example
└── README.md
```

---

## Environment Variables

```bash
DATABASE_URL=postgres://postgres:dev@db:5432/tasks
```

---

## Running the Project

```bash
git clone <repo>
cd <repo>
cp .env.example .env
docker compose up
```

---

## API Endpoints

```bash
GET /tasks
GET /tasks/:id
POST /tasks
PUT /tasks/:id
DELETE /tasks/:id
```

---

## Example cURL Commands

```bash
curl -i -X POST http://localhost:3000/tasks -H "Content-Type: application/json" -d '{"title": "Compose Test 1"}'
```

```bash
curl http://localhost:3000/tasks
```

```bash
curl http://localhost:3000/tasks/1
```

```bash
curl -i -X PUT http://localhost:3000/tasks/1 -H "Content-Type: application/json" -d '{"done": true}'
```

```bash
curl -i -X DELETE http://localhost:3000/tasks/1
```

---

## Clean Clone Test

```bash
git clone <repository-url>
cp .env.example .env
docker compose up
curl http://localhost:3000/tasks
```

---

## Roadmap

-Pagination
-Validation
-Services/Controllers
-Tests
-Deployment

---

## Author

Ralph Henry L. Dominisac
