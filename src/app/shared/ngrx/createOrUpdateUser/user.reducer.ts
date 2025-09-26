import { createReducer, on } from '@ngrx/store';
import {
  createUser,
  updateUser,
  userRespFailure,
  userRespSuccess,
  resetUserState,
} from './user.actions';

export interface User {
  id: string;
  email: string;
  username: string;
  jobRole: string;
}

export interface CreateOrUpdateUserState {
  user: User | null;
  loading: boolean;
  error: string | null;
}

export const initialState: CreateOrUpdateUserState = {
  user: null,
  loading: false,
  error: null,
};

export const createOrUpdateReducer = createReducer(
  initialState,
  on(createUser, updateUser, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),
  on(userRespSuccess, (state, { user }) => ({
    ...state,
    user,
    loading: false,
    error: null,
  })),
  on(userRespFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),
  on(resetUserState, () => initialState)
);
