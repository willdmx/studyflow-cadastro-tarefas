import { openDatabaseSync } from "expo-sqlite";

let database;
let initialized = false;

// Reutiliza uma única conexão e permite que a tela capture falhas do banco.
export function getDatabase() {
    if (!database) {
        database = openDatabaseSync("studyflow.db");
    }

    if (!initialized) {
        // Migra somente as colunas ausentes, preservando tarefas e seus IDs.
        database.withTransactionSync(() => {
            database.execSync(`
                CREATE TABLE IF NOT EXISTS tasks (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    title TEXT NOT NULL,
                    category TEXT NOT NULL,
                    description TEXT,
                    priority TEXT NOT NULL,
                    dueDate TEXT,
                    completed INTEGER DEFAULT 0
                );
            `);

            const columns = database.getAllSync("PRAGMA table_info(tasks)");
            const columnNames = new Set(columns.map((column) => column.name));

            if (!columnNames.has("description")) {
                database.execSync("ALTER TABLE tasks ADD COLUMN description TEXT;");
            }
            if (!columnNames.has("priority")) {
                database.execSync("ALTER TABLE tasks ADD COLUMN priority TEXT NOT NULL DEFAULT 'Média';");
            }
            if (!columnNames.has("dueDate")) {
                database.execSync("ALTER TABLE tasks ADD COLUMN dueDate TEXT;");
            }
        });
        initialized = true;
    }

    return database;
}
