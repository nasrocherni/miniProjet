import { Component, inject } from '@angular/core';
import { Order } from '../../../models/order';
import { User } from '../../../models/user';
import { OrderService } from '../../../services/order.service';
import { UserService } from '../../../services/user.service';
import { FormsModule } from '@angular/forms';
import { DatePipe, NgClass, TitleCasePipe } from '@angular/common';
import { ChocolateService } from '../../../services/chocolate.service';
import { Chocolate } from '../../../models/chocolate';

@Component({
  selector: 'app-orders-admin',
  standalone: true,
  imports: [FormsModule, DatePipe, NgClass, TitleCasePipe],
  templateUrl: './orders-admin.component.html',
  styleUrl: './orders-admin.component.css'
})
export class OrdersAdminComponent {
  private readonly orderService: OrderService = inject(OrderService)
  private readonly userService: UserService = inject(UserService)
  private readonly chocolateService: ChocolateService = inject(ChocolateService)
  orders: Order[] = [];
  users: User[] = [];
  chocolates!: Chocolate[]
  filterDate: string = '';
  filterStatus: string = '';
  filterUser: string = '';

  filteredOrders: Order[] = [];



  ngOnInit(): void {
    this.orderService.getOrder().subscribe((orders) => {
      this.orders = orders;
      this.applyFilters();
    });
    this.chocolateService.getChocolate().subscribe((choc) => {
      this.chocolates = choc
    })

    this.userService.getUsers().subscribe((users) => {
      this.users = users.filter(user => user.role === 'user')
    });
  }
  getChocolatName(chocolateId: string) {
    return this.chocolates.find(choc => choc.id === chocolateId)?.name
  }
  getUserName(userId: string | User) {
    let user = this.users.find(user => user.id === userId)
    return `${user?.firstname} ${user?.lastname}`
  }

  applyFilters(){
    this.filteredOrders = this.orders.filter(order => {
      const matchesDate = this.filterDate ? new Date(order.date).toLocaleDateString() === new Date(this.filterDate).toLocaleDateString() : true;

      const matchesStatus = this.filterStatus ? order.status === this.filterStatus : true;

      const matchesUser = this.filterUser ? order.user === this.filterUser : true;

      return matchesDate && matchesStatus && matchesUser;
    });
  }

}
