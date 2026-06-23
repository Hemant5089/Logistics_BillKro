/*
  Warnings:

  - You are about to drop the column `weight` on the `Shipment` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Shipment" DROP COLUMN "weight",
ADD COLUMN     "codAmount" DOUBLE PRECISION,
ADD COLUMN     "customerName" TEXT,
ADD COLUMN     "deadWeight" DOUBLE PRECISION,
ADD COLUMN     "paymentMethod" TEXT,
ADD COLUMN     "receiverCity" TEXT,
ADD COLUMN     "receiverName" TEXT,
ADD COLUMN     "receiverPincode" TEXT,
ADD COLUMN     "receiverState" TEXT,
ADD COLUMN     "senderCity" TEXT,
ADD COLUMN     "senderName" TEXT,
ADD COLUMN     "senderPincode" TEXT,
ADD COLUMN     "senderState" TEXT,
ADD COLUMN     "shippingType" TEXT,
ADD COLUMN     "totalAmount" DOUBLE PRECISION,
ADD COLUMN     "volumetricWeight" DOUBLE PRECISION;
