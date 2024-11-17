import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { OrderItem } from '../models/order-item';

const URL="http://localhost:3000/orders/"

@Injectable({
  providedIn: 'root'
})
export class OrderItemService {
  private readonly http:HttpClient=inject(HttpClient)
  public getOrderItem(id:string):Observable<OrderItem[]>{
    return this.http.get<OrderItem[]>(`${URL}${id}/items`)
  }
  public addOrderItem(id:string,c:OrderItem):Observable<OrderItem>{
    return this.http.post<OrderItem>(`${URL}${id}/items`,c)
  }
  public patchOrderItem(id: string, itemId: string, partialOrderItem: Partial<OrderItem>): Observable<OrderItem> {
    return this.http.patch<OrderItem>(`${URL}${id}/items/${itemId}`, partialOrderItem)
  }
  public deleteOrderItem(id: string, itemId: string): Observable<void> {
    return this.http.delete<void>(`${URL}${id}/items/${itemId}`)

}
}
