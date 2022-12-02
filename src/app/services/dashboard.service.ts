import { Injectable } from '@angular/core';
import { AccountsService } from './accounts.service';
import { AuthService } from './auth.service';
import { BuildingsService } from './buildings.service';
import { HttpService } from './http.service';
import { ReportsService } from './reports.service';

@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  private locations: Map<string, LocationData> | undefined;
  constructor(
    private httpService: HttpService,
    private buildingsService: BuildingsService,
    private reportsService: ReportsService,
    private accountsService: AccountsService,
    private authService: AuthService
  ) {}
  hasLocationData(locationId?: string) {
    if (this.locations == undefined) return false;
    if (locationId == undefined) return true;
    return this.locations.has(locationId);
  }
  getLocations() {
    if (this.locations == undefined) return [];
    return Array.from(this.locations.values());
  }
  async updateLocationsAsync() {
    await this.updateLocationAsync('pablo-borbon', 'Pablo Borbon');
    await this.updateLocationAsync('alangilan', 'Alangilan');
    await this.updateLocationAsync('nasugbu', 'ARASOF-Nasugbu');
    await this.updateLocationAsync('balayan', 'Balayan');
    await this.updateLocationAsync('lemery', 'Lemery');
    await this.updateLocationAsync('mabini', 'Mabini');
    await this.updateLocationAsync('malvar', 'JPLPC-Malvar');
    await this.updateLocationAsync('lipa', 'Lipa');
    await this.updateLocationAsync('rosario', 'Rosario');
    await this.updateLocationAsync('san-juan', 'San Juan');
    await this.updateLocationAsync('lobo', 'Lobo');
  }
  async updateLocationAsync(locationId: string, locationName?: string) {
    if (this.locations == undefined) this.locations = new Map();
    if (locationName == undefined) return;
    await this.buildingsService.updateBuildingCacheAsync(locationId);
    const buildings = this.buildingsService.getBuildingIdList(locationId);
    let status: number | undefined = undefined;
    let maxCapacity = 0;
    let reports = 0;
    let buildingsData: BuildingData[] | undefined = [];
    await Promise.all(
      buildings.map(async (building) => {
        const buildingStatus = await this.buildingsService.getBuildingInfoAsync(
          building
        );
        if (status == undefined) status = buildingStatus.lastStatus;
        else {
          if (buildingStatus.lastStatus > status)
            status = buildingStatus.lastStatus;
        }
        const buildingReports = await this.reportsService.countReportsAsync(
          locationId,
          building
        );
        reports += buildingReports;
        maxCapacity += buildingStatus.maxCapacity;
        // console.log(buildingStatus);
        buildingsData!.push({
          buildingName: buildingStatus.name,
          buildingId: buildingStatus.id,
          maxCapacity: buildingStatus.maxCapacity,
          status: buildingStatus.lastStatus,
          reports: buildingReports,
          lastIncidentId: buildingStatus.lastIncidentId,
          lastInspection: buildingStatus.lastInspection,
          otherInformation: buildingStatus.otherInformation,
        });
      })
    );
    const location = {
      locationName: locationName,
      locationId: locationId,
      status: status,
      maxCapacity: maxCapacity,
      accounts: await this.accountsService.countAccountsAsync(locationId),
      reports: reports,
      buildings: buildingsData,
    };
    console.log(location);
    if (this.locations == undefined) this.locations = new Map();
    this.locations.set(locationId, location);
  }
}

export interface LocationData {
  locationName: string;
  locationId: string;
  status: number | undefined;
  maxCapacity: number;
  accounts: number;
  reports: number;
  buildings: BuildingData[] | undefined;
}

export interface BuildingData {
  buildingName: string;
  buildingId: string;
  maxCapacity: number;
  status: number | undefined;
  reports: number;
  lastIncidentId: string | undefined;
  lastInspection: string | undefined;
  otherInformation: string;
}
