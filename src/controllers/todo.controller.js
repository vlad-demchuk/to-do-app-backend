import * as todoService from '../services/todo.service.js';

export const get = async (req, res) => {
  const todos = await todoService.getAll();
  const normalizedTodos = todos.map(todoService.normalize);

  res.send(normalizedTodos);
};

export const getOne = async (req, res) => {
  const { id } = req.params;

  const todo = await todoService.getById(id);
  if (!todo) {
    res.sendStatus(404);
    return;
  }

  const normalizedTodos = todoService.normalize(todo);

  res.send(normalizedTodos);
};

export const create = async (req, res) => {
  const { title } = req.body;

  if (!title) {
    res.sendStatus(422);
    return;
  }

  const todo = await todoService.create(title);

  res.statusCode = 201;
  res.send(todo);
};

export const update = async (req, res) => {
  const { id } = req.params;
  const { title, completed } = req.body;

  const todo = await todoService.getById(id);

  if (!todo) {
    res.sendStatus(404);
    return;
  }

  if (typeof title !== 'string' || typeof completed !== 'boolean') {
    res.sendStatus(422);
    return;
  }

  await todoService.update({ id, title, completed });

  const updatedTodo = todoService.getById(id);

  res.send(updatedTodo);
};

export const remove = async (req, res) => {
  const { id } = req.params;

  if (!(await todoService.getById(id))) {
    res.sendStatus(404);
    return;
  }

  await todoService.remove(id);

  res.sendStatus(204);
};

export const removeMany = (req, res) => {
  const { ids } = req.body;

  if (!Array.isArray(ids)) {
    res.sendStatus(422);
    return;
  }

  if (!ids.every(id => todoService.getById(id))) {
    throw new Error();
  }

  todoService.removeMany(ids);

  res.sendStatus(204);
};

export const updateMany = async (req, res) => {
  const { items } = req.body;

  if (!Array.isArray(items)) {
    res.sendStatus(422);
    return;
  }

  await todoService.updateMany(items);

  res.sendStatus(204);
};
