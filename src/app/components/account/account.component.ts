import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { User } from '../../models/user';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-account',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './account.component.html',
  styleUrl: './account.component.css'
})
export class AccountComponent implements OnInit {
  private readonly fb: FormBuilder = inject(FormBuilder)
  private readonly userService: UserService = inject(UserService)
  accountForm!: FormGroup;
  user: User | null = null;
  selectedFile: File | null = null;
  isEditMode: boolean = false;


  ngOnInit(): void {
    this.userService.user.subscribe({
      next: (user) => {
        this.user = user;
        if (user) {
          this.accountForm.patchValue({
            firstname: user.firstname,
            lastname: user.lastname,
            email: user.email,
            password: user.password,
            imageUrl: user.imageUrl
          });
        }
      },
      error: (error) => console.error('Failed to load user', error)
    });
    this.accountForm = this.fb.group({
      firstname: ['', [Validators.required, Validators.pattern(/^[A-Z].*$/), Validators.minLength(3)]],
      lastname: ['', [Validators.required, Validators.pattern(/^[A-Z].*$/), Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      imageUrl: ['']
    });
  }

  toggleEditMode() {
    this.isEditMode = !this.isEditMode;
  }


  onSubmit() {
    if (this.accountForm.valid && this.user) {

      this.userService.patchUser(this.user.id, this.accountForm.value).subscribe({
        next: (response) => {
          console.log('User updated successfully:', response);
          alert('Your profile has been updated!');
          this.isEditMode = false;
        },
        error: (error) => {
          console.error('Error updating user', error);
          alert('Failed to update your profile.');
        }
      });
    }
  }

  onReset() {
    if (this.user) {
      this.accountForm.reset({
        firstname: this.user.firstname,
        lastname: this.user.lastname,
        email: this.user.email,
        password: this.user.password,
        imageUrl: this.user.imageUrl
      });
    }
  }
}
