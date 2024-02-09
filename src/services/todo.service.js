import { DataTypes, Op } from 'sequelize';
import { sequelize } from './db.js';

export const Todo = sequelize.define('Todo', {
  // Model attributes are defined here
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  completed: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
}, {
  tableName: 'todos',
  updatedAt: false,
});

export const normalize = ({ id, title, completed }) => {
  return { id, title, completed };
};

export const getAll = async () => {
  const todos = await Todo.findAll({
    order: [['title', 'ASC']],
  });

  return todos;
};

export const getById = async (id) => {
  return Todo.findByPk(id);
};

export const create = (title) => {
  return Todo.create({ title });
};

export const update = async ({ id, title, completed }) => {
  await Todo.update({ title, completed }, { where: { id } });
};

export const remove = async (id) => {
  await Todo.destroy({
    where: {
      id,
    },
  });
};

const isUuid = (id) => {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  return uuidRegex.test(id);
};

export const removeMany = async (ids) => {
  await Todo.destroy({
    where: {
      id: {
        [Op.in]: ids,
      },
    },
  });
};

export const updateMany = async (todos) => {
  // Managed transaction
  const t = await sequelize.transaction();
  //
  // return  await sequelize.transaction(async (t) => {
  //   for (const { id, title, completed } of todos) {
  //     await Todo.update({ title, completed }, { where: { id }, transaction: t });
  //   }
  // });

  // Unmanaged transaction
  try {
    for (const { id, title, completed } of todos) {
      await Todo.update({ title, completed }, { where: { id }, transaction: t });
    }

    await t.commit();
  } catch (e) {
    await t.rollback();
  }
};
