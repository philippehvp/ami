import { Route } from '@angular/router';

import { UnavailableComponent } from './components/unavailable/unavailable.component';
import { Umpire } from './components/umpire/umpire';

export const appRoutes: Route[] = [
  {
    path: 'umpire',
    component: Umpire,
  },
  {
    path: 'unavailable',
    component: UnavailableComponent,
  },
  {
    path: '**',
    component: Umpire,
  },
];
