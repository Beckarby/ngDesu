import { Component, inject } from '@angular/core';
import { ChildrenOutletContexts } from '@angular/router';
import { trigger, transition, style, query, group, animate } from '@angular/animations';
import { IonApp, IonRouterOutlet } from '@ionic/angular/standalone';

const routeTransition = trigger('routeTransition', [
  transition('* <=> *', [
    style({ position: 'relative' }),
    query(':enter, :leave', [
      style({ position: 'absolute', top: 0, left: 0, width: '100%', opacity: 1 }),
    ], { optional: true }),
    query(':enter', [
      style({ opacity: 0, transform: 'translateY(6px)' }),
    ], { optional: true }),
    group([
      query(':leave', [
        animate('180ms ease-out', style({ opacity: 0, transform: 'translateY(-4px)' })),
      ], { optional: true }),
      query(':enter', [
        animate('280ms ease-out', style({ opacity: 1, transform: 'translateY(0)' })),
      ], { optional: true }),
    ]),
  ]),
]);

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  imports: [IonApp, IonRouterOutlet],
  animations: [routeTransition],
})
export class AppComponent {
  private contexts = inject(ChildrenOutletContexts);

  getRouteAnimation() {
    return this.contexts.getContext('primary')?.route?.snapshot?.data?.['animation'] || 'page';
  }
}
