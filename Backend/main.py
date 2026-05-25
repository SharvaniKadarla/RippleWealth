from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import create_engine, Column, Integer, String, Float
from sqlalchemy.orm import sessionmaker, declarative_base, Session
from pydantic import BaseModel
import yfinance as yf

from orchestrator import run_engine

# ---------------- CONFIG ----------------

DATABASE_URL = "sqlite:///./ripple.db"

engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(bind=engine)
Base = declarative_base()

app = FastAPI(title="RippleWealth Backend API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---------------- DATABASE MODELS ----------------

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True)
    username = Column(String, unique=True)
    password = Column(String)


class Portfolio(Base):
    __tablename__ = "portfolio"
    id = Column(Integer, primary_key=True)
    user_id = Column(Integer)
    symbol = Column(String)
    quantity = Column(Float)


Base.metadata.create_all(bind=engine)

# ---------------- REQUEST MODELS ----------------

class UserCreate(BaseModel):
    username: str
    password: str


class PortfolioCreate(BaseModel):
    user_id: int
    symbol: str
    quantity: float


# ---------------- DB DEP ----------------

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# ---------------- AUTH ----------------

@app.post("/register")
def register(user: UserCreate, db: Session = Depends(get_db)):
    existing = db.query(User).filter_by(username=user.username).first()

    if existing:
        raise HTTPException(status_code=400, detail="User already exists")

    new_user = User(username=user.username, password=user.password)
    db.add(new_user)
    db.commit()

    return {"message": "User registered successfully"}


@app.post("/login")
def login(user: UserCreate, db: Session = Depends(get_db)):
    db_user = db.query(User).filter_by(
        username=user.username,
        password=user.password,
    ).first()

    if not db_user:
        raise HTTPException(status_code=401, detail="Invalid credentials")

    return {"user_id": db_user.id}


# ---------------- PORTFOLIO ----------------

@app.post("/portfolio/add")
def add_portfolio(data: PortfolioCreate, db: Session = Depends(get_db)):
    new_asset = Portfolio(**data.dict())
    db.add(new_asset)
    db.commit()

    return {"message": "Asset added"}


@app.get("/portfolio/{user_id}")
def get_portfolio(user_id: int, db: Session = Depends(get_db)):
    portfolio = db.query(Portfolio).filter_by(user_id=user_id).all()

    return [
        {
            "id": p.id,
            "symbol": p.symbol,
            "quantity": p.quantity,
        }
        for p in portfolio
    ]


@app.delete("/portfolio/{asset_id}")
def delete_asset(asset_id: int, db: Session = Depends(get_db)):
    asset = db.query(Portfolio).filter_by(id=asset_id).first()

    if not asset:
        raise HTTPException(status_code=404, detail="Asset not found")

    db.delete(asset)
    db.commit()

    return {"message": "Asset deleted"}


# ---------------- AI ANALYSIS ----------------

@app.get("/ai/analyze/{user_id}")
def analyze(user_id: int, db: Session = Depends(get_db)):
    portfolio = db.query(Portfolio).filter_by(user_id=user_id).all()

    if not portfolio:
        raise HTTPException(status_code=404, detail="No portfolio found")

    tickers = [p.symbol for p in portfolio]
    result = run_engine(tickers)

    return result


# ---------------- SIMULATION ----------------

@app.get("/ai/simulate/{user_id}")
def simulate(user_id: int, db: Session = Depends(get_db)):
    portfolio = db.query(Portfolio).filter_by(user_id=user_id).all()

    if not portfolio:
        raise HTTPException(status_code=404, detail="No portfolio found")

    tickers = [p.symbol for p in portfolio]
    result = run_engine(tickers)

    return result["simulation_sample"]


# ---------------- LIVE MARKET DATA ----------------

@app.get("/market/{symbol}")
def get_market_price(symbol: str):
    try:
        stock = yf.Ticker(symbol)
        price = stock.history(period="1d")["Close"].iloc[-1]

        return {
            "symbol": symbol,
            "price": float(price),
        }
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid symbol")
