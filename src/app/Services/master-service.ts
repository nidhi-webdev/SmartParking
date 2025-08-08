import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { responseModel } from '../Models/login.model';
import { UserService } from './user-service';

@Injectable({
  providedIn: 'root'
})
export class Master {
  private readonly apiUrl = 'https://api.freeprojectapi.com/api/SmartParking';
  private userService = inject(UserService);

  constructor(private http: HttpClient) { }

  getSitesByClientId(): Observable<responseModel> {
    const clientId = this.userService.loggedIndata?.extraId;

    if (!clientId) {
      return throwError(() => new Error('Client ID not found. User may not be logged in.'));
    }

    return this.http.get<responseModel>(`${this.apiUrl}/GetSitesByClientId?id=${clientId}`);
  }

  getBuildingByClientId(siteId: number): Observable<responseModel> {
    if (!siteId) {
      return throwError(() => new Error('Site ID not found. User may not be logged in.'));
    }
    return this.http.get<responseModel>(`${this.apiUrl}/GetBuildingBySiteId?id=${siteId}`);
  }

  getFloorBybuildingId(buildingId: number): Observable<responseModel> {
    if (!buildingId) {
      return throwError(() => new Error('buildingId ID not found. User may not be logged in.'));
    }
    return this.http.get<responseModel>(`${this.apiUrl}/GetFloorsByBuildingId?id=${buildingId}`);
  }

  getParkingByFloor(floorId: number): Observable<responseModel> {
    return this.http.get<responseModel>(`${this.apiUrl}/GetAllParkingByFloor?id=${floorId}`);
  }

  // https://api.freeprojectapi.com/api/SmartParking/GetAllParkingByFloor?id=1
}
