import { Component, inject } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { UserService } from '../../Services/user';

@Component({
  selector: 'app-layout',
  imports: [RouterOutlet],
  templateUrl: './layout.html',
  styleUrl: './layout.scss'
})
export class Layout {
  userservice = inject(UserService);
  router = inject(Router);

  logoff() {
    // if (typeof window !== 'undefined') {
    //   localStorage.removeItem("parkUser");
    // }
    // this.userservice.loggedIndata = undefined;
    // this.router.navigateByUrl('/login');
    
  }
}
