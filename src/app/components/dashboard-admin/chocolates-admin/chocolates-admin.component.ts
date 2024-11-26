import { Component, inject, OnInit } from '@angular/core';
import { Chocolate } from '../../../models/chocolate';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ChocolateService } from '../../../services/chocolate.service';
import { Router, RouterLink } from '@angular/router';
import { ReviewService } from '../../../services/review.service';
import { CategoryService } from '../../../services/category.service';
import { Category } from '../../../models/category';

@Component({
  selector: 'app-chocolates-admin',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './chocolates-admin.component.html',
  styleUrl: './chocolates-admin.component.css'
})
export class ChocolatesAdminComponent implements OnInit {
  private router: Router = inject(Router)
  private fb: FormBuilder = inject(FormBuilder)
  private readonly chocolateService: ChocolateService = inject(ChocolateService)
  private readonly categoryService: CategoryService = inject(CategoryService);

  private readonly reviewService: ReviewService = inject(ReviewService)
  filteredChocolates: Chocolate[] = []; 

  chocolates: Chocolate[] = [];
  chocolateForm!: FormGroup;
  categorys!: Category[]
  searchControl: FormControl = new FormControl('');


  ngOnInit(): void {
    this.loadChocolates();
    this.chocolateForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      type: ['', [Validators.required]],
      description: ['', [Validators.required]],
      price: ['', [Validators.required, Validators.min(0)]],
      availability: [true, [Validators.required]],
      imageUrl: ['', [Validators.required]],
      category: ['', [Validators.required]],
    });
    this.categoryService.getCategory().subscribe((res) => {
      this.categorys = res
    })
    this.searchControl.valueChanges.subscribe((searchTerm) => {
      this.filteredChocolates = this.filterChocolates(searchTerm);
    });
  }

  loadChocolates() {
    this.chocolateService.getChocolate().subscribe((data) => {
      this.chocolates = data
      this.filteredChocolates = data;
    });
  }
  filterChocolates(searchTerm: string): Chocolate[] {
    if (!searchTerm) {
      return this.chocolates;
    }

    searchTerm = searchTerm.toLowerCase(); 
    return this.chocolates.filter((chocolate) =>
      chocolate.name.toLowerCase().includes(searchTerm) || chocolate.type.toLowerCase().includes(searchTerm) || chocolate.description.toLowerCase().includes(searchTerm)   
    );
  }

  onSubmit() {
    if (this.chocolateForm.valid) {
      const newChocolate = new Chocolate(
        '',
        this.chocolateForm.value.name,
        this.chocolateForm.value.type,
        this.chocolateForm.value.description,
        this.chocolateForm.value.price,
        this.chocolateForm.value.imageUrl,
        this.chocolateForm.value.availability,
        [],
        this.chocolateForm.value.category
      );
      newChocolate.id = String(parseInt(this.chocolates[this.chocolates.length - 1].id) + 1)
      this.chocolateService.addChocolate(newChocolate).subscribe(() => {
        this.chocolateForm.reset();
        this.loadChocolates();
      });
    }
  }
  navigateToEdit(chocolate: Chocolate) {
    this.router.navigate(['/dashboard/chocolates', chocolate.id]);
  }
  deleteChocolate(chocolate: Chocolate) {
    this.chocolateService.deleteChocolate(chocolate.id).subscribe(() => {
      this.loadChocolates();
      let reviewIds = chocolate.reviews.filter(r => typeof r === 'string');
      this.reviewService.getReviewsByIds(reviewIds).subscribe((resolvedReviews) => {
        resolvedReviews.forEach((res) => {
          this.reviewService.deleteReview(res.id).subscribe()
        })
      });
    });
  }
}
