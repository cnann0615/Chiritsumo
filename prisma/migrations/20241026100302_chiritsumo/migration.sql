/*
  Warnings:

  - You are about to drop the `Category` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Schedule` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Task` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Category" DROP CONSTRAINT "Category_userId_fkey";

-- DropForeignKey
ALTER TABLE "Schedule" DROP CONSTRAINT "Schedule_userId_fkey";

-- DropForeignKey
ALTER TABLE "Task" DROP CONSTRAINT "Task_categoryId_fkey";

-- DropForeignKey
ALTER TABLE "Task" DROP CONSTRAINT "Task_scheduleId_fkey";

-- DropForeignKey
ALTER TABLE "Task" DROP CONSTRAINT "Task_userId_fkey";

-- DropTable
DROP TABLE "Category";

-- DropTable
DROP TABLE "Schedule";

-- DropTable
DROP TABLE "Task";

-- CreateTable
CREATE TABLE "TsumoBalance" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "tsumoBalance" INTEGER NOT NULL,

    CONSTRAINT "TsumoBalance_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TsumoLog" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "tsumo" INTEGER NOT NULL,
    "habitualWasteId" TEXT,

    CONSTRAINT "TsumoLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HabitualWaste" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "tsumo" INTEGER NOT NULL,

    CONSTRAINT "HabitualWaste_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "wantedItem" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "price" INTEGER NOT NULL,

    CONSTRAINT "wantedItem_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "HabitualWaste_title_key" ON "HabitualWaste"("title");

-- AddForeignKey
ALTER TABLE "TsumoBalance" ADD CONSTRAINT "TsumoBalance_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TsumoLog" ADD CONSTRAINT "TsumoLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TsumoLog" ADD CONSTRAINT "TsumoLog_habitualWasteId_fkey" FOREIGN KEY ("habitualWasteId") REFERENCES "HabitualWaste"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HabitualWaste" ADD CONSTRAINT "HabitualWaste_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "wantedItem" ADD CONSTRAINT "wantedItem_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
