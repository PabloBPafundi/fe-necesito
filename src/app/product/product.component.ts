import { Component } from '@angular/core';
import { ProductListComponent } from './product-list/product-list.component';
import { ProductFilterComponent } from './product-filter/product-filter.component';


@Component({
  selector: 'app-product',
  imports: [ProductListComponent, ProductFilterComponent],
  templateUrl: './product.component.html',
  styleUrl: './product.component.css'
})
export class ProductComponent {

}
