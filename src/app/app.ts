import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { UserService } from './Services/user';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('carParking');

  constructor(private userservice: UserService) {}
  ngOnInit() {
    this.userservice.restoreUserFromStorage();
  }
}
