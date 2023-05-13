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
import { ListViewComponent } from './accounts/list-view/list-view.component';
import { CreateViewComponent } from './accounts/create-view/create-view.component';
import { ModifyViewComponent } from './accounts/modify-view/modify-view.component';

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
        children: [
          {
            path: '',
            redirectTo: 'list',
            pathMatch: 'full',
          },
          {
            path: 'list',
            component: ListViewComponent,
          },
          {
            path: 'create',
            component: CreateViewComponent,
          },
          {
            path: 'edit/:id',
            component: ModifyViewComponent,
          },
        ],
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
