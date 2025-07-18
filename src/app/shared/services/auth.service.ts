
import { Injectable, signal } from '@angular/core';
import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { IUserLogin } from '../types/IUserLogin';
import { IUserRegister } from '../types/IUserRegister';
import { catchError, Observable, tap, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { UserService } from './user.service';
import { ILoginResponse, ILoginError } from '../types/ILoginResponse';
import { isPlatformBrowser } from '@angular/common';
import { PLATFORM_ID, Inject } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { jwtDecode } from 'jwt-decode';
import { IDecodedToken } from '../types/IDecodedToken';
import { environment } from '../../../environments/environment';


@Injectable({
  providedIn: 'root',
})
export class AuthService {
  isAuthenticated = signal<boolean>(false);
  private apiAuthUrl = `${environment.apiBaseUrl}/usuarios`;
  private readonly STORAGE_USER_KEY = 'user_data';
  private isBrowser: boolean;

  constructor(
    private http: HttpClient,
    private router: Router,
    private userService: UserService,
    private cookieService: CookieService,
    @Inject(PLATFORM_ID) platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
    if (this.isBrowser) {
      this.checkStoredUserData();
    }
  }

  /*
   * Método para registrarse
   */
  register(user: IUserRegister): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http
      .post(`${this.apiAuthUrl}/register`, user, { headers })
      .pipe(
        catchError((error: HttpErrorResponse) => {
          return throwError(
            () => new Error(error.message || 'Error desconocido')
          );
        })
      );
  }

  /*
   * Método para iniciar sesión
   */
  login(user: IUserLogin): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http
      .post<ILoginResponse>(`${this.apiAuthUrl}/login`, user, { headers })
      .pipe(
        tap((response) => {
          if (response.success) {
            const usuario = response.result;
            this.isAuthenticated.set(true);
            this.userService.userName.set(usuario.nombre);
            this.userService.userId.set(usuario.id);
            this.userService.userId();

            if (this.isBrowser) {
              this.saveUserData(usuario, response.token);
            }
          }
        }),
        catchError((error: HttpErrorResponse) => {
          return throwError(
            () => new Error(error.message || 'Error desconocido')
          );
        })
      );
  }

  /*
   * Método para guardar datos del usuario en localStorage
   */
  private saveUserData(usuario: any, token: string): void {
    if (!this.isBrowser) return;

    const userData = {
      id: usuario.id,
      nombre: usuario.nombre,
      token,
      isAuthenticated: true,
    };

    try {
      localStorage.setItem(this.STORAGE_USER_KEY, JSON.stringify(userData));
    } catch (e) {
      console.error('Error saving to localStorage:', e);
    }
  }
  /*
   * Método para verificar si hay datos guardados al cargar la aplicación
   */
  checkStoredUserData(): void {
    if (!this.isBrowser) return;

    try {
      const storedData = localStorage.getItem(this.STORAGE_USER_KEY);

      if (storedData) {
        const userData = JSON.parse(storedData);
        this.isAuthenticated.set(userData.isAuthenticated);
        this.userService.userName.set(userData.nombre);
        this.userService.userId.set(userData.id);
      }
    } catch (error) {
      console.error('Error al procesar datos guardados:', error);
      this.clearUserData();
    }
  }

  /*
   * Método para cerrar sesión
   */
  logout() {
    // Resetear los estados
    this.isAuthenticated.set(false);
    this.userService.userName.set(null);

    // Eliminar datos del localStorage (solo en navegador)
    if (this.isBrowser) {
      this.clearUserData();
    }

    // Redireccionar
    this.router.navigate(['/auth']);
  }

  /*
   * Método para eliminar datos del localStorage
   */
  private clearUserData(): void {
    if (!this.isBrowser) return;

    try {
      localStorage.removeItem(this.STORAGE_USER_KEY);
    } catch (e) {
      console.error('Error removing from localStorage:', e);
    }
  }



  public isTokenValid(): boolean {
  if (!this.isBrowser) return false;

  const storedData = localStorage.getItem(this.STORAGE_USER_KEY);
  if (!storedData) return false;

  try {
    const userData = JSON.parse(storedData);
    const token = userData.token;

    const decoded: IDecodedToken = jwtDecode(token);
    const currentTime = Math.floor(Date.now() / 1000);

    return decoded.exp > currentTime;
  } catch (e) {
    console.error('Error al validar token:', e);
    return false;
  }
}
}
