
import { Injectable, signal } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  constructor(private http: HttpClient, private router: Router) {

  }


  signInLocal(user: ): Observable<> {
    const apiUrl: string = 'http://localhost:8080/';
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
  
    return this.http.post<>(apiUrl, user, { headers }).pipe(
      tap((response) => {
        
    })
  );
}
}
