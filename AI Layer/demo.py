from agent_orchestrator import run_engine

tickers = ["AAPL", "TSLA", "MSFT"]

result = run_engine(tickers)

risk = result["risk"]
opt = result["optimization"]
rec = result["recommendation"]
scenarios = result["scenarios"]

print("\n" + "="*50)
print("📊 RIPPLEWEALTH AI FINANCIAL REPORT")
print("="*50)

# --- Risk ---
print("\n🔍 Risk Analysis")
print(f"Sharpe Ratio : {risk['sharpe_ratio']:.2f}")
print(f"Value at Risk: {risk['VaR']:.4f}")

# --- Optimization ---
print("\n📈 Optimized Portfolio Allocation")
for stock, weight in opt["weights"].items():
    print(f"{stock}: {weight*100:.2f}%")

print(f"\nExpected Return : {opt['expected_return']:.4f}")
print(f"Volatility      : {opt['volatility']:.4f}")

# --- Recommendation ---
print("\n💡 AI Recommendation")
print(rec)

# --- Scenarios ---
print("\n⚠️ Scenario Insights")
for s in scenarios:
    print(f"- {s}")

print("\n" + "="*50)
print("✅ Analysis Complete")
print("="*50)