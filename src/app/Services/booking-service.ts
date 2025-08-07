import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { responseModel, IParkingBooking } from '../Models/login.model';

@Injectable({
  providedIn: 'root'
})
export class BookingService {
  constructor(private http: HttpClient) { }
  private bookingApi: string =  "https://api.freeprojectapi.com/api/SmartParking"

  bookSpot(obj: IParkingBooking): Observable<responseModel[]> {
    return this.http.post<responseModel[]>(`${this.bookingApi}/AddParking`, obj)
  }



}
