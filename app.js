const express = require('express');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');

const app = express();
const port = process.env.PORT || 3001;

let todos = [
  { id: '1', title: 'wtf', completed: false },
  { id: '2', title: 'again?', completed: false },
  { id: '3', title: 'bleat', completed: true },
];

app.use(cors());

app.patch('/todos', express.json(), (req, res) => {
  const { action } = req.query;
  const { ids, items } = req.body;

  if (action === 'delete') {
    if (!Array.isArray(ids)) {
      res.sendStatus(422);
      return;
    }

    const updatedTodos = todos.filter(todo => !ids.includes(todo.id));

    todos = updatedTodos;

    res.sendStatus(204);
    return;
  }

  if (action === 'update') {
    if (!Array.isArray(items)) {
      res.sendStatus(422);
      return;
    }

    for (const { id, title, completed } of items) {
      const todo = todos.find(todo => todo.id === id);

      if (!todo) {
        continue;
      }

      Object.assign(todo, { title, completed });
    }

    res.sendStatus(204);
    return;
  }

  res.sendStatus(422);
});

app.get('/todos', (req, res) => {
  res.send(todos);
});

app.get('/todos/:id', (req, res) => {
  const { id } = req.params;

  const todo = todos.find(item => {
    return item.id === id;
  });

  if (!todo) {
    res.sendStatus(404);
    return;
  }

  res.send(todo);
});

app.put('/todos/:id', express.json(), (req, res) => {
  const { id } = req.params;
  const { title, completed } = req.body;

  const todo = todos.find(todo => todo.id === id);

  if (!todo) {
    res.sendStatus(404);
    return;
  }

  if (typeof title !== 'string' || typeof completed !== 'boolean') {
    res.sendStatus(422);
    return;
  }

  Object.assign(todo, { title, completed });

  res.send(todo);
});

app.patch('/todos/:id', (req, res) => {
  const { id } = req.params;
  const todo = todos.find(todo => todo.id === id);

  res.send(todo);
});

app.post('/todos/', express.json(), (req, res) => {
  const { title } = req.body;

  if (!title) {
    res.sendStatus(422);
    return;
  }

  const todo = {
    id: uuidv4(),
    completed: false,
    title,
  };

  todos.push(todo);

  res.statusCode = 201;
  res.send(todo);
});

app.delete('/todos/:id', (req, res) => {
  const { id } = req.params;

  const newTodos = todos.filter(todo => todo.id !== id);

  if (newTodos.length === todos.length) {
    res.sendStatus(404);
    return;
  }

  todos = newTodos;

  res.sendStatus(204);
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
