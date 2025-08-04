import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { responseModel } from '../Models/login.model';
import {UserService} from '../Services/user';

@Injectable({
  providedIn: 'root'
})
export class Master {
  private getsiteurl: string = "https://api.freeprojectapi.com/api/SmartParking/GetSitesByClientId"
  userservice = inject(UserService);

  constructor(private http: HttpClient) {}

  getSitesByClientId() {
    const clientId = this.userservice.loggedIndata?.extraId;
    return this.http.get<responseModel>("https://api.freeprojectapi.com/api/SmartParking/GetSitesByClientId?id=" +clientId)
  }
}
