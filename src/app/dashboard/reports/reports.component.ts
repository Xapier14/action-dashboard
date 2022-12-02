import { Component, OnInit } from '@angular/core';
import { BuildingsService } from 'src/app/services/buildings.service';
import { ReportsService } from 'src/app/services/reports.service';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss'],
})
export class ReportsComponent implements OnInit {
  locations: Map<string, string> = new Map();
  buildings: Map<string, string> = new Map();
  locationsFilter: string[] = [];
  buildingsFilter: string[] = [];
  buildingsValues: string[] = [];

  locationsSelect: string[] = [];
  buildingsSelect: string[] = [];
  severitySelect: string[] = [];

  reportsData: ReportItem[] | undefined = [];
  constructor(
    private buildingsService: BuildingsService,
    private reportsService: ReportsService
  ) {
    this.locations.set('Pablo Borbon', 'pablo-borbon');
    this.locations.set('Alangilan', 'alangilan');
    this.locations.set('ARASOF-Nasugbu', 'nasugbu');
    this.locations.set('Balayan', 'balayan');
    this.locations.set('Lemery', 'lemery');
    this.locations.set('Mabini', 'mabini');
    this.locations.set('JPLPC-Malvar', 'malvar');
    this.locations.set('Lipa', 'lipa');
    this.locations.set('Rosario', 'rosario');
    this.locations.set('San Juan', 'san-juan');
    this.locations.set('Lobo', 'lobo');
    this.locationsFilter = Array.from(this.locations.keys());
  }

  getLocationFromId(id: string): string {
    let location = 'Unknown';
    this.locations.forEach((value, key) => {
      if (value === id) {
        location = key;
      }
    });
    return location;
  }

  async ngOnInit(): Promise<void> {
    await this.updateBuildingsFilter(this.locationsSelect);
    await this.updateDataview();
    this.reportsService.setAutoIncrement(false);
  }

  async updateBuildingsFilter(locations: string[]): Promise<void> {
    this.buildings.clear();
    this.buildingsSelect = [];
    await Promise.all(
      locations.map(async (location) => {
        const locationId = this.locations.get(location);
        await this.buildingsService.updateBuildingCacheAsync(locationId);
        const buildingIds = this.buildingsService.getBuildingIdList(locationId);
        buildingIds.forEach((buildingId) => {
          this.buildings.set(
            this.buildingsService.getBuildingName(buildingId, locationId),
            buildingId
          );
        });
      })
    );
    this.buildingsFilter = Array.from(this.buildings.keys());
    this.buildingsValues = Array.from(this.buildings.values());
  }

  async onLocationChange(event: string[]): Promise<void> {
    this.locationsSelect = event;
    await this.updateBuildingsFilter(this.locationsSelect);
    await this.updateDataview();
  }

  async onBuildingChange(event: string[]): Promise<void> {
    this.buildingsSelect = event;
    console.log(this.buildingsSelect);
    await this.updateDataview();
  }

  async onSeverityChange(event: string[]): Promise<void> {
    this.severitySelect = event;
    await this.updateDataview();
  }

  async updateDataview() {
    console.log('updateDataview');
    this.reportsData = undefined;
    let newData: ReportItem[] = [];
    const reports = await this.reportsService.getListDataAsync();
    reports.forEach((report: any) => {
      newData.push({
        id: report.id,
        inspector: report.inspector,
        inspectedDate: report.inspectedDateTime,
        inspectedDateString: new Date(
          report.inspectedDateTime
        ).toLocaleString(),
        location: report.location,
        locationString: this.getLocationFromId(report.location),
        building: report.buildingName,
        severity: report.severityStatus,
      });
    });
    this.reportsData = newData;
    console.log(this.reportsData);
  }

  async viewReport(id: string) {
    console.log(id);
  }
}
interface ReportItem {
  id: string;
  inspector: string;
  inspectedDate: string;
  inspectedDateString: string;
  location: string;
  locationString: string;
  building: string;
  severity: number;
}
