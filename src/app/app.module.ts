import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

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

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    DashboardComponent,
    DashboardNavBarComponent,
    OverviewComponent,
    DashboardSideMenuComponent,
    UnauthorizedComponent,
    ReportsComponent,
    FilterDropDownComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    DashboardRoutingModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
