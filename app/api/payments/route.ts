import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { toPayment, PaymentRow } from "@/lib/mappers";
import { Payment } from "@/lib/types";

export const dynamic = "force-dynamic";

// Record a settlement payment.
export async function POST(req: NextRequest) {
  const body = (await req.json()) as Partial<Payment>;
  if (
    !body.id ||
    !body.from ||
    !body.to ||
    typeof body.amount !== "number" ||
    !body.date
  ) {
    return NextResponse.json(
      { error: "missing required payment fields" },
      { status: 400 }
    );
  }

  const { data, error } = await supabase
    .from("payments")
    .insert({
      id: body.id,
      from: body.from,
      to: body.to,
      amount: body.amount,
      date: body.date,
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json(toPayment(data as PaymentRow), { status: 201 });
}
