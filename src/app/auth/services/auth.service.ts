import { Injectable, signal} from '@angular/core';
import { IUserLogin } from '../interfaces/IUserLogin';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  isAuthenticated = signal<boolean|null>(null);

  constructor() { }

  signUp(user: IUserLogin) {
    this.isAuthenticated.set(true);
  }
}
