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

- Overview
- Features
- Tech Stack
- Project Structure
- Environment Variables
- Running the Project
- API Endpoints
- Example cURL Commands
- Clean Clone Test
- Roadmap
- Author

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

Node.js, Express.js, PostgreSQL, Docker Compose, OpenAPI 3.0

---

## Project Structure

├── app.js
├── db.js
├── Dockerfile
├── compose.yaml
├── openapi.json
├── package.json
├── .env.example
└── README.md

---

## Environment Variables

- DATABASE_URL=postgres://postgres:dev@db:5432/tasks

---

## Running the Project

`git clone <repo>`
`cd <repo>`
`cp .env.example .env`
`docker compose up`

---

## API Endpoints

- GET /tasks
- GET /tasks/:id
- POST /tasks
- PUT /tasks/:id
- DELETE /tasks/:id

---

## Example cURL Commands

`curl -i -X POST http://localhost:3000/tasks -H "Content-Type: application/json" -d '{"title": "Compose Test 1"}'`
`curl http://localhost:3000/tasks`
`curl http://localhost:3000/tasks/1`
`curl -i -X PUT http://localhost:3000/tasks/1 -H "Content-Type: application/json" -d '{"done": true}'`
`curl -i -X DELETE http://localhost:3000/tasks/1`

---

## Clean Clone Test

`git clone`
`cp .env.example .env`
`docker compose up`
`curl http://localhost:3000/tasks`
``

---

## Roadmap

Pagination, validation, services/controllers, tests, deployment

---

## Author

Ralph Henry L. Dominisac
