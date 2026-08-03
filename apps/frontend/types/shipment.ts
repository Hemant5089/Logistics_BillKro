export interface ShipmentImportResponse {
  success: boolean;
  totalRows: number;
  creates: number;
  updates: number;
  errors: any[];
}