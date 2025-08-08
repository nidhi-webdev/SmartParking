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
    @Inject(MAT_DIALOG_DATA) public data: { spotNo: number, floorId: number },
    private bookservice: BookingService
  ) { }

  myForm = new FormGroup({
    vehicleNo: new FormControl('', Validators.required),
    amount: new FormControl('', Validators.required),
    customerName: new FormControl(''),
    contactNumber: new FormControl('', Validators.required)
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
      const currentDateTime = new Date();
      
      this.bookSpotUser = {
        parkId: 0,
        floorId: Number(this.data.floorId), // Convert to number to avoid validation error
        custName: formValues.customerName || null, // Allow null like in existing data
        custMobileNo: formValues.contactNumber || "",
        vehicleNo: formValues.vehicleNo || "",
        parkDate: currentDateTime.toISOString(), // Use ISO string format
        parkSpotNo: Number(this.data.spotNo), // Also ensure spotNo is a number
        inTime: currentDateTime.toISOString(), // Use ISO string format
        outTime: null,
        amount: Number(formValues.amount) || 0,
        extraCharge: 0,
        parkingNo: "" // Empty string like in existing data
      };

      this.bookservice.bookSpot(this.bookSpotUser).subscribe({
        next: (res: any) => {
          if (res.result) {
            alert("Spot Booked Successfully");
            // Close with refresh flag and both spotNo and floorId
            this.dialog.close({ 
              refresh: true, 
              spotNo: this.data.spotNo, 
              floorId: this.data.floorId,
              bookingData: this.bookSpotUser
            });
          } else {
            alert("Spot Booking Failed: " + (res.message || 'Unknown error'));
          }
        },
        error: (err) => {
          alert("Spot Booking Failed: " + (err.error?.message || err.message || 'Unknown error'));
        }
      });
    } else {
      // Mark all fields as touched to show validation errors
      this.myForm.markAllAsTouched();
      alert("Please fill in all required fields");
    }
  }
}
