import { createReducer, on } from '@ngrx/store'
import { userMgmtRespFailure, userMgmtRespSuccess } from './user-mgmt.actions';
import { User } from '../createOrUpdateUser/user.reducer';

export interface UserMgmtState {
  user: User[] | null;
  loading: boolean;
  error: string | null;
}

export const initialState: UserMgmtState = {
  user: null,
  loading: false,
  error: null,
};

export const userMgmtReducer = createReducer(
  initialState,
  on(userMgmtRespSuccess, (state, { user }) => ({
    ...state,
    loading: false,
    user,
    error: null,
  })),
  on(userMgmtRespFailure, (state, { error }) => ({
    ...state,
    loading: false,
    user:null,
    error,
  }))
);

