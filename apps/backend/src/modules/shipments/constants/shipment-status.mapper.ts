import { ShipmentStatus } from '@prisma/client';

export const ShipmentStatusMap: Record<string, ShipmentStatus> = {
  'Delivered': ShipmentStatus.DELIVERED,
  'In-Transit': ShipmentStatus.IN_TRANSIT,
  'Order Cancelled': ShipmentStatus.CANCELLED,
  'Out For Delivery': ShipmentStatus.OUT_FOR_DELIVERY,
  'Pickup Awaited': ShipmentStatus.PICKUP_AWAITED,
  'Reached At Destination': ShipmentStatus.REACHED_AT_DESTINATION,
  'RTO BOOKED': ShipmentStatus.RTO_BOOKED,
  'RTO Delivered': ShipmentStatus.RTO_DELIVERED,
  'RTO IN Transit': ShipmentStatus.RTO_IN_TRANSIT,
  'RTO Out For Delivery': ShipmentStatus.RTO_OUT_FOR_DELIVERY,
  'RTO REACHED DESTINATION': ShipmentStatus.RTO_REACHED_DESTINATION,
  'Shipped': ShipmentStatus.SHIPPED,
  'Undelivered': ShipmentStatus.UNDELIVERED,
};