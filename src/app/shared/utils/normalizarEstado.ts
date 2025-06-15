import { StateReservationColourEnum } from '../enums/StateReservationEnum';

export function normalizarEstado(
  nombre: string
): keyof typeof StateReservationColourEnum {
  switch (nombre.toLowerCase()) {
    case 'creado':
      return 'CREATED';
    case 'abierta':
      return 'OPEN';
    case 'en proceso':
      return 'IN_PROGRESS';
    case 'cancelada':
      return 'CANCELED';
    case 'cerrada':
      return 'CLOSED';
    default:
      return 'OPEN';
  }
}
