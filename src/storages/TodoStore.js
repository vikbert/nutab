const store = require('store');
const todoStore = {
  key: 'nutab_todos',
};

todoStore.loadTodos = () => {
  // order: array of IDs, which are referenced to the ordered active todos
  return store.get(todoStore.key, { todos: {}, order: [] });
};

todoStore.saveTodos = (todos, order = []) => {
  store.set(todoStore.key, { todos: todos, order: order });
};

export default todoStore;
