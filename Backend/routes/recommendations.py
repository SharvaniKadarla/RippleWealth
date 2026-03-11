from fastapi import APIRouter

router = APIRouter()

@router.post("/recommend")
def recommend(event: dict):

    event_name = event.get("event")

    if event_name == "Typhoon in Taiwan":

        return {
            "avoid": ["NVIDIA", "AMD"],
            "suggested": ["Microsoft", "Google", "Adobe"],
            "reason": "Cloud companies are less dependent on semiconductor supply chains."
        }

    elif event_name == "Port Strike in Los Angeles":

        return {
            "avoid": ["Amazon"],
            "suggested": ["Salesforce", "Adobe", "ServiceNow"],
            "reason": "Digital service companies are less affected by logistics disruptions."
        }

    else:

        return {
            "avoid": [],
            "suggested": ["SPY ETF"],
            "reason": "Diversified exposure recommended."
        }