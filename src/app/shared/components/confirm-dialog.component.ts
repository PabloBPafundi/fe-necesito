import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';

@Component({
  standalone: true,
  selector: 'app-confirm-dialog',
  template: `
    <div class="p-6 max-w-sm text-center space-y-4">
      <h2 class="text-lg font-bold text-red-600">{{ data.title }}</h2>
      <p class="text-gray-700">{{ data.message }}</p>

      <div class="flex justify-center gap-4 mt-6">
        <button mat-stroked-button color="primary" (click)="dialogRef.close(false)">
          Cancelar
        </button>
        <button mat-flat-button color="warn" (click)="dialogRef.close(true)">
          Eliminar
        </button>
      </div>
    </div>
  `,
  imports: [CommonModule, MatButtonModule],
})
export class ConfirmDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<ConfirmDialogComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: { title: string; message: string }
  ) {}
}