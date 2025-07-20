from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
load_dotenv()

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
from app.routes import ai, transactions, insights, savings_rules

app.include_router(ai.router, prefix="/api/ai")
app.include_router(transactions.router, prefix="/api/transactions")
app.include_router(insights.router, prefix="/api/insights")
app.include_router(savings_rules.router, prefix="/api/savings-rules") 