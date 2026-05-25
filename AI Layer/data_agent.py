import yfinance as yf

def fetch_prices(tickers):
    data = yf.download(tickers, period="1y")
    return data["Close"]