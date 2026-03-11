from fastapi import APIRouter

router = APIRouter()

@router.post("/rebalance")
def rebalance():

    return {

        "current_portfolio": {
            "NVDA": 30,
            "AAPL": 25,
            "MSFT": 20,
            "TSLA": 15,
            "AMZN": 10
        },

        "recommended_portfolio": {
            "NVDA": 20,
            "AAPL": 25,
            "MSFT": 30,
            "TSLA": 15,
            "GOOG": 10
        },

        "explanation": "Reduce semiconductor exposure and increase cloud/software allocation."
    }