from fastapi import APIRouter

router = APIRouter()

@router.post("/simulate")
def simulate(event: dict):

    event_name = event.get("event")

    starting_value = 100000

    if event_name == "Typhoon in Taiwan":

        projection = [100000, 98500, 97200, 96000, 95000]

    elif event_name == "Port Strike in Los Angeles":

        projection = [100000, 99200, 98500, 98000, 97500]

    else:

        projection = [100000, 100200, 100400, 100600, 100800]

    final_value = projection[-1]

    loss = starting_value - final_value

    loss_percent = round((loss / starting_value) * 100, 2)

    return {
        "projection": projection,
        "loss": loss,
        "loss_percent": loss_percent
    }