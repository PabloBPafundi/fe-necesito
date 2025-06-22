import { NgFor, NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  LucideAngularModule,
  User,
  Edit,
  Loader,
  Trash2,
} from 'lucide-angular';
import { ProfileService } from '../../shared/services/profile.service';
import { UserService } from '../../shared/services/user.service';
import { catchError, EMPTY, firstValueFrom, map, Observable, tap, throwError } from 'rxjs';
import { IUserProfile } from '../../shared/types/IProfile';
import { Router } from '@angular/router';
import { AuthService } from '../../shared/services/auth.service';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';
import { LocalidadService } from '../../shared/services/localidad.service';
import { ILocalidad } from '../../shared/types/ILocalidad.interface';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    LucideAngularModule,
    NgIf,
    NgFor,
    FormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatSelectModule
  ],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css',
})
export class ProfileComponent implements OnInit {
  readonly User = User;
  readonly Edit = Edit;
  readonly Loader = Loader;
  readonly Trash2 = Trash2;

  user: IUserProfile = {
    nombre: '',
    apellido: '',
    georreferencias: [],
    email: '',
  };

  showPasswordForm = false;
  newPassword = '';
  confirmPassword = '';

  isLoading: boolean = true;
  isEditing: boolean = false;
  editUserData: any = {
    nombre: '',
    apellido: '',
    email: '',
    georreferencias: []
  };
  localidades: ILocalidad[] = [];

  constructor(
    private snackbar: MatSnackBar,
    private userService: UserService,
    private profileService: ProfileService,
    private localidadService: LocalidadService,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadUserProfile();
    this.loadLocalidades();
  }

  async deleteUserAccount(): Promise<void> {
    const confirmDelete = confirm(
      '¿Estás seguro de que quieres eliminar tu cuenta? Esta acción no se puede deshacer.'
    );

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

  loadLocalidades() {
    this.localidadService.getLocalidades().subscribe({
      next: (res) => this.localidades = res,
      error: () => console.error('Error al cargar localidades')
    });
  }

  startEditing(): void {
    this.isEditing = true;
    this.editUserData = {
      ...this.user,
      georreferencias: this.user.georreferencias.map(g => ({
        ...g,
        localidadId: g.localidad.id,
      }))
    };
  }

  addGeorreferencia() {
    this.editUserData.georreferencias.push({
      calle: '',
      altura: '',
      localidad: null,
      nombre: ''
    });
  }

  removeGeorreferencia(index: number) {
    this.editUserData.georreferencias.splice(index, 1);
  }

  cancelEditing(): void {
    this.isEditing = false;
    this.editUserData = {};
  }

  async updateUserProfile(): Promise<void> {
    try {
      const userId = this.userService.userId();
      if (userId) {
        const dataToSend = {
          ...this.editUserData,
          georreferencias: this.editUserData.georreferencias.map((geo: any) => ({
            id: geo.id,
            calle: geo.calle,
            altura: geo.altura,
            nombre: geo.nombre,
            localidad: { id: geo.localidadId }
          }))
        };
        const updatedUser = await firstValueFrom(
          this.profileService.updateUserProfile(userId, dataToSend)
        );
        this.user = {
          nombre: updatedUser.result.nombre,
          apellido: updatedUser.result.apellido,
          georreferencias: updatedUser.result.georreferencias,
          email: updatedUser.result.email,
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
        const userData = await firstValueFrom(
          this.profileService.getUserProfile(userId)
        );

        this.user = {
          nombre: userData.result.nombre,
          apellido: userData.result.apellido,
          georreferencias: userData.result.georreferencias,
          email: userData.result.email,
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

  changeUserPassword(newPassword: string): Observable<void> {
    if (!newPassword) return EMPTY;

    const userId = this.userService.userId();

    if (userId == null) {
      this.snackbar.open('No se pudo obtener el ID del usuario', 'Cerrar', {
        duration: 3000,
      });
      return EMPTY;
    }

    return this.profileService
      .changePassword(userId, { password: newPassword })
      .pipe(
        tap((result) => {
          if ('success' in result) {
            this.snackbar.open('Contraseña actualizada con éxito', 'Cerrar', {
              duration: 3000,
            });
          } else {
            this.snackbar.open('Error al cambiar contraseña', 'Cerrar', {
              duration: 3000,
            });
          }
        }),
        catchError((error) => {
          console.error('Error al cambiar contraseña:', error);
          this.snackbar.open('Error inesperado', 'Cerrar', { duration: 3000 });
          return throwError(() => error);
        }),
        map(() => void 0)
      );
  }

  onSubmitPasswordChange() {
    if (this.newPassword !== this.confirmPassword) {
      this.snackbar.open('Las contraseñas no coinciden', 'Cerrar', {
        duration: 3000,
      });
      return;
    }

    this.changeUserPassword(this.newPassword).subscribe({
      next: () => {
        this.newPassword = '';
        this.confirmPassword = '';
        this.showPasswordForm = false;
      },
      error: () => {},
    });
  }
}
