import { NextResponse } from "next/server";
import { supabaseAdmin } from "../../../../lib/supabaseAdmin";

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