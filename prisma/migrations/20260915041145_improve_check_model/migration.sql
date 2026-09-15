/*
  Warnings:

  - Changed the type of `status` on the `Check` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "MonitorStatus" AS ENUM ('UNKNOWN', 'UP', 'DOWN');

-- CreateEnum
CREATE TYPE "CheckStatus" AS ENUM ('SUCCESS', 'FAILED');

-- AlterTable
ALTER TABLE "Check" DROP COLUMN "status",
ADD COLUMN     "status" "CheckStatus" NOT NULL,
ALTER COLUMN "statusCode" DROP NOT NULL,
ALTER COLUMN "error" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Monitor" ADD COLUMN     "status" "MonitorStatus" NOT NULL DEFAULT 'UNKNOWN',
ALTER COLUMN "timeout" SET DEFAULT 30000;
