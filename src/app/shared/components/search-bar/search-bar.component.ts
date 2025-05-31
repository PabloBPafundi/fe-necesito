import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-search-bar',
   imports: [FormsModule],
  templateUrl: './search-bar.component.html',
  styleUrl: './search-bar.component.css',
  standalone: true
})
export class SearchBarComponent {
  searchTerm: string = '';

  constructor(private router: Router) {}

  onSearch() {
    if (!this.searchTerm.trim()) return;

    this.router.navigate(['/product'], {
      queryParams: {
        page: 1,
        maxResults: 20,
        nombre: this.searchTerm,
        descripcion: this.searchTerm,
        activo: 1
      }
    });
  }
}
