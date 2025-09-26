import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, mergeMap, of } from 'rxjs';
import {
  createUser,
  updateUser,
  userRespFailure,
  userRespSuccess,
} from './user.actions';
import { ApiService } from '../../services/api/api-service';

@Injectable()
export class CreateOrUpdateUserEffects {
  private actions$ = inject(Actions);
  private api = inject(ApiService);

  createUser$ = createEffect(() =>
    this.actions$.pipe(
      ofType(createUser),
      mergeMap(({ payload }) =>
        this.api.commonPostMethod('createUser', payload).pipe(
          map((response) => userRespSuccess({ user: response?.data })),
          catchError((error) =>
            of(userRespFailure({ error: error?.error?.Message || 'Create user failed' }))
          )
        )
      )
    )
  );

  updateUser$ = createEffect(() =>
    this.actions$.pipe(
      ofType(updateUser),
      mergeMap(({ id, payload }) =>
        this.api.commonPatchMethod(`updateUser/${id}`, payload).pipe(
          map((response) => userRespSuccess({ user: response?.data })),
          catchError((error) =>
            of(userRespFailure({ error: error?.error?.Message || 'Update user failed' }))
          )
        )
      )
    )
  );
}
