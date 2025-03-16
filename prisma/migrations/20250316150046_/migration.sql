/*
  Warnings:

  - You are about to drop the column `rule` on the `users` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ADMIN', 'QA', 'USER');

-- AlterTable
ALTER TABLE "users" DROP COLUMN "rule",
ADD COLUMN     "role" "Role" NOT NULL DEFAULT 'QA';
