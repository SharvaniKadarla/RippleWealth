# orchestrator.py
from data_agent import fetch_prices
from risk_agent import risk_analysis
from simulation_agent import monte_carlo
from optimization_agent import optimize
from recommendation_agent import recommend
from explanation_agent import explain
from scenario_agent import scenario_analysis

def run_engine(tickers):
    prices = fetch_prices(tickers)

    risk = risk_analysis(prices)
    simulation = monte_carlo(prices)
    optimization = optimize(prices)
    recommendation = recommend(risk)
    scenarios = scenario_analysis(risk)

    explanation = explain(risk, optimization, recommendation)

    return {
        "risk": risk,
        "simulation_sample": simulation[:2],
        "optimization": optimization,
        "scenarios": scenarios,
        "recommendation": recommendation,
        "explanation": explanation
    }