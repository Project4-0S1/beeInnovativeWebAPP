# BeeInnovativeWebApp

Web APP: https://beeinnovative.netlify.app/
<br>
API: https://beeinnovative.azurewebsites.net/api/

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 18.1.0.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via a platform of your choice. To use this command, you need to first add a package that implements end-to-end testing capabilities.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.


# Branching Strategy for Web App and API Development

## Overview
We will adopt a feature-based branching strategy to streamline the development of our web app and API. This ensures organized collaboration, efficient testing, and easy integration.

## Main Branches
- **main**: The stable branch containing production-ready code. Only thoroughly tested changes are merged here.
- **develop**: The integration branch for ongoing development. All feature branches are merged here after review.

## Feature Branch Workflow
1. **Branch Naming**: Use clear and consistent names, e.g., `<initials>-<short-description>`.
2. **Creation**: Branch from `develop` for each new feature.
3. **Development**: Implement the feature in isolation.
4. **Testing**: Ensure thorough testing within the feature branch.
5. **Merging**: Create a pull request to merge the feature branch into `develop`.

## Merging Guidelines

### Feature to Develop
- Open a Pull Request when the feature is complete.
- Ensure all tests pass and the code is reviewed.
- Merge with a **squash commit** to keep history clean.

### Develop to Main
- Merge into `main` only after rigorous testing on `develop`.
- Use a **merge commit** to retain the context of changes.
- Tag releases for versioning.

### Conflict Resolution
- Resolve conflicts locally before pushing to the branch.
- Always ensure the branch is up-to-date with its base before merging.

