/*
  Warnings:
  - A unique constraint covering the columns `[inviteCode]` on the table `Family` will be added.
  - Added the required column `inviteCode` to the `Family` table, populated with a random UUID per existing row.
*/
-- AlterTable (add as nullable first)
ALTER TABLE "Family" ADD COLUMN     "inviteCode" TEXT;

-- Populate existing rows with a unique random UUID
UPDATE "Family" SET "inviteCode" = gen_random_uuid()::text WHERE "inviteCode" IS NULL;

-- Now make it required
ALTER TABLE "Family" ALTER COLUMN "inviteCode" SET NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Family_inviteCode_key" ON "Family"("inviteCode");