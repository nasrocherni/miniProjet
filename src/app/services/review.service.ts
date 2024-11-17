import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Review } from '../models/review';

const URL="http://localhost:3000/reviews"
@Injectable({
  providedIn: 'root'
})
export class ReviewService {
  private readonly http:HttpClient=inject(HttpClient)
  public getReview():Observable<Review[]>{
    return this.http.get<Review[]>(URL)
  }
  public addReview(r:Review):Observable<Review>{
    return this.http.post<Review>(URL,r)
  }
  public patchReview(id: string, partialReview: Partial<Review>): Observable<Review> {
    return this.http.patch<Review>(`${URL}/${id}`, partialReview);
  }

  public deleteReview(id: string): Observable<void> {
    return this.http.delete<void>(`${URL}/${id}`);
  }
}
