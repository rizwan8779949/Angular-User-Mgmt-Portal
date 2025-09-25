import { createReducer, on } from '@ngrx/store'
import {  userRespFailure, userRespSuccess } from './user.actions';

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
  on(userRespSuccess, (state, { user }) => ({
    ...state,
    loading: false,
    user,
    error: null,
  })),
  on(userRespFailure, (state, { error }) => ({
    ...state,
    loading: false,
    user:null,
    error,
  }))
);

export interface User{
  id: string;
  email: string;
  username: string;
  jobRole: string;
}
