import { Component } from '@angular/core';
import { OrderService } from '../../shared/services/Order.service';

@Component({
  selector: 'app-calendar-orders',
  imports: [],
  templateUrl: './calendar-orders.component.html',
})
export class CalendarOrdersComponent {


   constructor(
    private orderService: OrderService
  ) {}

}
