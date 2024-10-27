/*
  Warnings:

  - Added the required column `url` to the `WantedItem` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "WantedItem" ADD COLUMN     "url" TEXT NOT NULL;
