import { Injectable, signal } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { IUserLogin } from '../interfaces/IUserLogin';
import { IUserRegister } from '../interfaces/IUserRegister';
import { catchError, Observable, tap, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { UserService } from '../../user/services/user.service';
import { ILoginResponse } from '../interfaces/ILoginResponse';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  isAuthenticated = signal<boolean | null>(null);
  private apiAuthUrl = 'http://localhost:8000/api/usuarios';

  constructor(private http: HttpClient, private router: Router, private userService: UserService) { }


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
    return this.http.post<ILoginResponse>(`${this.apiAuthUrl}/login`, user, { headers }).pipe(
      tap((response) => {
        if (response.success && response.result.length > 0) {
          const usuario = response.result[0];
          this.isAuthenticated.set(true);
          this.userService.userName.set(usuario.nombre);
        }
      }),
      catchError((error: HttpErrorResponse) => {
        return throwError(() => new Error(error.message || 'Error desconocido'));
      })
    );
  }


logout(){
  this.isAuthenticated.set(false);
  this.userService.userName.set(null);
  this.router.navigate(['/auth']);

}

}