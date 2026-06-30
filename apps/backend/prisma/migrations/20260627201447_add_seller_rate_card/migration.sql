-- CreateTable
CREATE TABLE "SellerRateCard" (
    "id" TEXT NOT NULL,
    "sellerId" TEXT NOT NULL,
    "masterRateCardId" TEXT,
    "carrierId" TEXT NOT NULL,
    "service" "ServiceType" NOT NULL,
    "startWeight" DOUBLE PRECISION NOT NULL,
    "endWeight" DOUBLE PRECISION NOT NULL,
    "maxWeight" DOUBLE PRECISION NOT NULL,
    "additionalWeight" DOUBLE PRECISION NOT NULL,
    "localAmount" DOUBLE PRECISION NOT NULL,
    "localAdditionalAmount" DOUBLE PRECISION NOT NULL,
    "stateAmount" DOUBLE PRECISION NOT NULL,
    "stateAdditionalAmount" DOUBLE PRECISION NOT NULL,
    "roiAmount" DOUBLE PRECISION NOT NULL,
    "roiAdditionalAmount" DOUBLE PRECISION NOT NULL,
    "metroAmount" DOUBLE PRECISION NOT NULL,
    "metroAdditionalAmount" DOUBLE PRECISION NOT NULL,
    "specialAmount" DOUBLE PRECISION NOT NULL,
    "specialAdditionalAmount" DOUBLE PRECISION NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SellerRateCard_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "SellerRateCard_sellerId_idx" ON "SellerRateCard"("sellerId");

-- CreateIndex
CREATE INDEX "SellerRateCard_carrierId_idx" ON "SellerRateCard"("carrierId");

-- AddForeignKey
ALTER TABLE "SellerRateCard" ADD CONSTRAINT "SellerRateCard_sellerId_fkey" FOREIGN KEY ("sellerId") REFERENCES "Seller"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SellerRateCard" ADD CONSTRAINT "SellerRateCard_masterRateCardId_fkey" FOREIGN KEY ("masterRateCardId") REFERENCES "RateCardTemplate"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SellerRateCard" ADD CONSTRAINT "SellerRateCard_carrierId_fkey" FOREIGN KEY ("carrierId") REFERENCES "Carrier"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
