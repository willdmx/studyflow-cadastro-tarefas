// src/models/Task.js
// =============================================================================
// MODELO DE DOMÍNIO DA TAREFA (POO + DML SQLite)
// Centraliza as regras de negócio e executa as instruções SQL locais.
// =============================================================================

import { getDatabase } from '../database/database';

const TASK_PRIORITIES = ['Baixa', 'Média', 'Alta'];

export class Task {
  // Atributos privados da POO (Encapsulamento ES6)
  #id;
  #title;
  #category;
  #description;
  #priority;
  #dueDate;
  #completed;

  constructor(title, category, description, priority, dueDate, completed = 0, id = null) {
    this.#id = id;
    this.setTitle(title);      // Executa validações de entrada
    this.setCategory(category);  // Executa validações de entrada
    this.setDescription(description);
    this.setPriority(priority);
    this.setDueDate(dueDate);
    this.#completed = completed ? 1 : 0;
  }

  // Getters para leitura controlada
  getId() { return this.#id; }
  getTitle() { return this.#title; }
  getCategory() { return this.#category; }
  getDescription() { return this.#description; }
  getPriority() { return this.#priority; }
  getDueDate() { return this.#dueDate; }
  isCompleted() { return this.#completed === 1; }

  // Setters com validações
  setTitle(title) {
    const formatted = (typeof title === 'string' ? title : '').trim();
    if (!formatted || formatted.length < 3) {
      throw new Error('O título da tarefa deve ter pelo menos 3 caracteres.');
    }
    this.#title = formatted;
  }

  setCategory(category) {
    const formatted = (typeof category === 'string' ? category : '').trim();
    if (!formatted) {
      throw new Error('Informe uma categoria para a tarefa.');
    }
    this.#category = formatted;
  }

  setDescription(description) {
    this.#description = (description || '').trim();
  }

  setPriority(priority) {
    if (!TASK_PRIORITIES.includes(priority)) {
      throw new Error('Prioridade inválida.');
    }
    this.#priority = priority;
  }

  setDueDate(dueDate) {
    const formatted = (dueDate ?? '').toString().trim();

    // Tarefas anteriores à migração podem não ter uma data cadastrada.
    if (!formatted) {
      this.#dueDate = null;
      return;
    }

    const parts = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(formatted);
    if (!parts) {
      throw new Error('Informe uma data de entrega válida no formato DD/MM/AAAA.');
    }

    const day = Number(parts[1]);
    const month = Number(parts[2]);
    const year = Number(parts[3]);
    const isLeapYear = year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0);
    const daysInMonth = [31, isLeapYear ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

    if (year < 1 || month < 1 || month > 12 || day < 1 || day > daysInMonth[month - 1]) {
      throw new Error('Informe uma data de entrega válida no formato DD/MM/AAAA.');
    }

    this.#dueDate = formatted;
  }

  // =========================================================================
  // DML 1: INSERÇÃO (CREATE / INSERT INTO)
  // Grava uma nova instância do objeto diretamente na tabela 'tasks'
  // =========================================================================
  saveLocal() {
    if (!this.#dueDate) throw new Error('Informe a data de entrega.');

    let statement;
    try {
      // Prepared Statement: Previne SQL Injection utilizando $parâmetros
      statement = getDatabase().prepareSync(
        `INSERT INTO tasks (title, category, description, priority, dueDate, completed)
         VALUES ($title, $category, $description, $priority, $dueDate, $completed)`
      );

      // Executa a inserção passando os valores encapsulados
      const result = statement.executeSync({
        $title: this.#title,
        $category: this.#category,
        $description: this.#description,
        $priority: this.#priority,
        $dueDate: this.#dueDate,
        $completed: this.#completed,
      });

      this.#id = result.lastInsertRowId;
      return this.#id; // Retorna o ID autogerado
    } catch (error) {
      throw new Error('Erro ao executar o INSERT da tarefa no banco local.');
    } finally {
      statement?.finalizeSync();
    }
  }

  // =========================================================================
  // DML 2: ALTERAÇÃO (UPDATE + WHERE)
  // Alterna o status da coluna 'completed' filtrando pelo 'id'
  // =========================================================================
  toggleStatusLocal() {
    if (!this.#id) throw new Error('Tarefa sem ID para atualização.');

    let statement;
    try {
      const newStatus = this.#completed === 1 ? 0 : 1;

      statement = getDatabase().prepareSync(
        'UPDATE tasks SET completed = $completed WHERE id = $id'
      );
      statement.executeSync({
        $completed: newStatus,
        $id: this.#id,
      });

      this.#completed = newStatus;
    } catch (error) {
      throw new Error('Erro ao executar o UPDATE do status no banco.');
    } finally {
      statement?.finalizeSync();
    }
  }

  // =========================================================================
  // DML 3: REMOÇÃO (DELETE + WHERE)
  // Apaga a linha correspondente ao 'id'
  // =========================================================================
  deleteLocal() {
    if (!this.#id) throw new Error('Tarefa sem ID para exclusão.');

    let statement;
    try {
      statement = getDatabase().prepareSync('DELETE FROM tasks WHERE id = $id');
      statement.executeSync({ $id: this.#id });
    } catch (error) {
      throw new Error('Erro ao executar o DELETE no banco local.');
    } finally {
      statement?.finalizeSync();
    }
  }

  // =========================================================================
  // DML 4: CONSULTA E ORDENAÇÃO (SELECT + ORDER BY)
  // Retorna todos os registros ordenados do mais recente ao mais antigo
  // =========================================================================
  static listAllLocal() {
    try {
      return getDatabase().getAllSync('SELECT * FROM tasks ORDER BY id DESC');
    } catch (error) {
      throw new Error('Erro ao executar a consulta SELECT das tarefas.');
    }
  }

  // =========================================================================
  // DML 5: CONSULTA COM FILTRO (SELECT + WHERE + ORDER BY)
  // Filtra as tarefas dependendo do estado da coluna 'completed'
  // =========================================================================
  static filterByStatusLocal(isCompleted) {
    try {
      const statusValue = isCompleted ? 1 : 0;

      return getDatabase().getAllSync(
        'SELECT * FROM tasks WHERE completed = ? ORDER BY id DESC',
        [statusValue]
      );
    } catch (error) {
      throw new Error('Erro ao filtrar tarefas com a cláusula WHERE.');
    }
  }

  // SELECT + WHERE: consulta uma das prioridades permitidas.
  static filterByPriorityLocal(priority) {
    if (!TASK_PRIORITIES.includes(priority)) {
      throw new Error('Prioridade inválida.');
    }

    try {
      return getDatabase().getAllSync(
        'SELECT * FROM tasks WHERE priority = ? ORDER BY id DESC',
        [priority]
      );
    } catch (error) {
      throw new Error('Erro ao filtrar tarefas por prioridade.');
    }
  }

  // SELECT + WHERE + AND: tarefas de prioridade alta que ainda estão pendentes.
  static filterHighPriorityPendingLocal() {
    try {
      return getDatabase().getAllSync(
        "SELECT * FROM tasks WHERE priority = 'Alta' AND completed = 0 ORDER BY id DESC"
      );
    } catch (error) {
      throw new Error('Erro ao consultar tarefas de prioridade alta pendentes.');
    }
  }

  // Métricas gerais do Dashboard, independentes dos filtros da listagem.
  static getDashboardStatsLocal() {
    try {
      const { total, completed, pending } = getDatabase().getFirstSync(
        `SELECT COUNT(*) AS total,
                COALESCE(SUM(CASE WHEN completed = 1 THEN 1 ELSE 0 END), 0) AS completed,
                COALESCE(SUM(CASE WHEN completed = 0 THEN 1 ELSE 0 END), 0) AS pending
         FROM tasks`
      );

      return {
        total,
        completed,
        pending,
        percentage: total > 0 ? Math.round((completed / total) * 100) : 0,
      };
    } catch (error) {
      throw new Error('Erro ao consultar as estatísticas das tarefas.');
    }
  }
}
