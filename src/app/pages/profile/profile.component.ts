import { NgFor, NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { LucideAngularModule, User, Edit, Loader, Trash2 } from 'lucide-angular';
import { ProfileService } from './profile.service';
import { UserService } from '../../services/user.service';
import { firstValueFrom } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { UserProfile } from './IProfile';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [LucideAngularModule, NgIf, FormsModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css',
})
export class ProfileComponent implements OnInit {
  readonly User = User;
  readonly Edit = Edit;
  readonly Loader = Loader;
  readonly Trash2 = Trash2;

  user: UserProfile = {
    nombre: '',
    apellido: '',
    georreferencias: '',
    email: ''
  };

  isLoading: boolean = true;
  isEditing: boolean = false;
  editUserData: any = {};

  constructor(
    private http: HttpClient, 
    private userService: UserService,
    private profileService: ProfileService,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadUserProfile();
  }

  async deleteUserAccount(): Promise<void> {
    const confirmDelete = confirm('¿Estás seguro de que quieres eliminar tu cuenta? Esta acción no se puede deshacer.');
    
    if (confirmDelete) {
      try {
        const userId = this.userService.userId();
        if (userId) {
          await firstValueFrom(this.profileService.deleteUser(userId));
          this.authService.logout();
          this.router.navigate(['/auth/sign-in']);
        }
      } catch (error) {
        console.error('Error al eliminar la cuenta:', error);
        alert('Ocurrió un error al intentar eliminar la cuenta');
      }
    }
  }

  startEditing(): void {
    this.isEditing = true;
    this.editUserData = { ...this.user };
  }

  cancelEditing(): void {
    this.isEditing = false;
    this.editUserData = {};
  }

  async updateUserProfile(): Promise<void> {
    try {
      const userId = this.userService.userId();
      if (userId) {
        const dataToSend = Object.fromEntries(
          Object.entries(this.editUserData).filter(([_, v]) => v !== '' && v !== undefined)
        );
        const updatedUser = await firstValueFrom(
          this.profileService.updateUserProfile(userId, dataToSend)
        );
        this.user = {
          nombre: updatedUser.result.nombre,
          apellido: updatedUser.result.apellido,
          georreferencias: updatedUser.result.georreferencias,
          email: updatedUser.result.email
        };

        this.isEditing = false;
      }
    } catch (error) {
      console.error('Error al actualizar el perfil:', error);
      alert('Ocurrió un error al actualizar el perfil');
    }
  }

  async loadUserProfile(): Promise<void> {
    this.isLoading = true;
    
    try {
      const userId = this.userService.userId();


      if (userId) {
        const userData = await firstValueFrom(this.profileService.getUserProfile(userId));
        
        this.user = {
          nombre: userData.result.nombre,
          apellido: userData.result.apellido,
          georreferencias: userData.result.georreferencias,
          email: userData.result.email
        };
      } else {
        console.warn('No hay un ID de usuario válido disponible');
      }
    } catch (error) {
      console.error('Error al cargar los datos del usuario:', error);
    } finally {
      this.isLoading = false;
    }
  }
}