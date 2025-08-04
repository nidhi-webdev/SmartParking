import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { login, userLogin } from '../Models/login.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private readonly loginUrl = 'https://api.freeprojectapi.com/api/SmartParking/login';
  private readonly storageKey = 'parkUser';
  
  loggedIndata: userLogin | undefined;
  
  constructor(private http: HttpClient) {}

  restoreUserFromStorage(): void {
    if (typeof window === 'undefined') return;
    
    try {
      const userData = localStorage.getItem(this.storageKey);
      this.loggedIndata = userData ? JSON.parse(userData) : undefined;
    } catch (error) {
      console.error('Error parsing user data from localStorage:', error);
      this.loggedIndata = undefined;
    }
  }

  saveUserToStorage(userData: userLogin): void {
    if (typeof window === 'undefined') return;
    
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(userData));
      this.loggedIndata = userData;
    } catch (error) {
      console.error('Error saving user data to localStorage:', error);
    }
  }

  clearUserData(): void {
    if (typeof window === 'undefined') return;
    
    localStorage.removeItem(this.storageKey);
    this.loggedIndata = undefined;
  }

  loginUser(loginData: login): Observable<userLogin> {
    return this.http.post<userLogin>(this.loginUrl, loginData);
  }

  isLoggedIn(): boolean {
    return !!this.loggedIndata?.extraId;
  }
}


