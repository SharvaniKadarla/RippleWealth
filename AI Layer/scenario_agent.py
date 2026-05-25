# scenario_agent.py
def scenario_analysis(risk):
    scenarios = []

    if risk["VaR"] < -0.05:
        scenarios.append("Market crash → significant losses expected")

    if risk["sharpe_ratio"] < 0.5:
        scenarios.append("Low efficiency portfolio")

    if not scenarios:
        scenarios.append("Stable portfolio under current conditions")

    return scenarios