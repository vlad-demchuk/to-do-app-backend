import { v4 as uuidv4 } from 'uuid';

export let todos = [
  { id: '1', title: 'NodeJs', completed: false },
  { id: '2', title: 'JS', completed: false },
  { id: '3', title: 'Express', completed: true },
];

export const getAll = () => {
  return todos;
};

export const getById = (id) => {
  return todos.find(item => item.id === id) || null;
};

export const create = (title) => {
  const todo = {
    id: uuidv4(),
    completed: false,
    title,
  };

  todos.push(todo);

  return todo;
};

export const update = ({ id, title, completed }) => {
  const todo = getById(id);

  Object.assign(todo, { title, completed });

  return todo;
};

export const remove = (id) => {
  todos = todos.filter(todo => todo.id !== id);
};

export const removeMany = (ids) => {
  todos = todos.filter(todo => !ids.includes(todo.id));
};

export const updateMany = (todos) => {
  for (const { id, title, completed } of todos) {
    const todo = getById(id);

    if (!todo) {
      continue;
    }

    Object.assign(todo, { title, completed });
  }
}
