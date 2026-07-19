import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter, withPreloading, PreloadAllModules, withHashLocation, RouteReuseStrategy } from '@angular/router';
import { provideIonicAngular, IonicRouteStrategy } from '@ionic/angular/standalone';

import { routes } from './app/app.routes';
import { AppComponent } from './app/app.component';

bootstrapApplication(AppComponent, {
  providers: [
    provideIonicAngular(),
    provideRouter(routes, withPreloading(PreloadAllModules), withHashLocation()),
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
  ],
});