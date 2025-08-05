import { Component } from '@angular/core';
import {MatDialogRef} from '@angular/material/dialog'

@Component({
  selector: 'app-parking-slot-modal-component',
  imports: [],
  templateUrl: './parking-slot-modal-component.html',
  styleUrl: './parking-slot-modal-component.scss'
})
export class ParkingSlotModalComponent {
  constructor(private dialog: MatDialogRef<ParkingSlotModalComponent>) {}


  close() {
    this.dialog.close();
  }
}
