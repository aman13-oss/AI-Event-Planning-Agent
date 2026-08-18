import uuid

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from app.ai_service import generate_plan, optimize_budget

app = FastAPI(title="AI Event Planning Agent")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # fine for hackathon demo; restrict in production
    allow_methods=["*"],
    allow_headers=["*"],
)

# In-memory store — good enough for a prototype/demo. Swap for a real DB later.
EVENTS: dict[str, dict] = {}


class EventRequest(BaseModel):
    event_type: str
    location: str
    date: str
    guests: int
    budget: int
    theme: str = "modern"
    food: str = "veg_nonveg"
    duration: str = "1 day"
    special_requirements: str = ""


class OptimizeBudgetRequest(BaseModel):
    new_budget: int


@app.get("/")
def root():
    return {"status": "ok", "service": "AI Event Planning Agent"}


@app.post("/api/events")
def create_event(payload: EventRequest):
    event_id = str(uuid.uuid4())
    event_data = payload.model_dump()

    plan = generate_plan(event_data)

    EVENTS[event_id] = {"event": event_data, "plan": plan}

    return {"event_id": event_id, "event": event_data, "plan": plan}


@app.get("/api/events/{event_id}")
def get_event(event_id: str):
    record = EVENTS.get(event_id)
    if not record:
        raise HTTPException(status_code=404, detail="Event not found")
    return {"event_id": event_id, **record}


@app.post("/api/events/{event_id}/optimize-budget")
def optimize_event_budget(event_id: str, payload: OptimizeBudgetRequest):
    record = EVENTS.get(event_id)
    if not record:
        raise HTTPException(status_code=404, detail="Event not found")

    old_budget = record["plan"]["budget"]
    new_budget_breakdown = optimize_budget(record["event"], old_budget, payload.new_budget)

    record["plan"]["budget"] = new_budget_breakdown
    record["event"]["budget"] = payload.new_budget

    return {
        "event_id": event_id,
        "old_total": sum(old_budget.values()),
        "new_total": payload.new_budget,
        "savings": sum(old_budget.values()) - payload.new_budget,
        "budget": new_budget_breakdown,
    }


@app.get("/api/events/{event_id}/venues")
def get_venues(event_id: str):
    record = EVENTS.get(event_id)
    if not record:
        raise HTTPException(status_code=404, detail="Event not found")
    return {"venues": record["plan"]["venues"]}


@app.get("/api/events/{event_id}/vendors")
def get_vendors(event_id: str):
    record = EVENTS.get(event_id)
    if not record:
        raise HTTPException(status_code=404, detail="Event not found")
    return {"vendors": record["plan"]["vendors"]}


@app.patch("/api/events/{event_id}/checklist/{task_index}")
def toggle_checklist_item(event_id: str, task_index: int):
    record = EVENTS.get(event_id)
    if not record:
        raise HTTPException(status_code=404, detail="Event not found")
    checklist = record["plan"]["checklist"]
    if task_index < 0 or task_index >= len(checklist):
        raise HTTPException(status_code=400, detail="Invalid task index")
    checklist[task_index]["done"] = not checklist[task_index]["done"]
    return {"checklist": checklist}
