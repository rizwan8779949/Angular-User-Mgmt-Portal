import { createSelector, createFeatureSelector } from '@ngrx/store';
import { UserMgmtState } from './user-mgmt.reducer';

export const selectUserMgmt = createFeatureSelector<UserMgmtState>('userMgmt');

export const userMgmtLoading = createSelector(
  selectUserMgmt,
  (state) => state.loading
);

export const userMgmtError = createSelector(
  selectUserMgmt,
  (state) => state.error
);

export const userMgmtSelector = createSelector(
  selectUserMgmt,
  (state) => state.user
);
