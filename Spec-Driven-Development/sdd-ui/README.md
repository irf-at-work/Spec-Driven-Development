# SddUi

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 22.2.3.

## API and deployment configuration

The UI loads `public/app-config.json` at startup. Set `apiBaseUrl` to the API base URL before deploying:

```json
{
  "apiBaseUrl": "/api"
}
```

Use `/api` when the UI and API are exposed on the same origin (for example, through a reverse proxy), or provide the full API base URL such as `https://api.example.com/api` when they are hosted separately. The file is copied into the built assets, so it can be changed for each deployment without rebuilding the UI. The UI displays a startup error if the file is missing or invalid.

When hosting the UI and API on different origins, configure the UI origin in the API's `Cors:AllowedOrigins` setting. For local development, `appsettings.Development.json` allows `http://localhost:4200`. The development server proxies `/api` to the local API; update `proxy.conf.json` only if the local API address changes.

## Development server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running unit tests

To execute unit tests with the [Vitest](https://vitest.dev/) test runner, use the following command:

```bash
ng test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
