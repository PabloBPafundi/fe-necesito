import { Component, OnInit } from '@angular/core';
import { OrderService } from '../../shared/services/Order.service';
import { UserService } from '../../shared/services/user.service';
import { IReserva, IReservaResponse } from '../../shared/types/IOrder.interface';
import { NgFor, NgIf } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-order-list',
  templateUrl: './order-list.component.html',
  styleUrl: './order-list.component.css',
  imports: [MatCardModule, MatButtonModule, NgIf, NgFor]
})
export class OrderListComponent implements OnInit {
  orders: IReserva[] = [];
  isLoading = false;
  isArrendadorView = true;
  page = 1;
  pages = 1;
  userId!: number;

  constructor(
    private orderService: OrderService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    const id = this.userService.userId();
    if (id) {
      this.userId = id;
      this.fetchOrders();
    }
  }

  fetchOrders(): void {
    this.isLoading = true;
    const params: any = {
      page: this.page
    };
    params[this.isArrendadorView ? 'arrendador' : 'arrendatario'] = this.userId;

    this.orderService.getOrderFromUserWithData(params).subscribe({
      next: (res) => {
        this.orders = res.result;
        this.pages = res.pages;
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      }
    });
  }

  toggleView(): void {
    this.isArrendadorView = !this.isArrendadorView;
    this.page = 1;
    this.fetchOrders();
  }

  acceptOrder(order: IReserva): void {
    const acceptField = this.isArrendadorView ? 'acepto_arrendador' : 'acepto_arrendatario';
    const data: any = {
      id: order.id,
      [acceptField]: true,
    };
    this.orderService.updateOrder(order.id, data).subscribe(() => this.fetchOrders());
  }

  markAsReturned(order: IReserva): void {
    const data = { estado: 4 }; // CLOSED
    this.orderService.updateOrder(order.id, data).subscribe(() => this.fetchOrders());
  }

  nextPage(): void {
    if (this.page < this.pages) {
      this.page++;
      this.fetchOrders();
    }
  }

  prevPage(): void {
    if (this.page > 1) {
      this.page--;
      this.fetchOrders();
    }
  }
}