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
        baseAmount = Number(rateCard.localAmount);
        additionalAmount = Number(
          rateCard.localAdditionalAmount,
        );
        break;

      case 'STATE':
        baseAmount = Number(rateCard.stateAmount);
        additionalAmount = Number(
          rateCard.stateAdditionalAmount,
        );
        break;

      case 'ROI':
        baseAmount = Number(rateCard.roiAmount);
        additionalAmount = Number(
          rateCard.roiAdditionalAmount,
        );
        break;

      case 'METRO':
        baseAmount = Number(rateCard.metroAmount);
        additionalAmount = Number(
          rateCard.metroAdditionalAmount,
        );
        break;

      case 'SPECIAL':
        baseAmount = Number(rateCard.specialAmount);
        additionalAmount = Number(
          rateCard.specialAdditionalAmount,
        );
        break;
    }

    // Inside base slab
    if (
      applicableWeight <=
      Number(rateCard.endWeight)
    ) {
      return {
        baseCharge: baseAmount,
        additionalCharge: 0,
        forwardTotalCharge: baseAmount,
      };
    }

    // Above base slab
    const extraWeight =
      applicableWeight -
      Number(rateCard.endWeight);

    const additionalUnits = Math.ceil(
      extraWeight /
        Number(rateCard.additionalWeight),
    );

    const additionalCharge =
      additionalUnits * additionalAmount;

    return {
      baseCharge: baseAmount,
      additionalCharge,
      forwardTotalCharge:
        baseAmount + additionalCharge,
    };
  }
}