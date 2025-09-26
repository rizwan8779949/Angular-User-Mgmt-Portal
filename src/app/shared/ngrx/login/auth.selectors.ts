import { createSelector, createFeatureSelector } from '@ngrx/store';
import { AuthState } from './auth.reducer';

export const selectAuth = createFeatureSelector<AuthState>('login');

export const isLoading = createSelector(
  selectAuth,
  (state) => state.loading
);

export const selectError  = createSelector(
  selectAuth,
  (state) => state.error
);

export const selectLoginResponse  = createSelector(
  selectAuth,
  (state) => state.loginResonse
);
