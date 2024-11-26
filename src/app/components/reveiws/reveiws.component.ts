import { Component, inject, OnInit } from '@angular/core';
import { User } from '../../models/user';
import { Review } from '../../models/review';
import { UserService } from '../../services/user.service';
import { ReviewService } from '../../services/review.service';
import { ChocolateService } from '../../services/chocolate.service';

@Component({
  selector: 'app-reveiws',
  standalone: true,
  imports: [],
  templateUrl: './reveiws.component.html',
  styleUrl: './reveiws.component.css'
})
export class ReveiwsComponent implements OnInit {

  private readonly chocolateService: ChocolateService = inject(ChocolateService)

  private readonly userService: UserService = inject(UserService)
  private readonly reviewService: ReviewService = inject(ReviewService)
  user!: User | null
  reviews: Review[] = []
  ngOnInit(): void {
    this.userService.user.subscribe((res) => {
      this.user = res

    })
    this.reviewService.getReview().subscribe((res) => {
      this.reviews = res.filter((res) => res.user === this.user?.id)
    })

  }
  generateStars(rating: number) {
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
  onDelete(review: Review) {
    if (!this.user) return;
    this.reviewService.deleteReview(review.id).subscribe(() => {
      this.chocolateService.getChocolate().subscribe((chocolates) => {
        const chocolate = chocolates.find((c) => c.reviews.includes(review.id));
        if (chocolate) {
          const updatedReviews = chocolate.reviews.filter((r) => r !== review.id);
          this.chocolateService.patchChocolate(chocolate.id, { reviews: updatedReviews }).subscribe(() => {
            this.reviews = this.reviews.filter((r) => r.id !== review.id);
          });
        }
      });
    });
  }


}
