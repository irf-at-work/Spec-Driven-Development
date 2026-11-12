import { bootstrapApplication } from '@angular/platform-browser';
import { provideApiConfiguration } from './app/api/generated/api-configuration';
import { appConfig } from './app/app.config';
import { App } from './app/app';
import { environment } from './environments/environment';

void bootstrapApplication(App, {
  ...appConfig,
  providers: [...appConfig.providers, provideApiConfiguration(environment.apiBaseUrl)],
});
