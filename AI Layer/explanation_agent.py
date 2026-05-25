# explanation_agent.py
def explain(risk, optimization, recommendation):
    return f"""
Your portfolio has a Sharpe Ratio of {round(risk['sharpe_ratio'],2)}, indicating its risk-adjusted performance.

The Value at Risk (VaR) is {round(risk['VaR'],4)}, meaning potential losses under extreme conditions.

Optimization suggests allocation:
{optimization['weights']}

Final Recommendation:
{recommendation}
"""