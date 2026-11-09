import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter, withHashLocation, withRouterConfig } from '@angular/router';
import { apiErrorInterceptor } from './core/interceptors/api-error.interceptor';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    // "eager" records the chosen make in the browser history straight away, so the Open page can read it
    // when it starts, and again after a page refresh.
    provideRouter(routes, withHashLocation(), withRouterConfig({ urlUpdateStrategy: 'eager' })),
    provideHttpClient(withInterceptors([apiErrorInterceptor])),
  ],
};
