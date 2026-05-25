import numpy as np

def calculate_returns(prices):
    return prices.pct_change().dropna()

def sharpe_ratio(returns):
    return float(np.mean(returns) / np.std(returns) * np.sqrt(252))

def value_at_risk(returns, confidence=0.95):
    return float(np.percentile(returns, (1 - confidence) * 100))

def risk_analysis(prices):
    returns = calculate_returns(prices)
    avg_returns = returns.mean(axis=1)

    return {
        "sharpe_ratio": sharpe_ratio(avg_returns),
        "VaR": value_at_risk(avg_returns)
    }