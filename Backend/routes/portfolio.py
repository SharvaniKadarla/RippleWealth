from fastapi import APIRouter
import random

router = APIRouter()

@router.get("/portfolio")

def portfolio():

    return [
        {"asset":"NVIDIA","ticker":"NVDA","investment":30000},
        {"asset":"Apple","ticker":"AAPL","investment":25000},
        {"asset":"Microsoft","ticker":"MSFT","investment":20000},
        {"asset":"Tesla","ticker":"TSLA","investment":15000},
        {"asset":"Amazon","ticker":"AMZN","investment":10000}
    ]


@router.get("/portfolio/risk")

def portfolio_risk():

    return {
        "VaR": random.randint(90,120),
        "CVaR": random.randint(120,160),
        "sector_exposure":{
            "Tech":45,
            "Energy":25,
            "Retail":30
        }
    }
