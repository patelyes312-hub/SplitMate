import { Expense, Payment, SplitType } from "./types";

// Supabase row shapes (snake_case columns) <-> app types (camelCase).

export type ExpenseRow = {
  id: string;
  description: string;
  group_id: string;
  paid_by: string;
  amount: number | string;
  date: string;
  split_type: string;
  splits: Record<string, number>;
};

export type PaymentRow = {
  id: string;
  from: string;
  to: string;
  amount: number | string;
  date: string;
};

export function toExpense(r: ExpenseRow): Expense {
  return {
    id: r.id,
    description: r.description,
    groupId: r.group_id,
    paidBy: r.paid_by,
    amount: Number(r.amount),
    date: r.date,
    splitType: r.split_type as SplitType,
    splits: r.splits ?? {},
  };
}

export function fromExpense(e: Expense): ExpenseRow {
  return {
    id: e.id,
    description: e.description,
    group_id: e.groupId,
    paid_by: e.paidBy,
    amount: e.amount,
    date: e.date,
    split_type: e.splitType,
    splits: e.splits,
  };
}

export function toPayment(r: PaymentRow): Payment {
  return {
    id: r.id,
    from: r.from,
    to: r.to,
    amount: Number(r.amount),
    date: r.date,
  };
}
