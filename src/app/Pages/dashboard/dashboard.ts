import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Master } from '../../Services/master';
import { Ibuilding, Ifloor, Isite, responseModel } from '../../Models/login.model';
import { UserService } from '../../Services/user';
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


  constructor(
    private master: Master,
    public userService: UserService,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
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
    this.dialog.open(ParkingSlotModalComponent);
  }

  getSites(): void {
    this.master.getSitesByClientId().subscribe({
      next: (res: responseModel) => {
        if (res.data && Array.isArray(res.data)) {
          this.siteList.set(res.data);
        } else {
          this.siteList.set([]);
        }
      },
      error: (error) => {
        console.error('Error fetching sites:', error);
        this.siteList.set([]);
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
            console.log('flooList:', this.flooList());
          }
        },
        error: (error) => {
          console.log('Error fetching floor:', error);
          this.flooList.set([]);
          console.log('flooList:', this.flooList());
        }
      });

    } else {
      console.log('No Building selected')
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