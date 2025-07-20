from fastapi import APIRouter
import pandas as pd
import numpy as np

router = APIRouter()
CSV_PATH = "C:/finbuddy/finbuddy/backend/app/open_banking_transactions.csv"

@router.get("")
@router.get("/")
async def get_transactions():
    df = pd.read_csv(CSV_PATH)
    # NaN değerleri None (null) yap
    df = df.replace({np.nan: None})
    return df.to_dict(orient="records")