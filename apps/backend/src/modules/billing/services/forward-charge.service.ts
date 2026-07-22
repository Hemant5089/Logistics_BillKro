import { Injectable } from '@nestjs/common';

@Injectable()
export class ForwardChargeService {

  calculate(
    rateCard: any,
    zone: string,
    applicableWeight: number,
  ) {

    let baseAmount = 0;
    let additionalAmount = 0;

    switch (zone) {

      case 'LOCAL':
        baseAmount = rateCard.localAmount;
        additionalAmount =
          rateCard.localAdditionalAmount;
        break;

      case 'STATE':
        baseAmount = rateCard.stateAmount;
        additionalAmount =
          rateCard.stateAdditionalAmount;
        break;

      case 'ROI':
        baseAmount = rateCard.roiAmount;
        additionalAmount =
          rateCard.roiAdditionalAmount;
        break;

      case 'METRO':
        baseAmount = rateCard.metroAmount;
        additionalAmount =
          rateCard.metroAdditionalAmount;
        break;

      case 'SPECIAL':
        baseAmount = rateCard.specialAmount;
        additionalAmount =
          rateCard.specialAdditionalAmount;
        break;
    }

    // Inside slab
    if (applicableWeight <= rateCard.endWeight) {

      return {

        baseCharge: baseAmount,

        additionalCharge: 0,

        forwardTotalCharge: baseAmount,
      };

    }

    // Above slab
    const extraWeight =
      applicableWeight - rateCard.endWeight;

    const slabs =
      Math.ceil(
        extraWeight /
          rateCard.additionalWeight,
      );

    const additionalCharge =
      slabs * additionalAmount;

    return {

      baseCharge: baseAmount,

      additionalCharge,

      forwardTotalCharge:
        baseAmount + additionalCharge,
    };
  }
}