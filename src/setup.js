import { Todo } from './services/todo.service.js';

// This creates the table, dropping it first if it already existed
await Todo.sync({ force: true });
