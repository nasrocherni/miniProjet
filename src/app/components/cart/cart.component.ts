import { Component, inject, OnInit } from '@angular/core';
import { OrderService } from '../../services/order.service';
import { Chocolate } from '../../models/chocolate';
import { OrderItem } from '../../models/order-item';
import { Order } from '../../models/order';
import { RouterLink } from '@angular/router';
import { NavComponent } from '../nav/nav.component';
import { UserService } from '../../services/user.service';
import { User } from '../../models/user';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css'],
})
export class CartComponent implements OnInit {
  private readonly orderService: OrderService = inject(OrderService);
  private readonly userService: UserService = inject(UserService);

  chocolate: Chocolate[] = [];
  user: User | null = null;
  orderItems: OrderItem[] = [];
  order!: Order;
  isLoggedIn: boolean = false
  showAlert: boolean = false;
  totalAmount!: number
  showSuccess: boolean = false;

  ngOnInit(): void {
    this.userService.user.subscribe(loggedIn => {
      this.user = loggedIn;
      if (this.user != null) {
        this.showSuccess = true
      }
      else {
        this.showAlert = true
      }

    });
    const cartData = localStorage.getItem('cart');
    if (cartData) {
      this.orderItems = JSON.parse(cartData) as OrderItem[];
      this.totalAmount = this.calculateTotalAmount();
    }
  }

  resolveChocolateData() {

    this.orderItems.forEach((item) => {
      if (typeof item.chocolate !== 'string') {
        this.updateItemTotal(item);
        this.updateCart();
        item.totalPrice = item.chocolate.price * item.quantity
        item.chocolate = item.chocolate.id;

      };
    });
  }

  getChocolateName(item: OrderItem) {
    return (item.chocolate as Chocolate).name
  }

  getChocolateImage(item: OrderItem) {
    return (item.chocolate as Chocolate).imageUrl
  }

  getChocolatePrice(item: OrderItem) {
    return (item.chocolate as Chocolate).price
  }

  decreaseQuantity(item: OrderItem) {
    if (item.quantity > 1) {
      item.quantity--;
      this.updateItemTotal(item);
      this.updateCart();
    }
  }

  increaseQuantity(item: OrderItem) {
    item.quantity++;
    this.updateItemTotal(item);
    this.updateCart();
  }

  removeItem(item: OrderItem) {
    const index = this.orderItems.indexOf(item);
    if (index !== -1) {
      this.orderItems.splice(index, 1);
      this.updateCart();
    }
  }

  updateItemTotal(item: OrderItem) {
    const chocolatePrice = this.getChocolatePrice(item);
    item.totalPrice = chocolatePrice * item.quantity;
  }

  updateCart() {
    localStorage.setItem('cart', JSON.stringify(this.orderItems));
    this.totalAmount = this.calculateTotalAmount();
    NavComponent.cartUpdated.emit();
  }
  checkout() {
    if (this.user) {
      this.resolveChocolateData();
      this.order = new Order(
        "",
        this.user.id,
        this.orderItems,
        this.totalAmount,
        'pending',
        new Date()
      );
      this.orderService.getOrder().subscribe((res) => {
        if (res.length == 0) {
          this.order.id = String(1)
        } else {
          this.order.id = String(parseInt(res[res.length - 1].id) + 1)

        }
        this.orderService.addOrder(this.order).subscribe(() => {
          localStorage.removeItem('cart');
          this.orderItems = [];
          this.totalAmount = 0;
          NavComponent.cartUpdated.emit();
        });
      })

    } else {
      console.error('User or User ID is not defined.');
    }
  }


  calculateTotalAmount() {
    return this.orderItems.reduce((total, item) => total + item.totalPrice, 0);
  }
}
