/*
  Warnings:

  - You are about to drop the column `reason` on the `Incident` table. All the data in the column will be lost.
  - The `status` column on the `Incident` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "IncidentStatus" AS ENUM ('OPEN', 'RESOLVED');

-- AlterTable
ALTER TABLE "Incident" DROP COLUMN "reason",
ALTER COLUMN "resolvedAt" DROP NOT NULL,
DROP COLUMN "status",
ADD COLUMN     "status" "IncidentStatus" NOT NULL DEFAULT 'OPEN';
