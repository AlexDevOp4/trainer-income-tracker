import { NextResponse } from "next/server";
import { supabaseAdmin } from "../../../../lib/supabaseAdmin";
import { createSupabaseServer } from "../../../../lib/supabaseServer";


export const runtime = "nodejs";

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

    return NextResponse.json({ client: data }, { status: 200 })

  } catch (err: any) {
    console.log("Supabse update error:", err.message)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

export async function DELETE(
  _req: Request,
  ctx: { params: Promise<{ id: string }> }
) {
  const { id } = await ctx.params;
  if (!id) return NextResponse.json({ error: "Client ID required" }, { status: 400 });

  const supabase = await createSupabaseServer();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

  const { data, error } = await supabase
    .from("Client")
    .delete()
    .eq("id", id)
    .select("*");

  if (error) return NextResponse.json({ error: error.message }, { status: 403 });
  if (!data?.length) return NextResponse.json({ error: "Not found or not owned" }, { status: 404 });

  return NextResponse.json({ message: "Client deleted", client: data[0] }, { status: 200 });
}