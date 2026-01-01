/*
  Warnings:

  - You are about to drop the column `companyId` on the `Service` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Service" DROP CONSTRAINT "Service_companyId_fkey";

-- AlterTable
ALTER TABLE "Service" DROP COLUMN "companyId",
ADD COLUMN     "price" INTEGER NOT NULL DEFAULT 0;
