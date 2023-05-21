import { Component } from '@angular/core';
import { Router } from '@angular/router';
import {
  BuildingData,
  BuildingsService,
} from 'src/app/services/buildings.service';
import { DashboardService } from 'src/app/services/dashboard.service';

@Component({
  selector: 'app-edit-building',
  templateUrl: './edit-building.component.html',
  styleUrls: ['./edit-building.component.scss'],
})
export class EditBuildingComponent {
  buildingData: BuildingData | undefined;

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
    private router: Router,
    private buildingService: BuildingsService,
    private dashboardService: DashboardService
  ) {}
  async ngOnInit(): Promise<void> {
    const id = this.router.url.split('/').pop();
    if (id === undefined) {
      this.goBack();
    }
    const building = await this.buildingService.getBuildingInfoAsync(id!);
    if (building === undefined) {
      this.goBack();
    }
    this.buildingData = building!;
    console.log(this.buildingData);
    await this.revertChanges();
  }

  async revertChanges() {
    this.name = this.buildingData?.name;
    this.location = this.buildingData?.location;
    this.maxCapacity = this.buildingData?.maxCapacity;
    this.otherInformation = this.buildingData?.otherInformation;
    this.address = this.buildingData?.address;
    this.buildingMarshal = this.buildingData?.buildingMarshal;
    this.storyAboveGround = this.buildingData?.storyAboveGround;
    this.storyBelowGround = this.buildingData?.storyBelowGround;
    this.typeOfConstruction = this.buildingData?.typeOfConstruction;
    this.primaryOccupancy = this.buildingData?.primaryOccupancy;
  }
  async saveChanges() {
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
      id: this.buildingData?.id,
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
      lastIncidentId: undefined,
      lastInspection: undefined,
      lastStatus: undefined,
    };

    if (!(await this.buildingService.editBuildingAsync(data, undefined))) {
      alert('Failed to edit building');
      return;
    }
    this.dashboardService.flagUpdatedBuildingInfo();
    await this.goBack();
  }

  async goBack() {
    await this.router.navigate(['dashboard', 'overview'], {
      queryParams:
        location != undefined ? { location: this.location } : undefined,
    });
  }
}
