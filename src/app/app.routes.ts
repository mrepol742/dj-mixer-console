import { Routes } from '@angular/router';
import { ConsoleComponent } from './console/console.component';
import { Landing } from './landing-page/landing-page.component';

export const routes: Routes = [
  { path: '', component: Landing },
  {
    path: 'console',
    component: ConsoleComponent,
  },
];
