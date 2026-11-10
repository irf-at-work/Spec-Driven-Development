import { bootstrapApplication } from '@angular/platform-browser';
import { provideApiConfiguration } from './app/api/generated/api-configuration';
import { appConfig } from './app/app.config';
import { App } from './app/app';

interface RuntimeConfig {
  apiBaseUrl: string;
}

function isRuntimeConfig(value: unknown): value is RuntimeConfig {
  if (typeof value !== 'object' || value === null || !('apiBaseUrl' in value)) {
    return false;
  }

  const apiBaseUrl = value.apiBaseUrl;
  if (typeof apiBaseUrl !== 'string' || apiBaseUrl.trim().length === 0) {
    return false;
  }

  if (apiBaseUrl.startsWith('/') && !apiBaseUrl.startsWith('//')) {
    return true;
  }

  try {
    const url = new URL(apiBaseUrl);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch {
    return false;
  }
}

async function startApplication(): Promise<void> {
  const response = await fetch(new URL('app-config.json', document.baseURI), {
    cache: 'no-store',
  });
  if (!response.ok) {
    throw new Error(`Could not load app-config.json (HTTP ${response.status}).`);
  }

  const config: unknown = await response.json();
  if (!isRuntimeConfig(config)) {
    throw new Error('app-config.json must contain a valid apiBaseUrl.');
  }

  const apiBaseUrl = config.apiBaseUrl.trim().replace(/\/+$/, '');
  await bootstrapApplication(App, {
    ...appConfig,
    providers: [...appConfig.providers, provideApiConfiguration(apiBaseUrl)],
  });
}

void startApplication().catch((error: unknown) => {
  console.error('Application startup failed.', error);
  const appRoot = document.querySelector('app-root');
  if (appRoot) {
    appRoot.textContent = 'Application configuration could not be loaded. Please contact support.';
  }
});
