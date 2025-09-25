import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { mergeMap, map, catchError, of, switchMap } from 'rxjs';
import { ApiService } from '../../services/api/api-service';
import { userMgmtInitial, userMgmtRespFailure, userMgmtRespSuccess } from './user-mgmt.actions';

@Injectable()
export class UserMgmtEffects {
  private actions$ = inject(Actions);
  private api = inject(ApiService);

  getAllUser$ = createEffect(() =>
    this.actions$.pipe(
      ofType(userMgmtInitial),
      switchMap((action) => {
        return this.api.commonGetMethod('allUsers', {}).pipe(
          map((response) => userMgmtRespSuccess({ user: response?.data })),
          catchError((error) =>
            of(userMgmtRespFailure({ error: error?.error?.Message || 'Please try again..!' }))
          )
        );
      })
    )
  );
}
