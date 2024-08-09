import { ADD_TODO, TOGGLE_TODO, DELETE_TODO, SET_TODOS, UPDATE_TODO } from "./Action";

const initialState = {
    todos: [],
};

const todoReducer = (state = initialState, action) => {
    switch (action.type) {
        case ADD_TODO:
            return {
                ...state,
                todos: [
                    ...state.todos,
                    { id: action.payload.id, text: action.payload.text, completed: false }
                ],
            };

        case TOGGLE_TODO:
            return {
                ...state,
                todos: state.todos.map(todo =>
                    todo.id === action.payload.id
                        ? { ...todo, completed: !todo.completed }
                        : todo
                ),
            };

        case DELETE_TODO:
            return {
                ...state,
                todos: state.todos.filter(todo => todo.id !== action.payload.id),
            };

        case SET_TODOS:
            return {
                ...state,
                todos: action.payload,
            };

        case UPDATE_TODO:
            return {
                ...state,
                todos: state.todos.map(todo =>
                    todo.id === action.payload.id
                        ? { ...todo, text: action.payload.text }
                        : todo
                ),
            };

        default:
            return state;
    }
};

export default todoReducer;
