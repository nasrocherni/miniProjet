import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { User } from '../../models/user';
import { UserService } from '../../services/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css'
})
export class SignupComponent implements OnInit {
  private readonly fb: FormBuilder = inject(FormBuilder)
  private readonly router: Router = inject(Router)
  private readonly userService: UserService = inject(UserService)

  signUpForm!: FormGroup;
  ngOnInit(): void {
    this.signUpForm = this.fb.group({
      firstname: ['', [Validators.required, Validators.minLength(3), Validators.pattern('^[A-Z][a-zA-Z]+$')]],
      lastname: ['', [Validators.required, Validators.minLength(3), Validators.pattern('^[A-Z][a-zA-Z]+$')]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      imageUrl: ['']
    });

  }

  public get firstname() {
    return this.signUpForm.get('firstname')
  }
  public get lastname() {
    return this.signUpForm.get('lastname')
  }
  public get email() {
    return this.signUpForm.get('email')
  }
  public get password() {
    return this.signUpForm.get('password')
  }




  onReset() {
    this.signUpForm.reset();


  }

  onSubmit() {
    console.log("form", this.signUpForm.value);

    if (this.signUpForm.valid) {
      let newUser: User = new User(
        '',
        this.signUpForm.value.firstname,
        this.signUpForm.value.lastname,
        this.signUpForm.value.email,
        this.signUpForm.value.password,
        // this.signUpForm.value.imageUrl,
        "",
        'user'
      );
      this.userService.getUsers().subscribe((res) => {
        console.log("users", res);

        newUser.id = String(parseInt(res[res.length - 1].id) + 1)
        this.userService.addUser(newUser).subscribe({
          next: (createdUser) => {
            console.log('User created successfully:', createdUser);
            this.router.navigate(["/main/login"])
          },
          error: (err) => {
            console.error('Error creating user:', err);
            alert('Signup failed!');
          }
        });
      })

    } else {
      alert('Please fill out the form correctly.');
    }
  }
}