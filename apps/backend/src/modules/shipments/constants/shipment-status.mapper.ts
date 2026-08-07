import { ShipmentStatus } from '@prisma/client';

export const ShipmentStatusMap: Record<string, ShipmentStatus> = {
  DELIVERED: ShipmentStatus.DELIVERED,

  PICKED_UP: ShipmentStatus.PICKED_UP,

  SHIPPED: ShipmentStatus.SHIPPED,

  IN_TRANSIT: ShipmentStatus.IN_TRANSIT,

  OUT_FOR_DELIVERY: ShipmentStatus.OUT_FOR_DELIVERY,

  REACHED_AT_DESTINATION:
    ShipmentStatus.REACHED_AT_DESTINATION,

  PICKUP_AWAITED:
    ShipmentStatus.PICKUP_AWAITED,

  CANCELLED:
    ShipmentStatus.CANCELLED,

  UNDELIVERED:
    ShipmentStatus.UNDELIVERED,

  LOST: ShipmentStatus.LOST,

  DAMAGED: ShipmentStatus.DAMAGED,

  RTO_BOOKED:
    ShipmentStatus.RTO_BOOKED,

  RTO_IN_TRANSIT:
    ShipmentStatus.RTO_IN_TRANSIT,

  RTO_OUT_FOR_DELIVERY:
    ShipmentStatus.RTO_OUT_FOR_DELIVERY,

  RTO_REACHED_DESTINATION:
    ShipmentStatus.RTO_REACHED_DESTINATION,

  RTO_DELIVERED:
    ShipmentStatus.RTO_DELIVERED,
};