/*
  Warnings:

  - Added the required column `description` to the `tests_cases` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "tests_cases" ADD COLUMN     "description" TEXT NOT NULL;
