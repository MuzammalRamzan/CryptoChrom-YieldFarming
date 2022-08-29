import { createStore } from 'redux';
import homeReducer from "./reducers/home";

export default createStore(homeReducer);