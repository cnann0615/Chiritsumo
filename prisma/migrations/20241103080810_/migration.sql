/*
  Warnings:

  - You are about to drop the `HabitualWaste` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "HabitualWaste" DROP CONSTRAINT "HabitualWaste_userId_fkey";

-- DropTable
DROP TABLE "HabitualWaste";
