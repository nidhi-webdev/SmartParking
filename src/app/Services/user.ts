import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {login, userLogin} from '../Models/login.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private loginUrl: string = "https://api.freeprojectapi.com/api/SmartParking/login"
  constructor(private http: HttpClient) {}

  loginUser(Login :login): Observable<userLogin>{
    return this.http.post<userLogin>(this.loginUrl, Login)
  }
}
