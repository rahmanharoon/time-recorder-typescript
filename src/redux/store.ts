import thunk from "redux-thunk";
import recorderReducer from "./recorder";
import userEventsReducer from "./user-events";
import { applyMiddleware, combineReducers, createStore } from "redux";

const rootReducer = combineReducers({
  userEvents: userEventsReducer,
  recorder: recorderReducer,
});

export type RootState = ReturnType<typeof rootReducer>;

const store = createStore(rootReducer, applyMiddleware(thunk));

export default store;
