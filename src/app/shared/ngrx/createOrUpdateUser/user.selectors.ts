import { createFeatureSelector, createSelector } from '@ngrx/store';
import { CreateOrUpdateUserState } from './user.reducer';

export const selectCreateOrUpdateUser = createFeatureSelector<CreateOrUpdateUserState>('createOrUpdateUser');

export const isLoading = createSelector(
  selectCreateOrUpdateUser,
  (state) => state.loading
);

export const Error = createSelector(
  selectCreateOrUpdateUser,
  (state) => state.error
);

export const userRespSelector = createSelector(
  selectCreateOrUpdateUser,
  (state) => state.user
);
