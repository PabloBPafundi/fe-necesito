import { Injectable, signal } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { IUserLogin } from '../interfaces/IUserLogin';
import { IUserRegister } from '../interfaces/IUserRegister';
import { catchError, Observable, tap, throwError } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  isAuthenticated = signal<boolean | null>(null);
  private apiAuthUrl = 'http://localhost:8000/api/usuarios';

  constructor(private http: HttpClient, private router: Router) { }


   /* 
  Método para registrarse
  */
  register(user: IUserRegister): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post(`${this.apiAuthUrl}/register`, user, { headers }).pipe(
      catchError((error: HttpErrorResponse) => {
        return throwError(() => new Error(error.message || 'Error desconocido'));
      })
    );
  }

  /* 
  Método para iniciar sesión
  */
  login(user: IUserLogin): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post(`${this.apiAuthUrl}/login`, user, { headers }).pipe(
      tap((response) => {
        this.isAuthenticated.set(true);
      }),
      catchError((error: HttpErrorResponse) => {
        return throwError(() => new Error(error.message || 'Error desconocido'));
      })
    );
  }
}
