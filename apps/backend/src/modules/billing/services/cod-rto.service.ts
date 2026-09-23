import { Injectable } from '@nestjs/common';

@Injectable()
export class CodRtoService {

calculateCod(
  shipmentStatus: string,
  paymentMode: string,
  productValue: number,
  rateCard: any,
) {
  // Only delivered COD shipments get COD charge
  if (
    shipmentStatus !== 'DELIVERED' ||
    paymentMode !== 'COD'
  ) {
    return 0;
  }

  if (!productValue) {
    return 0;
  }

  if (productValue < rateCard.codThresholdAmount) {
    return rateCard.codFixedCharge;
  }

  return Number(
    (
      (productValue * rateCard.codPercentage) /
      100
    ).toFixed(2),
  );
}

  calculateRto(
    shipmentStatus: string,
    forwardCharge: number,
  ) {

    if (
      shipmentStatus !== 'RTO_DELIVERED'
    ) {
      return 0;
    }

    // Same Forward Charge Again
    return forwardCharge;
  }

}