/*
  Warnings:

  - You are about to drop the column `email` on the `Employee` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[intagram]` on the table `Employee` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[whatsapp]` on the table `Employee` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[telegram]` on the table `Employee` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[viber]` on the table `Employee` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[phone]` on the table `Employee` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Employee_email_key";

-- AlterTable
ALTER TABLE "Employee" DROP COLUMN "email",
ADD COLUMN     "intagram" TEXT,
ADD COLUMN     "telegram" TEXT,
ADD COLUMN     "viber" TEXT,
ADD COLUMN     "whatsapp" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Employee_intagram_key" ON "Employee"("intagram");

-- CreateIndex
CREATE UNIQUE INDEX "Employee_whatsapp_key" ON "Employee"("whatsapp");

-- CreateIndex
CREATE UNIQUE INDEX "Employee_telegram_key" ON "Employee"("telegram");

-- CreateIndex
CREATE UNIQUE INDEX "Employee_viber_key" ON "Employee"("viber");

-- CreateIndex
CREATE UNIQUE INDEX "Employee_phone_key" ON "Employee"("phone");
