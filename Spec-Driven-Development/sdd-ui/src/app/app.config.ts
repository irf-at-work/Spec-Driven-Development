import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter, withRouterConfig } from '@angular/router';
import { API_BASE_URL_VALUE } from './core/app-config';
import { apiErrorInterceptor } from './core/interceptors/api-error.interceptor';
import { API_BASE_URL } from './generated/api-client';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    // "eager" records the chosen make in the browser history straight away, so the Open page can read it
    // when it starts, and again after a page refresh.
    provideRouter(routes, withRouterConfig({ urlUpdateStrategy: 'eager' })),
    provideHttpClient(withInterceptors([apiErrorInterceptor])),
    { provide: API_BASE_URL, useValue: API_BASE_URL_VALUE },
  ],
};
