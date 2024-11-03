/*
  Warnings:

  - A unique constraint covering the columns `[userId]` on the table `Balance` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Balance" ALTER COLUMN "Balance" SET DEFAULT 0;

-- CreateIndex
CREATE UNIQUE INDEX "Balance_userId_key" ON "Balance"("userId");
