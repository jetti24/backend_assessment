import express, { Request, Response } from 'express';
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

const app = express();
const dbName = 'database.sqlite3';

// Interface for the columns object
interface ColumnSchema {
  [columnName: string]: string;
}

async function createTablesFromSchema(schema: any) {
  const db = await open({
    filename: dbName,
    driver: sqlite3.Database
  });

  for (const [tableName, columns] of Object.entries<ColumnSchema>(schema)) {
    const columnDefinitions = Object.entries(columns).map(([columnName, columnType]) => {
      return `${columnName} ${columnType}`;
    });
    const createTableQuery = `CREATE TABLE IF NOT EXISTS ${tableName} (${columnDefinitions.join(', ')})`;
    await db.exec(createTableQuery);
  }
}

async function initializeDatabase() {
  try {
    const schema = require('./schema.json');
    await createTablesFromSchema(schema);
    console.log('Database schema created successfully.');
  } catch (error) {
    console.error('Error creating database schema:', error);
  }
}

app.use(express.json());

app.post('/:collection', async (req: Request, res: Response) => {
  try {
    const collection = req.params.collection;
    const data = req.body;

    const db = await open({
      filename: dbName,
      driver: sqlite3.Database
    });

    const columns = Object.keys(data).join(', ');
    const values = Object.values(data).map(value => `'${value}'`).join(', ');
    const insertQuery = `INSERT INTO ${collection} (${columns}) VALUES (${values})`;

    await db.run(insertQuery);

    res.json({ message: 'Record created successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create the record' });
  }
});

app.get('/:collection/:id', async (req: Request, res: Response) => {
  try {
    const collection = req.params.collection;
    const id = req.params.id;

    const db = await open({
      filename: dbName,
      driver: sqlite3.Database
    });

    const selectQuery = `SELECT * FROM ${collection} WHERE id = ?`;
    const row = await db.get(selectQuery, id);

    if (!row) {
      return res.status(404).json({ message: 'Record not found' });
    }

    res.json(row);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve the record' });
  }
});

app.post('/:collection/:id', async (req: Request, res: Response) => {
  try {
    const collection = req.params.collection;
    const id = req.params.id;
    const data = req.body;

    const db = await open({
      filename: dbName,
      driver: sqlite3.Database
    });

    const updateColumns = Object.entries(data).map(([columnName, value]) => {
      return `${columnName} = '${value}'`;
    });

    const updateQuery = `UPDATE ${collection} SET ${updateColumns.join(', ')} WHERE id = ?`;
    await db.run(updateQuery, id);

    res.json({ message: 'Record updated successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update the record' });
  }
});

app.delete('/:collection/:id', async (req: Request, res: Response) => {
  try {
    const collection = req.params.collection;
    const id = req.params.id;

    const db = await open({
      filename: dbName,
      driver: sqlite3.Database
    });

    const deleteQuery = `DELETE FROM ${collection} WHERE id = ?`;
    await db.run(deleteQuery, id);

    res.json({ message: 'Record deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete the record' });
  }
});

async function startServer() {
  const port = 3000;
  await initializeDatabase();

  app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
  });
}

startServer();
