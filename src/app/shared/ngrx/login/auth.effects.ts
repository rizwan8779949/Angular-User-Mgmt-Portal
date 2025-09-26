import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { login, loginSuccess, loginFailure,  } from './auth.actions';
import { catchError, map, switchMap } from 'rxjs/operators';
import { of } from 'rxjs';
import { ApiService } from '../../services/api/api-service';
import { LoginRespose } from './auth.reducer';

@Injectable()
export class AuthEffects {
  private actions$ = inject(Actions);
  private api = inject(ApiService);
  login$ = createEffect(() =>
    this.actions$.pipe(
      ofType(login),
      switchMap(({ username, password }) =>
        this.api.commonPostMethod('login',{username:username,password:password} ).pipe(
          map((loginResonse: LoginRespose) => loginSuccess({ loginResonse })),
          catchError((error) => of(loginFailure({ error: error.message || 'Login failed' })))
        )
      )
    )
  );
}
