from fastapi import APIRouter

router = APIRouter()

@router.get("/events")

def get_events():

    return [
        {
            "title":"Typhoon in Taiwan",
            "industry":"Semiconductors",
            "severity":"High",
            "confidence":0.87
        },
        {
            "title":"Port Strike in Los Angeles",
            "industry":"Logistics",
            "severity":"Medium",
            "confidence":0.73
        }
    ]
