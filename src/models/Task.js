import { getDatabase } from "../database/database";

export default class Task {
    #title;
    #category;

    constructor(title, category) {
        this.title = title;
        this.category = category;
    }

    get title() {
        return this.#title;
    }

    set title(value) {
        if (typeof value !== "string" || value.trim().length < 3) {
            throw new Error("O título deve possuir pelo menos 3 caracteres.");
        }

        this.#title = value.trim();
    }

    get category() {
        return this.#category;
    }

    set category(value) {
        if (typeof value !== "string" || value.trim().length === 0) {
            throw new Error("A categoria não pode estar vazia.");
        }

        this.#category = value.trim();
    }

    saveLocal() {
        const statement = getDatabase().prepareSync(
            "INSERT INTO tasks (title, category, completed) VALUES (?, ?, ?)"
        );

        try {
            statement.executeSync([this.title, this.category, 0]);
        } finally {
            statement.finalizeSync();
        }
    }

    static listAllLocal() {
        return getDatabase().getAllSync("SELECT * FROM tasks");
    }
}
