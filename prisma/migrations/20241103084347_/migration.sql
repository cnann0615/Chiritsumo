/*
  Warnings:

  - You are about to drop the column `Balance` on the `Balance` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Balance" DROP COLUMN "Balance",
ADD COLUMN     "balance" INTEGER NOT NULL DEFAULT 0;
