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
import { AddBuildingComponent } from './overview/add-building/add-building.component';
import { EditBuildingComponent } from './overview/edit-building/edit-building.component';
import { BuildingInventoryComponent } from './overview/building-inventory/building-inventory.component';
import { AddItemComponent } from './overview/building-inventory/add-item/add-item.component';
import { EditItemComponent } from './overview/building-inventory/edit-item/edit-item.component';

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
        children: [],
      },
      {
        path: 'reports',
        component: ReportsComponent,
      },
      {
        path: 'building',
        redirectTo: 'overview',
        pathMatch: 'full',
      },
      {
        path: 'building/add/:location',
        component: AddBuildingComponent,
      },
      {
        path: 'building/edit/:id',
        component: EditBuildingComponent,
      },
      {
        path: 'building/inventory/:location/:id',
        component: BuildingInventoryComponent,
      },
      {
        path: 'building/inventory/:location/:id/add',
        component: AddItemComponent,
      },
      {
        path: 'building/inventory/:location/:id/edit/:itemCode',
        component: EditItemComponent,
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
