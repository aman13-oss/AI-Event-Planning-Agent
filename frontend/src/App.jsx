import { useState } from "react";
import axios from "axios";
import CreateEvent from "./components/CreateEvent.jsx";
import Dashboard from "./components/Dashboard.jsx";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:8000";

export default function App() {
  const [view, setView] = useState("create"); // "create" | "dashboard"
  const [eventId, setEventId] = useState(null);
  const [eventData, setEventData] = useState(null);
  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function handleCreateEvent(formData) {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.post(`${API_BASE}/api/events`, formData);
      setEventId(res.data.event_id);
      setEventData(res.data.event);
      setPlan(res.data.plan);
      setView("dashboard");
    } catch (err) {
      setError(
        err?.response?.data?.detail ||
          "Could not reach the backend. Make sure the FastAPI server is running on " + API_BASE
      );
    } finally {
      setLoading(false);
    }
  }

  async function handleOptimizeBudget(newBudget) {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.post(
        `${API_BASE}/api/events/${eventId}/optimize-budget`,
        { new_budget: Number(newBudget) }
      );
      setPlan((prev) => ({ ...prev, budget: res.data.budget }));
      setEventData((prev) => ({ ...prev, budget: Number(newBudget) }));
      return res.data;
    } catch (err) {
      setError(
        err?.response?.data?.detail || "Could not optimize budget. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  function handleReset() {
    setView("create");
    setEventId(null);
    setEventData(null);
    setPlan(null);
    setError(null);
  }

  return (
    <div className="min-h-screen">
      <header className="bg-brand-700 text-white py-4 px-6 shadow">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <h1 className="text-xl font-bold tracking-tight">🎯 AI Event Planning Agent</h1>
          {view === "dashboard" && (
            <button
              onClick={handleReset}
              className="text-sm bg-brand-600 hover:bg-brand-500 px-3 py-1.5 rounded-md transition"
            >
              + New Event
            </button>
          )}
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
            {error}
          </div>
        )}

        {view === "create" && (
          <CreateEvent onSubmit={handleCreateEvent} loading={loading} />
        )}

        {view === "dashboard" && plan && (
          <Dashboard
            eventData={eventData}
            plan={plan}
            loading={loading}
            onOptimizeBudget={handleOptimizeBudget}
          />
        )}
      </main>
    </div>
  );
}
