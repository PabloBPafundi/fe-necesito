import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-order-details-dialog',
  imports: [CommonModule],
  templateUrl: './order-details-dialog.component.html'
})
export class OrderDetailsDialogComponent {


    constructor(@Inject(MAT_DIALOG_DATA) public data: any) {}

}
