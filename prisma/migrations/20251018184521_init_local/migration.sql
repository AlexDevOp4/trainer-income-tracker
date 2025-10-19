/*
  Warnings:

  - Added the required column `costCents` to the `Client` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "SessionStatus" AS ENUM ('completed', 'canceled', 'no_show');

-- AlterTable
ALTER TABLE "Client" ADD COLUMN     "costCents" INTEGER NOT NULL;
