import { Component, inject, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { OrderService } from '../../services/order.service';
import { User } from '../../models/user';
import { Order } from '../../models/order';
import { DatePipe, NgClass} from '@angular/common';
import { OrderItem } from '../../models/order-item';
import { Chocolate } from '../../models/chocolate';
import { ChocolateService } from '../../services/chocolate.service';
import { RouterLink } from '@angular/router';


@Component({
  selector: 'app-order-history',
  standalone: true,
  imports: [DatePipe, NgClass, RouterLink],

  templateUrl: './order-history.component.html',
  styleUrl: './order-history.component.css'
})
export class OrderHistoryComponent implements OnInit {
  private readonly userService: UserService = inject(UserService)
  private readonly orderService: OrderService = inject(OrderService)
  private readonly chocolateService: ChocolateService = inject(ChocolateService)
  user!: User | null
  orders: Order[] = []
  chocolates!: Chocolate[]

  ngOnInit(): void {
    this.userService.user.subscribe((user) => {
      this.user = user;
      this.orderService.getOrder().subscribe((orders) => {
        console.log("orders", orders);

        this.orders = orders.filter((order) => order.user === this.user?.id);
        this.chocolateService.getChocolate().subscribe((res) => {
          this.chocolates = res

          orders.forEach(element => {
            element.items.forEach(item => {
              for (const choc of this.chocolates) {
                if (item.chocolate == choc.id) {
                  item.chocolate = choc
                }
              }
            })
          });

        })
      });
    });
  }

  castToChoclate(item: any) {
    return (item as Chocolate).name
  }
  getOrderItemChocolateId(item: OrderItem) {
    return item.chocolate;
  }

  getQuantity(item: OrderItem) {
    return item.quantity
  }
  deleteOrder(orderId: string) {
    if (confirm('Are you sure you want to delete this order?')) {
      this.orderService.deleteOrder(orderId).subscribe(() => {
        this.orders = this.orders.filter(order => order.id !== orderId);
        alert('Order deleted successfully.');
      });
    }
  }
}
