import { Component, inject, OnInit } from '@angular/core';
import { UserService } from '../../../services/user.service';
import { ChocolateService } from '../../../services/chocolate.service';
import { OrderService } from '../../../services/order.service';
import { User } from '../../../models/user';
import { Order } from '../../../models/order';
import { Chocolate } from '../../../models/chocolate';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-home-admin',
  standalone: true,
  imports: [DatePipe],
  templateUrl: './home-admin.component.html',
  styleUrl: './home-admin.component.css'
})
export class HomeAdminComponent implements OnInit {


  private readonly userService: UserService = inject(UserService)
  private readonly chocolateService: ChocolateService = inject(ChocolateService)
  private readonly orderService: OrderService = inject(OrderService)
  admins: User[] = []
  users: User[] = []
  orders: Order[] = []
  pendingOrders: Order[] = []
  chocolates: Chocolate[] = []
  selectedUser: User | null = null;


  ngOnInit(): void {
    this.userService.getUsers().subscribe((res) => {
      this.users = res.filter(user => user.role === 'user')
      this.admins = res.filter(admin => admin.role === 'admin')
    })
    this.chocolateService.getChocolate().subscribe((res) => {
      this.chocolates = res
    })
    this.orderService.getOrder().subscribe((orders) => {
      this.orders = orders
      this.pendingOrders = orders.filter(order => order.status === 'pending');
    })

  }
  promptMakeAdmin(user: User) {
    this.selectedUser = user;
    const modal = new bootstrap.Modal(document.getElementById('confirmModal')!);
    modal.show();
  }
  makeAdmin(user: User | null) {
    if (!user) return;
    this.userService.patchUser(user.id, { role: 'admin' }).subscribe(() => {
      user.role = 'admin';
      this.users = this.users.filter((u) => u.id !== user.id);
      this.admins.push(user);
      this.selectedUser = null;
    });
  }

  markAsCompleted(order: Order) {
    this.orderService.patchOrder(order.id, { status: 'completed' }).subscribe((updatedOrder) => {
      order.status = updatedOrder.status;
      this.pendingOrders = this.orders.filter(o => o.status === 'pending');
    })
  }
  getUserFullName(user: User | string) {
    if (typeof user === 'string') {
      return user;
    }
    return `${user.firstname} ${user.lastname}`;
  }
}
