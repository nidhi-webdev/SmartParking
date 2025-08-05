import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ParkingSlotModalComponent } from './parking-slot-modal-component';

describe('ParkingSlotModalComponent', () => {
  let component: ParkingSlotModalComponent;
  let fixture: ComponentFixture<ParkingSlotModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ParkingSlotModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ParkingSlotModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
