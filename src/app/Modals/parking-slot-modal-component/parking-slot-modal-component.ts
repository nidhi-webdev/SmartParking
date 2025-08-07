import { Component, Inject } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog'
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BookingService } from '../../Services/booking-service';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { IParkingBooking } from '../../Models/login.model';


@Component({
  selector: 'app-parking-slot-modal-component',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './parking-slot-modal-component.html',
  styleUrl: './parking-slot-modal-component.scss'
})
export class ParkingSlotModalComponent {
  constructor(private dialog: MatDialogRef<ParkingSlotModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { spotNo: number },
    private bookservice: BookingService
  ) { }

  myForm = new FormGroup({
    vehicleNo: new FormControl('', Validators.required),
    amount: new FormControl('', Validators.required),
    customerName: new FormControl('', Validators.required),
    contactNumber: new FormControl('', Validators.required),
    entryTime: new FormControl('', Validators.required)
  })

  bookSpotUser: IParkingBooking = {
    parkId: 0,
    floorId: 0,
    custName: "",
    custMobileNo: "",
    vehicleNo: "",
    parkDate: new Date(),
    parkSpotNo: 0,
    inTime: new Date(),
    outTime: null,
    amount: 0,
    extraCharge: 0,
    parkingNo: ""
  };

  close() {
    this.dialog.close();
  }

  onBookSpot() {
    if (this.myForm.valid) {
      const formValues = this.myForm.value;
      this.bookSpotUser = {
        parkId: 0,
        floorId: 0,
        custName: formValues.customerName || "",
        custMobileNo: formValues.contactNumber || "",
        vehicleNo: formValues.vehicleNo || "",
        parkDate: new Date(),
        parkSpotNo: this.data.spotNo,
        inTime: formValues.entryTime || new Date().toTimeString().slice(0, 5),
        outTime: null,
        amount: Number(formValues.amount) || 0,
        extraCharge: 0,
        parkingNo: `PARK-${this.data.spotNo}`
      };

      this.bookservice.bookSpot(this.bookSpotUser).subscribe({
        next: (res: any) => {
          alert("Spot Booked Successfully");
          this.dialog.close();
        },
        error: (err) => {
          alert("Spot Booking Failed");
        }
      });
    } else {
      // Mark all fields as touched to show validation errors
      this.myForm.markAllAsTouched();
      alert("Please fill in all required fields");
    }
  }

}
