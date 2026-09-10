/*
  Warnings:

  - A unique constraint covering the columns `[registrationNumber]` on the table `users` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[rollNumber]` on the table `users` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "users" ADD COLUMN     "batchYear" INTEGER,
ADD COLUMN     "registrationNumber" TEXT,
ADD COLUMN     "rollNumber" TEXT;

-- CreateTable
CREATE TABLE "student_counters" (
    "id" TEXT NOT NULL,
    "year" INTEGER NOT NULL,
    "lastCount" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "student_counters_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "student_counters_year_key" ON "student_counters"("year");

-- CreateIndex
CREATE UNIQUE INDEX "users_registrationNumber_key" ON "users"("registrationNumber");

-- CreateIndex
CREATE UNIQUE INDEX "users_rollNumber_key" ON "users"("rollNumber");
