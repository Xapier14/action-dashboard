import { Component, OnInit } from '@angular/core';
import { AccountsService } from 'src/app/services/accounts.service';
import { BuildingsService } from 'src/app/services/buildings.service';
import { ReportsService } from 'src/app/services/reports.service';

@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.scss'],
})
export class OverviewComponent implements OnInit {
  selectedCampus: string | undefined;
  locationData:
    | undefined
    | {
        locationName: string;
        locationId: string;
        status: number | undefined;
        maxCapacity: number;
        accounts: number;
        reports: number;
        buildings:
          | {
              buildingName: string;
              buildingId: string;
              maxCapacity: number;
              status: number | undefined;
              reports: number;
              lastIncidentId: string | undefined;
              lastInspection: string | undefined;
              otherInformation: string;
            }[]
          | undefined;
      };
  contentTitle: string | undefined;
  locations:
    | {
        locationName: string;
        locationId: string;
        status: number | undefined;
        maxCapacity: number;
        accounts: number;
        reports: number;
        buildings:
          | {
              buildingName: string;
              buildingId: string;
              maxCapacity: number;
              status: number | undefined;
              reports: number;
              lastIncidentId: string | undefined;
              lastInspection: string | undefined;
              otherInformation: string;
            }[]
          | undefined;
      }[]
    | undefined;

  constructor(
    private buildingsService: BuildingsService,
    private accountsService: AccountsService,
    private reportsService: ReportsService
  ) {}

  async ngOnInit(): Promise<void> {
    await this.updateLocations();
  }

  async updateLocations() {
    this.locations = undefined;
    this.selectedCampus = undefined;
    this.contentTitle = undefined;
    this.locationData = undefined;
    let newLocations: {
      locationName: string;
      locationId: string;
      status: number | undefined;
      maxCapacity: number;
      accounts: number;
      reports: number;
      buildings:
        | {
            buildingName: string;
            buildingId: string;
            maxCapacity: number;
            status: number | undefined;
            reports: number;
            lastIncidentId: string | undefined;
            lastInspection: string | undefined;
            otherInformation: string;
          }[]
        | undefined;
    }[] = [];
    await this.pushCampus(newLocations, 'Pablo Borbon', 'pablo-borbon');
    await this.pushCampus(newLocations, 'Alangilan', 'alangilan');
    await this.pushCampus(newLocations, 'ARASOF-Nasugbu', 'nasugbu');
    await this.pushCampus(newLocations, 'Balayan', 'balayan');
    await this.pushCampus(newLocations, 'Lemery', 'lemery');
    await this.pushCampus(newLocations, 'Mabini', 'mabini');
    await this.pushCampus(newLocations, 'JPLPC-Malvar', 'malvar');
    await this.pushCampus(newLocations, 'Lipa', 'lipa');
    await this.pushCampus(newLocations, 'Rosario', 'rosario');
    await this.pushCampus(newLocations, 'San Juan', 'san-juan');
    await this.pushCampus(newLocations, 'Lobo', 'lobo');
    this.locations = newLocations;
  }

  async updateLocation(locationId: string | undefined) {
    if (this.locations == undefined || locationId == undefined) return;

    //find
    let location = this.locations.find(
      (location) => location.locationId === locationId
    );

    if (!location) return;
    location.buildings = undefined;

    await this.buildingsService.updateBuildingCacheAsync(locationId);
    const buildings = this.buildingsService.getBuildingIdList(locationId);
    let status: number | undefined = undefined;
    let maxCapacity = 0;
    let reports = 0;
    let buildingsData: {
      buildingName: string;
      buildingId: string;
      maxCapacity: number;
      status: number | undefined;
      reports: number;
      lastIncidentId: string | undefined;
      lastInspection: string | undefined;
      otherInformation: string;
    }[] = [];
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
        maxCapacity += buildingStatus.maxCapacity;
        const buildingReports = await this.reportsService.countReportsAsync(
          locationId,
          building
        );
        reports += buildingReports;
        // console.log(buildingStatus);
        buildingsData.push({
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
    location.status = status;
    location.maxCapacity = maxCapacity;
    location.buildings = buildingsData;
    location.reports = reports;
    location.accounts = await this.accountsService.countAccountsAsync(
      locationId
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

  async pushCampus(
    newLocations: {
      locationName: string;
      locationId: string;
      status: number | undefined;
      maxCapacity: number;
      accounts: number;
      reports: number;
      buildings:
        | {
            buildingName: string;
            buildingId: string;
            maxCapacity: number;
            status: number | undefined;
            reports: number;
            lastIncidentId: string | undefined;
            lastInspection: string | undefined;
            otherInformation: string;
          }[]
        | undefined;
    }[],
    locationName: string,
    locationId: string
  ) {
    await this.buildingsService.updateBuildingCacheAsync(locationId);
    const buildings = this.buildingsService.getBuildingIdList(locationId);
    let status: number | undefined = undefined;
    let maxCapacity = 0;
    let reports = 0;
    let buildingsData:
      | {
          buildingName: string;
          buildingId: string;
          maxCapacity: number;
          status: number | undefined;
          reports: number;
          lastIncidentId: string | undefined;
          lastInspection: string | undefined;
          otherInformation: string;
        }[]
      | undefined = [];
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
    // console.log(location);
    newLocations.push(location);
  }
}
