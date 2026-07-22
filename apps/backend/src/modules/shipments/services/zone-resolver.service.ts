import { Injectable } from '@nestjs/common';

@Injectable()
export class ZoneResolverService {

  resolveZone(
    senderCity: string,
    senderState: string,
    receiverCity: string,
    receiverState: string,
    metroCities: Set<string>,
    specialRegions: Set<string>,
  ): string {

    senderCity = senderCity.trim().toLowerCase();
    receiverCity = receiverCity.trim().toLowerCase();

    senderState = senderState.trim().toLowerCase();
    receiverState = receiverState.trim().toLowerCase();

    // SPECIAL
    if (
      specialRegions.has(senderState) ||
      specialRegions.has(receiverState) ||
      specialRegions.has(senderCity) ||
      specialRegions.has(receiverCity)
    ) {
      return 'SPECIAL';
    }

    // METRO
    if (
      metroCities.has(senderCity) &&
      metroCities.has(receiverCity)
    ) {
      return 'METRO';
    }

    // LOCAL
    if (senderCity === receiverCity) {
      return 'LOCAL';
    }

    // STATE
    if (senderState === receiverState) {
      return 'STATE';
    }

    return 'ROI';
  }
}