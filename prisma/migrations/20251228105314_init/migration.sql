/*
  Warnings:

  - You are about to drop the column `intagram` on the `Employee` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[instagram]` on the table `Employee` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Employee_intagram_key";

-- AlterTable
ALTER TABLE "Employee" DROP COLUMN "intagram",
ADD COLUMN     "instagram" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Employee_instagram_key" ON "Employee"("instagram");
