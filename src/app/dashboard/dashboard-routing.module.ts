import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard.component';
import { OverviewComponent } from './overview/overview.component';
import { ReportsComponent } from './reports/reports.component';
import { AuthGuard } from '../guard/auth.guard';
import { AccountsComponent } from './accounts/accounts.component';
import { AttachmentsComponent } from './attachments/attachments.component';
import { LogsComponent } from './logs/logs.component';

const routes: Routes = [
  {
    path: '',
    component: DashboardComponent,
    children: [
      {
        path: '',
        redirectTo: 'overview',
        pathMatch: 'full',
      },
      {
        path: 'overview',
        component: OverviewComponent,
      },
      {
        path: 'reports',
        component: ReportsComponent,
      },
      {
        path: 'accounts',
        component: AccountsComponent,
      },
      {
        path: 'attachments',
        component: AttachmentsComponent,
      },
      {
        path: 'logs',
        component: LogsComponent,
      },
    ],
  },
];

@NgModule({
  declarations: [],
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DashboardRoutingModule {}
