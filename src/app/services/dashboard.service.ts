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
  private lastUpdated: string = 'Never';
  private updatedBuildingInfo = false;
  private hasError = false;
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
  flagUpdatedBuildingInfo() {
    this.updatedBuildingInfo = true;
  }
  hasUpdatedBuildingInfo() {
    const status = this.updatedBuildingInfo;
    this.updatedBuildingInfo = false;
    return status;
  }
  getLastUpdateString(locationId?: string) {
    if (locationId == undefined) return this.lastUpdated;
    if (this.locations == undefined) return 'Never';
    if (!this.locations.has(locationId)) return 'Never';
    return this.locations.get(locationId)!.lastUpdated;
  }
  getLocations() {
    if (this.locations == undefined) return [];
    return Array.from(this.locations.values());
  }
  async updateLocationsAsync() {
    try {
      this.hasError = false;
      await Promise.all([
        this.updateLocationAsync('pablo-borbon', 'Pablo Borbon'),
        this.updateLocationAsync('alangilan', 'Alangilan'),
        this.updateLocationAsync('nasugbu', 'ARASOF-Nasugbu'),
        this.updateLocationAsync('balayan', 'Balayan'),
        this.updateLocationAsync('lemery', 'Lemery'),
        this.updateLocationAsync('mabini', 'Mabini'),
        this.updateLocationAsync('malvar', 'JPLPC-Malvar'),
        this.updateLocationAsync('lipa', 'Lipa'),
        this.updateLocationAsync('rosario', 'Rosario'),
        this.updateLocationAsync('san-juan', 'San Juan'),
        this.updateLocationAsync('lobo', 'Lobo'),
      ]);
    } catch (e) {
      console.error('Error updating all location data');
      console.error(e);
      // alert('Error updating location data. Please login again.');
      this.authService.logout();
      return;
    }
    // sort locations
    if (this.locations == undefined) return;
    const sortedLocations = new Map(
      [...this.locations.entries()].sort((a, b) => {
        if (a[1].locationName < b[1].locationName) return -1;
        if (a[1].locationName > b[1].locationName) return 1;
        return 0;
      })
    );
    this.locations = sortedLocations;
  }
  async updateLocationAsync(locationId: string, locationName?: string) {
    if (this.hasError) {
      console.log('Skipping update location due to error');
      return;
    }
    if (this.locations == undefined) this.locations = new Map();
    if (!this.locations.has(locationId) && locationName == undefined) return;
    await this.buildingsService.updateBuildingCacheAsync(locationId);
    const buildings = this.buildingsService.getBuildingIdList(locationId);
    let status: number | undefined = undefined;
    let maxCapacity = 0;
    let reports = 0;
    let buildingsData: BuildingData[] | undefined = [];
    while (true) {
      try {
        await Promise.all(
          buildings.map(async (building) => {
            const buildingStatus =
              await this.buildingsService.getBuildingInfoAsync(building);
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
        break;
      } catch (e) {
        this.hasError = true;
        console.error(`Error updating location ${locationId} data.`);
        console.error(e);
        if (e != undefined) {
          // alert('Error updating location data. Please login again.');
          this.authService.logout();
        }
        return;
      }
    }
    // sort buildings
    if (buildingsData != undefined) {
      buildingsData = buildingsData.sort((a, b) => {
        if (a.buildingName < b.buildingName) return -1;
        if (a.buildingName > b.buildingName) return 1;
        return 0;
      });
    }

    const locName =
      locationName ?? this.locations.get(locationId)?.locationName ?? 'Unknown';
    const location = {
      locationName: locName,
      locationId: locationId,
      lastUpdated: new Date().toLocaleString(),
      status: status,
      maxCapacity: maxCapacity,
      accounts: await this.accountsService.countAccountsAsync(locationId),
      reports: reports,
      buildings: buildingsData,
    };
    if (this.locations == undefined) this.locations = new Map();
    this.locations.set(locationId, location);
  }
}

export interface LocationData {
  locationName: string;
  locationId: string;
  lastUpdated: string;
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
