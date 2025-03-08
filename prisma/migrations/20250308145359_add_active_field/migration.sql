-- AlterTable
ALTER TABLE "Feature" ADD COLUMN     "active" BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE "Team" ADD COLUMN     "active" BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE "tests_cases" ALTER COLUMN "active" SET DEFAULT true;

-- AlterTable
ALTER TABLE "users" ALTER COLUMN "active" SET DEFAULT true;
