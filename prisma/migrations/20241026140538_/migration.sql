/*
  Warnings:

  - You are about to drop the column `habitualWasteId` on the `TsumoLog` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "TsumoLog" DROP CONSTRAINT "TsumoLog_habitualWasteId_fkey";

-- AlterTable
ALTER TABLE "TsumoLog" DROP COLUMN "habitualWasteId";
