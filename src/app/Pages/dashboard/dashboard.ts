import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Master } from '../../Services/master-service';
import { Ibuilding, Ifloor, Isite, responseModel } from '../../Models/login.model';
import { UserService } from '../../Services/user-service';
import { FormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ParkingSlotModalComponent } from '../../Modals/parking-slot-modal-component/parking-slot-modal-component';

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

  constructor(
    private master: Master,
    public userService: UserService,
    private dialog: MatDialog
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
        if (typeof window !== 'undefined') {
          console.error('User not logged in or client ID not found');
        }
        return;
      }
      this.getSites();
    }, 100);
  }

  openModal(spotNo: number) {
    const dialogRef = this.dialog.open(ParkingSlotModalComponent, {
      data: { spotNo }
    });
  }

  // Method to manually refresh sites if needed
  refreshSites(): void {
    this.sitesLoaded = false;
    this.getSites();
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
      this.master.getFloorBySiteId(buildingId).subscribe({
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
  }
}
