import { Component } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import {
  BuildingData,
  BuildingsService,
  InventoryItem,
} from 'src/app/services/buildings.service';

interface InventoryPage {
  pageNumber: number;
  items: InventoryItem[];
}

@Component({
  selector: 'app-view-inventory',
  templateUrl: './view-inventory.component.html',
  styleUrls: ['./view-inventory.component.scss'],
})
export class ViewInventoryComponent {
  itemsPerPage: number = 22;
  buildingId: string = '';
  buildingData: BuildingData | undefined;
  inventoryData: InventoryItem[] | undefined;
  pageData: InventoryPage[] | undefined;
  error: string = '';
  currentLoading: string = 'Initializing...';

  constructor(
    private route: ActivatedRoute,
    private buildingsService: BuildingsService,
    private title: Title
  ) {}

  ngOnInit() {
    this.route.params.subscribe(async (params) => {
      this.buildingId = params['buildingId'];

      // this.currentLoading = 'Retrieving report data...';
      // this.reportData = await this.reportsService.tryGetReportAsync(this.id);
      // if (!this.reportData) {
      //   this.router.navigate(['errors', 'notfound']);
      //   return;
      // }
      // this.reportData.evaluationComment.replace('\n', '&#10');
      // console.log(this.reportData.evaluationComment);

      // this.currentLoading = 'Retrieving inspector data...';
      // this.inspectorData = await this.accountsService.getAccountDataAsync(
      //   this.reportData?.inspectorId ?? ''
      // );
      // if (!this.inspectorData) {
      //   this.error = 'Inspector user data could not be retrieved';
      //   return;
      // }

      console.log(`Building ID: ${this.buildingId}`);

      this.currentLoading = 'Retrieving building data...';
      this.buildingData = await this.buildingsService.getBuildingInfoAsync(
        this.buildingId ?? ''
      );
      if (!this.buildingData) {
        this.error = 'Building data could not be retrieved';
        return;
      }

      this.currentLoading = 'Retrieving inventory data...';
      this.inventoryData =
        await this.buildingsService.getBuildingInventoryAsync(this.buildingId);
      if (!this.inventoryData) {
        this.error = 'Inventory data could not be retrieved';
        return;
      }

      this.currentLoading = 'Formatting inventory data...';
      const totalPages = Math.ceil(
        this.inventoryData.length / this.itemsPerPage
      );
      let pageData = [];
      for (let i = 0; i < totalPages; i++) {
        pageData.push({
          pageNumber: i + 1,
          items: this.inventoryData.slice(
            i * this.itemsPerPage,
            (i + 1) * this.itemsPerPage
          ),
        });
      }
      // fill in the last page with empty items
      if (pageData.length > 0) {
        const lastPage = pageData[pageData.length - 1];
        while (lastPage.items.length < this.itemsPerPage) {
          lastPage.items.push({
            itemCode: '',
            name: '',
            description: '',
          });
        }
      }
      this.pageData = pageData;
      console.log(pageData);
      // this.inventoryData =
      //   await this.buildingsService.getBuildingInventoryAsync(this.buildingId);
      // if (!this.inventoryData) {
      //   this.error = 'Inventory data could not be retrieved';
      //   return;
      // }

      this.title.setTitle('Inventory Viewer - ACTION Dashboard Web App');
    });
  }

  isOtherConstructionType(data: string | undefined) {
    if (!data) return false;
    const types = ['wood', 'steel', 'concrete', 'masonry'];
    return !types.includes(data);
  }

  isOtherOccupancyType(data: string | undefined) {
    if (!data) return false;
    const types = [
      'singleFamily',
      'multiResidential',
      'emergencyServices',
      'industrial',
      'offices',
      'commercial',
      'school',
      'government',
    ];
    return !types.includes(data);
  }

  async print() {
    window.print();
  }

  updateItemsPerPage(event: any) {
    this.itemsPerPage = event.target.value;
    this.ngOnInit();
  }
}
