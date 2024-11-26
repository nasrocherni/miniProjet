import { Component, EventEmitter, inject, OnInit } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { OrderService } from '../../services/order.service';
import { Order } from '../../models/order';
import { UserService } from '../../services/user.service';
import { NgIf } from '@angular/common';
import { OrderItem } from '../../models/order-item';
import { User } from '../../models/user';

@Component({
  selector: 'app-nav',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {
  static cartUpdated = new EventEmitter<void>();
  private readonly userService: UserService = inject(UserService);
  private readonly route: Router = inject(Router);
  private readonly orderService: OrderService = inject(OrderService);
  orders: Order[] = [];
  totalItems: number = 0;
  loggedIn: boolean = false;
  user!: User | null

  ngOnInit(): void {
    this.userService.user.subscribe((connectedUser) => {
      this.user = connectedUser;
      console.log("LoggedIn user:", this.user);
    });
    this.calculateTotalItems();
    NavComponent.cartUpdated.subscribe(() => {
      this.calculateTotalItems();
    });

  }

  private calculateTotalItems() {
    const cartData = localStorage.getItem('cart');
    if (cartData) {
      const orderItems = JSON.parse(cartData) as OrderItem[];
      this.totalItems = orderItems.reduce((total, item) => total + item.quantity, 0);
    }
    else {
      this.totalItems = 0
    }
  }

  logOut() {
    this.userService.logOut();
    this.route.navigate(['/main/home'])
  }

}
