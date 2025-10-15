import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
// If you use Supabase Auth, get userId on the server; placeholder for now:
const getUserId = async () => "f2c5c93a-3a2d-4fd3-866d-fdec0e2698c7";

export async function POST(req: Request) {
  const { fullName, email, status } = await req.json();
  if (!fullName?.trim())
    return NextResponse.json({ error: "Full name required" }, { status: 400 });

  const userId = await getUserId();
  const client = await prisma.client.create({
    data: {
      userId,
      fullName: fullName.trim(),
      email: email || null,
      status: (status ?? "active") as "active" | "paused" | "inactive",
    },
    select: {
      id: true,
      fullName: true,
      email: true,
      status: true,
      createdAt: true,
    },
  });

  return NextResponse.json(client, { status: 201 });
}
