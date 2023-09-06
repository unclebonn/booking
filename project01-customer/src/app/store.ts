import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import loginReducer from "../pages/login/loginSlice";
import menuReducer from "../component/header/headerSlice";

export const store = configureStore({
  reducer: {
    login: loginReducer,
    menu: menuReducer,
  }
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
