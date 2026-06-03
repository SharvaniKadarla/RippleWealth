# RippleWealth – AI-Driven Investment Risk Intelligence Platform

## Overview

RippleWealth is an AI-driven investment risk intelligence platform that helps investors evaluate portfolio performance, analyze market risk, optimize asset allocations, and simulate future market scenarios.

The platform combines a multi-agent financial analytics engine with an interactive web dashboard to provide:

* Portfolio risk analysis
* Asset allocation optimization
* Monte Carlo market simulations
* Market scenario assessments
* Investment recommendations
* Interactive financial visualizations

The system follows a decoupled architecture consisting of a FastAPI backend and a React/Vite frontend.

---

# 🚀 Key Features

### 📈 Portfolio Risk Analytics

* Portfolio volatility calculation
* Sharpe Ratio analysis
* Historical return evaluation
* Parametric Value at Risk (VaR)

### 🤖 Multi-Agent Intelligence Framework

RippleWealth uses specialized AI agents that collaborate to generate investment insights:

* Data Retrieval Agent
* Risk Analysis Agent
* Optimization Agent
* Simulation Agent
* Scenario Analysis Agent
* Recommendation Agent
* Explanation Agent
* Agent Orchestrator

### 📊 Portfolio Optimization

* Markowitz Mean-Variance Optimization
* Covariance matrix analysis
* Asset weight allocation recommendations

### 🔮 Market Simulation

* Monte Carlo simulations
* Correlated asset forecasting
* Future portfolio projection scenarios

### 🔐 Secure User Management

* User registration
* User authentication
* Bcrypt password hashing
* Secure credential verification

### 📉 Interactive Dashboard

* Portfolio visualization
* Asset allocation charts
* Market simulation graphs
* Recommendation displays

### ☁️ Cloud Deployment

RippleWealth supports cloud deployment using:

- Railway (Backend API Hosting)
- Netlify (Frontend Hosting)

Production deployment separates the frontend and backend into independently scalable services while maintaining secure API communication.

### 📊 Implemented Features

The current version of RippleWealth includes:

- User Authentication
- Portfolio Management
- Live Market Price Integration
- Portfolio Allocation Engine
- Sharpe Ratio Analysis
- Value at Risk (VaR)
- AI-Based Portfolio Recommendations
- Scenario Simulation
- Interactive Financial Dashboard

---

# 🏗️ System Architecture

## Backend Layer (FastAPI)

The backend is responsible for:

* User authentication
* Portfolio management
* Financial data processing
* Agent orchestration
* Risk calculations
* Simulation execution
* Recommendation generation

### Core Agents

#### Agent Orchestrator

Coordinates execution across all analytical agents and manages workflow sequencing.

#### Data Retrieval Agent

Fetches historical market data using Yahoo Finance (`yfinance`).

#### Risk Analysis Agent

Computes:

* Portfolio volatility
* Sharpe Ratio
* Historical returns
* Value at Risk (VaR)

#### Optimization Agent

Performs:

* Mean-Variance Optimization
* Efficient portfolio allocation calculations

#### Simulation Agent

Generates:

* Monte Carlo simulations
* Future asset price projections

#### Scenario Agent

Evaluates:

* Market stress scenarios
* Portfolio resilience

#### Recommendation Agent

Produces:

* Portfolio improvement recommendations
* Risk mitigation suggestions

#### Explanation Agent

Converts quantitative outputs into human-readable investment insights.

---

## Frontend Layer (React + Vite)

The frontend provides:

* User authentication screens
* Portfolio management interface
* Financial dashboards
* Simulation visualizations
* Interactive analytics

Technologies:

* React
* Vite
* Chart.js
* JavaScript
* CSS

---

# 📂 Project Structure

Generate the complete folder structure using:

```powershell
tree /F > structure.txt
```

Current project layout:

```text
C:\Users\Downloads\ripplewealth\
└── ripplewealth/
    ├── requirements.txt
    ├── venv/
    │
    ├── AI Layer/
    │   ├── agent_orchestrator.py
    │   ├── data_agent.py
    │   ├── optimization_agent.py
    │   ├── simulation_agent.py
    │   ├── recommendation_agent.py
    │   ├── risk_agent.py
    │   ├── scenario_agent.py
    │   ├── explanation_agent.py
    │   └── demo.py

    ├── Backend/
    │   ├── main.py
    │   ├── orchestrator.py
    │   ├── ripple.db
    │   ├── ripplewealth.db
    │
    └── Frontend/
        ├── package.json
        ├── vite.config.js
        ├── index.html
        ├── login.html
        ├── dashboard.html
        └── src/
            ├── main.jsx
            ├── App.jsx
            └── index.css
```

---

# 🛠️ Installation & Setup

## Prerequisites

Install:

* Python 3.10+
* Node.js
* npm

---

# Step 1: Clone the Repository

```powershell
git clone <repository-url>
```

```powershell
cd ripplewealth
```

---

# Step 2: Create Virtual Environment

```powershell
python -m venv venv
```

Activate the environment:

```powershell
venv\Scripts\activate
```

Install backend dependencies:

```powershell
pip install -r requirements.txt
```

---

# ▶️ Running the Backend

Open **Terminal 1**

```powershell
cd ripplewealth
```

```powershell
venv\Scripts\activate
```

```powershell
cd backend
```

```powershell
python -m uvicorn main:app --reload --port 8001
```

Expected output:

```text
INFO:     Uvicorn running on http://127.0.0.1:8001
INFO:     Application startup complete.
```

Backend URL:

```text
http://127.0.0.1:8001
```

Swagger Documentation:

```text
http://127.0.0.1:8001/docs
```

---

# 💻 Running the Frontend

Open **Terminal 2**

```powershell
cd ripplewealth
```

```powershell
venv\Scripts\activate
```

```powershell
cd Frontend
```

Install frontend dependencies:

```powershell
npm install
```

Start Vite:

```powershell
npm run dev
```

Expected output:

```text
Local: http://localhost:5173/
```

Frontend URL:

```text
http://localhost:5173/
```

---

# 🔐 Security Features

## Password Protection

User passwords are never stored in plaintext.

Passwords are:

* Salted
* Hashed using bcrypt
* Verified securely during login

---

## Authentication Validation

Login requests are validated using:

```python
bcrypt.checkpw()
```

before granting access.

---

## Portfolio Integrity Protection

Portfolio updates perform asset aggregation checks to:

* Prevent duplicate holdings
* Maintain accurate quantities
* Preserve portfolio consistency

---

## CORS Security

Cross-Origin Resource Sharing (CORS) middleware enables secure communication between:

```text
Frontend: http://localhost:5173
Backend : http://127.0.0.1:8001
```

---

# 🧪 Technology Stack

## Backend

* FastAPI
* SQLAlchemy
* SQLite
* NumPy
* Pandas
* yFinance
* Bcrypt
* Uvicorn

## Frontend

* React
* Vite
* Chart.js
* JavaScript
* CSS

---

# ☁️ Cloud Deployment

## Backend Deployment (Railway)

Backend services can be deployed using Railway.

Example Procfile:

```text
web: uvicorn main:app --host 0.0.0.0 --port $PORT
```

Deployment steps:

* Install Railway CLI
* Login to Railway
* Navigate to backend folder
* Deploy using Railway
* Generate a public Railway domain
* Access FastAPI documentation through `/docs`

---

## Frontend Deployment (Netlify)

Frontend services can be deployed using Netlify.

Deployment steps:

* Replace localhost backend URLs with Railway URL
* Configure Netlify settings
* Upload frontend build
* Deploy application

Pages include:

- /login.html
- /dashboard.html
- /register.html

---

# 🌐 Live Demo

Frontend Application:

https://ripplewealth.netlify.app/

Backend API Documentation:

https://your-railway-url/docs

---

# 🚀 Future Enhancements

### Database Scaling

* PostgreSQL migration
* Cloud-hosted persistence

### Authentication

* JWT-based authentication
* Role-based access control

### Real-Time Data

* WebSocket integration
* Live market streaming

### Deployment

* Docker containerization
* CI/CD pipelines
* Cloud deployment


---
