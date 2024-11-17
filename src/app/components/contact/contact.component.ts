import { NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [NgIf,ReactiveFormsModule],
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css'],
})
export class ContactComponent {
  contactForm: FormGroup;
  enableReview = false;

  constructor(private fb: FormBuilder) {
    this.contactForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      message: ['', Validators.required],
      rating: [0],
      reviewMessage: [''],
    });
  }

  toggleReview(event: Event): void {
    const checkbox = event.target as HTMLInputElement;
    const isChecked = checkbox.checked;

    this.enableReview = isChecked;

    if (isChecked) {
      this.contactForm.get('rating')!.setValidators([Validators.required]);
      this.contactForm.get('reviewMessage')!.setValidators([Validators.required]);
    } else {
      this.contactForm.get('rating')!.clearValidators();
      this.contactForm.get('reviewMessage')!.clearValidators();
      this.contactForm.patchValue({ rating: 0, reviewMessage: '' });
    }

    this.contactForm.get('rating')!.updateValueAndValidity();
    this.contactForm.get('reviewMessage')!.updateValueAndValidity();
  }

  onSubmit(): void {
    
  }
}