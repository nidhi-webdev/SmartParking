import { Component, OnInit } from '@angular/core';
import {Master} from '../../Services/master';
import { Isite, responseModel } from '../../Models/login.model';
import { UserService } from '../../Services/user';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-dashboard',
  imports: [CommonModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss'
})
export class Dashboard implements OnInit {
  
  siteList: Isite[] = [];
  
 constructor(private master: Master, public userservice: UserService) {
  this.userservice.restoreUserFromStorage();
  console.log('loggedIndata in constructor:', this.userservice.loggedIndata);
}

ngOnInit(): void {
  if (!this.userservice.loggedIndata?.extraId) {
    if (typeof window !== 'undefined') {
      alert('Please log in first!');
      // Optionally, redirect to login page
      // window.location.href = '/login'; // Uncomment and set your login route if needed
    }
    return;
  }
  this.getSite();
  console.log('siteList value from the oninit', this.siteList);
}

getSite() {
  this.master.getSitesByClientId().subscribe({
    next: (res: responseModel) => {
      console.log('Full API response:', res);
      this.siteList = res.data;
      console.log('Site list:', this.siteList);
    },
    error: (error) => {
      console.error('Error fetching sites:', error);
    }
  });
}

}
