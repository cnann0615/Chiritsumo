/*
  Warnings:

  - A unique constraint covering the columns `[userId]` on the table `TsumoBalance` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "TsumoBalance" ALTER COLUMN "tsumoBalance" SET DEFAULT 0;

-- CreateIndex
CREATE UNIQUE INDEX "TsumoBalance_userId_key" ON "TsumoBalance"("userId");
