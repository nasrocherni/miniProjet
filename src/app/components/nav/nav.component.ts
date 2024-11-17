import { Component, inject, OnInit } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { OrderService } from '../../services/order.service';
import { Order } from '../../models/order';

@Component({
  selector: 'app-nav',
  standalone: true,
  imports: [RouterLink ,RouterLinkActive],
  templateUrl: './nav.component.html',
  styleUrl: './nav.component.css'
})
export class NavComponent implements OnInit {
  private readonly orederService:OrderService=inject(OrderService)
  orders:Order[]=[]
  totalItems: number = 0;
  ngOnInit(): void {
    this.orederService.getOrder().subscribe(
      (data) => {
        this.orders = data;
        this.calculateTotalItems();
      })
  }
  private calculateTotalItems(): void {
    this.totalItems = this.orders.reduce((total, order) => {
      return total + order.items.reduce((itemTotal, item) => itemTotal + item.quantity, 0);
    }, 0);
  }
}
