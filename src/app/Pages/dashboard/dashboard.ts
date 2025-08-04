import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Master } from '../../Services/master';
import { Isite, responseModel } from '../../Models/login.model';
import { UserService } from '../../Services/user';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss'
})
export class Dashboard implements OnInit {
  siteList = signal<Isite[]>([]);
  
  constructor(
    private master: Master, 
    public userService: UserService
  ) {}

  ngOnInit(): void {
    setTimeout(() => {
      if (!this.userService.loggedIndata?.extraId) {
        if (typeof window !== 'undefined') {
          alert('Please log in first!');
        }
        return;
      }
      this.getSites();
    }, 100);
  }


  private getSites(): void {
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
}
