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
export class BillingPreviewService {
  constructor(
    private prisma: PrismaService,

    private rateResolver: RateResolverService,

    private forwardCalculator: ForwardChargeService,

    private codRtoCalculator: CodRtoService,
  ) {}

  async previewBill(
    sellerId: string,
    billingMonth: string,
  ) {
    // ==========================================
    // Verify Seller
    // ==========================================

    const seller =
      await this.prisma.seller.findUnique({
        where: {
          id: sellerId,
        },
      });

    if (!seller) {
      throw new NotFoundException(
        'Seller not found',
      );
    }

    // ==========================================
    // Load Seller Rate Cards
    // ==========================================

    const rateCards =
      await this.rateResolver.getSellerRateCards(
        sellerId,
      );

    // ==========================================
    // Load Pending Shipments
    // ==========================================

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

    // ==========================================
    // Preview Result
    // ==========================================

    const calculations: any[] = [];

    for (const shipment of shipments) {
      const rateCard =
        this.rateResolver.findRate(
          rateCards,
          shipment.carrierId,
          shipment.service,
          shipment.applicableWeight,
        );

      const forward =
        this.forwardCalculator.calculate(
          rateCard,
          shipment.zone.name,
          shipment.applicableWeight,
        );

      const codCharge =
        this.codRtoCalculator.calculateCod(
          shipment.shipmentStatus,
          shipment.paymentMode,
          shipment.productValue,
          rateCard,
        );

      const rtoCharge =
        this.codRtoCalculator.calculateRto(
          shipment.shipmentStatus,
          forward.forwardTotalCharge,
        );

      const totalCharge =
        forward.forwardTotalCharge +
        codCharge +
        rtoCharge;

      calculations.push({
        awbNumber: shipment.awbNumber,

        orderId: shipment.orderId,

        carrier: shipment.carrier.name,

        zone: shipment.zone.name,

        shipmentStatus:
          shipment.shipmentStatus,

        paymentMode:
          shipment.paymentMode,

        actualWeight:
          shipment.actualWeight,

        volumetricWeight:
          shipment.volumetricWeight,

        applicableWeight:
          shipment.applicableWeight,

        rateCardId: rateCard.id,

        slab: `${rateCard.startWeight} - ${rateCard.endWeight}`,

        forwardBaseCharge:
          forward.baseCharge,

        forwardAdditionalCharge:
          forward.additionalCharge,

        forwardTotalCharge:
          forward.forwardTotalCharge,

        codCharge,

        rtoCharge,

        totalCharge,
      });
    }

    return {
      success: true,

      seller: seller.sellerName,

      billingMonth,

      shipmentCount:
        calculations.length,

      calculations,
    };
  }
}