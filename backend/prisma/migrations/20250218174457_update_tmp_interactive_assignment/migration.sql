/*
  Warnings:

  - You are about to drop the column `codeSnippet` on the `InteractiveAssignment` table. All the data in the column will be lost.
  - You are about to drop the column `constraints` on the `InteractiveAssignment` table. All the data in the column will be lost.
  - You are about to drop the column `instructions` on the `InteractiveAssignment` table. All the data in the column will be lost.
  - You are about to drop the column `language` on the `InteractiveAssignment` table. All the data in the column will be lost.
  - You are about to drop the column `maxAttempts` on the `InteractiveAssignment` table. All the data in the column will be lost.
  - You are about to drop the column `testCases` on the `InteractiveAssignment` table. All the data in the column will be lost.
  - Added the required column `content` to the `InteractiveAssignment` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "InteractiveAssignment" DROP COLUMN "codeSnippet",
DROP COLUMN "constraints",
DROP COLUMN "instructions",
DROP COLUMN "language",
DROP COLUMN "maxAttempts",
DROP COLUMN "testCases",
ADD COLUMN     "content" TEXT NOT NULL;
