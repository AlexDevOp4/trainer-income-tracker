import { NextResponse } from "next/server";
import { supabaseAdmin } from '../../../lib/supabaseAdmin';
export const runtime = "nodejs";

const DEV_USER_ID = process.env.DEV_USER_ID!

export async function POST(req: Request) {
  try {
    const { fullName, email, status = "active" } = await req.json();
    if (!fullName?.trim()) {
      return NextResponse.json({ error: "Full name required" }, { status: 400 });
    }

    const { data, error } = await supabaseAdmin
      .from("Client") // Prisma created "Client" (capital C)
      .insert([{ userId: DEV_USER_ID, fullName: fullName.trim(), email: email || null, status }])
      .select("id, fullName, email, status, createdAt")
      .single();

    if (error) throw error;
    return NextResponse.json({ client: data }, { status: 201 });
  } catch (err: any) {
    console.error("Supabase insert error:", err.message || err);
    return NextResponse.json({ error: err.message || "Insert failed" }, { status: 500 });
  }
}

export async function GET() {
  const { data, error } = await supabaseAdmin
    .from("Client")
    .select("*")
    .order("createdAt", { ascending: false });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ clients: data }, { status: 200 });
}

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  try {

    const clientId = params.id;
    const updates = await req.json()

    if (!clientId) {
      return NextResponse.json({ error: "Client ID required" }, { status: 400 })
    }

    if (Object.keys(updates).length === 0) {
      return NextResponse.json({ error: "No fields provided" }, { status: 400 })
    }

    const { data, error } = await supabaseAdmin.from("Client").update(updates).eq("id", clientId).select("*").single()

    if (error) throw error

    return NextResponse.json({ client: data }, {status: 200 })

  } catch (err: any) {
    console.log("Supabse update error:", err.message)
    return NextResponse.json({ error: err.message }, {status: 500})
  }
}

//? Docker Configuration
//! Comment out when on a better network
// import { NextResponse } from "next/server";
// import { PrismaClient } from "@prisma/client";
// const prisma = new PrismaClient();

// export async function GET() {
//   const clients = await prisma.client.findMany({
//     orderBy: { createdAt: "desc" },
//   });
//   return NextResponse.json({ clients });
// }
