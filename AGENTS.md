# ngDesu — agent guidance

## Stack

- **Angular 20** (standalone components, no NgModules). `bootstrapApplication` in `src/main.ts`.
- **Ionic 8** — import from `@ionic/angular/standalone` (not `@ionic/angular`).
- **Capacitor 8** (Android). Build output `www/` is both Angular output dir and Capacitor `webDir`.
- **Karma + Jasmine 5** for unit tests (Chrome browser).
- **ESLint** via `@angular-eslint`. No Prettier config found.

## Commands

| Action | Command |
|---|---|
| Dev server | `npm start` (ng serve, dev config) |
| Build | `npm run build` (ng build, **production** by default) |
| Dev build (watch) | `npm run watch` |
| Test (all) | `npm test` (ng test, Karma + Chrome) |
| Lint | `npm run lint` (ng lint, ESLint on `src/**/*.ts` and `src/**/*.html`) |

No CI workflows, no pre-commit hooks.

## Architecture

```
src/
  main.ts                         — bootstrapApplication entry
  app/
    app.routes.ts                 — root routes (loads tabs lazily)
    tabs/tabs.routes.ts           — child routes: home, search, library, profile
    home/home.page.ts
    search/search.page.ts
    library/library.page.ts
    profile/profile.page.ts
    login/login.page.ts
    signup/signup.page.ts
    explore-container/            — shared placeholder component
```

- **All pages are standalone components** with `imports` arrays. Lazily loaded via `loadComponent()` (not `loadChildren`).
- Routes: root redirects to `/tabs/home`. Tabs are defined in `tabs.routes.ts` as children of `TabsPage`.
- Icons registered via `addIcons()` from `ionicons/icons` (see `tabs.page.ts`).
- **No `IonicRouteStrategy`** in `main.ts` — uses Angular's default `RouteReuseStrategy`. Ionic's strategy retains stacked pages and caused stacked `ion-router-outlet` overlays that swallowed all taps. Auth-flow navigations use `NavController.navigateRoot(..., { animated: false })`.
- **`global.scss` fixes outlet pointer events**: `ion-router-outlet { pointer-events: none }` with `ion-router-outlet > * { pointer-events: auto }`. Required so retained/stacked outlet hosts can't block clicks on the active page. Do not remove.

## Conventions

- **SCSS** everywhere (`styleext: "scss"`).
- Component selector prefix: `app`, kebab-case for elements, camelCase for directives.
- Page suffix: `Page` or `Component` — enforced by ESLint.
- **Export naming is inconsistent** — home/search use `homePage`/`searchPage` (camelCase), library uses `LibraryPage` (PascalCase). Check actual export name before importing.
- Environment files in `src/environments/` with production replacement (`environment.prod.ts`).
- Ionic schematic collection: `@ionic/angular-toolkit`. Generate pages/components with `ng g page` / `ng g component`.
