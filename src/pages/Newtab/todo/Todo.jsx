import React, { useState, useEffect, useRef } from 'react';
import dragula from 'react-dragula';
import classnames from 'classnames';
import TodoItem from './TodoItem';
import { Toptips } from 'react-weui';
import TodoFactory from './TodoFactory';
import { loadTodos, saveTodos, saveOrder, saveFilter, loadFilter } from '../../../storages/TodoStore';
import TodoConfig from './TodoConfig';
import useVisible from '../../../hooks/useVisible';
import Confirm from '../../../components/Confirm';

const FILTER = {
  all: 'all',
  active: 'active',
  completed: 'completed',
};

const INIT_TOGGLE = {
  slideActive: true,
  toptipActive: false,
};

const INIT_CONTROL = {
  filter: FILTER.active,
  countActive: 0,
};

const Todo = () => {
  const [todos, setTodos] = useState({});
  const [order, setOrder] = useState({ all: [], active: [] });
  const [newTodo, setNewTodo] = useState('');
  const [toggle, setToggle] = useState(INIT_TOGGLE);
  const [control, setControl] = useState(INIT_CONTROL);
  const { visible, show, hide } = useVisible(false);

  const newTodoRef = useRef(null);
  const todosRef = useRef(null);

  const __countTodos = (updatedList) => {
    const allKeys = Object.keys(updatedList);

    return {
      countAll: allKeys.length,
      countActive: allKeys.filter((key) => !updatedList[key].completed).length,
    };
  };

  const toggleToptip = () => {
    setToggle({ ...toggle, toptipActive: true });
    setTimeout(() => {
      setToggle({ ...toggle, toptipActive: false });
    }, 3000);
  };

  const handleChangeNewTodoInput = (event) => {
    const inputValue = event.target.value;
    setNewTodo(inputValue.trimLeft());
  };

  const __saveTodosInStateAndStore = (updatedList, updatedOrder) => {
    const { countAll, countActive } = __countTodos(updatedList);
    setControl({ ...control, countAll, countActive });
    setTodos(updatedList);
    setOrder(updatedOrder);

    saveTodos(updatedList, updatedOrder);
  };

  const handlePressKeyInputField = (e) => {
    if (e.key !== 'Enter') {
      return null;
    }

    if (newTodo.length === 0) {
      return null;
    }

    setNewTodo('');
    setToggle({ ...toggle, slideActive: true });

    const newObject = TodoFactory.create(newTodo);
    const updatedList = { [newObject.id]: newObject, ...todos };
    const updatedOrder = {
      ...order,
      all: [newObject.id, ...order.all],
      active: [newObject.id, ...order.active],
    };

    __saveTodosInStateAndStore(updatedList, updatedOrder);
  };

  const handleDeleteAllCompleted = () => {
    const updatedTodos = { ...todos };
    let updatedOrderAll = [...order.all];
    let updatedOrderActive = [...order.active];

    Object.keys(updatedTodos).forEach((key) => {
      if (updatedTodos[key].completed) {
        delete updatedTodos[key];

        updatedOrderAll = updatedOrderAll.filter((id) => {
          return id !== parseInt(key);
        });
        updatedOrderActive = updatedOrderActive.filter((id) => {
          return id !== parseInt(key);
        });
      }
    });

    const updatedOrder = {
      ...order,
      all: updatedOrderAll,
      active: updatedOrderActive,
    };

    __saveTodosInStateAndStore(updatedTodos, updatedOrder);
  };

  const callbackUpdateTodo = (newTodo) => {
    const updatedList = { ...todos };
    const updatedOrderAll = [...order.all];
    const updatedOrderActive = [...order.active];
    // if completed chagned
    if (newTodo.completed !== updatedList[newTodo.id].completed) {
      if (newTodo.completed) {
        updatedOrderActive.forEach((item, index, object) => {
          if (item === parseInt(newTodo.id)) {
            object.splice(index, 1);
          }
        });
      } else {
        updatedOrderActive.unshift(newTodo.id);
      }
    }

    updatedList[newTodo.id] = newTodo;

    __saveTodosInStateAndStore(updatedList, {
      ...order,
      all: updatedOrderAll,
      active: updatedOrderActive,
    });
  };

  const callbackDeleteTodo = (todo) => {
    const updatedList = { ...todos };
    delete updatedList[todo.id];

    const updatedOrderAll = [...order.all];
    const updatedOrderActive = [...order.active];
    updatedOrderActive.forEach((item, index, object) => {
      if (item === todo.id) {
        object.splice(index, 1);
      }
    });
    updatedOrderAll.forEach((item, index, object) => {
      if (item === todo.id) {
        object.splice(index, 1);
      }
    });

    __saveTodosInStateAndStore(updatedList, {
      ...order,
      all: updatedOrderAll,
      active: updatedOrderActive,
    });
  };

  const getOrderedIdsByFilter = () => {
    if (!order) {
      return [];
    }
    let keys = Object.keys(todos);
    if (keys.length === 0) {
      return [];
    }

    if (control.filter === 'active') {
      return order.all.filter((id) => !todos[id].completed);
    }

    return order.all;
  };

  const filteredOrder = getOrderedIdsByFilter();

  useEffect(() => {
    newTodoRef.current.focus();
  }, []);

  useEffect(() => {
    const { todos, order } = loadTodos();
    const { countActive } = __countTodos(todos);
    setTodos(todos);
    setOrder(order);
    setControl({
      ...control,
      countAll: Object.keys(todos).length,
      countActive,
      filter: loadFilter(),
    });
  }, []);

  useEffect(() => {
    if (Object.keys(todos).length > 0) {
      dragula([todosRef.current]).on('drop', (el, target, source) => {
        const currentFilter = target.getAttribute('data-filter');
        const orderByFilter = Array.from(todosRef.current.children).map((child) => parseInt(child.id));
        saveOrder(orderByFilter, currentFilter);
        setOrder({
          ...order,
          [currentFilter]: orderByFilter,
        });
      });
    }
  }, [todos]);

  useEffect(() => {
    saveFilter(control.filter);
  }, [control]);

  return (
    <>
      <Confirm
        visible={visible}
        hide={hide}
        message={'Do you want to remove ALL completed todos?'}
        confirmCallback={handleDeleteAllCompleted}
      />
      <div className="todoapp">
        <Toptips show={toggle.toptipActive} type={'warn'}>
          {`Fokusieren max. nur ${TodoConfig.starredLimit}x wichtigste Aufgabe !!! Get them Done !!!`}
        </Toptips>
        <header className="header">
          <span className={'icon-plus1'} />
          <input
            ref={newTodoRef}
            autoFocus={true}
            type="text"
            placeholder={'Add a new todo ...'}
            value={newTodo}
            onChange={handleChangeNewTodoInput}
            onKeyPress={handlePressKeyInputField}
            className="new-todo"
          />
        </header>
        <main className="main">
          <ul className="todo-list" ref={todosRef} data-filter={control.filter}>
            {filteredOrder.map((key) => (
              <TodoItem
                key={todos[key].id}
                item={todos[key]}
                updateTodoCallback={(todo) => callbackUpdateTodo(todo)}
                deleteTodoCallback={(todo) => callbackDeleteTodo(todo)}
                numberStarred={filteredOrder.length}
              />
            ))}
          </ul>
        </main>
        <footer className={classnames('footer', { shadow: true })}>
          <div className="filter-container">
            <ul className={'filters'}></ul>
            <ul className={'filters'}>
              <li>
                <a
                  className={control.filter === FILTER.all ? 'selected' : undefined}
                  href={'#/' + FILTER.all}
                  onClick={() => setControl({ ...control, filter: FILTER.all })}
                >
                  All ({control.countAll || 0})
                </a>
              </li>

              <li>
                <a
                  className={control.filter === FILTER.active ? 'selected' : undefined}
                  href={'#/' + FILTER.active}
                  onClick={() => setControl({ ...control, filter: FILTER.active })}
                >
                  Active ({control.countActive || 0})
                </a>
              </li>
              <li></li>
            </ul>
            <ul className={'filters'}>
              <li>
                <a href="#/clean-all-completed" onClick={show}>
                  Clean all completed
                </a>
              </li>
            </ul>
          </div>
        </footer>
      </div>
    </>
  );
};

export default Todo;
