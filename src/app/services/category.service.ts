import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Category } from '../models/category';

const URL = "http://localhost:3000/categories"

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private readonly http: HttpClient = inject(HttpClient)
  public getCategoryById(id: string): Observable<Category> {
    return this.http.get<Category>(`${URL}/${id}`);
  }
  public getCategory(): Observable<Category[]> {
    return this.http.get<Category[]>(URL)
  }
  public addCategory(c: Category): Observable<Category> {
    return this.http.post<Category>(URL, c)
  }
  public patchCategory(id: string, partialCategory: Partial<Category>): Observable<Category> {
    return this.http.patch<Category>(`${URL}/${id}`, partialCategory);
  }

  public deleteCategory(id: string): Observable<void> {
    return this.http.delete<void>(`${URL}/${id}`);
  }

}
