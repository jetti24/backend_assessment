# Generic Database Proxy - Node.js and TypeScript

This project provides a generic database proxy, which is a REST API for performing CRUD (Create, Read, Update, Delete) operations on a SQL database. The server is built using Node.js and TypeScript and allows clients to interact with the database using HTTP methods (POST, GET, DELETE).

## Technical Requirements

- Node.js
- npm or yarn package manager

## Installation

1. Unzip the code:

2. Install the dependencies:

```bash
npm install
```

## Schema Definition

The database schema is defined in a JSON format. Each collection represents a table in the database, and the fields represent the columns. For example:

```json
{
  "users": {
    "id": "INTEGER PRIMARY KEY",
    "name": "TEXT",
    "email": "TEXT"
  },
  "posts": {
    "id": "INTEGER PRIMARY KEY",
    "title": "TEXT",
    "content": "TEXT",
    "user_id": "INTEGER"
  }
}
```

The schema is ingested and the tables are created on every server startup. If the tables already exist, the proxy will add any missing columns based on the schema.

## Starting the Server

To start the server, use the following command:

```bash
npx ts-node-dev index.ts
```

The server will be running at `http://localhost:3000`.

## API Endpoints

### Create a new record

- Endpoint: `POST /:collection`
- Example: `POST /users`

```json
// Request body
{
  "name": "John Doe",
  "email": "john.doe@example.com"
}
```

### Read a record by ID

- Endpoint: `GET /:collection/:id`
- Example: `GET /users/1`

### Update a record by ID

- Endpoint: `POST /:collection/:id`
- Example: `POST /users/1`

```json
// Request body
{
  "name": "Updated Name",
  "email": "updated.email@example.com"
}
```

### Delete a record by ID

- Endpoint: `DELETE /:collection/:id`
- Example: `DELETE /users/1`

## Database

The project uses SQLite as the default database. The database file is named `database.sqlite3` and will be created automatically on server startup.

## Concurrency

The current implementation is designed for single-threaded use. If the application needs to run in a concurrent environment, additional considerations for thread safety and scalability should be taken into account.
