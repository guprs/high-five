/*
  Warnings:
  - You are about to drop the column `pin` on the `Family` table. All the data in the column will be lost.
  - Added the required column `updatedAt` to the `Family` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `User` table without a default value. This is not possible if the table is not empty.
*/
-- AlterTable
ALTER TABLE "Family" DROP COLUMN "pin",
ADD COLUMN     "pinHash" TEXT,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
-- AlterTable
ALTER TABLE "User" ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;