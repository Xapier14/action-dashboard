import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ViewIncidentComponent } from './view-incident/view-incident.component';
import { ViewerComponent } from './viewer.component';
import { ViewInventoryComponent } from './view-inventory/view-inventory.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: '/dashboard/overview',
    pathMatch: 'full',
  },
  {
    path: 'incident/:id',
    component: ViewIncidentComponent,
  },
  {
    path: 'inventory/:building',
    component: ViewInventoryComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ViewerRoutingModule {}
