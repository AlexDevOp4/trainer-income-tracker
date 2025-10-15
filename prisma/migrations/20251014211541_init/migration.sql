-- CreateEnum
CREATE TYPE "ClientStatus" AS ENUM ('active', 'paused', 'inactive');

-- CreateEnum
CREATE TYPE "PaymentCategory" AS ENUM ('session', 'package', 'subscription', 'other');

-- CreateTable
CREATE TABLE "Client" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "email" TEXT,
    "status" "ClientStatus" NOT NULL DEFAULT 'active',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Client_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Payment" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "clientId" TEXT NOT NULL,
    "amount" DECIMAL(12,2) NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'USD',
    "category" "PaymentCategory" NOT NULL DEFAULT 'session',
    "note" TEXT,
    "paidAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Payment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ClientMonthlySummary" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "clientId" TEXT NOT NULL,
    "year" INTEGER NOT NULL,
    "month" INTEGER NOT NULL,
    "totalAmount" DECIMAL(12,2) NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'USD',
    "finalizedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ClientMonthlySummary_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Client_userId_status_idx" ON "Client"("userId", "status");

-- CreateIndex
CREATE INDEX "Payment_userId_paidAt_idx" ON "Payment"("userId", "paidAt");

-- CreateIndex
CREATE INDEX "Payment_clientId_paidAt_idx" ON "Payment"("clientId", "paidAt");

-- CreateIndex
CREATE INDEX "Payment_userId_clientId_paidAt_idx" ON "Payment"("userId", "clientId", "paidAt");

-- CreateIndex
CREATE INDEX "ClientMonthlySummary_userId_year_month_idx" ON "ClientMonthlySummary"("userId", "year", "month");

-- CreateIndex
CREATE INDEX "ClientMonthlySummary_clientId_year_month_idx" ON "ClientMonthlySummary"("clientId", "year", "month");

-- CreateIndex
CREATE UNIQUE INDEX "ClientMonthlySummary_userId_clientId_year_month_key" ON "ClientMonthlySummary"("userId", "clientId", "year", "month");

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClientMonthlySummary" ADD CONSTRAINT "ClientMonthlySummary_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client"("id") ON DELETE CASCADE ON UPDATE CASCADE;
