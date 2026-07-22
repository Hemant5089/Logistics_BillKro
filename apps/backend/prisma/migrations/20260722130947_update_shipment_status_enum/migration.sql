/*
  Warnings:

  - The values [RTO,NOT_PICKED] on the enum `ShipmentStatus` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "ShipmentStatus_new" AS ENUM ('BOOKED', 'PICKUP_AWAITED', 'PICKED_UP', 'SHIPPED', 'IN_TRANSIT', 'REACHED_AT_DESTINATION', 'OUT_FOR_DELIVERY', 'DELIVERED', 'UNDELIVERED', 'CANCELLED', 'RTO_BOOKED', 'RTO_IN_TRANSIT', 'RTO_REACHED_DESTINATION', 'RTO_OUT_FOR_DELIVERY', 'RTO_DELIVERED', 'LOST', 'DAMAGED', 'UNKNOWN');
ALTER TABLE "Shipment" ALTER COLUMN "shipmentStatus" TYPE "ShipmentStatus_new" USING ("shipmentStatus"::text::"ShipmentStatus_new");
ALTER TYPE "ShipmentStatus" RENAME TO "ShipmentStatus_old";
ALTER TYPE "ShipmentStatus_new" RENAME TO "ShipmentStatus";
DROP TYPE "public"."ShipmentStatus_old";
COMMIT;
