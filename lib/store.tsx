"use client";
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { Expense, Group, Payment, Person } from "./types";
import { getBalances, simplify } from "./calculations";

type Suggestion = { from: string; to: string; amount: number };

export type SplitMateStore = {
  people: Person[];
  groups: Group[];
  expenses: Expense[];
  payments: Payment[];
  balances: Record<string, number>;
  suggestions: Suggestion[];
  total: number;
  loading: boolean;
  error: string | null;
  personName: (id: string) => string;
  groupName: (id: string) => string;
  addExpense: (e: Expense) => Promise<void>;
  deleteExpense: (id: string) => Promise<void>;
  addGroup: (g: Group) => Promise<void>;
  markPaid: (x: Suggestion) => Promise<void>;
};

const C = createContext<SplitMateStore | null>(null);

async function json<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error || `Request failed (${res.status})`);
  }
  return res.json() as Promise<T>;
}

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [people, setPeople] = useState<Person[]>([]);
  const [groups, setGroups] = useState<Group[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load everything from the database on mount.
  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const data = await json<{
          people: Person[];
          groups: Group[];
          expenses: Expense[];
          payments: Payment[];
        }>(await fetch("/api/data"));
        if (!active) return;
        setPeople(data.people);
        setGroups(data.groups);
        setExpenses(data.expenses);
        setPayments(data.payments);
      } catch (e) {
        if (active) setError(e instanceof Error ? e.message : "Failed to load");
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  const balances = useMemo(
    () => getBalances(people, expenses, payments),
    [people, expenses, payments]
  );

  const value: SplitMateStore = {
    people,
    groups,
    expenses,
    payments,
    balances,
    suggestions: simplify(balances),
    total: expenses.reduce((a, e) => a + e.amount, 0),
    loading,
    error,
    personName: (id) => people.find((p) => p.id === id)?.name || "Unknown",
    groupName: (id) => groups.find((g) => g.id === id)?.name || "No group",
    addExpense: async (e) => {
      const saved = await json<Expense>(
        await fetch("/api/expenses", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(e),
        })
      );
      setExpenses((x) => [...x, saved]);
    },
    deleteExpense: async (id) => {
      await json<{ ok: true }>(
        await fetch(`/api/expenses/${id}`, { method: "DELETE" })
      );
      setExpenses((x) => x.filter((e) => e.id !== id));
    },
    addGroup: async (g) => {
      await json<Group>(
        await fetch("/api/groups", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(g),
        })
      );
      setGroups((x) => [...x, g]);
    },
    markPaid: async (x) => {
      const payment: Payment = {
        ...x,
        id: crypto.randomUUID(),
        date: new Date().toISOString().slice(0, 10),
      };
      const saved = await json<Payment>(
        await fetch("/api/payments", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payment),
        })
      );
      setPayments((p) => [...p, saved]);
    },
  };

  return <C.Provider value={value}>{children}</C.Provider>;
}

export const useSplitMate = () => {
  const c = useContext(C);
  if (!c) throw new Error("useSplitMate must be used within StoreProvider");
  return c;
};
