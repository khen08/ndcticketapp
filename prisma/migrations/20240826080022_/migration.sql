/*
  Warnings:

  - You are about to drop the column `failedAttempts` on the `user` table. All the data in the column will be lost.
  - You are about to drop the column `lockoutUntil` on the `user` table. All the data in the column will be lost.
  - You are about to drop the column `password` on the `user` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `user` DROP COLUMN `failedAttempts`,
    DROP COLUMN `lockoutUntil`,
    DROP COLUMN `password`;
