import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { Group } from "@/lib/types";

export const dynamic = "force-dynamic";

// Create a group.
export async function POST(req: NextRequest) {
  const body = (await req.json()) as Partial<Group>;
  if (!body.id || !body.name || !Array.isArray(body.members)) {
    return NextResponse.json(
      { error: "id, name and members are required" },
      { status: 400 }
    );
  }

  const { data, error } = await supabase
    .from("groups")
    .insert({ id: body.id, name: body.name, members: body.members })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json(data, { status: 201 });
}
