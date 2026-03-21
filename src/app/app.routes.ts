import { Routes } from '@angular/router';
import { ConsoleComponent } from './console/console.component';
import { Landing } from './landing-page/landing-page.component';
import { environment } from '../environments/environment';
import { Countdown } from './countdown-page/countdown-page.component';

export const routes: Routes = [
  { path: '', component: Landing },
  {
    path: 'console',
    component: environment.IS_DEVELOPMENT === 'true' ? ConsoleComponent : Countdown,
  },
];
