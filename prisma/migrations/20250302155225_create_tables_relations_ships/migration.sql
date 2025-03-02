/*
  Warnings:

  - You are about to drop the column `feature` on the `tests_cases` table. All the data in the column will be lost.
  - Added the required column `teamId` to the `Feature` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `Feature` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `Team` table without a default value. This is not possible if the table is not empty.
  - Added the required column `featureId` to the `tests_cases` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Feature" ADD COLUMN     "teamId" TEXT NOT NULL,
ADD COLUMN     "userId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Team" ADD COLUMN     "userId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "tests_cases" DROP COLUMN "feature",
ADD COLUMN     "featureId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "tests_cases" ADD CONSTRAINT "tests_cases_featureId_fkey" FOREIGN KEY ("featureId") REFERENCES "Feature"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Feature" ADD CONSTRAINT "Feature_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Team"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Feature" ADD CONSTRAINT "Feature_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Team" ADD CONSTRAINT "Team_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
