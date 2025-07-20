from fastapi import APIRouter
import pandas as pd
from datetime import datetime

router = APIRouter()
CSV_PATH = "C:/finbuddy/finbuddy/backend/app/open_banking_transactions.csv"

@router.get("/monthly-summary")
async def monthly_summary():
    df = pd.read_csv(CSV_PATH)
    df['date'] = pd.to_datetime(df['date'])
    now = datetime.now()
    this_month = now.month
    this_year = now.year
    prev_month = 12 if this_month == 1 else this_month - 1
    prev_year = this_year - 1 if this_month == 1 else this_year
    current_month = df[(df['date'].dt.year == this_year) & (df['date'].dt.month == this_month)]['amount'].sum()
    previous_month = df[(df['date'].dt.year == prev_year) & (df['date'].dt.month == prev_month)]['amount'].sum()
    change_percent = round(((current_month - previous_month) / previous_month) * 100) if previous_month else 0
    return {"currentMonth": current_month, "previousMonth": previous_month, "changePercent": change_percent}

@router.get("/pie-data/{user_id}")
async def pie_data(user_id: str):
    import numpy as np
    df = pd.read_csv(CSV_PATH)
    df.columns = df.columns.str.strip()
    # user_id'yi hem int hem string olarak karşılaştır
    try:
        user_id_int = int(user_id)
    except Exception:
        user_id_int = None
    user_df = df[(df['user_id'] == user_id_int) | (df['user_id'].astype(str) == str(user_id))]
    if user_df.empty:
        return []
    user_df = user_df.replace({np.nan: None})
    category_map = user_df.groupby('category')['amount'].sum().sort_values(ascending=False)
    N = 7
    top = category_map.head(N)
    other = category_map.iloc[N:].sum()
    pie_data = [{"name": k, "value": float(v)} for k, v in top.items()]
    if other > 0:
        pie_data.append({"name": "Diğer", "value": float(other)})
    return pie_data 