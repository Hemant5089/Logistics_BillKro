-- AlterTable
ALTER TABLE "SellerRateCard" ADD COLUMN     "codFixedCharge" DOUBLE PRECISION NOT NULL DEFAULT 30,
ADD COLUMN     "codPercentage" DOUBLE PRECISION NOT NULL DEFAULT 1.9,
ADD COLUMN     "codThresholdAmount" DOUBLE PRECISION NOT NULL DEFAULT 2000,
ADD COLUMN     "rtoCharge" DOUBLE PRECISION NOT NULL DEFAULT 30;

-- CreateTable
CREATE TABLE "BillingRecord" (
    "id" TEXT NOT NULL,
    "shipmentId" TEXT NOT NULL,
    "sellerId" TEXT NOT NULL,
    "carrierId" TEXT NOT NULL,
    "zoneId" TEXT NOT NULL,
    "sellerRateCardId" TEXT NOT NULL,
    "applicableWeight" DOUBLE PRECISION NOT NULL,
    "billedWeight" DOUBLE PRECISION NOT NULL,
    "slabStartWeight" DOUBLE PRECISION NOT NULL,
    "slabEndWeight" DOUBLE PRECISION NOT NULL,
    "forwardBaseCharge" DOUBLE PRECISION NOT NULL,
    "forwardAdditionalCharge" DOUBLE PRECISION NOT NULL,
    "forwardTotalCharge" DOUBLE PRECISION NOT NULL,
    "rtoCharge" DOUBLE PRECISION NOT NULL,
    "codCharge" DOUBLE PRECISION NOT NULL,
    "totalCharge" DOUBLE PRECISION NOT NULL,
    "billingMonth" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BillingRecord_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "BillingRecord_shipmentId_key" ON "BillingRecord"("shipmentId");

-- CreateIndex
CREATE INDEX "BillingRecord_sellerId_idx" ON "BillingRecord"("sellerId");

-- CreateIndex
CREATE INDEX "BillingRecord_billingMonth_idx" ON "BillingRecord"("billingMonth");

-- AddForeignKey
ALTER TABLE "BillingRecord" ADD CONSTRAINT "BillingRecord_shipmentId_fkey" FOREIGN KEY ("shipmentId") REFERENCES "Shipment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BillingRecord" ADD CONSTRAINT "BillingRecord_sellerId_fkey" FOREIGN KEY ("sellerId") REFERENCES "Seller"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BillingRecord" ADD CONSTRAINT "BillingRecord_carrierId_fkey" FOREIGN KEY ("carrierId") REFERENCES "Carrier"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BillingRecord" ADD CONSTRAINT "BillingRecord_zoneId_fkey" FOREIGN KEY ("zoneId") REFERENCES "Zone"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BillingRecord" ADD CONSTRAINT "BillingRecord_sellerRateCardId_fkey" FOREIGN KEY ("sellerRateCardId") REFERENCES "SellerRateCard"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
