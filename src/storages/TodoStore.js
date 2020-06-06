const store = require('store');
const todoStore = {
  key: 'nutab_todos',
};

todoStore.loadTodos = () => {
  return store.get(todoStore.key, { todos: {}, order: [] });
};

todoStore.saveTodos = (todos) => {
  store.set(todoStore.key, todos);
};

export default todoStore;
