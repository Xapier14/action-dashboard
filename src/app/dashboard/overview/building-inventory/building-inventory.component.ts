import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  BuildingsService,
  InventoryItem,
} from 'src/app/services/buildings.service';

@Component({
  selector: 'app-building-inventory',
  templateUrl: './building-inventory.component.html',
  styleUrls: ['./building-inventory.component.scss'],
})
export class BuildingInventoryComponent {
  inventoryData: InventoryItem[] | undefined;
  buildingName: string | undefined;
  private location: string | undefined;
  private buildingId: string | undefined;
  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private buildingsService: BuildingsService
  ) {
    this.activatedRoute.params.subscribe((params) => {
      this.location = params['location'];
      this.buildingId = params['id'];
    });
    console.log(this.location);
    console.log(this.buildingId);
  }
  async ngOnInit(): Promise<void> {
    await this.buildingsService.updateBuildingCacheAsync(this.location);
    this.buildingName = this.buildingsService.getBuildingName(
      this.buildingId!,
      this.location
    );
    this.inventoryData = await this.buildingsService.getBuildingInventoryAsync(
      this.buildingId!
    );
  }
  async goBack() {
    await this.router.navigate(['dashboard', 'overview'], {
      queryParams:
        location != undefined ? { location: this.location } : undefined,
    });
  }
  async addItem() {
    await this.router.navigate([
      'dashboard',
      'building',
      'inventory',
      this.location,
      this.buildingId,
      'add',
    ]);
  }
  async print() {
    const url = this.router.serializeUrl(
      this.router.createUrlTree([`/viewer/inventory/${this.buildingId}`])
    );

    window.open(url, '_blank');
  }
  async editItem(item: InventoryItem) {
    await this.router.navigate(
      [
        'dashboard',
        'building',
        'inventory',
        this.location,
        this.buildingId,
        'edit',
        item.itemCode,
      ],
      {
        queryParams: {
          name: item.name,
          description: item.description,
        },
      }
    );
  }
  async deleteItem(item: InventoryItem) {
    if (
      confirm(
        'Are you sure you want to delete this item?\nThis action is irreversible.'
      )
    ) {
      const [result, errorMsg] =
        await this.buildingsService.deleteInventoryItemAsync(
          this.buildingId!,
          item.itemCode
        );
      if (result) {
        await this.buildingsService.updateBuildingCacheAsync(this.location);
        this.inventoryData =
          await this.buildingsService.getBuildingInventoryAsync(
            this.buildingId!
          );
      } else {
        alert(errorMsg);
      }
    }
  }
}
