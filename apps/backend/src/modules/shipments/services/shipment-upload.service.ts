import {
  Injectable,
  BadRequestException,
} from '@nestjs/common';

import { PrismaService } from '../../../common/prisma/prisma.service';

import { ShipmentImportService } from './shipment-import.service';
import { ShipmentValidationService } from './shipment-validation.service';
import { WeightCalculatorService } from './weight-calculator.service';
import { ZoneResolverService } from './zone-resolver.service';

//new adds
import { ShipmentStatus } from '@prisma/client';
import { ShipmentStatusMap } from '../constants/shipment-status.mapper';


@Injectable()
export class ShipmentUploadService {
  constructor(
    private prisma: PrismaService,

    private shipmentImportService: ShipmentImportService,

    private shipmentValidationService: ShipmentValidationService,

    private weightCalculatorService: WeightCalculatorService,

    private zoneResolverService: ZoneResolverService,
  ) {}

 async upload(
  sellerId: string,
  buffer: Buffer,
) {
  // 1. Verify Seller
  const seller = await this.prisma.seller.findUnique({
    where: {
      id: sellerId,
    },
  });

  if (!seller) {
    throw new BadRequestException(
      'Seller not found',
    );
  }

  // 2. Parse Excel
  const rows =
    this.shipmentImportService.parseExcel(
      buffer,
    );

  // 3. Validate Excel
  const validation =
    this.shipmentValidationService.validate(
      rows,
    );

  if (validation.invalidRows > 0) {
    return validation;
  }

  const carriers =
  await this.prisma.carrier.findMany();

const zones =
  await this.prisma.zone.findMany();

const metroCities =
  await this.prisma.metroCity.findMany();

const specialRegions =
  await this.prisma.specialRegion.findMany();

const existingShipments =
  await this.prisma.shipment.findMany({
    select: {
      id: true,
      awbNumber: true,
    },
  });

  const carrierMap = new Map(
  carriers.map((carrier) => [
    carrier.name.trim().toLowerCase(),
    carrier,
  ]),
);

const shipmentMap = new Map(
  existingShipments.map((shipment) => [
    shipment.awbNumber,
    shipment,
  ]),
);

const zoneMap = new Map(
  zones.map((zone) => [
    zone.name.trim().toUpperCase(),
    zone,
  ]),
);

const metroSet = new Set(
  metroCities.map((city) =>
    city.city.trim().toLowerCase(),
  ),
);

const specialSet = new Set(
  specialRegions.flatMap((region) => [
    region.state.trim().toLowerCase(),
    region.city?.trim().toLowerCase() ?? "",
  ]).filter((value) => value !== ""),
);

const createData: any[] = [];
const updateData: any[] = [];
const errors: any[] = [];

for (const row of validation.data) {

  // Find Carrier
  const carrier = carrierMap.get(
    row.carrier.trim().toLowerCase(),
  );

  if (!carrier) {
    continue;
  }

  // Calculate Volumetric Weight
  const volumetricWeight =
    this.weightCalculatorService.calculateVolumetricWeight(
      row.length,
      row.breadth,
      row.height,
    );

  // Calculate Applicable Weight
  const applicableWeight =
    this.weightCalculatorService.calculateApplicableWeight(
      row.actualWeight,
      volumetricWeight,
    );

  // Resolve Zone
  const zoneName =
    this.zoneResolverService.resolveZone(
      row.senderCity,
      row.senderState,
      row.receiverCity,
      row.receiverState,
      metroSet,
      specialSet,
    );

  const zone = zoneMap.get(zoneName);
  const shipmentStatus =
    ShipmentStatusMap[row.shipmentStatus?.trim()] ??
    ShipmentStatus.UNKNOWN;

 const shipmentData = {
  awbNumber: row.awbNumber,

  orderId: row.orderId,

  sellerId: seller.id,

  carrierId: carrier.id,

  zoneId: zone?.id,

  service: 'SURFACE',

  paymentMode: row.paymentMode,

  shipmentStatus,
  
  billingEligibility:
    // row.shipmentStatus === 'DELIVERED' ||
    // row.shipmentStatus === 'PICKED_UP' ||
    // row.shipmentStatus === 'RTO_DELIVERED'
    //   ? 'BILLABLE'
    //   : 'IGNORE',

    shipmentStatus === ShipmentStatus.DELIVERED ||
    shipmentStatus === ShipmentStatus.PICKED_UP ||
    shipmentStatus === ShipmentStatus.RTO_DELIVERED
      ? 'BILLABLE'
      : 'IGNORE',

  productValue: row.productValue,

  actualWeight: row.actualWeight,

  volumetricWeight,

  applicableWeight,

  length: row.length,

  breadth: row.breadth,

  height: row.height,

  senderName: row.senderName,
  senderCity: row.senderCity,
  senderState: row.senderState,
  senderPincode: row.senderPincode,

  receiverName: row.receiverName,
  receiverCity: row.receiverCity,
  receiverState: row.receiverState,
  receiverPincode: row.receiverPincode,

  shipmentDate: new Date(row.shipmentDate),
};

const existingShipment =
  shipmentMap.get(row.awbNumber);

if (existingShipment) {

  updateData.push({
    id: existingShipment.id,
    data: shipmentData,
  });

} else {

  createData.push(shipmentData);

}

}


// ===========================
// Create New Shipments
// ===========================

if (createData.length > 0) {
  await this.prisma.shipment.createMany({
    data: createData,
  });
}

// ===========================
// Update Existing Shipments
// ===========================

for (const shipment of updateData) {
  await this.prisma.shipment.update({
    where: {
      id: shipment.id,
    },
    data: shipment.data,
  });
}

// ===========================
// Final Response
// ===========================

return {
  success: true,

  totalRows: validation.totalRows,

  creates: createData.length,

  updates: updateData.length,

  errors,
};
//  return {
    // success: true,
    // totalRows: validation.totalRows,
//  processed: processedShipments.length,
//  data: processedShipments,

    // creates: createData.length,
    // updates: updateData.length,
    // errors,

//   validRows: validation.validRows,
//   invalidRows: validation.invalidRows,
//   carriers: carrierMap.size,
//   zones: zoneMap.size,
//   metroCities: metroSet.size,
//   specialRegions: specialSet.size,
//   existingShipments: shipmentMap.size,
// data: validation.data,



//   };
}
}