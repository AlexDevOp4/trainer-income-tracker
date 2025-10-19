-- CreateTable
CREATE TABLE "Session" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "clientId" TEXT NOT NULL,
    "performedAt" TIMESTAMPTZ(6) NOT NULL,
    "status" "SessionStatus" NOT NULL DEFAULT 'completed',
    "priceCentsAtTime" INTEGER NOT NULL DEFAULT 0,
    "feeCents" INTEGER NOT NULL DEFAULT 0,
    "durationMinutes" INTEGER,
    "notes" TEXT,
    "cancelledAt" TIMESTAMPTZ(6),
    "cancelReason" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Session_userId_performedAt_idx" ON "Session"("userId", "performedAt");

-- CreateIndex
CREATE INDEX "Session_userId_clientId_performedAt_idx" ON "Session"("userId", "clientId", "performedAt");
