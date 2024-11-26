import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Order } from '../models/order';

const URL = "http://localhost:3000/orders"

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private readonly http: HttpClient = inject(HttpClient)
  public getOrderByUser(id: string | undefined): Observable<Order[]> {
    return this.http.get<Order[]>(`${URL}/${id}`);
  }
  public getOrder(): Observable<Order[]> {
    return this.http.get<Order[]>(URL)
  }
  public addOrder(c: Order): Observable<Order> {
    return this.http.post<Order>(URL, c)
  }
  public patchOrder(id: string, partialOrder: Partial<Order>): Observable<Order> {
    return this.http.patch<Order>(`${URL}/${id}`, partialOrder);
  }

  public deleteOrder(id: string): Observable<void> {
    return this.http.delete<void>(`${URL}/${id}`);
  }



}
