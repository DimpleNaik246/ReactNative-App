export const ADD_TODO = 'ADD_TODO';
export const TOGGLE_TODO = 'TOGGLE_TODO';
export const DELETE_TODO = 'DELETE_TODO';
export const SET_TODOS = 'SET_TODOS';
export const UPDATE_TODO = 'UPDATE_TODO';

export const addTodo = (id, text) => ({
    type: ADD_TODO,
    payload: { id, text },
});

export const toggleTodo = (id) => ({
    type: TOGGLE_TODO,
    payload: { id },
});

export const deleteTodo = (id) => ({
    type: DELETE_TODO,
    payload: { id },
});

export const setTodos = (todos) => ({
    type: SET_TODOS,
    payload: todos,
});

export const updateTodo = (id, text) => ({
    type: UPDATE_TODO,
    payload: { id, text },
});