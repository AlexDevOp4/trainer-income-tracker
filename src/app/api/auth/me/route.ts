import { NextResponse } from "next/server";
import { createSupabaseServer } from "../../../../lib/supabaseServer";

export async function GET() {
  const supabase = await createSupabaseServer();
  const { data: { user } } = await supabase.auth.getUser();
  return NextResponse.json({ user }, { status: user ? 200 : 401 });
}
