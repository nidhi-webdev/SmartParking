import { Component, inject, OnInit } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { UserService } from '../../Services/user';

@Component({
  selector: 'app-layout',
  imports: [RouterOutlet],
  templateUrl: './layout.html',
  styleUrl: './layout.scss'
})
export class Layout  {
  userService = inject(UserService);
  router = inject(Router);

  logoff(): void {
    this.userService.clearUserData();
    this.router.navigateByUrl('/login');
  }
}
