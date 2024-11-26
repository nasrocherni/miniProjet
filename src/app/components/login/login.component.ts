import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { UserService } from '../../services/user.service';
import { User } from '../../models/user';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {
  private readonly fb: FormBuilder = inject(FormBuilder)
  private readonly userService: UserService = inject(UserService)
  private readonly router: Router = inject(Router)
  loginForm!: FormGroup;
  user!: User | null
  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
    this.userService.user.subscribe((user) => {
      this.user = user
    })
  }

  public get email() {
    return this.loginForm.get('email')
  }
  public get password() {
    return this.loginForm.get('password')
  }


  onReset() {
    this.loginForm.reset();

  }
  onSubmit() {
    if (this.loginForm.valid) {
      this.userService.logInUser(this.loginForm.value.email, this.loginForm.value.password).subscribe((user) => {
        if (user) {
          if (user.role === 'user') {
            this.router.navigate(['/main/home'])
          } else {
            this.router.navigate(['/dashboard'])
          }
        } else {
          console.error('Error: User not found');
          alert('Email or password incorrect!');
        }
      })

    }

  }
}
