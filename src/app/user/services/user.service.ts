import { Injectable } from '@angular/core';
import { signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor() { }

  
  userName = signal<string | null>(null);
  userId = signal<number | null>(null);
}
