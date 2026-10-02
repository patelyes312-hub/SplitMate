import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { toExpense, toPayment, ExpenseRow, PaymentRow } from "@/lib/mappers";

export const dynamic = "force-dynamic";

// Single endpoint the client loads on mount: all people, groups, expenses, payments.
export async function GET() {
  const [people, groups, expenses, payments] = await Promise.all([
    supabase.from("people").select("*").order("name"),
    supabase.from("groups").select("*").order("created_at"),
    supabase.from("expenses").select("*").order("created_at"),
    supabase.from("payments").select("*").order("created_at"),
  ]);

  const err =
    people.error || groups.error || expenses.error || payments.error;
  if (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }

  return NextResponse.json({
    people: people.data ?? [],
    groups: groups.data ?? [],
    expenses: (expenses.data as ExpenseRow[] | null)?.map(toExpense) ?? [],
    payments: (payments.data as PaymentRow[] | null)?.map(toPayment) ?? [],
  });
}
