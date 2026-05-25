def recommend(risk):
    if risk["VaR"] < -0.05:
        return "High downside risk → shift to safer assets like bonds/gold"

    if risk["sharpe_ratio"] > 1:
        return "Strong portfolio → maintain current allocation"

    return "Moderate risk → diversify across sectors"