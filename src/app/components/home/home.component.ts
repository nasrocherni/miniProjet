import { Component, inject, OnInit } from '@angular/core';
import { CategoryService } from '../../services/category.service';
import { Category } from '../../models/category';
import { NgClass} from '@angular/common';
import { ReviewService } from '../../services/review.service';
import { Review } from '../../models/review';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [NgClass,RouterLink],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {
  private readonly categoryService: CategoryService = inject(CategoryService);
  private readonly reviewService: ReviewService = inject(ReviewService);

  categorys: Category[] = [];
  reviews: Review[] = [];
  visibleReviews = 3;

  ngOnInit(): void {
    this.categoryService.getCategory().subscribe(
      data => this.categorys = data
    );
    this.reviewService.getReviewsWithUserData().subscribe(data => {
      this.reviews = data;
      console.log(this.reviews);
    });


  }

  loadMore() {
    this.visibleReviews += 3;
  }


  generateStars(rating: number){
    let stars = '';
    for (let i = 1; i <= 5; i++) {
      if (i <= rating) {
        stars += `<i class="fas fa-star text-primary"></i>`;
      } else {
        stars += `<i class="fas fa-star"></i>`;
      }
    }
    return stars;
  }
}
