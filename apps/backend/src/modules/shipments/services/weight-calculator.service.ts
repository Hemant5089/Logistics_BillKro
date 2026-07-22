import { Injectable } from '@nestjs/common';

@Injectable()
export class WeightCalculatorService {
  /**
   * Calculate volumetric weight
   * Formula:
   * (L × B × H) / 5000
   */
  calculateVolumetricWeight(
    length: number,
    breadth: number,
    height: number,
  ): number {
    if (
      !length ||
      !breadth ||
      !height
    ) {
      return 0;
    }

    const volumetricWeight =
      (length * breadth * height) / 5000;

    return Number(
      volumetricWeight.toFixed(2),
    );
  }

  /**
   * Applicable Weight
   * Higher of Actual & Volumetric
   */
  calculateApplicableWeight(
    actualWeight: number,
    volumetricWeight: number,
  ): number {
    return Math.max(
      actualWeight,
      volumetricWeight,
    );
  }
}