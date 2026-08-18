import json
import os

DATA_DIR = os.path.join(os.path.dirname(__file__), "data")


def load_venues():
    with open(os.path.join(DATA_DIR, "venues.json"), "r", encoding="utf-8") as f:
        return json.load(f)


def load_vendors():
    with open(os.path.join(DATA_DIR, "vendors.json"), "r", encoding="utf-8") as f:
        return json.load(f)


def filter_venues(event, top_n=3):
    """Filter venues by capacity, location and rough budget fit, then rank by rating."""
    venues = load_venues()
    guests = event.get("guests", 0)
    location = (event.get("location") or "").lower()
    event_type = (event.get("event_type") or "corporate").lower()

    def score(v):
        matches_location = location in v["location"].lower() or v["location"].lower() in location
        matches_capacity = v["capacity"] >= guests
        matches_type = event_type in [t.lower() for t in v.get("type", [])]
        return (matches_location, matches_capacity, matches_type, v["rating"])

    ranked = sorted(venues, key=score, reverse=True)
    # Prefer ones that actually fit capacity
    fitting = [v for v in ranked if v["capacity"] >= guests] or ranked
    return fitting[:top_n]


def filter_vendors_by_category(category, top_n=2):
    vendors = load_vendors()
    matched = [v for v in vendors if v["category"] == category]
    matched.sort(key=lambda v: v["rating"], reverse=True)
    return matched[:top_n]


def recommend_vendors(event):
    categories = ["catering", "decoration", "photography", "entertainment", "security"]
    result = []
    for cat in categories:
        result.extend(filter_vendors_by_category(cat, top_n=1))
    return result
