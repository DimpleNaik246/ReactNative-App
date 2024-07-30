import todoReducer from "./Reducer";
import UserReducer from "./UserReducer";
import {combineReducers, createStore} from 'redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {persistStore, persistReducer} from 'redux-persist';

const persistConfig = {
    key : 'root',
    storage: AsyncStorage
}


const rootReducer = combineReducers({
    user: UserReducer,
    todos: todoReducer
})

export const persistedReducer = persistReducer(persistConfig, rootReducer);


// const store = createStore(rootReducer);
const store = createStore(persistedReducer);
export const persistor = persistStore(store);

export default store;