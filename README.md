# Guidemap • KhNUE

This project is a PWA (Progressive Web Application) created as diploma project to KhNUE (Kharkiv) for indoor navigation
Unlike most similar solutions uses QR codes as reference points for positioning instead of radio waves (GPS, WIFI, Bluetooth)

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 10.1.0.

## Demo

[https://guidemap-test.web.app](https://guidemap-test.web.app)

## Development environment

**Official Documentation** -> Getting Started -> [Setup](https://angular.io/guide/setup-local)

Project environment:

- NodeJS - v14.15.1
- NPM - 6.14.11
- Angular CLI - 11.1.4 or above (Run 'npm install -g @angular/cli' after npm and nodejs install)

## Development server

Run `npm install` to install all dependencies

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Build

You should be changed an environment property in environment.ts (environments.prod.ts if it's production build) as bellow

```ts
export const environment = {
  url: "<URL where application will be hosted>",
};
```

Run `npm install` if dependencies are not installed or are out of date

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.
