from fastapi import APIRouter, Request
import os
import pandas as pd
import numpy as np
from datetime import datetime, timedelta

router = APIRouter()
CSV_PATH = "C:/finbuddy/finbuddy/backend/app/open_banking_transactions.csv"

def detect_subscriptions(user_df):
    """Kullanıcının son 6 ayda tekrarlayan popüler aboneliklerini tespit eder."""
    services = ['Spotify', 'Netflix', 'YouTube', 'BluTV', 'Exxen', 'Amazon', 'Apple']
    recent = user_df[user_df['date'] > user_df['date'].max() - pd.Timedelta(days=180)]
    subs = []
    for service in services:
        service_payments = recent[recent['merchant'].str.contains(service, case=False, na=False)]
        if len(service_payments) >= 2:
            subs.append({
                "service": service,
                "last_payment": service_payments['date'].max(),
                "amount": service_payments['amount'].mean()
            })
    return subs

def detect_periodic_expenses(user_df):
    """Kullanıcının dönemsel (yıllık/aylık) harcama alışkanlıklarını analiz eder."""
    user_df['month'] = user_df['date'].dt.month
    user_df['year'] = user_df['date'].dt.year
    grouped = user_df.groupby(['category', 'month'])['amount'].agg(['count', 'sum']).reset_index()
    suggestions = []
    for _, row in grouped.iterrows():
        if row['count'] >= 2:
            avg = round(row['sum'] / row['count'])
            suggestions.append({
                "category": row['category'],
                "month": int(row['month']),
                "avg": avg,
                "text": f"Geçen yıllarda her {int(row['month'])}. ayda {row['category']} için ortalama {avg} TL harcamışsın. Bu yıl da benzer bir harcama planlayabilirsin."
            })
    return suggestions

def detect_advance_travel(user_df):
    """Kullanıcının 6 ay önceden yaptığı seyahat/tatil harcamalarını bulur ve hatırlatıcı üretir."""
    travel_keywords = ['Uçak', 'Otobüs', 'Otel', 'Booking', 'Airbnb', 'Tatil']
    travel_expenses = user_df[user_df['category'].str.contains('|'.join(travel_keywords), case=False, na=False)]
    reminders = []
    for _, row in travel_expenses.iterrows():
        months_ahead = (row['date'].month - datetime.now().month) % 12
        if months_ahead >= 5:
            reminders.append({
                "date": str(row['date'].date()),
                "category": row['category'],
                "amount": row['amount'],
                "text": f"Bu sene {row['date'].strftime('%B')} ayında {row['category']} için harcama yapmıştın. Seneye fiyatlar artmadan erken rezervasyon yapabilirsin."
            })
    return reminders

def get_behavior_profile(user_id):
    """Kullanıcının öneri kabul/ret davranış geçmişini okur."""
    import json
    path = f"C:/finbuddy/finbuddy/backend/app/user_profiles/{user_id}.json"
    if not os.path.exists(path):
        return {"rejected": 0, "accepted": 0, "last_reject": None}
    with open(path, "r", encoding="utf-8") as f:
        return json.load(f)

def update_behavior_profile(user_id, action):
    """Kullanıcı öneri etkileşimini (kabul/ret) kaydeder."""
    import json
    from datetime import datetime
    path = f"C:/finbuddy/finbuddy/backend/app/user_profiles/{user_id}.json"
    profile = get_behavior_profile(user_id)
    if action == "reject":
        profile["rejected"] += 1
        profile["last_reject"] = datetime.now().isoformat()
    elif action == "accept":
        profile["accepted"] += 1
    with open(path, "w", encoding="utf-8") as f:
        json.dump(profile, f, ensure_ascii=False, indent=2)

@router.get("/users")
async def list_users():
    """Sistemdeki kullanıcıları listeler."""
    df = pd.read_csv(CSV_PATH)
    df.columns = df.columns.str.strip()
    users = df['user_id'].unique().tolist()
    return users

@router.get("/advice/{user_id}")
async def get_advice(user_id: str):
    """Kullanıcıya özel öneri, abonelik ve hatırlatıcıları döner."""
    df = pd.read_csv(CSV_PATH)
    df.columns = df.columns.str.strip()
    user_df = df[df['user_id'].astype(str) == str(user_id)]
    if user_df.empty:
        return {"advice": [], "subscriptions": [], "reminders": []}
    user_df['date'] = pd.to_datetime(user_df['date'])
    subscriptions = detect_subscriptions(user_df)
    periodic = detect_periodic_expenses(user_df)
    reminders = detect_advance_travel(user_df)
    profile = get_behavior_profile(user_id)
    if profile["rejected"] >= 3:
        subscriptions = []
    return {
        "advice": periodic,
        "subscriptions": subscriptions,
        "reminders": reminders,
        "profile": profile
    }

@router.post("/advice-feedback/{user_id}")
async def advice_feedback(user_id: str, request: Request):
    """Kullanıcıdan gelen öneri etkileşimini kaydeder."""
    data = await request.json()
    action = data.get("action")
    update_behavior_profile(user_id, action)
    return {"ok": True}

@router.get("/calendar-data/{user_id}")
async def calendar_data(user_id: str):
    """Kullanıcının gün bazında harcama ve kategori verisini döner."""
    df = pd.read_csv(CSV_PATH)
    df.columns = df.columns.str.strip()
    user_df = df[df['user_id'].astype(str) == str(user_id)]
    if user_df.empty:
        return []
    user_df['date'] = pd.to_datetime(user_df['date'])
    calendar = user_df.groupby(user_df['date'].dt.date).agg({
        'amount': 'sum',
        'category': lambda x: x.value_counts().idxmax()
    }).reset_index()
    calendar.rename(columns={'date': 'day', 'amount': 'total', 'category': 'top_category'}, inplace=True)
    return calendar.to_dict(orient='records') 