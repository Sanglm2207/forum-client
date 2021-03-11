import { combineReducers } from "redux";
import { ThreadCategoriesReducer } from "./categories/Reducer";
import { UserProfileReducer } from "./user/Reducer";

export const rootReducer = combineReducers({
  user: UserProfileReducer,
  categories: ThreadCategoriesReducer,
});

export type AppState = ReturnType<typeof rootReducer>;
