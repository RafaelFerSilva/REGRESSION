-- CreateTable
CREATE TABLE "tests_cases" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "feature" TEXT NOT NULL,
    "active" BOOLEAN NOT NULL,
    "criticality" TEXT,
    "priority" TEXT,
    "severity" TEXT,
    "platform" TEXT[],
    "type" TEXT NOT NULL,
    "prerequisite" TEXT,
    "steps" TEXT NOT NULL,
    "expected_result" TEXT NOT NULL,
    "observation" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "tests_cases_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "tests_cases_title_key" ON "tests_cases"("title");
