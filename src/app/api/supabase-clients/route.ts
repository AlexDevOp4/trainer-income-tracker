import { NextResponse } from "next/server";
import { supabaseAdmin } from '../../../lib/supabaseAdmin';

const DEV_USER_ID = process.env.DEV_USER_ID!
export const runtime = "nodejs"; // ensures Node runtime (access to process.env)

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
  try {

    const { data, error } = await supabaseAdmin.from("Client").select("*").order("createdAt", { ascending: false })
    
    if (error) throw error;
    return NextResponse.json({ clients: data }, {status: 200})
    
  } catch (err: any) {
    console.error("Supabase fetch error:", err.message)
    return NextResponse.json({ error: err.message}, {status: 500})
  }
}     