import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BuildingInventoryComponent } from './building-inventory.component';

describe('BuildingInventoryComponent', () => {
  let component: BuildingInventoryComponent;
  let fixture: ComponentFixture<BuildingInventoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BuildingInventoryComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BuildingInventoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
