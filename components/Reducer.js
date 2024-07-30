import { ADD_TODO, TOGGLE_TODO, DELETE_TODO } from "./Action";
import {persistReducer} from 'redux-persist;'

const initialState = {
    todos: [
        { id: 1, text: 'Sample', completed: false }
    ],
};

const todoReducer = (state = initialState, action) => {
    switch (action.type) {
        case ADD_TODO:
            return {
                ...state,
                todos: [
                    ...state.todos,
                    { id: Date.now(), text: action.payload.text, completed: false }
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

        default:
            return state;
    }
};


export default todoReducer;
