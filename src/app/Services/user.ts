import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {login, userLogin} from '../Models/login.model';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class UserService {
  private loginUrl: string = "https://api.freeprojectapi.com/api/SmartParking/login"
  loggedIndata: userLogin | undefined;
  
constructor(private http: HttpClient) {
  this.restoreUserFromStorage();
}

 restoreUserFromStorage() {
  if (typeof window !== 'undefined') {
    const loggeddata = localStorage.getItem('parkUser');
    if (loggeddata) {
      this.loggedIndata = JSON.parse(loggeddata);
      console.log('User restored:', this.loggedIndata);
    } else {
      console.log('No user found in localStorage');
    }
  }
}

  loginUser(Login :login): Observable<userLogin>{
    return this.http.post<userLogin>(this.loginUrl, Login)
  }
}


