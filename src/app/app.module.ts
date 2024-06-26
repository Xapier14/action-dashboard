import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LoginComponent } from './login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { DashboardNavBarComponent } from './dashboard/dashboard-nav-bar/dashboard-nav-bar.component';
import { DashboardRoutingModule } from './dashboard/dashboard-routing.module';
import { OverviewComponent } from './dashboard/overview/overview.component';
import { DashboardSideMenuComponent } from './dashboard/dashboard-side-menu/dashboard-side-menu.component';
import { UnauthorizedComponent } from './errors/unauthorized/unauthorized.component';
import { ReportsComponent } from './dashboard/reports/reports.component';
import { FilterDropDownComponent } from './dashboard/reports/filter-drop-down/filter-drop-down.component';
import { AccountsComponent } from './dashboard/accounts/accounts.component';
import { AttachmentsComponent } from './dashboard/attachments/attachments.component';
import { ViewerComponent } from './viewer/viewer.component';
import { ViewIncidentComponent } from './viewer/view-incident/view-incident.component';
import { NotFoundComponent } from './errors/not-found/not-found.component';
import { LogsComponent } from './dashboard/logs/logs.component';
import { ListViewComponent } from './dashboard/accounts/list-view/list-view.component';
import { CreateViewComponent } from './dashboard/accounts/create-view/create-view.component';
import { ModifyViewComponent } from './dashboard/accounts/modify-view/modify-view.component';
import { AttachmentComponent } from './viewer/view-incident/attachment/attachment.component';
import { AddBuildingComponent } from './dashboard/overview/add-building/add-building.component';
import { EditBuildingComponent } from './dashboard/overview/edit-building/edit-building.component';
import { EditIncidentComponent } from './editor/edit-incident/edit-incident.component';
import { SearchResultsComponent } from './dashboard/search-results/search-results.component';
import { BuildingInventoryComponent } from './dashboard/overview/building-inventory/building-inventory.component';
import { AddItemComponent } from './dashboard/overview/building-inventory/add-item/add-item.component';
import { EditItemComponent } from './dashboard/overview/building-inventory/edit-item/edit-item.component';
import { ViewInventoryComponent } from './viewer/view-inventory/view-inventory.component';

@NgModule({
  declarations: [
    AppComponent,
    AttachmentComponent,
    LoginComponent,
    DashboardComponent,
    DashboardNavBarComponent,
    OverviewComponent,
    DashboardSideMenuComponent,
    UnauthorizedComponent,
    ReportsComponent,
    FilterDropDownComponent,
    AccountsComponent,
    AttachmentsComponent,
    ViewerComponent,
    ViewIncidentComponent,
    NotFoundComponent,
    LogsComponent,
    ListViewComponent,
    CreateViewComponent,
    ModifyViewComponent,
    AttachmentComponent,
    AddBuildingComponent,
    EditBuildingComponent,
    EditIncidentComponent,
    SearchResultsComponent,
    BuildingInventoryComponent,
    AddItemComponent,
    EditItemComponent,
    ViewInventoryComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    DashboardRoutingModule,
    LeafletModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
