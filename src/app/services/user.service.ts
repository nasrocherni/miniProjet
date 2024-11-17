import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../models/user';

const URL="http://localhost:3000/users"

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private readonly http:HttpClient=inject(HttpClient)
  public getUser():Observable<User[]>{
    return this.http.get<User[]>(URL)
  }
  public addUser(c:User):Observable<User>{
    return this.http.post<User>(URL,c)
  }
  public patchUser(id: string, partialUser: Partial<User>): Observable<User> {
    return this.http.patch<User>(`${URL}/${id}`, partialUser);
  }

  public deleteUser(id: string): Observable<void> {
    return this.http.delete<void>(`${URL}/${id}`);
  }

}
