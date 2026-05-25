import numpy as np

def monte_carlo(prices, days=30, sims=100):
    returns = prices.pct_change().dropna()
    mean = returns.mean()
    std = returns.std()

    last_price = prices.iloc[-1]

    results = []

    for _ in range(sims):
        path = [last_price]

        for _ in range(days):
            shock = np.random.normal(mean, std)
            path.append(path[-1] * (1 + shock))

        results.append(path)

    return results