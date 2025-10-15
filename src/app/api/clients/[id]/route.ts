import { NextResponse } from "next/server";
import { prisma } from "@"

export async function PUT(req, { params }) {
  const body = await req.json();
  const updated = await prisma.client.update({
    where: { id: params.id },
    data: { fullName: body.fullName, email: body.email, status: body.status },
  });
  return NextResponse.json(updated);
}
