import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  BuildingData,
  BuildingsService,
} from 'src/app/services/buildings.service';
import { DashboardService } from 'src/app/services/dashboard.service';

@Component({
  selector: 'app-add-building',
  templateUrl: './add-building.component.html',
  styleUrls: ['./add-building.component.scss'],
})
export class AddBuildingComponent {
  name: string | undefined;
  location: string | undefined;
  maxCapacity: number | undefined;
  otherInformation: string | undefined;
  address: string | undefined;
  buildingMarshal: string | undefined;
  storyAboveGround: number | undefined;
  storyBelowGround: number | undefined;
  typeOfConstruction: string | undefined;
  primaryOccupancy: string | undefined;

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private buildingsService: BuildingsService,
    private dashboardService: DashboardService
  ) {
    this.activatedRoute.params.subscribe((params) => {
      this.location = params['location'];
    });
  }

  async createBuilding() {
    if (this.name === undefined || this.name === '') {
      alert('Name is required');
      return;
    }
    if (this.location === undefined || this.location === '') {
      alert('Location is required');
      return;
    }
    if (this.maxCapacity === undefined || this.maxCapacity < 0) {
      alert('Max Capacity is required');
      return;
    }
    if (this.address === undefined || this.address === '') {
      alert('Address is required');
      return;
    }
    if (this.buildingMarshal === undefined || this.buildingMarshal === '') {
      alert('Building Marshal is required');
      return;
    }
    if (this.storyAboveGround === undefined || this.storyAboveGround < 0) {
      alert('Story Above Ground is required and must be greater than 0');
      return;
    }
    if (this.storyBelowGround === undefined || this.storyBelowGround < 0) {
      alert('Story Below Ground is required and must be greater than 0');
      return;
    }
    if (
      this.typeOfConstruction === undefined ||
      this.typeOfConstruction === ''
    ) {
      alert('Type of Construction is required');
      return;
    }
    if (this.primaryOccupancy === undefined || this.primaryOccupancy === '') {
      alert('Primary Occupancy is required');
      return;
    }

    const data: BuildingData = {
      id: undefined,
      name: this.name,
      maxCapacity: this.maxCapacity,
      otherInformation: this.otherInformation,
      address: this.address,
      buildingMarshal: this.buildingMarshal,
      storyAboveGround: this.storyAboveGround,
      storyBelowGround: this.storyBelowGround,
      typeOfConstruction: this.typeOfConstruction,
      primaryOccupancy: this.primaryOccupancy,
      location: this.location,
      lastStatus: undefined,
      lastIncidentId: undefined,
      lastInspection: undefined,
    };
    const result = this.buildingsService.addBuildingAsync(data);
    if (!result) {
      alert('Failed to add building!');
      return;
    }
    this.dashboardService.flagUpdatedBuildingInfo();
    this.goBack();
  }

  async goBack() {
    await this.router.navigate(['dashboard', 'overview'], {
      queryParams: { location: this.location },
    });
  }
}
