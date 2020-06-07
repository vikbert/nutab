const store = require('store');
const todoStore = {
  key: 'nutab_todos',
};

export const loadTodos = () => {
  // order: array of IDs, which are referenced to the ordered active todos
  return store.get(todoStore.key, { todos: {}, order: { all: [], active: [] } });
};

export const saveTodos = (todos, order) => {
  store.set(todoStore.key, { todos: todos, order: order });
};

export const saveOrder = (orderByFilter, filter) => {
  const { todos, order } = loadTodos();
  const updatedOrder = {
    ...order,
    [filter]: orderByFilter,
  };
  saveTodos(todos, updatedOrder);
};

export default todoStore;
