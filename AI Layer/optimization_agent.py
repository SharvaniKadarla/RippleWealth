import numpy as np

def optimize(prices):
    returns = prices.pct_change().dropna()

    mean_returns = returns.mean()
    cov = returns.cov()

    weights = np.random.random(len(mean_returns))
    weights /= np.sum(weights)

    exp_return = float(np.dot(weights, mean_returns))
    volatility = float(np.sqrt(np.dot(weights.T, np.dot(cov, weights))))

    # convert numpy types → python floats
    weights_dict = {k: float(v) for k, v in zip(prices.columns, weights)}

    return {
        "weights": weights_dict,
        "expected_return": exp_return,
        "volatility": volatility
    }