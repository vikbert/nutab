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

export const loadFilter = () => {
  return store.get('nutab_todo_filter', 'all');
};

export const saveFilter = (filter) => {
  store.set('nutab_todo_filter', filter);
};

export default todoStore;
