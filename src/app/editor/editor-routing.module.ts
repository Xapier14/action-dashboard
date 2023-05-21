import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EditIncidentComponent } from './edit-incident/edit-incident.component';
import { FormsModule } from '@angular/forms';

const routes: Routes = [
  {
    path: '',
    redirectTo: '/dashboard/overview',
    pathMatch: 'full',
  },
  {
    path: 'incident/:id',
    component: EditIncidentComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule, FormsModule],
})
export class EditorRoutingModule {}
