export interface ShipmentRow {
  orderId: string;

  awbNumber: string;

  shipmentDate: string;

  customerName: string;

  senderName: string;
  senderCity: string;
  senderState: string;
  senderPincode: string;

  receiverName: string;
  receiverCity: string;
  receiverState: string;
  receiverPincode: string;

  actualWeight: number;

  length: number;
  breadth: number;
  height: number;

  volumetricWeight: number;

  carrier: string;

  paymentMode: string;

  shipmentStatus: string;

  productValue: number;

  codAmount: number;
}