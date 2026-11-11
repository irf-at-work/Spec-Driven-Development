import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app';
import { API_BASE_URL } from './app/generated/api-client';
import { ApplicationConfig, isDevMode } from '@angular/core';

interface RuntimeConfig {
  apiBaseUrl: string;
}

async function loadJson<T>(url: string, required: boolean): Promise<Partial<T>> {
  const response = await fetch(url);
  if (!response.ok) {
    if (required) throw new Error(`Could not load ${url}`);
    return {};
  }
  return (await response.json()) as Partial<T>;
}

// Works like appsettings.json + appsettings.Development.json in the API:
// runtime-config.json is always loaded, and in a development build
// runtime-config.development.json is layered on top of it (its values win).
// The development file is optional and is left out of production builds (see angular.json).
async function loadRuntimeConfig(): Promise<RuntimeConfig> {
  const base = await loadJson<RuntimeConfig>('/runtime-config.json', true);
  const overrides = isDevMode()
    ? await loadJson<RuntimeConfig>('/runtime-config.development.json', false)
    : {};
  return { ...base, ...overrides } as RuntimeConfig;
}

loadRuntimeConfig()
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
