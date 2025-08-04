import { Component } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormGroup } from '@angular/forms';
import { login } from '../../Models/login.model';
import { UserService } from '../../Services/user';
import { Router } from '@angular/router';


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrl: './login.scss'
})
export class Login {
  myForm = new FormGroup({
    email: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required)
  })

  constructor(private userservice: UserService, private router: Router ) {}

  login() {
    if(this.myForm.valid) {
    const newUser: login = {
      emailId: this.myForm.value.email || '',
      password: this.myForm.value.password || ''
    };
    

    this.userservice.loginUser(newUser).subscribe({
      next: (res) => {
        alert("logged In");
        if (typeof window !== 'undefined') {
          localStorage.setItem("parkUser", JSON.stringify(res));
        }
        this.userservice.loggedIndata = res;
        this.myForm.reset();
        this.router.navigateByUrl('/dashboard');
      },
      error: (err) => {
        alert("falied");
        this.myForm.reset();
      }
    })
  }

}
}
