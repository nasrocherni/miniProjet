import { NgIf } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Review } from '../../models/review';
import { ReviewService } from '../../services/review.service';
import { UserService } from '../../services/user.service';
import { User } from '../../models/user';
import { Chocolate } from '../../models/chocolate';
import { ChocolateService } from '../../services/chocolate.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css'],
})
export class ContactComponent implements OnInit {
  private readonly fb: FormBuilder = inject(FormBuilder)
  private readonly reviewService: ReviewService = inject(ReviewService)
  private readonly userService: UserService = inject(UserService)
  private readonly chocolateService: ChocolateService = inject(ChocolateService)
  private readonly router: Router = inject(Router)

  contactForm!: FormGroup;
  enableReview = false;
  loggedInUser: User | null = null;
  chocolates: Chocolate[] = [];
  ngOnInit(): void {
    this.userService.user.subscribe(status => {
      this.loggedInUser = status;
    });


    this.contactForm = this.fb.group({
      message: ['', Validators.required],
      reviewMessage: [''],
      rating: [0],
      chocolate: ['']

    });
    this.fetchChocolates();
  }
  fetchChocolates() {
    this.chocolateService.getChocolate().subscribe({
      next: (chocolates) => {
        this.chocolates = chocolates;
      },
      error: (err) => {
        console.error('Error fetching chocolates:', err);
        alert('Failed to load chocolates. Please try again later.');
      }
    });
  }

  toggleReview(event: Event) {
    const checkbox = event.target as HTMLInputElement;
    this.enableReview = checkbox.checked;

    if (this.enableReview) {
      this.contactForm.get('rating')!.setValidators([Validators.required]);
      this.contactForm.get('reviewMessage')!.setValidators([Validators.required]);
      this.contactForm.get('chocolate')!.setValidators([Validators.required]);
    } else {
      this.contactForm.get('rating')!.clearValidators();
      this.contactForm.get('reviewMessage')!.clearValidators();
      this.contactForm.get('chocolate')!.clearValidators();
      this.contactForm.patchValue({ rating: 0, reviewMessage: '', chocolate: '' });
    }

    this.contactForm.get('rating')!.updateValueAndValidity();
    this.contactForm.get('reviewMessage')!.updateValueAndValidity();
    this.contactForm.get('chocolate')!.updateValueAndValidity();
  }
  onReset() {
    this.contactForm.reset();


  }
  onSubmit() {
    if (!this.loggedInUser) {
      alert('You need to log in to submit a message.');
      return;
    }

    if (this.contactForm.valid) {
      const newReview: Review = new Review(
        "",
        this.contactForm.value.message,
        this.loggedInUser.id,
        this.contactForm.value.reviewMessage,
        this.contactForm.value.rating
      );
      this.reviewService.getReview().subscribe((res) => {
        if (res.length === 0) {
          newReview.id = '1';
        }
        else {
          newReview.id = String(parseInt(res[res.length - 1].id) + 1)
        }
        this.reviewService.addReview(newReview).subscribe({
          next: (reviewResponse) => {
            alert('Review added successfully')
            console.log('Review added successfully:', reviewResponse);
            this.updateChocolateReviews(this.contactForm.value.chocolate, reviewResponse.id);
            this.router.navigate(['/main/home'])
          },
          error: (err) => {
            console.error('Error submitting review:', err);
            alert('Failed to submit the review. Please try again.');
          },
        });
      })
    }
  }


  updateChocolateReviews(chocolateId: string, id: string) {
    let chocolate = this.chocolates.find(c => c.id === chocolateId);

    if (!chocolate) {
      alert('Selected chocolate not found.');
      return;
    }

    chocolate.reviews.push(id)
    this.chocolateService.patchChocolate(chocolateId, { reviews: chocolate.reviews }).subscribe({
      next: () => {
        console.log(`Chocolate ${chocolateId} updated with new review.`);
        alert('Your review has been submitted successfully!');
        this.contactForm.reset();
        this.enableReview = false;
      },
      error: (err) => {
        console.error('Error updating chocolate reviews:', err);
        alert('Failed to associate the review with the chocolate. Please try again.');
      },
    });
  }



}