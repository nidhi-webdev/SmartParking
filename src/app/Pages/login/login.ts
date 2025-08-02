import { Component } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormGroup } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatOptionModule } from '@angular/material/core';
import { login } from '../../Models/login.model';
import { UserService } from '../../Services/user';


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, MatSelectModule, MatFormFieldModule, MatOptionModule],
  templateUrl: './login.html',
  styleUrl: './login.scss'
})
export class Login {
  myForm = new FormGroup({
    email: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required)
    // select: new FormControl('', Validators.required)
  })

  constructor(private userservice: UserService ) {}

  login() {
    if(this.myForm.valid) {
    const newUser: login = {
      emailId: this.myForm.value.email || '',
      password: this.myForm.value.password || ''
    };
    

    this.userservice.loginUser(newUser).subscribe({
      next: (res) => {
        alert("logged In");
        this.myForm.reset();
      },
      error: (err) => {
        alert("falied");
      }
    })
  }

}
}
