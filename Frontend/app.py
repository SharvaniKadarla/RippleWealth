import streamlit as st
import requests
import pandas as pd

API = "http://localhost:8001"

st.set_page_config(page_title="RippleWealth", layout="wide")

st.sidebar.title("RippleWealth")

page = st.sidebar.radio(
    "Navigation",
    ["Home","Portfolio","Events","Risk Metrics","Simulation","Suggestions"]
)

# ---------------- HOME ----------------

if page == "Home":

    st.title("RippleWealth")

    st.write("""
RippleWealth is an AI-powered platform that evaluates how global events
may impact investment portfolios.

This prototype demonstrates how external disruptions can propagate
through industries and affect portfolio risk.
""")

    st.write("""
Workflow:

1. Detect global events
2. Identify affected industries
3. Evaluate portfolio exposure
4. Simulate market impact
5. Suggest portfolio adjustments
""")

# ---------------- PORTFOLIO ----------------

elif page == "Portfolio":

    st.title("Sample Portfolio")

    portfolio = requests.get(f"{API}/portfolio").json()

    df = pd.DataFrame(portfolio)

    st.write("Total Portfolio Value: $100,000")

    st.table(df)

# ---------------- EVENTS ----------------

elif page == "Events":

    st.title("Global Events")

    events = requests.get(f"{API}/events").json()

    for event in events:

        st.subheader(event["title"])

        st.write("Industry:", event["industry"])
        st.write("Severity:", event["severity"])
        st.write("Confidence:", event["confidence"])

        st.divider()

# ---------------- RISK METRICS ----------------

elif page == "Risk Metrics":

    st.title("Portfolio Risk Metrics")

    risk = requests.get(f"{API}/portfolio/risk").json()

    col1, col2, col3 = st.columns(3)

    col1.metric("Portfolio VaR", risk["VaR"])
    col2.metric("Conditional VaR", risk["CVaR"])
    col3.metric("Tech Exposure", risk["sector_exposure"]["Tech"])

    st.subheader("Metric Legend")

    st.write("""
**Value at Risk (VaR)**  
Maximum expected loss of the portfolio within a time period at a given confidence level.

**Conditional Value at Risk (CVaR)**  
Expected loss if the portfolio exceeds the VaR threshold.

**Sector Exposure**  
Percentage of the portfolio invested in a specific industry sector.
""")

# ---------------- SIMULATION ----------------

elif page == "Simulation":

    st.title("Event Simulation")

    events = requests.get(f"{API}/events").json()

    event_names = [event["title"] for event in events]

    selected_event = st.selectbox(
        "Select an event to simulate",
        event_names
    )

    if st.button("Run Simulation"):

        result = requests.post(
            f"{API}/simulate",
            json={"event": selected_event}
        ).json()

        projection = result["projection"]

        projection_df = pd.DataFrame({
            "Time": ["Today","Day 1","Day 2","Day 3","Day 4"],
            "Portfolio Value": projection
        })

        st.subheader("Projected Portfolio Value")

        st.line_chart(projection_df.set_index("Time"))

        st.subheader("Projected Loss if No Action Taken")

        col1, col2 = st.columns(2)

        col1.metric(
            "Estimated Loss ($)",
            f"${result['loss']}"
        )

        col2.metric(
            "Estimated Loss (%)",
            f"{result['loss_percent']}%"
        )

# ---------------- SUGGESTIONS ----------------

elif page == "Suggestions":

    st.title("Investment Suggestions")

    events = requests.get(f"{API}/events").json()

    event_names = [event["title"] for event in events]

    selected_event = st.selectbox(
        "Select Event",
        event_names
    )

    if st.button("Get Suggestions"):

        suggestions = requests.post(
            f"{API}/recommend",
            json={"event": selected_event}
        ).json()

        st.subheader("Assets to Avoid")

        for stock in suggestions["avoid"]:
            st.write("⚠️", stock)

        st.subheader("Suggested Investments")

        for stock in suggestions["suggested"]:
            st.write("✅", stock)

        st.info(suggestions["reason"])

    if st.button("Show Rebalance Plan"):

        rebalance = requests.post(
            f"{API}/rebalance"
        ).json()

        st.subheader("Current Portfolio")

        st.write(rebalance["current_portfolio"])

        st.subheader("Recommended Portfolio")

        st.write(rebalance["recommended_portfolio"])

        st.success(rebalance["explanation"])