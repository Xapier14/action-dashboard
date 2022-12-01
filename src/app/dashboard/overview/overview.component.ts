import { Component, OnInit } from '@angular/core';
import { BuildingsService } from 'src/app/services/buildings.service';

@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.scss'],
})
export class OverviewComponent implements OnInit {
  selectedCampus: string | undefined;
  contentTitle: string | undefined;
  locations: { locationName: string; locationId: string; status: number }[] =
    [];

  constructor(private buildingsService: BuildingsService) {}

  ngOnInit(): void {
    this.pushCampus('Pablo Borbon', 'pablo-borbon');
    this.pushCampus('Alangilan', 'alangilan');
    this.pushCampus('ARASOF-Nasugbu', 'nasugbu');
    this.pushCampus('Balayan', 'balayan');
    this.pushCampus('Lemery', 'lemery');
    this.pushCampus('Mabini', 'mabini');
    this.pushCampus('JPLPC-Malvar', 'malvar');
    this.pushCampus('Lipa', 'lipa');
    this.pushCampus('Rosario', 'rosario');
    this.pushCampus('San Juan', 'san-juan');
    this.pushCampus('Lobo', 'lobo');
  }

  async onLocationClick(locationId: string | undefined) {
    // set content title
    this.contentTitle = this.locations.find(
      (location) => location.locationId === locationId
    )?.locationName;
    if (this.selectedCampus === locationId) return;
    this.selectedCampus = locationId;
    if (!locationId) return;

    // get buildings of location
    const buildings = await this.buildingsService.getBuildingIdList(locationId);
  }

  pushCampus(locationName: string, locationId: string) {
    const location = {
      locationName: locationName,
      locationId: locationId,
      status: 0,
    };
    this.locations.push(location);
  }
}
