import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app';
import { API_BASE_URL } from './app/generated/api-client';
import { ApplicationConfig } from '@angular/core';

interface RuntimeConfig {
  apiBaseUrl: string;
}

fetch('/runtime-config.json')
  .then((response) => {
    if (!response.ok) throw new Error('Could not load /runtime-config.json');
    return response.json() as Promise<RuntimeConfig>;
  })
  .then((runtimeConfig) => {
    if (typeof runtimeConfig.apiBaseUrl !== 'string') {
      throw new Error('runtime-config.json must define apiBaseUrl as a string');
    }

    const runtimeAppConfig: ApplicationConfig = {
      ...appConfig,
      providers: [
        ...appConfig.providers,
        { provide: API_BASE_URL, useValue: runtimeConfig.apiBaseUrl },
      ],
    };

    return bootstrapApplication(App, runtimeAppConfig);
  })
  .catch((err) => console.error(err));
