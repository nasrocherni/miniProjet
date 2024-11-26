import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable, switchMap } from 'rxjs';
import { Review } from '../models/review';
import { UserService } from './user.service'; 

const URL = "http://localhost:3000/reviews";

@Injectable({
  providedIn: 'root'
})
export class ReviewService {
  private readonly http: HttpClient = inject(HttpClient);
  private readonly userService: UserService = inject(UserService);

  public getReviewById(id: string): Observable<Review> {
    return this.http.get<Review>(`${URL}/${id}`);
  }

  public getReviewsByIds(ids: string[]): Observable<Review[]> {
    const query = `id_in=${ids.join(',')}`;
    return this.http.get<Review[]>(`${URL}?${query}`).pipe(
      map((reviews) => {
        console.log('Fetched Reviews:', reviews);
        return reviews.filter((review) => ids.includes(review.id));
      })
    );
  }



  public getReview(): Observable<Review[]> {
    return this.http.get<Review[]>(URL);
  }

  public addReview(r: Review): Observable<Review> {
    return this.http.post<Review>(URL, r);
  }

  public patchReview(id: string, partialReview: Partial<Review>): Observable<Review> {
    return this.http.patch<Review>(`${URL}/${id}`, partialReview);
  }

  public deleteReview(id: string): Observable<void> {
    return this.http.delete<void>(`${URL}/${id}`);
  }

  public getReviewsWithUserData(): Observable<Review[]> {
    return this.http.get<Review[]>(URL).pipe(
      switchMap(reviews => {
        return this.userService.getUsers().pipe(
          map(users => {
            reviews.forEach(review => {
              if (typeof review.user === 'string') {
                const user = users.find(user => user.id === review.user);
                if (user) {
                  review.user = user;
                } else {
                  console.warn(`User not found for review ID: ${review.id}`);
                }
              }
            });
            return reviews;
          })
        );
      })
    );
  }



}
