-- CreateTable
CREATE TABLE "RateCardTemplate" (
    "id" TEXT NOT NULL,
    "productName" TEXT NOT NULL,
    "carrierId" TEXT NOT NULL,
    "service" TEXT NOT NULL,
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

    CONSTRAINT "RateCardTemplate_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "RateCardTemplate_carrierId_idx" ON "RateCardTemplate"("carrierId");

-- AddForeignKey
ALTER TABLE "RateCardTemplate" ADD CONSTRAINT "RateCardTemplate_carrierId_fkey" FOREIGN KEY ("carrierId") REFERENCES "Carrier"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
