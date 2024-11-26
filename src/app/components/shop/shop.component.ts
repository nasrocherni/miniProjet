import { Component, inject, OnInit } from '@angular/core';
import { CategoryService } from '../../services/category.service';
import { Category } from '../../models/category';
import { ChocolateService } from '../../services/chocolate.service';
import { Chocolate } from '../../models/chocolate';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { OrderItem } from '../../models/order-item';
import { NavComponent } from '../nav/nav.component';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { ChocolateItemComponent } from "../chocolate-item/chocolate-item.component";

@Component({
  selector: 'app-shop',
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule, ChocolateItemComponent],
  templateUrl: './shop.component.html',
  styleUrl: './shop.component.css',
})
export class ShopComponent implements OnInit {
  private readonly categoryService: CategoryService = inject(CategoryService);
  private readonly chocolateService: ChocolateService = inject(ChocolateService);
  private readonly route: ActivatedRoute = inject(ActivatedRoute);
  private readonly router: Router = inject(Router);

  categorys: Category[] = [];
  chocolates: Chocolate[] = [];
  filteredChocolates: Chocolate[] = [];
  chocolateCounts: { [key: string]: number } = {};
  paginatedChocolates: Chocolate[] = [];
  itemsPerPage: number = 6;
  currentPage: number = 1;
  totalPages: number = 0;
  activeCategoryId: string | null = null;
  searchControl: FormControl = new FormControl('');
  priceControl: FormControl = new FormControl('');


  ngOnInit(): void {
    this.loadCategoriesAndChocolates();
    this.searchControl.valueChanges.subscribe(() => this.filterChocolates(this.activeCategoryId));
    this.priceControl.valueChanges.subscribe(() => this.filterChocolates(this.activeCategoryId));


    this.route.params.subscribe((params) => {
      const categoryId = params['categoryId'];
      console.log('Route param changed, categoryId:', categoryId);
      this.filterChocolates(categoryId || null);
    });
  }


  loadCategoriesAndChocolates() {
    this.categoryService.getCategory().subscribe((categories) => {
      this.categorys = categories;

      this.chocolateService.getChocolate().subscribe((chocolates) => {
        this.chocolates = chocolates;

        categories.forEach(category => {
          this.chocolateCounts[category.id] = chocolates.filter(chocolate => chocolate.category === category.id).length;
        });

        this.totalPages = Math.ceil(this.chocolates.length / this.itemsPerPage);
        this.filterChocolates(this.activeCategoryId);
      });
    });
  }

  filterChocolates(categoryId: string | null) {
    this.activeCategoryId = categoryId;
  
    let filtered = this.chocolates;
  
    if (categoryId) {
      filtered = filtered.filter(chocolate => chocolate.category === categoryId);
    }
  
    const searchTerm = this.searchControl.value?.toLowerCase() || '';
    if (searchTerm) {
      filtered = filtered.filter(chocolate => chocolate.name.toLowerCase().includes(searchTerm));
    }
  
    const maxPrice = parseFloat(this.priceControl.value);
    if (!isNaN(maxPrice)) {
      filtered = filtered.filter(chocolate => chocolate.price <= maxPrice);
    }
  
    this.filteredChocolates = filtered;
    this.currentPage = 1;
    this.totalPages = Math.ceil(this.filteredChocolates.length / this.itemsPerPage);
    this.updatePaginatedChocolates();
  }
  

  updatePaginatedChocolates() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;

    console.log('Start Index:', startIndex, 'End Index:', endIndex);

    this.paginatedChocolates = this.filteredChocolates.slice(startIndex, endIndex);
    console.log('Updated paginated chocolates:', this.paginatedChocolates);
  }
  addToShop(item: Chocolate) {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]') as OrderItem[];

    const existingItem = cart.find((orderItem: OrderItem) => 
      orderItem.chocolate && typeof orderItem.chocolate !== 'string' && 
      orderItem.chocolate.id === item.id
    );
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


  goToPage(page: number) {
    this.currentPage = page;
    this.updatePaginatedChocolates();
  }

  navigateToCategory(categoryId: string | null) {
    this.router.navigate([categoryId ? `/main/shop/${categoryId}` : '/main/shop']).then(() => {
      this.filterChocolates(categoryId);
    });
  }



}
