import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();


async function main() {
  const userId = "f2c5c93a-3a2d-4fd3-866d-fdec0e2698c7"; // your test user

  // Clients
  const alex = await prisma.client.create({
    data: { userId, fullName: "Alex A", email: "alex.ashtiany@gmail.com", status: "active", costCents: 9000 }
  });
  const jon = await prisma.client.create({
    data: { userId, fullName: "Jonathan Doe", email: "john@test.com", status: "active", costCents: 7500 }
  });

  // Sessions (snapshot priceCentsAtTime)
  await prisma.session.createMany({
    data: [
      { userId, clientId: alex.id, performedAt: new Date("2025-09-02T10:30:00Z"), status: "completed", priceCentsAtTime: 9000, feeCents: 0, durationMinutes: 45, notes: "Leg day" },
      { userId, clientId: alex.id, performedAt: new Date("2025-09-05T10:30:00Z"), status: "completed", priceCentsAtTime: 9000, feeCents: 0, durationMinutes: 45, notes: "Upper body" },
      { userId, clientId: alex.id, performedAt: new Date("2025-10-01T10:30:00Z"), status: "completed", priceCentsAtTime: 9000, feeCents: 0, durationMinutes: 45, notes: "HYROX prep" },

      { userId, clientId: jon.id, performedAt: new Date("2025-09-03T08:15:00Z"), status: "completed", priceCentsAtTime: 7500, feeCents: 0, durationMinutes: 45, notes: "Circuit" },
      { userId, clientId: jon.id, performedAt: new Date("2025-09-07T08:15:00Z"), status: "completed", priceCentsAtTime: 7500, feeCents: 0, durationMinutes: 45, notes: "KB conditioning" },
      { userId, clientId: jon.id, performedAt: new Date("2025-10-02T08:15:00Z"), status: "no_show",   priceCentsAtTime: 7500, feeCents: 0, durationMinutes: 45, notes: "No show" },
    ]
  });

  console.log("Seed complete.");
}

main().finally(() => prisma.$disconnect());
