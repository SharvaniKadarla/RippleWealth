from fastapi import FastAPI
from backend.routes import events, portfolio, simulation, recommendations, rebalance

app = FastAPI(title="RippleWealth API")

app.include_router(events.router)
app.include_router(portfolio.router)
app.include_router(simulation.router)
app.include_router(recommendations.router)
app.include_router(rebalance.router)