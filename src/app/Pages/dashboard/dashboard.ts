import { Component, OnInit, Signal, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Master } from '../../Services/master-service';
import { Ibuilding, Ifloor, Isite, responseModel } from '../../Models/login.model';
import { UserService } from '../../Services/user-service';
import { FormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ParkingSlotModalComponent } from '../../Modals/parking-slot-modal-component/parking-slot-modal-component';
import { ChangeDetectorRef } from '@angular/core';


@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss'
})
export class Dashboard implements OnInit {
  siteList = signal<Isite[]>([]);
  buildingList = signal<Ibuilding[] | null>(null);
  flooList = signal<Ifloor[] | null>(null);
  siteId: number = 0;
  buildingId: number = 0;
  Ifloor: number = 0;
  parkingBlocks: number[] = [];
  floorId: number = 0;
  private sitesLoaded = false; // Flag to prevent multiple API calls
  bookedSpotList = signal<any[]>([]);
  lastBookedSpotNo = signal<number | null>(null);

  constructor(
    private master: Master,
    public userService: UserService,
    private dialog: MatDialog,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    // Prevent multiple initializations
    if (this.sitesLoaded) {
      return;
    }
    // First restore user data from localStorage
    this.userService.restoreUserFromStorage();
    // Then check if user is logged in and get sites
    setTimeout(() => {
      if (!this.userService.loggedIndata?.extraId) {
        return;
      }
      this.getSites();
    }, 100);
  }

  openModal(spotNo: number) {
    const dialogRef = this.dialog.open(ParkingSlotModalComponent, {
      data: { spotNo, floorId: this.floorId }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && result.refresh) {
        // Immediately handle the new booking in local state
        if (result.bookingData) {
          this.handleNewBooking(result.spotNo, result.bookingData);
        }

        // Set the just-booked animation
        this.lastBookedSpotNo.set(result.spotNo);
        this.cdr.detectChanges();

        // Refresh from API after a delay to get the official data
        setTimeout(() => {
          this.getSpotByFloor();
        }, 1500);

        // Clear the "just booked" animation after 3 seconds
        setTimeout(() => {
          this.lastBookedSpotNo.set(null);
          this.cdr.detectChanges();
        }, 3000);
      }
    });
  }
  // Open modal only for available spots
  openModalForSpot(spotNo: number) {
    if (!this.isSpotBooked(spotNo)) {
      this.openModal(spotNo);
    }
  }



  getSites(): void {
    // Prevent multiple API calls
    if (this.sitesLoaded) {
      return;
    }

    this.sitesLoaded = true; // Set flag before API call to prevent race conditions

    this.master.getSitesByClientId().subscribe({
      next: (res: responseModel) => {
        if (res.data && Array.isArray(res.data)) {
          this.siteList.set(res.data);
        } else {
          this.siteList.set([]);
        }
      },
      error: (error) => {
        this.siteList.set([]);
        this.sitesLoaded = false; // Reset flag on error so user can retry
      }
    });
  }

  getBuildings(siteId: number) {
    if (siteId !== null) {
      this.master.getBuildingByClientId(siteId).subscribe({
        next: (res: responseModel) => {
          if (res.data && Array.isArray(res.data)) {
            this.buildingList.set(res.data);
          } else {
            this.buildingList.set([]);
          }
        },
        error: (error) => {
          console.error('Error fetching buildings:', error);
          this.buildingList.set([]);
        }
      });
    } else {
      console.error('No site selected');
    }
  }

  getFloor(buildingId: number) {
    if (buildingId !== null) {
      this.master.getFloorBybuildingId(buildingId).subscribe({
        next: (res: responseModel) => {
          if (res.data && Array.isArray(res.data)) {
            this.flooList.set(res.data);
          } else {
            this.flooList.set([]);
          }
        },
        error: (error) => {
          console.error('Error fetching floor:', error);
          this.flooList.set([]);
        }
      });
    } else {
      console.error('No Building selected');
    }
  }

  getFloorsBlock() {
    const floor = this.flooList()?.find((m: Ifloor) => m.floorId == this.floorId);
    this.parkingBlocks = [];
    if (floor) {
      this.parkingBlocks = Array.from({ length: floor.totalParkingSpots }, (_, i) => i + 1);
    }
    this.getSpotByFloor()
  }
  // Check if a spot is booked
  isSpotBooked(spotNo: number): boolean {
    const isBooked = this.bookedSpotList().some(booking => booking.parkSpotNo === spotNo);
    return isBooked;
  }
  
  // Get booking details for a spot
  getBookingDetails(spotNo: number): any {
    return this.bookedSpotList().find(booking => booking.parkSpotNo === spotNo);
  }
  
  // Get available spots count with validation
  getAvailableSpotsCount(): number {
    const total = this.parkingBlocks.length;
    const occupied = this.getUniqueOccupiedSpots();
    const available = total - occupied;
    return Math.max(0, available); // Ensure it doesn't go negative
  }
  
  // Get unique occupied spots (remove duplicates)
  getUniqueOccupiedSpots(): number {
    const uniqueSpots = new Set();
    this.bookedSpotList().forEach(booking => {
      uniqueSpots.add(booking.parkSpotNo);
    });
    return uniqueSpots.size;
  }
  
  // Get occupied spots count
  getOccupiedSpotsCount(): number {
    const occupied = this.getUniqueOccupiedSpots();
    return occupied;
  }
  
  // Get occupancy rate
  getOccupancyRate(): number {
    if (this.parkingBlocks.length === 0) return 0;
    const occupied = this.getUniqueOccupiedSpots();
    const rate = Math.round((occupied / this.parkingBlocks.length) * 100);
    return Math.min(100, rate); // Cap at 100%
  }

  
  getSpotByFloor() {
    if (!this.floorId || this.floorId <= 0) {
      this.bookedSpotList.set([]);
      return;
    }

    this.master.getParkingByFloor(this.floorId).subscribe({
      next: (res: any) => {
        if (res.data && Array.isArray(res.data)) {
          this.bookedSpotList.set(res.data);
        } else {
          this.bookedSpotList.set([]);
        }
      },
      error: (error) => {
        console.error('Error fetching floor data:', error);
        this.bookedSpotList.set([]);
      }
    });
  }

  forceRefresh() {
    this.bookedSpotList.set([]);
    this.getSpotByFloor();
  }

  handleNewBooking(spotNo: number, bookingData: any) {
    // Temporarily add the booking to local state until API confirms
    const currentBookings = this.bookedSpotList();
    const newBooking = {
      ...bookingData,
      parkSpotNo: spotNo,
      outTime: null // Ensure it's marked as active
    };
  
    // Check if this booking already exists in the list
    const existingBookingIndex = currentBookings.findIndex(b => 
      b.parkSpotNo === spotNo && (b.outTime === null || b.outTime === undefined)
    );

    if (existingBookingIndex === -1) {
      // Add new booking if it doesn't exist
      this.bookedSpotList.set([...currentBookings, newBooking]);
    }
  }
}
