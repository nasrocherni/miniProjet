import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ChocolateService } from '../../services/chocolate.service';
import { Chocolate } from '../../models/chocolate';
import { CategoryService } from '../../services/category.service';
import { ReviewService } from '../../services/review.service';
import { Review } from '../../models/review';
import { NgClass } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { User } from '../../models/user';
import { Category } from '../../models/category';
import { OrderItem } from '../../models/order-item';
import { NavComponent } from '../nav/nav.component';

@Component({
  selector: 'app-shop-detail',
  standalone: true,
  imports: [NgClass, ReactiveFormsModule, RouterLink],
  templateUrl: './shop-detail.component.html',
  styleUrl: './shop-detail.component.css'
})
export class ShopDetailComponent implements OnInit {
  private readonly activatedRoute: ActivatedRoute = inject(ActivatedRoute)
  private readonly router: Router = inject(Router)
  private readonly chocolateService: ChocolateService = inject(ChocolateService)
  private readonly categoryService: CategoryService = inject(CategoryService)
  private readonly reviewService: ReviewService = inject(ReviewService)
  private readonly fb: FormBuilder = inject(FormBuilder)
  private readonly userService: UserService = inject(UserService)
  idChocolate!: number;
  chocolates: Chocolate[] = [];
  chocolatesC: Chocolate[] = [];
  chocolateCounts: any;
  chocolate!: Chocolate;
  categorys: Category[] = [];
  averageRating: number = 0;
  reveiwForm!: FormGroup;
  loggedInUser: User | null = null;
  categoryId: string | null = null;
  chocolateId: string | null = null;
  activeCategoryId: string | null = null;


  ngOnInit(): void {
    this.activatedRoute.params.subscribe(params => {
      this.categoryId = params['categoryId'];
      this.chocolateId = params['chocolateId'];

      this.fetchData();
    });
    this.userService.user.subscribe((user) => {
      this.loggedInUser = user
    })

    this.reveiwForm = this.fb.group({
      message: ['', Validators.required],
      reviewMessage: ['', Validators.required],
      rating: [0, Validators.required]
    });
  }

  addToShop(item: Chocolate){
    const cart = JSON.parse(localStorage.getItem('cart') || '[]') as OrderItem[];

    const existingItem = cart.find((orderItem: OrderItem) => {
      if (orderItem.chocolate && typeof orderItem.chocolate !== 'string') {
        return orderItem.chocolate.id === item.id;
      }
      return false;
    });
    if (existingItem) {
      existingItem.quantity += 1;
      existingItem.totalPrice = item.price * existingItem.quantity
    } else {
      cart.push(new OrderItem(item, 1, item.price));
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    console.log('Cart updated:', cart);
    NavComponent.cartUpdated.emit();
  }

  fetchData(){
    this.categoryService.getCategory().subscribe(categories => {
      this.categorys = categories;
      this.chocolateService.getChocolate().subscribe(chocolates => {
        this.chocolates = chocolates;
        this.chocolateCounts = {};

        categories.forEach(category => {
          this.chocolateCounts[category.id] = chocolates.filter(chocolate => chocolate.category === category.id).length;
        });

        this.chocolateService.getChocolateById(this.chocolateId!).subscribe(chocolate => {
          this.chocolate = chocolate;

          this.chocolatesC = this.getChocolatesByCategory(String(this.chocolate.category), this.chocolates).filter(choc => choc.id !== this.chocolate.id);

          this.categoryService.getCategoryById(String(chocolate.category)).subscribe(category => {
            this.chocolate.category = category.name;
          });

          this.resolveReviews(this.chocolate);
        });
      });
    });
  }



  resolveReviews(chocolate: Chocolate){
    const reviewIds = chocolate.reviews.filter(r => typeof r === 'string');
    if (reviewIds.length > 0) {
      this.reviewService.getReviewsByIds(reviewIds).subscribe((resolvedReviews) => {

        this.averageRating = this.calculateAverageRating(resolvedReviews);
      });
    } else {
      this.averageRating = 0;
    }
  }



  calculateAverageRating(reviews: Review[]) {
    if (reviews.length === 0) {
      return 0;
    }
    const totalRating = reviews.reduce((sum, review) => sum + (review.rating || 0), 0);
    return parseFloat((totalRating / reviews.length).toFixed(2));
  }


  getChocolatesByCategory(categoryId: string, chocolates: Chocolate[]) {
    return chocolates.filter((chocolate) => chocolate.category === categoryId);
  }



  onSubmit() {
    if (this.loggedInUser) {
      if (this.reveiwForm.valid) {
        const newReview: Review = new Review(
          "",
          this.reveiwForm.value.message,
          this.loggedInUser.id,
          this.reveiwForm.value.reviewMessage,
          this.reveiwForm.value.rating
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
              console.log('Review added successfully:', reviewResponse);
              this.updateChocolateReviews(reviewResponse.id);
              this.reveiwForm.reset()
            },
            error: (err) => {
              console.error('Error submitting review:', err);
              alert('Failed to submit the review. Please try again.');
            },
          });
        })
      }
    }
    else {
      alert("you must be connected to submit a review")
    }

  }
  updateChocolateReviews(id: string) {
    this.chocolate.reviews.push(id)
    this.chocolateService.patchChocolate(this.chocolate.id, { reviews: this.chocolate.reviews }).subscribe(() => {
      console.log(`Chocolate ${this.chocolate.id} updated with new review.`);
      alert('Your review has been submitted successfully!');
      this.reveiwForm.reset();
    });
  }


  get message() {
    return this.reveiwForm.get('message');
  }

  get reviewMessage() {
    return this.reveiwForm.get('reviewMessage');
  }

  get rating() {
    return this.reveiwForm.get('rating');
  }
  navigateToCategory(categoryId: string | null){
    this.router.navigate(['/shop', categoryId || '']);
  }
}

