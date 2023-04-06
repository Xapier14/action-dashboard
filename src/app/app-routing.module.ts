import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NotFoundComponent } from './errors/not-found/not-found.component';
import { UnauthorizedComponent } from './errors/unauthorized/unauthorized.component';
import { AuthGuard } from './guard/auth.guard';
import { LoginComponent } from './login/login.component';

const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  {
    path: 'dashboard',
    loadChildren: () =>
      import('./dashboard/dashboard-routing.module').then(
        (m) => m.DashboardRoutingModule
      ),
    canActivateChild: [AuthGuard],
  },
  {
    path: 'viewer',
    loadChildren: () =>
      import('./viewer/viewer-routing.module').then(
        (m) => m.ViewerRoutingModule
      ),
    canActivateChild: [AuthGuard],
  },
  {
    path: 'error',
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'notfound',
      },
      {
        path: 'unauthorized',
        component: UnauthorizedComponent,
      },
      {
        path: 'notfound',
        component: NotFoundComponent,
      },
    ],
  },
  {
    path: '**',
    redirectTo: 'error/notfound',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
