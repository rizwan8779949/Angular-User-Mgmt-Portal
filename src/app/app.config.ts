import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
  provideZoneChangeDetection,
} from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideHttpClient } from '@angular/common/http';
import { provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { createOrUpdateReducer } from './shared/ngrx/createOrUpdateUser/user.reducer';
import { CreateOrUpdateUserEffects } from './shared/ngrx/createOrUpdateUser/user.effects';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { userMgmtReducer } from './shared/ngrx/allUserMgmt/user-mgmt.reducer';
import { UserMgmtEffects } from './shared/ngrx/allUserMgmt/user-mgmt.effects';
import { loginReducer } from './shared/ngrx/login/auth.reducer';
import { AuthEffects } from './shared/ngrx/login/auth.effects';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideStore({
      userMgmt: userMgmtReducer,
      createOrUpdateUser: createOrUpdateReducer,
      login: loginReducer,
    }),
    provideEffects([UserMgmtEffects, CreateOrUpdateUserEffects,AuthEffects]),
    provideStoreDevtools({ maxAge: 25 }),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(),
  ],
};
