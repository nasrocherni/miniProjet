import { Component, inject, NgModule, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ChocolateService } from '../../../services/chocolate.service';
import { Chocolate } from '../../../models/chocolate';
import { NgClass } from '@angular/common';
import { ReviewService } from '../../../services/review.service';
import { Review } from '../../../models/review';
import { FormsModule } from '@angular/forms';
import { CategoryService } from '../../../services/category.service';
import { Category } from '../../../models/category';
import { UserService } from '../../../services/user.service';
import { User } from '../../../models/user';

@Component({
  selector: 'app-chocolate-item',
  standalone: true,
  imports: [NgClass, FormsModule],
  templateUrl: './chocolate-item.component.html',
  styleUrl: './chocolate-item.component.css'
})
export class ChocolateItemComponent implements OnInit {

  private readonly activatedRoute: ActivatedRoute = inject(ActivatedRoute);
  private readonly chocolateService: ChocolateService = inject(ChocolateService);
  private readonly reviewService: ReviewService = inject(ReviewService);
  private readonly categoryService: CategoryService = inject(CategoryService);
  private readonly userService: UserService = inject(UserService);
  private readonly router: Router = inject(Router);



  reviews: Review[] = [];
  chocolateId: string | null = null;
  chocolate!: Chocolate;
  averageRating: number = 0;
  categorys!: Category[]
  user!: User;

  ngOnInit(): void {
    this.activatedRoute.params.subscribe((params) => {
      this.chocolateId = params['chocolateId'];
      this.loadChocolate(this.chocolateId!);
    });
    this.categoryService.getCategory().subscribe((res) => {
      this.categorys = res
    })
  }
  loadChocolate(id: string) {
    this.chocolateService.getChocolateById(id).subscribe((chocolate) => {
      this.chocolate = chocolate;
      this.loadReviews(chocolate);
    });
  }
  loadReviews(chocolate: Chocolate) {
    const reviewIds = chocolate.reviews.filter((r) => typeof r === 'string');
    if (reviewIds.length === 0) {
      this.reviews = [];
      this.averageRating = 0
      return;
    }
    this.reviewService.getReviewsByIds(reviewIds).subscribe((resolvedReviews) => {
      this.reviews = resolvedReviews;
      this.calculateAverageRating();
    });
  }

  calculateAverageRating() {
    this.averageRating =
      this.reviews.reduce((sum, review) => sum + parseFloat(String(review.rating)), 0) / this.reviews.length;
  }


  saveChocolate() {
    this.chocolateService.patchChocolate(this.chocolate.id, this.chocolate).subscribe(() => {
      alert('Chocolate details updated successfully!');
      this.router.navigate(['/dashboard/chocolates']);
    });
  }

  deleteChocolate(id: string) {
    this.chocolateService.deleteChocolate(id).subscribe(() => {
      this.reviews.forEach((review) => {
        this.reviewService.deleteReview(review.id).subscribe();
      });
      alert('Chocolate and associated reviews deleted!');
      this.router.navigate(['/dashboard/chocolates']);
    });
  }

  deleteReview(reviewId: string) {
    this.reviewService.deleteReview(reviewId).subscribe(() => {
      this.reviews = this.reviews.filter((review) => review.id !== reviewId);
      this.calculateAverageRating();
    });
  }
  getUserName(id: string) {
    this.userService.getUserById(id).subscribe((res) => {
      this.user = res
    })
    return `${this.user.firstname} ${this.user.lastname}`
  }
  toggleAvailability() {
    this.chocolate.availability = !this.chocolate.availability;
  }
}

