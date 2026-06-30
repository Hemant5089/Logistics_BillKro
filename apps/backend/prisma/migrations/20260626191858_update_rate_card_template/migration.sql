/*
  Warnings:

  - You are about to drop the column `productName` on the `RateCardTemplate` table. All the data in the column will be lost.
  - Changed the type of `service` on the `RateCardTemplate` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "ServiceType" AS ENUM ('SURFACE', 'AIR', 'EXPRESS');

-- AlterTable
ALTER TABLE "RateCardTemplate" DROP COLUMN "productName",
DROP COLUMN "service",
ADD COLUMN     "service" "ServiceType" NOT NULL;
