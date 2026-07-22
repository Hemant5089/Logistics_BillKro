/*
  Warnings:

  - You are about to drop the column `codAmount` on the `Shipment` table. All the data in the column will be lost.
  - You are about to drop the column `deadWeight` on the `Shipment` table. All the data in the column will be lost.
  - You are about to drop the column `paymentMethod` on the `Shipment` table. All the data in the column will be lost.
  - You are about to drop the column `shippingType` on the `Shipment` table. All the data in the column will be lost.
  - You are about to drop the column `totalAmount` on the `Shipment` table. All the data in the column will be lost.
  - You are about to drop the `RateCard` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `UploadJob` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `actualWeight` to the `Shipment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `applicableWeight` to the `Shipment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `billingEligibility` to the `Shipment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `paymentMode` to the `Shipment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `productValue` to the `Shipment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `service` to the `Shipment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `shipmentStatus` to the `Shipment` table without a default value. This is not possible if the table is not empty.
  - Made the column `receiverCity` on table `Shipment` required. This step will fail if there are existing NULL values in that column.
  - Made the column `receiverName` on table `Shipment` required. This step will fail if there are existing NULL values in that column.
  - Made the column `receiverPincode` on table `Shipment` required. This step will fail if there are existing NULL values in that column.
  - Made the column `receiverState` on table `Shipment` required. This step will fail if there are existing NULL values in that column.
  - Made the column `senderCity` on table `Shipment` required. This step will fail if there are existing NULL values in that column.
  - Made the column `senderName` on table `Shipment` required. This step will fail if there are existing NULL values in that column.
  - Made the column `senderPincode` on table `Shipment` required. This step will fail if there are existing NULL values in that column.
  - Made the column `senderState` on table `Shipment` required. This step will fail if there are existing NULL values in that column.
  - Made the column `volumetricWeight` on table `Shipment` required. This step will fail if there are existing NULL values in that column.

*/
-- CreateEnum
CREATE TYPE "PaymentMode" AS ENUM ('PREPAID', 'COD');

-- CreateEnum
CREATE TYPE "ShipmentStatus" AS ENUM ('BOOKED', 'PICKED_UP', 'IN_TRANSIT', 'DELIVERED', 'RTO', 'RTO_DELIVERED', 'LOST', 'DAMAGED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "BillingStatus" AS ENUM ('PENDING', 'BILLED');

-- CreateEnum
CREATE TYPE "BillingEligibility" AS ENUM ('BILLABLE', 'IGNORE');

-- DropForeignKey
ALTER TABLE "RateCard" DROP CONSTRAINT "RateCard_carrierId_fkey";

-- DropForeignKey
ALTER TABLE "RateCard" DROP CONSTRAINT "RateCard_sellerId_fkey";

-- DropForeignKey
ALTER TABLE "RateCard" DROP CONSTRAINT "RateCard_zoneId_fkey";

-- AlterTable
ALTER TABLE "Shipment" DROP COLUMN "codAmount",
DROP COLUMN "deadWeight",
DROP COLUMN "paymentMethod",
DROP COLUMN "shippingType",
DROP COLUMN "totalAmount",
ADD COLUMN     "actualWeight" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "applicableWeight" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "billingEligibility" "BillingEligibility" NOT NULL,
ADD COLUMN     "billingMonth" TEXT,
ADD COLUMN     "billingStatus" "BillingStatus" NOT NULL DEFAULT 'PENDING',
ADD COLUMN     "breadth" DOUBLE PRECISION,
ADD COLUMN     "height" DOUBLE PRECISION,
ADD COLUMN     "length" DOUBLE PRECISION,
ADD COLUMN     "paymentMode" "PaymentMode" NOT NULL,
ADD COLUMN     "productValue" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "service" "ServiceType" NOT NULL,
ADD COLUMN     "shipmentDate" TIMESTAMP(3),
ADD COLUMN     "shipmentStatus" "ShipmentStatus" NOT NULL,
ALTER COLUMN "orderId" DROP NOT NULL,
ALTER COLUMN "receiverCity" SET NOT NULL,
ALTER COLUMN "receiverName" SET NOT NULL,
ALTER COLUMN "receiverPincode" SET NOT NULL,
ALTER COLUMN "receiverState" SET NOT NULL,
ALTER COLUMN "senderCity" SET NOT NULL,
ALTER COLUMN "senderName" SET NOT NULL,
ALTER COLUMN "senderPincode" SET NOT NULL,
ALTER COLUMN "senderState" SET NOT NULL,
ALTER COLUMN "volumetricWeight" SET NOT NULL;

-- DropTable
DROP TABLE "RateCard";

-- DropTable
DROP TABLE "UploadJob";

-- CreateTable
CREATE TABLE "MetroCity" (
    "id" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MetroCity_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SpecialRegion" (
    "id" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "city" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SpecialRegion_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "MetroCity_city_state_key" ON "MetroCity"("city", "state");

-- CreateIndex
CREATE UNIQUE INDEX "SpecialRegion_state_city_key" ON "SpecialRegion"("state", "city");

-- CreateIndex
CREATE INDEX "Shipment_sellerId_idx" ON "Shipment"("sellerId");

-- CreateIndex
CREATE INDEX "Shipment_carrierId_idx" ON "Shipment"("carrierId");

-- CreateIndex
CREATE INDEX "Shipment_zoneId_idx" ON "Shipment"("zoneId");

-- CreateIndex
CREATE INDEX "Shipment_shipmentStatus_idx" ON "Shipment"("shipmentStatus");

-- CreateIndex
CREATE INDEX "Shipment_billingStatus_idx" ON "Shipment"("billingStatus");

-- CreateIndex
CREATE INDEX "Shipment_shipmentDate_idx" ON "Shipment"("shipmentDate");
