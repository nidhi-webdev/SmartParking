import { Component, inject, OnInit } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { UserService } from '../../Services/user-service';

@Component({
  selector: 'app-layout',
  imports: [RouterOutlet],
  templateUrl: './layout.html',
  styleUrl: './layout.scss'
})
export class Layout implements OnInit {
  userService = inject(UserService);
  router = inject(Router);

   ngOnInit(): void {
    // Restore user data from localStorage when layout loads
    this.userService.restoreUserFromStorage();
  }

  logoff(): void {
    this.userService.clearUserData();
    this.router.navigateByUrl('/login');
  }
}
