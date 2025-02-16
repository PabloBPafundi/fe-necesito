
import { Injectable, signal } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { IUserLogin } from '../../interfaces/IUserLogin'
@Injectable({
  providedIn: 'root'
})
export class ProductService {

  constructor(private http: HttpClient, private router: Router) {

  }



  signInLocal(user: IUserLogin): Observable<IUserLogin> {
    const apiUrl: string = 'http://localhost:8080/';
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
  
    return this.http.post<IUserLogin>(apiUrl, user, { headers }).pipe(
      tap((response) => {
        
    })
  );
}
}
