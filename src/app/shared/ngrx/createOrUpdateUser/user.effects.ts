import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { mergeMap, map, catchError, of } from 'rxjs';
import {  userRespFailure, userRespSuccess } from './user.actions';
import { ApiService } from '../../services/api/api-service';

@Injectable()
export class CreateOrUpdateUserEffects {
  private actions$ = inject(Actions);
  private api = inject(ApiService);

  createOrUpdateUser$ = createEffect(() =>
    this.actions$.pipe(
      mergeMap((action) => {
        const { email, username } = action;

        if (!email || !username) {
          return of(userRespFailure({ error: 'Missing credentials' }));
        }

        return this.api.commonPostMethod(email, username).pipe(
          map((response) =>
            userRespSuccess({ user: response?.Result })
          ),
          catchError((error) =>
            of(userRespFailure({ error: error?.error?.Message || 'User create/update failed' }))
          )
        );
      })
    )
  );
}
