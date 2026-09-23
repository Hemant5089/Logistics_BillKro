import { ShipmentStatus } from '@prisma/client';

export const ShipmentStatusMap: Record<string, ShipmentStatus> = {
  'DELIVERED': ShipmentStatus.DELIVERED,
  'PICKED UP': ShipmentStatus.PICKED_UP,
  'SHIPPED': ShipmentStatus.SHIPPED,
  'IN TRANSIT': ShipmentStatus.IN_TRANSIT,
  'OUT FOR DELIVERY': ShipmentStatus.OUT_FOR_DELIVERY,
  'REACHED AT DESTINATION':
    ShipmentStatus.REACHED_AT_DESTINATION,
  'PICKUP AWAITED':
    ShipmentStatus.PICKUP_AWAITED,
  'CANCELLED': ShipmentStatus.CANCELLED,
  'UNDELIVERED': ShipmentStatus.UNDELIVERED,
  'LOST': ShipmentStatus.LOST,
  'DAMAGED': ShipmentStatus.DAMAGED,

  'RTO BOOKED': ShipmentStatus.RTO_BOOKED,
  'RTO IN TRANSIT': ShipmentStatus.RTO_IN_TRANSIT,
  'RTO REACHED DESTINATION':
    ShipmentStatus.RTO_REACHED_DESTINATION,
  'RTO OUT FOR DELIVERY':
    ShipmentStatus.RTO_OUT_FOR_DELIVERY,
  'RTO DELIVERED': ShipmentStatus.RTO_DELIVERED,
};