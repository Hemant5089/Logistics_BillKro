export interface ExcelRow {
  name: string;
  carrier: string;
  service: string;

  startWeight: number;
  endWeight: number;

  maxWeight: number;
  additionalWeight: number;

  localAmount: number;
  localAdditionalAmount: number;

  stateAmount: number;
  stateAdditionalAmount: number;

  roiAmount: number;
  roiAdditionalAmount: number;

  metroAmount: number;
  metroAdditionalAmount: number;

  specialAmount: number;
  specialAdditionalAmount: number;
}