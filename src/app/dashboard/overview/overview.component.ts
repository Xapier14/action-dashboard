import { Component, OnInit } from '@angular/core';
import { AccountsService } from 'src/app/services/accounts.service';
import { BuildingsService } from 'src/app/services/buildings.service';
import {
  DashboardService,
  LocationData,
} from 'src/app/services/dashboard.service';
import { ReportsService } from 'src/app/services/reports.service';

@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.scss'],
})
export class OverviewComponent implements OnInit {
  selectedCampus: string | undefined;
  locationData: LocationData | undefined;
  contentTitle: string | undefined;
  locations: LocationData[] | undefined;

  constructor(private dashboardService: DashboardService) {}

  async ngOnInit(): Promise<void> {
    if (!this.dashboardService.hasLocationData()) await this.updateLocations();
    let newLocations = this.dashboardService.getLocations();
    this.locations = newLocations;
  }

  async updateLocations() {
    this.locations = undefined;
    this.selectedCampus = undefined;
    this.contentTitle = undefined;
    this.locationData = undefined;
    await this.dashboardService.updateLocationsAsync();
    let newLocations = this.dashboardService.getLocations();
    this.locations = newLocations;
  }

  async updateLocation(locationId: string | undefined) {
    if (locationId == undefined) return;
    this.locationData = undefined;
    await this.dashboardService.updateLocationAsync(locationId);
    let newLocations = this.dashboardService.getLocations();
    this.locations = newLocations;
    this.locationData = this.locations?.find(
      (location) => location.locationId === locationId
    );
  }

  async onLocationClick(locationId: string | undefined) {
    if (this.locations == undefined) return;
    // set content title
    this.contentTitle = this.locations.find(
      (location) => location.locationId === locationId
    )?.locationName;
    if (this.selectedCampus === locationId) return;
    this.selectedCampus = locationId;
    if (!locationId) return;
    this.locationData = this.locations.find(
      (location) => location.locationId === locationId
    );
  }
}
