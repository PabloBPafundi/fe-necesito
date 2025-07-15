import { Component, OnInit } from '@angular/core';
import { CalendarOptions, EventInput } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { OrderService } from '../../shared/services/Order.service';
import { UserService } from '../../shared/services/user.service';
import { IReserva } from '../../shared/types/IOrder.interface';
import { FullCalendarModule } from '@fullcalendar/angular';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';
import esLocale from '@fullcalendar/core/locales/es';
import { StateReservationColourEnum } from '../../shared/enums/StateReservationEnum';
import { normalizarEstado } from '../../shared/utils/normalizarEstado';
import { MatDialog } from '@angular/material/dialog';
import { OrderDetailsDialogComponent } from './order-details-dialog/order-details-dialog.component';

@Component({
  selector: 'app-calendar-orders',
  standalone: true,
  imports: [FullCalendarModule, MatCardModule, CommonModule],
  templateUrl: './calendar-orders.component.html',
})
export class CalendarOrdersComponent implements OnInit {
  stateCounts: Record<string, number> = {};
  isArrendadorView = true;
  userId: number | null = null; // ✅ Corregido

  calendarOptions: CalendarOptions = {
    plugins: [dayGridPlugin, interactionPlugin],
    initialView: 'dayGridMonth',
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth,dayGridWeek,dayGridDay',
    },
    eventColor: '#1976d2',
    height: 'auto',
    locales: [esLocale],
    locale: 'es',
    events: [],
    eventClick: this.onEventClick.bind(this),
    eventContent: function (arg) {
      return {
        html: `<b>${arg.event.title}</b>`,
      };
    },
  };

  constructor(
    private orderService: OrderService,
    private userService: UserService, // ✅ Agregado
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.userId = this.userService.userId();
    if (this.userId !== null) {
      this.loadOrders();
    }
  }

  loadOrders(): void {
    if (this.userId === null) return;

    const params: any = {};
    params[this.isArrendadorView ? 'arrendador' : 'arrendatario'] = this.userId;

    this.orderService.getOrderFromUserWithData(params).subscribe((res) => {
      const ordenes = res.result;
      this.stateCounts = this.contarEstados(ordenes);

      const events = this.mapOrdersToEvents(ordenes);

      this.calendarOptions = {
        ...this.calendarOptions,
        events: events,
      };
    });
  }

  toggleView(): void {
    this.isArrendadorView = !this.isArrendadorView;
    this.loadOrders();
  }

  onEventClick(arg: any): void {
    const event = arg.event;

    this.dialog.open(OrderDetailsDialogComponent, {
      data: {
        title: event.title,
        start: event.start,
        end: event.end,
        description: event.extendedProps?.description,
      },
      width: '400px',
      maxHeight: '80vh',
      autoFocus: false,
    });
  }

  private mapOrdersToEvents(ordenes: IReserva[]): EventInput[] {
    return ordenes.map((orden) => {
      const estadoNormalizado = normalizarEstado(orden.estado.nombre);
      const color =
        StateReservationColourEnum[
          estadoNormalizado as keyof typeof StateReservationColourEnum
        ] || '#9e9e9e';

      return {
        id: orden.id.toString(),
        title: `${orden.articulo.nombre} - ${orden.estado.nombre}`,
        start: orden.fecha_desde,
        end: orden.fecha_hasta,
        description: orden.observaciones,
        color,
        extendedProps: {
          orderId: orden.id.toString(),
          arrendadorId: orden.arrendador.id,
          arrendatarioId: orden.arrendatario.id,
        },
      };
    });
  }

  private contarEstados(ordenes: IReserva[]): Record<string, number> {
    return ordenes.reduce((acc, orden) => {
      const estado = normalizarEstado(orden.estado.nombre);
      acc[estado] = (acc[estado] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
  }

  getColorForState(estado: string): string {
    const key = normalizarEstado(estado);
    return (
      StateReservationColourEnum[
        key as keyof typeof StateReservationColourEnum
      ] || '#ccc'
    );
  }
}