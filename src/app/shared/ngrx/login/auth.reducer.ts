import { createReducer, on } from '@ngrx/store';
import { login, loginSuccess, loginFailure, logout } from './auth.actions';

export interface AuthState {
  loginResonse: LoginRespose | null;
  loading: boolean;
  error: string | null;
}

export const initialState: AuthState = {
  loginResonse: null,
  loading: false,
  error: null,
};

export const loginReducer = createReducer(
  initialState,
  on(login, (state) => ({ ...state, loading: true, error: null,user:null })),
  on(loginSuccess, (state, { loginResonse }) => ({
    ...state,
    loading: false,
    loginResonse,
    error: null,
  })),
  on(loginFailure, (state, { error }) => ({
    ...state,
    loading: false,
    loginResonse:null,
    error,
  })),
  on(logout, () => ({
    ...initialState,
  }))

);

export interface LoginRespose{
  data:{
    id:number,
    username:string
  },
  token:string
}
