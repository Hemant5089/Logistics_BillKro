import { Injectable } from '@nestjs/common';

@Injectable()
export class CodRtoService {

  calculateCod(
  shipmentStatus: string,
  paymentMode: string,
  productValue: number,
  rateCard: any,
) {

  if (shipmentStatus === 'RTO_DELIVERED') {
    return 0;
  }

  // Prepaid shipments never get COD charge
  if (paymentMode !== 'COD') {
    return 0;
  }

  // Safety
  if (!productValue) {
    return 0;
  }

  // Fixed COD
  if (productValue < rateCard.codThresholdAmount) {
    return rateCard.codFixedCharge;
  }

  // Percentage COD
  return Number(
    (
      productValue *
      rateCard.codPercentage /
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