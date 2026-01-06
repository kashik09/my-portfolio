/*
  Warnings:

  - A unique constraint covering the columns `[userId,deviceFingerprint]` on the table `device_sessions` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "device_sessions" ADD COLUMN     "lastTwoFactorAt" TIMESTAMP(3),
ADD COLUMN     "trustedUntil" TIMESTAMP(3);

-- CreateIndex
CREATE UNIQUE INDEX "device_sessions_userId_deviceFingerprint_key" ON "device_sessions"("userId", "deviceFingerprint");
