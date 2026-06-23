-- CreateTable
CREATE TABLE "RateCard" (
    "id" TEXT NOT NULL,
    "sellerId" TEXT NOT NULL,
    "carrierId" TEXT NOT NULL,
    "zoneId" TEXT NOT NULL,
    "startWeight" DOUBLE PRECISION NOT NULL,
    "endWeight" DOUBLE PRECISION NOT NULL,
    "baseRate" DOUBLE PRECISION NOT NULL,
    "additionalWeight" DOUBLE PRECISION NOT NULL,
    "additionalRate" DOUBLE PRECISION NOT NULL,
    "codCharge" DOUBLE PRECISION,
    "rtoCharge" DOUBLE PRECISION,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RateCard_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "RateCard" ADD CONSTRAINT "RateCard_sellerId_fkey" FOREIGN KEY ("sellerId") REFERENCES "Seller"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RateCard" ADD CONSTRAINT "RateCard_carrierId_fkey" FOREIGN KEY ("carrierId") REFERENCES "Carrier"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RateCard" ADD CONSTRAINT "RateCard_zoneId_fkey" FOREIGN KEY ("zoneId") REFERENCES "Zone"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
