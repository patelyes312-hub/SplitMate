import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { fromExpense, toExpense, ExpenseRow } from "@/lib/mappers";
import { Expense } from "@/lib/types";

export const dynamic = "force-dynamic";

// Create an expense.
export async function POST(req: NextRequest) {
  const body = (await req.json()) as Partial<Expense>;
  if (
    !body.id ||
    !body.description ||
    !body.groupId ||
    !body.paidBy ||
    typeof body.amount !== "number" ||
    !body.splitType ||
    !body.splits
  ) {
    return NextResponse.json(
      { error: "missing required expense fields" },
      { status: 400 }
    );
  }

  const row = fromExpense(body as Expense);
  const { data, error } = await supabase
    .from("expenses")
    .insert(row)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json(toExpense(data as ExpenseRow), { status: 201 });
}
