import React, {useState, useEffect, useRef} from 'react';
import classnames from 'classnames';
import TodoItem from "./TodoItem";
import {Toptips} from 'react-weui';
import TodoFactory from "./TodoFactory";
import todoStore from "../../../storages/TodoStore";
import TodoConfig from "./TodoConfig";
import useVisible from "../../../hooks/useVisible";
import Confirm from "../../../components/Confirm";

const FILTER = {
    all: 'all',
    active: 'active',
    completed: 'completed',
};

const INIT_TOGGLE = {
    searchActive: false,
    slideActive: true,
    toptipActive: false,
};

const INIT_CONTROL = {
    filter: FILTER.active,
    countActive: 0,
};

const Todo = () => {
    const [todos, setTodos] = useState({});
    const [newTodo, setNewTodo] = useState('');
    const [toggle, setToggle] = useState(INIT_TOGGLE);
    const [control, setControl] = useState(INIT_CONTROL);
    const {visible, show, hide} = useVisible(false);

    const newTodoRef = useRef(null);

    const __countTodos = (updatedList) => {
        const allKeys = Object.keys(updatedList);

        return {
            countAll: allKeys.length,
            countActive: allKeys.filter((key) => !updatedList[key].completed).length,
        };
    };

    const __saveTodosInStateAndStore = (updatedList) => {
        const {countAll, countActive} = __countTodos(updatedList);
        setControl({...control, countAll, countActive});
        setTodos(updatedList);

        todoStore.saveTodos(updatedList);
    };

    const toggleSearchMode = () => {
        setToggle({...toggle, searchActive: !toggle.searchActive});
        setNewTodo('');
    };

    const toggleToptip = () => {
        setToggle({...toggle, toptipActive: true});
        setTimeout(() => {
            setToggle({...toggle, toptipActive: false});
        }, 3000);
    };

    const handleChangeNewTodoInput = (event) => {
        const inputValue = event.target.value;
        setNewTodo(inputValue.trimLeft());
    };

    const handlePressKeyInputField = (e) => {
        if (e.key !== 'Enter' || toggle.searchActive) {
            return null;
        }

        if (newTodo.length === 0) {
            return null;
        }

        setNewTodo('');
        setToggle({...toggle, slideActive: true});

        const newObject = TodoFactory.create(newTodo);
        const updatedList = {[newObject.id]: newObject, ...todos};

        __saveTodosInStateAndStore(updatedList);
    };

    const handleClickDeleteCompleted = () => {
        setControl({...control, filter: FILTER.all});

        const activeTodos = {...todos};
        Object.keys(activeTodos).forEach((key) => {
            if (activeTodos[key].completed) {
                delete activeTodos[key];
            }
        });

        __saveTodosInStateAndStore(activeTodos);
    };

    const callbackUpdateTodo = (todo) => {
        const updatedList = {...todos};
        updatedList[todo.id] = todo;

        __saveTodosInStateAndStore(updatedList);
    };

    const callbackDeleteTodo = (todo) => {
        const updatedList = {...todos};
        delete updatedList[todo.id];

        __saveTodosInStateAndStore(updatedList);
    };

    const filterTodos = () => {
        let keys = Object.keys(todos);
        if (keys.length === 0) {
            return [];
        }

        if (toggle.searchActive && newTodo.length >= 2) {
            keys = keys.filter((key) => todos[key].title.toLowerCase().includes(newTodo.toLowerCase()));
        }

        switch (control.filter) {
            case FILTER.completed:
                return keys.filter((key) => todos[key].completed);
            case FILTER.active:
                return keys.filter((key) => todos[key].completed === false);
            default:
                return keys;
        }
    };

    const starredTodoKeys = filterTodos().filter((key) => todos[key].starred);
    const normalTodoKeys = filterTodos().filter((key) => todos[key].starred === false);

    useEffect(() => {
        newTodoRef.current.focus();
    }, [toggle.searchActive]);

    useEffect(() => {
        const todos = todoStore.loadTodos();
        setTodos(todos);
    }, []);

    return (
        <>
            <Confirm
                visible={visible}
                hide={hide}
                message={'Do you want to remove ALL completed todos?'}
                confirmCallback={handleClickDeleteCompleted}
            />
            <div className="todoapp">
                <Toptips show={toggle.toptipActive} type={'warn'}>
                    Max. 3x starred Todos !!!
                </Toptips>
                <header className="header">
                    <span className={toggle.searchActive ? "icon-search1 icon-search1--header" : "icon-plus1"}/>
                    <input
                        ref={newTodoRef}
                        autoFocus={true}
                        type="text"
                        placeholder={toggle.searchActive ? 'Type for search ...' : 'Add a new todo ...'}
                        value={newTodo}
                        onChange={handleChangeNewTodoInput}
                        onKeyPress={handlePressKeyInputField}
                        className="new-todo"
                    />
                    <span className={toggle.searchActive ? "icon-x" : "icon-search1"} onClick={toggleSearchMode}/>
                </header>
                <main className="main">
                    <ul className="todo-list">
                        {starredTodoKeys.map((key) => (
                            <TodoItem
                                key={todos[key].id}
                                item={todos[key]}
                                updateTodoCallback={(todo) => callbackUpdateTodo(todo)}
                                deleteTodoCallback={(todo) => callbackDeleteTodo(todo)}
                            />
                        ))}
                        <li className={'category category-inbox'}>
                            <label><span className="icon icon-drawer2" style={{paddingLeft: 0}}/></label>
                        </li>
                        {normalTodoKeys.map((key) => (
                            <TodoItem
                                key={todos[key].id}
                                item={todos[key]}
                                updateTodoCallback={(todo) => callbackUpdateTodo(todo)}
                                deleteTodoCallback={(todo) => callbackDeleteTodo(todo)}
                                numberStarred={starredTodoKeys.length}
                                showToptip={() => toggleToptip()}
                            />
                        ))}
                    </ul>
                </main>
                <footer
                    className={classnames("footer", {"shadow": normalTodoKeys.length > TodoConfig.visibleTodosLimit})}>
                    <div className="filter-container">
                        <ul className={'filters'}>
                        </ul>
                        <ul className={'filters'}>
                            <li>
                                <a className={control.filter === FILTER.all ? 'selected' : undefined}
                                   href={"#/" + FILTER.all}
                                   onClick={() => setControl({...control, filter: FILTER.all})}
                                >
                                    All ({control.countAll || 0})
                                </a>
                            </li>

                            <li>
                                <a className={control.filter === FILTER.active ? 'selected' : undefined}
                                   href={"#/" + FILTER.active}
                                   onClick={() => setControl({...control, filter: FILTER.active})}
                                >
                                    Active ({control.countActive || 0})
                                </a>
                            </li>
                            <li>
                                <a className={control.filter === FILTER.completed ? 'selected' : undefined}
                                   href={"#/" + FILTER.completed}
                                   onClick={() => setControl({...control, filter: FILTER.completed})}
                                >
                                    Completed ({control.countAll - control.countActive || 0})
                                </a>
                            </li>
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
