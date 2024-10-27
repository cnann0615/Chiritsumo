/*
  Warnings:

  - You are about to drop the `wantedItem` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "wantedItem" DROP CONSTRAINT "wantedItem_userId_fkey";

-- DropTable
DROP TABLE "wantedItem";

-- CreateTable
CREATE TABLE "WantedItem" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "price" INTEGER NOT NULL,

    CONSTRAINT "WantedItem_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "WantedItem" ADD CONSTRAINT "WantedItem_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
