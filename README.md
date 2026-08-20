# AI Event Planning Agent

An AI-powered event planning platform. User enters event requirements (type, location, date, guests, budget, theme, food) and the system generates a complete event plan: summary, budget breakdown, venue recommendations, vendor recommendations, timeline, and a preparation checklist. Users can then ask the system to re-optimize the plan for a new budget.

## 🚀 Live Demo

**Try the deployed application:**
https://ai-event-planning-agent-1.onrender.com/

> The application is live and can be tested directly in the browser.

## Why it's built this way (read this before demoing)

This is scoped as a **submission-round prototype**, not the full final product. It's intentionally lean:

* Mock JSON data for venues/vendors instead of a real database — swap in PostgreSQL later without changing the frontend at all.
* AI calls go through a single well-defined JSON contract (see `backend/app/ai_service.py`), not a multi-tool agent framework — faster to build, easier to demo, upgrade to a real agent framework later if needed.
* **The AI service has a built-in fallback.** If `ANTHROPIC_API_KEY` isn't set, or the API call fails for any reason, it automatically uses a rule-based generator instead. This means **the demo will never break on stage** even with flaky wifi. Judges see a working plan either way.

## Tech Stack

* **Frontend:** React + Vite + Tailwind CSS + Recharts
* **Backend:** Python + FastAPI
* **AI:** Anthropic API (Claude), with rule-based fallback
* **Data:** Static JSON (`venues.json`, `vendors.json`) — swap for PostgreSQL later
* **Deployment:** Render

## Architecture

```text
USER
 ↓
React Frontend (Create Event form → Dashboard)
 ↓
FastAPI Backend
 ↓
AI Service (Anthropic API call → JSON plan, falls back to rule-based logic)
 ↓
Venue/Vendor filtering (mock JSON data)
 ↓
Structured Plan → Dashboard (budget chart, venues, vendors, timeline, checklist)
```

## Project Structure

```text
AI-Event-Planner/
├── backend/
│   ├── app/
│   │   ├── main.py          # FastAPI routes
│   │   ├── ai_service.py    # AI plan generation + budget optimization
│   │   ├── data_loader.py   # Venue/vendor filtering logic
│   │   └── data/            # Mock venues.json, vendors.json
│   ├── requirements.txt
│   └── .env.example
├── frontend/
│   ├── src/
│   │   ├── App.jsx
│   │   └── components/
│   │       ├── CreateEvent.jsx
│   │       ├── Dashboard.jsx
│   │       └── BudgetChart.jsx
│   ├── package.json
│   └── .env.example
└── README.md
```

## Setup

### Backend

```bash
cd backend

python3 -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate

pip install -r requirements.txt

# Optional but recommended: enable real AI generation
cp .env.example .env

# Edit .env and add your ANTHROPIC_API_KEY
# Without this, the app automatically uses the rule-based fallback

uvicorn app.main:app --reload --port 8000
```

Backend runs at:

```text
http://localhost:8000
```

Check `http://localhost:8000/` for a health check and `http://localhost:8000/docs` for interactive API documentation.

### Frontend

```bash
cd frontend

npm install
cp .env.example .env

# Edit the API URL if needed

npm run dev
```

Frontend runs at:

```text
http://localhost:5173
```

## API Endpoints

| Method | Endpoint                                  | Description                         |
| ------ | ----------------------------------------- | ----------------------------------- |
| POST   | `/api/events`                             | Create event and generate full plan |
| GET    | `/api/events/{id}`                        | Fetch a saved event + plan          |
| POST   | `/api/events/{id}/optimize-budget`        | Re-optimize budget for new total    |
| GET    | `/api/events/{id}/venues`                 | Get recommended venues              |
| GET    | `/api/events/{id}/vendors`                | Get recommended vendors             |
| PATCH  | `/api/events/{id}/checklist/{task_index}` | Toggle a checklist item             |

## Demo Script (for judges, ~3–4 minutes)

### 1. Create an Event

Open the **Live Demo**:

https://ai-event-planning-agent-1.onrender.com/

Fill the form with:

* **Event Type:** Corporate Event
* **Location:** Gurgaon
* **Guests:** 150
* **Budget:** ₹5,00,000

Click **Generate Event Plan**.

The application generates:

* Event summary
* Budget breakdown
* Budget visualization
* Venue recommendations
* Vendor recommendations
* Event timeline
* Preparation checklist

### 2. Optimize the Budget

Change the budget from **₹5,00,000 → ₹4,00,000** and click **Optimize**.

The system re-optimizes the allocation while protecting important categories such as venue and catering from excessive cuts.

### 3. Checklist

Check off a few preparation tasks.

The readiness progress bar updates automatically as tasks are completed.

## Future Scope

* Real PostgreSQL database (schema sketched out — users, events, venues, vendors, guests, tasks)
* AI chat assistant for free-form follow-up requests
* RSVP management for guests
* Multi-tool agent architecture with separate venue, vendor, budget, and timeline tools
* Improved production deployment architecture and monitoring
* User authentication and event history
* Real vendor and venue integrations

## Deployment

The current application is deployed and publicly accessible through **Render**.

**Live Application:**
https://ai-event-planning-agent-1.onrender.com/

The backend and frontend deployment configuration can be further separated into dedicated production services as the project evolves.

## Project Status

**Current Status:** 🟢 Live Demo / Submission Prototype

The application is currently deployed and available for testing.
