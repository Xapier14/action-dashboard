import { Component, OnInit } from '@angular/core';
import { BuildingsService } from 'src/app/services/buildings.service';

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
        buildings: {
          buildingName: string;
          buildingId: string;
          maxCapacity: number;
          status: number | undefined;
          lastIncidentId: string | undefined;
          lastInspection: string | undefined;
          otherInformation: string;
        }[];
      };
  contentTitle: string | undefined;
  locations:
    | {
        locationName: string;
        locationId: string;
        status: number | undefined;
        buildings: {
          buildingName: string;
          buildingId: string;
          maxCapacity: number;
          status: number | undefined;
          lastIncidentId: string | undefined;
          lastInspection: string | undefined;
          otherInformation: string;
        }[];
      }[]
    | undefined;

  constructor(private buildingsService: BuildingsService) {}

  async ngOnInit(): Promise<void> {
    await this.updateLocations();
  }

  async updateLocations() {
    this.locations = undefined;
    let newLocations: {
      locationName: string;
      locationId: string;
      status: number | undefined;
      buildings: {
        buildingName: string;
        buildingId: string;
        maxCapacity: number;
        status: number | undefined;
        lastIncidentId: string | undefined;
        lastInspection: string | undefined;
        otherInformation: string;
      }[];
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
      buildings: {
        buildingName: string;
        buildingId: string;
        maxCapacity: number;
        status: number | undefined;
        lastIncidentId: string | undefined;
        lastInspection: string | undefined;
        otherInformation: string;
      }[];
    }[],
    locationName: string,
    locationId: string
  ) {
    await this.buildingsService.updateBuildingCacheAsync(locationId);
    const buildings = this.buildingsService.getBuildingIdList(locationId);
    let status: number | undefined = undefined;
    let buildingsData: {
      buildingName: string;
      buildingId: string;
      maxCapacity: number;
      status: number | undefined;
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
        // console.log(buildingStatus);
        buildingsData.push({
          buildingName: buildingStatus.name,
          buildingId: buildingStatus.id,
          maxCapacity: buildingStatus.maxCapacity,
          status: buildingStatus.lastStatus,
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
      buildings: buildingsData,
    };
    console.log(location);
    // console.log(location);
    newLocations.push(location);
  }
}
