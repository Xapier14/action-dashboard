import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BuildingsService } from 'src/app/services/buildings.service';

@Component({
  selector: 'app-add-item',
  templateUrl: './add-item.component.html',
  styleUrls: ['./add-item.component.scss'],
})
export class AddItemComponent {
  itemCode: string = '';
  name: string = '';
  description: string = '';
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

  ngOnInit(): void {}
  async addItem() {
    const [result, errorMsg] =
      await this.buildingsService.addInventoryItemAsync(this.buildingId!, {
        itemCode: this.itemCode,
        name: this.name,
        description: this.description,
      });
    if (result) await this.goBack();
    else alert(errorMsg);
  }
  async goBack() {
    await this.router.navigate([
      'dashboard',
      'building',
      'inventory',
      this.location,
      this.buildingId,
    ]);
  }
}
