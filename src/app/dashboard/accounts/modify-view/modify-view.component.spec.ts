import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModifyViewComponent } from './modify-view.component';

describe('ModifyViewComponent', () => {
  let component: ModifyViewComponent;
  let fixture: ComponentFixture<ModifyViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModifyViewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModifyViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
