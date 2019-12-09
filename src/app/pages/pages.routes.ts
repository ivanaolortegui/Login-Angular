import { RouterModule, Routes } from '@angular/router';

import { PagesComponent } from './pages.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ProgressComponent } from './progress/progress.component';
import { Graphics1Component } from './graphics1/graphics1.component';
import { AccountSettingsComponent } from './account-settings/account-settings.component';
import { PromiseComponent } from './promise/promise.component';
import { RxjsComponent } from './rxjs/rxjs.component';



const pagesRoutes: Routes = [
  {
    path: '',
    component: PagesComponent,
    children: [
      { path: 'dashboard', component: DashboardComponent, data : {title: 'dashboard'}},
      { path: 'progress', component: ProgressComponent, data : {title: 'progress'}},
      { path: 'graficas1', component: Graphics1Component, data : {title: 'gráficas'} },
      { path: 'promesa', component: PromiseComponent, data : {title: 'promesa'}},
      { path: 'rxjs', component: RxjsComponent, data : {title: 'Rxjs'}},
      { path: 'account-settings', component: AccountSettingsComponent, data : {title: 'Ajustes  del Tema'}},
      { path: '', redirectTo: '/dashboard', pathMatch: 'full' }
    ]
  }
];


export const PAGES_ROUTES = RouterModule.forChild(pagesRoutes);
