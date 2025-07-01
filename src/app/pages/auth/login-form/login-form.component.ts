import { Component } from '@angular/core';
import { AuthService } from '../../../shared/services/auth.service'; 
import { IUserLogin } from '../../../shared/types/IUserLogin'; 
import { Router, RouterLink } from '@angular/router'; 
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms'; 
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.css'],
  imports:[ReactiveFormsModule, NgIf, RouterLink]
})
export class LoginFormComponent {

 
  loginForm: FormGroup;
  errorMessage: string = ''; 


  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {
  
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]], 
      password: ['', [Validators.required, Validators.minLength(6)]], 
    });
  }


  login() {
    if (this.loginForm.valid) {
      this.authService.login(this.loginForm.value).subscribe({
        next: (response) => {
          if (response.success) {
            this.router.navigate(['/home']);
          }
        },
        error: (err) => {
          if (err.error?.message === "Invalid credentials.") {
            this.errorMessage = "Credenciales inválidas, revise lo ingresado.";
          } else {
            this.errorMessage = err.error?.error || 'Hubo un problema con el inicio de sesión.';
          }
        }
      });
    } else {
      this.errorMessage = 'Por favor, rellena todos los campos correctamente.';
    }
  }
}
