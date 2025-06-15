import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ICategoryResponse } from '../types/ICategory.interface';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private domainApi = 'http://127.0.0.1:8000/api/categorias';

  constructor(private http: HttpClient) {}

  getCategories(): Observable<ICategoryResponse> {
    return this.http.get<ICategoryResponse>(this.domainApi);
  }
}