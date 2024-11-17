import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Chocolate } from '../models/chocolate';
const URL="http://localhost:3000/chocolates"
@Injectable({
  providedIn: 'root'
})
export class ChocolateService {
  private readonly http:HttpClient=inject(HttpClient)
  public getChocolate():Observable<Chocolate[]>{
    return this.http.get<Chocolate[]>(URL)
  }
  public addChocolate(c:Chocolate):Observable<Chocolate>{
    return this.http.post<Chocolate>(URL,c)
  }
  public patchChocolate(id: string, partialChocolate: Partial<Chocolate>): Observable<Chocolate> {
    return this.http.patch<Chocolate>(`${URL}/${id}`, partialChocolate);
  }

  public deleteChocolate(id: string): Observable<void> {
    return this.http.delete<void>(`${URL}/${id}`);
  }
}
