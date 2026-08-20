import { useState } from "react";
import BudgetChart from "./BudgetChart.jsx";

function Card({ title, children, className = "" }) {
  return (
    <div className={`bg-white rounded-xl shadow-sm border border-slate-200 p-5 ${className}`}>
      <h3 className="font-semibold text-slate-800 mb-3">{title}</h3>
      {children}
    </div>
  );
}

export default function Dashboard({ eventData, plan, loading, onOptimizeBudget }) {
  const [newBudget, setNewBudget] = useState(eventData.budget);
  const [optimizeResult, setOptimizeResult] = useState(null);
  const [checklist, setChecklist] = useState(plan.checklist);

  const completedCount = checklist.filter((c) => c.done).length;
  const progressPct = Math.round((completedCount / checklist.length) * 100);

  async function handleOptimize() {
    const result = await onOptimizeBudget(newBudget);
    if (result) setOptimizeResult(result);
  }

  function toggleTask(idx) {
    setChecklist((prev) =>
      prev.map((item, i) => (i === idx ? { ...item, done: !item.done } : item))
    );
  }

  return (
    <div className="space-y-6">
      {/* Summary */}
      <Card title="📋 Event Summary">
        <p className="text-slate-600">{plan.summary}</p>
        <div className="flex flex-wrap gap-2 mt-3 text-xs">
          <span className="bg-brand-50 text-brand-700 px-2 py-1 rounded-full">
            {eventData.event_type}
          </span>
          <span className="bg-brand-50 text-brand-700 px-2 py-1 rounded-full">
            {eventData.location}
          </span>
          <span className="bg-brand-50 text-brand-700 px-2 py-1 rounded-full">
            {eventData.guests} guests
          </span>
          <span className="bg-brand-50 text-brand-700 px-2 py-1 rounded-full">
            {eventData.date}
          </span>
          {plan.meta?.generated_by === "rule_based" && (
            <span className="bg-amber-50 text-amber-700 px-2 py-1 rounded-full">
              offline/demo mode
            </span>
          )}
        </div>
      </Card>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Budget */}
        <Card title="💰 Budget Breakdown">
          <BudgetChart budget={plan.budget} />

          <div className="mt-4 pt-4 border-t border-slate-100">
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Adjust total budget
            </label>
            <div className="flex gap-2">
              <input
                type="number"
                value={newBudget}
                onChange={(e) => setNewBudget(e.target.value)}
                className="flex-1 border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-brand-500 focus:outline-none"
              />
              <button
                onClick={handleOptimize}
                disabled={loading}
                className="bg-brand-600 hover:bg-brand-700 disabled:opacity-60 text-white px-4 py-2 rounded-lg text-sm font-medium transition"
              >
                {loading ? "Optimizing..." : "Optimize"}
              </button>
            </div>
            {optimizeResult && (
              <p className="text-sm text-green-700 bg-green-50 rounded-lg px-3 py-2 mt-3">
                ✓ Saved ₹{Math.max(0, optimizeResult.savings).toLocaleString("en-IN")} —
                venue capacity and catering quality preserved.
              </p>
            )}
          </div>
        </Card>

        {/* Checklist */}
        <Card title="✅ Preparation Checklist">
          <div className="mb-3">
            <div className="flex justify-between text-sm text-slate-500 mb-1">
              <span>Event Readiness</span>
              <span>
                {completedCount} / {checklist.length} tasks
              </span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-2">
              <div
                className="bg-brand-600 h-2 rounded-full transition-all"
                style={{ width: `${progressPct}%` }}
              />
            </div>
          </div>
          <ul className="space-y-2 max-h-56 overflow-y-auto pr-1">
            {checklist.map((item, idx) => (
              <li key={idx} className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={item.done}
                  onChange={() => toggleTask(idx)}
                  className="accent-brand-600 w-4 h-4"
                />
                <span className={item.done ? "line-through text-slate-400" : "text-slate-700"}>
                  {item.task}
                </span>
              </li>
            ))}
          </ul>
        </Card>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Venues */}
        <Card title="🏛️ Recommended Venues">
          <div className="space-y-3">
            {plan.venues.map((v) => (
              <div key={v.id} className="border border-slate-100 rounded-lg p-3">
                <div className="flex justify-between items-start">
                  <span className="font-medium text-slate-800">{v.name}</span>
                  <span className="text-xs bg-amber-50 text-amber-700 px-2 py-0.5 rounded-full">
                    ★ {v.rating}
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  {v.location} • Capacity {v.capacity} • ₹{v.price.toLocaleString("en-IN")}
                </p>
              </div>
            ))}
          </div>
        </Card>

        {/* Vendors */}
        <Card title="🤝 Recommended Vendors">
          <div className="space-y-3">
            {plan.vendors.map((v) => (
              <div key={v.id} className="border border-slate-100 rounded-lg p-3">
                <div className="flex justify-between items-start">
                  <span className="font-medium text-slate-800">{v.name}</span>
                  <span className="text-xs bg-amber-50 text-amber-700 px-2 py-0.5 rounded-full">
                    ★ {v.rating}
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-1 capitalize">
                  {v.category} • ₹{v.price.toLocaleString("en-IN")}
                </p>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Timeline */}
      <Card title="🗓️ Event Timeline">
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h4 className="text-sm font-semibold text-slate-500 mb-2">Event Day</h4>
            <ul className="space-y-1.5 text-sm">
              {plan.timeline.event_day.map((t, i) => (
                <li key={i} className="flex gap-3">
                  <span className="text-brand-600 font-medium w-20 shrink-0">{t.time}</span>
                  <span className="text-slate-600">{t.activity}</span>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-slate-500 mb-2">Preparation Timeline</h4>
            <ul className="space-y-1.5 text-sm">
              {plan.timeline.preparation.map((t, i) => (
                <li key={i} className="flex gap-3">
                  <span className="text-brand-600 font-medium w-28 shrink-0">{t.milestone}</span>
                  <span className="text-slate-600">{t.task}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Card>
    </div>
  );
}
