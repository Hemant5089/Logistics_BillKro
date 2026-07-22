import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { PrismaService } from '../../../common/prisma/prisma.service';

import { RateResolverService } from './rate-resolver.service';
import { ForwardChargeService } from './forward-charge.service';
import { CodRtoService } from './cod-rto.service';
import { ShipmentStatus } from '@prisma/client';


@Injectable()
export class BillingEngineService {
  constructor(
    private prisma: PrismaService,

    private rateResolver: RateResolverService,

    private forwardCalculator: ForwardChargeService,

    private codRtoCalculator: CodRtoService,
  ) {}

  async generateBill(
    sellerId: string,
    billingMonth: string,
  ) {
    // Verify Seller
    const seller = await this.prisma.seller.findUnique({
      where: {
        id: sellerId,
      },
    });

    if (!seller) {
      throw new NotFoundException('Seller not found');
    }

    // Load Seller Rate Cards (One Time)
    const rateCards =
      await this.rateResolver.getSellerRateCards(
        sellerId,
      );

    // Load Billable Shipments
    const shipments =
      await this.prisma.shipment.findMany({
     where: {
  sellerId,

  billingStatus: 'PENDING',

  // shipmentStatus: {
  //   notIn: [
  //     'CANCELLED',
  //     'NOT_PICKED',
  //     'LOST',
  //     'DAMAGED',
  //   ],
  // },

  NOT: {
  shipmentStatus: {
    in: [
      ShipmentStatus.CANCELLED,
      ShipmentStatus.LOST,
      ShipmentStatus.DAMAGED,
    ],
  },
}

},

        include: {
          carrier: true,
          zone: true,
        },

        orderBy: {
          shipmentDate: 'asc',
        },
      });

    if (shipments.length === 0) {
      return {
        success: true,
        message: 'No billable shipments found.',
      };
    }

    // Billing Records to Insert
    const billingRecords: any[] = [];

    // ==========================================
    // Billing Loop (Next Step)
    // ==========================================

    for (const shipment of shipments) {
     // ==========================================
// Resolve Seller Rate Card
// ==========================================

const rateCard =
  this.rateResolver.findRate(
    rateCards,
    shipment.carrierId,
    shipment.service,
    shipment.applicableWeight,
  );

// ==========================================
// Calculate Forward Charge
// ==========================================

const forward =
  this.forwardCalculator.calculate(
    rateCard,
    shipment.zone.name,
    shipment.applicableWeight,
  );

// ==========================================
// Calculate COD Charge
// ==========================================

const codCharge =
  this.codRtoCalculator.calculateCod(
    shipment.shipmentStatus,
    shipment.paymentMode,
    shipment.productValue,
    rateCard,
  );

// ==========================================
// Calculate RTO Charge
// ==========================================

const rtoCharge =
  this.codRtoCalculator.calculateRto(
    shipment.shipmentStatus,
    forward.forwardTotalCharge,
  );

// ==========================================
// Calculate Final Amount
// ==========================================

const totalCharge =
  forward.forwardTotalCharge +
  codCharge +
  rtoCharge;

// ==========================================
// Remarks
// ==========================================

// let remarks: string | null = null;

// if (shipment.shipmentStatus === 'RTO_DELIVERED') {
//   remarks = 'RTO Charged';
// }

// if (shipment.shipmentStatus === 'DELIVERED') {
//   remarks = 'Forward Charged';
// }

// ==========================================
// Prepare Billing Record
// ==========================================

billingRecords.push({
  shipmentId: shipment.id,

  sellerId: shipment.sellerId,

  carrierId: shipment.carrierId,

  zoneId: shipment.zoneId,

  sellerRateCardId: rateCard.id,

  applicableWeight: shipment.applicableWeight,

  billedWeight: shipment.applicableWeight,

  slabStartWeight: rateCard.startWeight,

  slabEndWeight: rateCard.endWeight,

  forwardBaseCharge: forward.baseCharge,

  forwardAdditionalCharge: forward.additionalCharge,

  forwardTotalCharge: forward.forwardTotalCharge,

  codCharge,

  rtoCharge,

  totalCharge,

  billingMonth,
});
    }
// return {
//   success: true,

//   seller: seller.sellerName,

//   billingMonth,

//   shipmentCount: shipments.length,

//   calculations: billingRecords,
// };

// Save Billing Records
// await this.prisma.billingRecord.createMany({
//   data: billingRecords,
// });

// // Update Shipment Billing Status
// await this.prisma.shipment.updateMany({
//   where: {
//     id: {
//       in: shipments.map((s) => s.id),
//     },
//   },
//   data: {
//     billingStatus: 'BILLED',
//     billingMonth,
//   },
// });

// return {
//   success: true,
//   seller: seller.sellerName,
//   billingMonth,
//   generatedBills: billingRecords.length,
// };


await this.prisma.billingRecord.createMany({
  data: billingRecords,
});

await this.prisma.shipment.updateMany({
  where: {
    id: {
      in: shipments.map((s) => s.id),
    },
  },
  data: {
    billingStatus: 'BILLED',
    billingMonth,
  },
});

return {
  success: true,

  seller: seller.sellerName,

  generatedBills: billingRecords.length,

  billingMonth,
};


  }
}