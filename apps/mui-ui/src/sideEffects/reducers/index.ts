import { combineReducers } from 'redux';
import { GuiState, guiReducer } from './gui.reducer';
import { AppState, appReducer } from './app.reducer';
import { userReducer } from './user.reducer';
import { User } from '../../types/user.types';

export interface RootState {
  user: User;
  gui: GuiState;
  app: AppState;
}

export const rootReducer = combineReducers({
  user: userReducer,
  gui: guiReducer,
  app: appReducer,
});
