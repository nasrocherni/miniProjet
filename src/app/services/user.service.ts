import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { User } from '../models/user';

const URL = "http://localhost:3000/users";

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private readonly http: HttpClient = inject(HttpClient);
  public user = new BehaviorSubject<User | null>(null);
  public getUser = this.user.asObservable();

  setUser(aa: User) {
    this.user.next(aa)
  }

  logOut(): void {
    this.user.next(null);
    localStorage.removeItem("loggedInUserId")
  }


  logInUser(email: string, password: string): Observable<User | null> {
    return this.http.get<User[]>(`${URL}?email=${email}&password=${password}`).pipe(
      map(users => {
        if (users.length > 0) {
          const loggedInUser = users[0];
          this.setUser(loggedInUser);
          console.log("id func", loggedInUser.id);

          localStorage.setItem('loggedInUserId', loggedInUser.id)
          return loggedInUser;
        }
        return null;
      }),
      catchError(error => {
        console.error('Error during login:', error);
        return throwError(() => new Error('Login failed'));
      })
    );
  }

  public getUserById(id: string): Observable<User> {
    return this.http.get<User>(`${URL}/${id}`);
  }

  public getUsers(): Observable<User[]> {
    return this.http.get<User[]>(URL);
  }

  public addUser(user: User): Observable<User> {
    return this.http.post<User>(URL, user);
  }

  public patchUser(id: string, partialUser: Partial<User>): Observable<User> {
    return this.http.patch<User>(`${URL}/${id}`, partialUser).pipe(
      catchError(error => {
        console.error('Error updating user:', error);
        return throwError(() => new Error('Error updating user'));
      })
    );
  }

  public deleteUser(id: string): Observable<void> {
    return this.http.delete<void>(`${URL}/${id}`).pipe(
      catchError(error => {
        console.error('Error deleting user:', error);
        return throwError(() => new Error('Error deleting user'));
      })
    );
  }
}

