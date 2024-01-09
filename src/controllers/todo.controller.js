import * as todoService from '../services/todo.service.js';

export const get = (req, res) => {
  res.send(todoService.getAll());
};

export const getOne = (req, res) => {
  const { id } = req.params;

  const todo = todoService.getById(id);
  if (!todo) {
    res.sendStatus(404);
    return;
  }

  res.send(todo);
};

export const create = (req, res) => {
  const { title } = req.body;

  if (!title) {
    res.sendStatus(422);
    return;
  }

  const todo = todoService.create(title);

  res.statusCode = 201;
  res.send(todo);
};

export const update = (req, res) => {
  const { id } = req.params;
  const { title, completed } = req.body;

  const todo = todoService.getById(id);

  if (!todo) {
    res.sendStatus(404);
    return;
  }

  if (typeof title !== 'string' || typeof completed !== 'boolean') {
    res.sendStatus(422);
    return;
  }

  const updatedTodo = todoService.update({ id, title, completed });

  res.send(updatedTodo);
};

export const remove = (req, res) => {
  const { id } = req.params;

  if (!todoService.getById(id)) {
    res.sendStatus(404);
    return;
  }

  todoService.remove(id);

  res.sendStatus(204);
}

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
}

export const updateMany = (req, res) => {
  const { items } = req.body;

  if (!Array.isArray(items)) {
    res.sendStatus(422);
    return;
  }

  const errors = [];
  const results = [];
  for (const { id, title, completed } of items) {
    const todo = todoService.getById(id);

    if (!todo) {
      errors.push({ id, title, completed, error: 'Not found' });
    } else {
      const result = todoService.update({ id, title, completed });

      results.push(result);
    }
  }

  res.send({ errors, results });
}
