import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { PrismaService } from '../../common/prisma/prisma.service';

import { RateResolverService } from './services/rate-resolver.service';
import { ForwardChargeService } from './services/forward-charge.service';
import { CodRtoService } from './services/cod-rto.service';

@Injectable()
export class BillingService {
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
      throw new NotFoundException(
        'Seller not found',
      );
    }

    // Load Seller Rate Cards
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
          billingEligibility: 'BILLABLE',
        },
        include: {
          carrier: true,
          zone: true,
        },
        orderBy: {
          shipmentDate: 'asc',
        },
      });

    const preview: any[] = [];

    for (const shipment of shipments) {
      // Find Rate Card
      const rateCard =
        this.rateResolver.findRate(
          rateCards,
          shipment.carrierId,
          shipment.service,
          shipment.applicableWeight,
        );

      // Calculate Forward
      const forward =
        this.forwardCalculator.calculate(
          rateCard,
          shipment.zone.name,
          shipment.applicableWeight,
        );

      // Calculate COD
      const codCharge =
        this.codRtoCalculator.calculateCod(
          shipment.shipmentStatus,
          shipment.paymentMode,
          shipment.productValue,
          rateCard,
        );

      // Calculate RTO
      const rtoCharge =
        this.codRtoCalculator.calculateRto(
          shipment.shipmentStatus,
          forward.forwardTotalCharge,
        );

      const totalCharge =
        forward.forwardTotalCharge +
        codCharge +
        rtoCharge;

      preview.push({
        awbNumber: shipment.awbNumber,
        orderId: shipment.orderId,

        carrier: shipment.carrier.name,
        zone: shipment.zone.name,

        shipmentStatus: shipment.shipmentStatus,
        paymentMode: shipment.paymentMode,

        actualWeight: shipment.actualWeight,
        volumetricWeight:
          shipment.volumetricWeight,
        applicableWeight:
          shipment.applicableWeight,

        rateCardId: rateCard.id,

        slab:
          `${rateCard.startWeight} - ${rateCard.endWeight}`,

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

      shipmentCount: preview.length,

      calculations: preview,
    };
  }
}