import { useState } from "react";

const EVENT_TYPES = ["corporate", "wedding", "birthday", "conference", "exhibition"];
const FOOD_OPTIONS = [
  { value: "veg", label: "Vegetarian" },
  { value: "nonveg", label: "Non-Vegetarian" },
  { value: "veg_nonveg", label: "Veg + Non-Veg" },
];

export default function CreateEvent({ onSubmit, loading }) {
  const [form, setForm] = useState({
    event_type: "corporate",
    location: "Gurgaon",
    date: "",
    guests: 150,
    budget: 500000,
    theme: "Modern",
    food: "veg_nonveg",
    duration: "1 day",
    special_requirements: "",
  });

  function update(key, value) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    onSubmit(form);
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-slate-800">Plan Your Complete Event</h2>
        <p className="text-slate-500 mt-1">
          Fill in your requirements — AI will generate a full event plan in seconds.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 space-y-5"
      >
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Event Type</label>
            <select
              value={form.event_type}
              onChange={(e) => update("event_type", e.target.value)}
              className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-brand-500 focus:outline-none"
            >
              {EVENT_TYPES.map((t) => (
                <option key={t} value={t}>
                  {t[0].toUpperCase() + t.slice(1)}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Location</label>
            <input
              type="text"
              value={form.location}
              onChange={(e) => update("location", e.target.value)}
              className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-brand-500 focus:outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Event Date</label>
            <input
              type="date"
              value={form.date}
              onChange={(e) => update("date", e.target.value)}
              className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-brand-500 focus:outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Number of Guests</label>
            <input
              type="number"
              min="1"
              value={form.guests}
              onChange={(e) => update("guests", Number(e.target.value))}
              className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-brand-500 focus:outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Budget (₹)</label>
            <input
              type="number"
              min="1000"
              step="1000"
              value={form.budget}
              onChange={(e) => update("budget", Number(e.target.value))}
              className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-brand-500 focus:outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Theme</label>
            <input
              type="text"
              value={form.theme}
              onChange={(e) => update("theme", e.target.value)}
              className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-brand-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Food Preference</label>
            <select
              value={form.food}
              onChange={(e) => update("food", e.target.value)}
              className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-brand-500 focus:outline-none"
            >
              {FOOD_OPTIONS.map((f) => (
                <option key={f.value} value={f.value}>
                  {f.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Duration</label>
            <input
              type="text"
              value={form.duration}
              onChange={(e) => update("duration", e.target.value)}
              className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-brand-500 focus:outline-none"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Special Requirements (optional)
          </label>
          <textarea
            value={form.special_requirements}
            onChange={(e) => update("special_requirements", e.target.value)}
            rows={3}
            className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-brand-500 focus:outline-none"
            placeholder="e.g. wheelchair accessibility, kids' zone, live band..."
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-brand-600 hover:bg-brand-700 disabled:opacity-60 text-white font-medium py-3 rounded-lg transition"
        >
          {loading ? "Generating your plan..." : "Generate Event Plan"}
        </button>
      </form>
    </div>
  );
}
