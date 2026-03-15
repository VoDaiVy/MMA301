import * as SQLite from 'expo-sqlite';

const DATABASE_NAME = 'smart_notification_hub.db';

let databasePromise;

async function getDatabase() {
  if (!databasePromise) {
    databasePromise = SQLite.openDatabaseAsync(DATABASE_NAME);
  }

  return databasePromise;
}

export async function initDatabase() {
  const db = await getDatabase();

  await db.execAsync(`
    PRAGMA journal_mode = WAL;
    CREATE TABLE IF NOT EXISTS notification_logs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      message TEXT NOT NULL,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    );
  `);
}

export async function saveNotificationLog(title, message) {
  const db = await getDatabase();

  await db.runAsync(
    'INSERT INTO notification_logs (title, message) VALUES (?, ?);',
    [title, message]
  );
}

export async function getNotificationLogs() {
  const db = await getDatabase();

  return db.getAllAsync(`
    SELECT id, title, message, created_at
    FROM notification_logs
    ORDER BY datetime(created_at) DESC, id DESC;
  `);
}

export async function clearNotificationLogs() {
  const db = await getDatabase();

  await db.runAsync('DELETE FROM notification_logs;');
}