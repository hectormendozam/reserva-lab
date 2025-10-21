import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReturnEquipmentComponent } from './return-equipment.component';

describe('ReturnEquipmentComponent', () => {
  let component: ReturnEquipmentComponent;
  let fixture: ComponentFixture<ReturnEquipmentComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ReturnEquipmentComponent]
    });
    fixture = TestBed.createComponent(ReturnEquipmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
