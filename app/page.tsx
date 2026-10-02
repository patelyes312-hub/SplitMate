"use client";
import { useSplitMate } from "@/lib/store";
import AppShell from "@/components/AppShell";
import Stat from "@/components/Stat";
import Panel from "@/components/Panel";
import ExpenseRow from "@/components/ExpenseRow";
import { money } from "@/lib/calculations";

export default function Dashboard(){
 const s=useSplitMate();
 if(s.loading) return <AppShell><p className="py-12 text-center text-slate-500">Loading…</p></AppShell>;
 if(s.error) return <AppShell><p className="py-12 text-center text-red-600">{s.error}</p></AppShell>;
 return <AppShell><div><h2 className="text-3xl font-bold">Hello, Yash</h2><p className="text-slate-500">Your shared spending overview.</p></div>
 <div className="grid gap-4 sm:grid-cols-3"><Stat label="Total expenses" value={money(s.total)}/><Stat label="Your balance" value={money(s.balances.yash||0)}/><Stat label="Payments to settle" value={String(s.suggestions.length)}/></div>
 <Panel title="Current balances">{s.people.map(p=><div key={p.id} className="flex justify-between border-b py-3 last:border-0"><b>{p.name}</b><strong className={(s.balances[p.id]||0)>=0?"text-emerald-600":"text-red-600"}>{(s.balances[p.id]||0)>=0?"gets back ":"owes "}{money(Math.abs(s.balances[p.id]||0))}</strong></div>)}</Panel>
 <Panel title="Recent expenses">{s.expenses.slice().reverse().map(e=><ExpenseRow key={e.id} expense={e}/>)}</Panel></AppShell>
}