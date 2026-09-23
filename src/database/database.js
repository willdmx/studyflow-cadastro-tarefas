import { openDatabaseSync } from "expo-sqlite";

let database;
let initialized = false;

// Reutiliza uma única conexão e permite que a tela capture falhas do banco.
export function getDatabase() {
    if (!database) {
        database = openDatabaseSync("studyflow.db");
    }

    if (!initialized) {
        database.execSync(`
            CREATE TABLE IF NOT EXISTS tasks (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                title TEXT NOT NULL,
                category TEXT NOT NULL,
                completed INTEGER DEFAULT 0
            );
        `);
        initialized = true;
    }

    return database;
}
