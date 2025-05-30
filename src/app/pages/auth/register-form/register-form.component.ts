import { Component } from '@angular/core';
import { AuthService } from '../../../services/auth.service'; 
import { Router, RouterLink } from '@angular/router'; 
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule, AbstractControl, AbstractControlOptions   } from '@angular/forms'; 
import { NgClass, NgIf } from '@angular/common';

@Component({
  selector: 'app-register-form',
  imports:[ReactiveFormsModule, NgIf, RouterLink, NgClass],
  templateUrl: './register-form.component.html',
  styleUrl: './register-form.component.css'
})
export class RegisterFormComponent {


  signUpForm: FormGroup;
  errorMessage: string = ''; 


  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {


    const formOptions: AbstractControlOptions = {
      validators: this.passwordMatchValidator
    };

    this.signUpForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(2)]], 
      apellido: ['', [Validators.required, Validators.minLength(2)]], 
      dni: ['', [Validators.required, Validators.pattern('^[0-9]{7,8}$')]], 
      email: ['', [Validators.required, Validators.email]], 
      password: ['', [Validators.required, Validators.minLength(6)]], 
      confirmPassword: ['', [Validators.required]]
    }, { validators: this.passwordMatchValidator });
  }
  
  passwordMatchValidator(form: AbstractControl) {
    const password = form.get('password')?.value;
    const confirmPassword = form.get('confirmPassword')?.value;
    return password && confirmPassword && password !== confirmPassword ? { mismatch: true } : null;
  }

  signUp() {
    if (this.signUpForm.valid) {
      this.authService.register(this.signUpForm.value).subscribe({
        next: (response) => {
          if (response.success) {
            this.router.navigate(['/auth/login']);
          } else {
            this.errorMessage = response.error || 'Hubo un problema con el registro';
          }
        },
        error: () => {
          this.errorMessage = 'Error en la comunicación con el servidor. Intenta nuevamente.';
        }
      });
    } else {
      this.errorMessage = 'Por favor, rellena todos los campos correctamente.';
    }
  }}