from fastapi import APIRouter, HTTPException
import json
import os
from uuid import uuid4

router = APIRouter()
RULES_PATH = "C:/finbuddy/finbuddy/backend/app/savings_rules.json"

def load_rules():
    if not os.path.exists(RULES_PATH):
        return []
    with open(RULES_PATH, "r", encoding="utf-8") as f:
        return json.load(f)

def save_rules(rules):
    with open(RULES_PATH, "w", encoding="utf-8") as f:
        json.dump(rules, f, ensure_ascii=False, indent=2)

@router.get("/")
async def get_savings_rules():
    return load_rules()

@router.post("/")
async def add_savings_rule(rule: dict):
    rules = load_rules()
    rule["_id"] = str(uuid4())
    rules.append(rule)
    save_rules(rules)
    return rule

@router.delete("/{rule_id}")
async def delete_savings_rule(rule_id: str):
    rules = load_rules()
    new_rules = [r for r in rules if r.get("_id") != rule_id]
    if len(new_rules) == len(rules):
        raise HTTPException(status_code=404, detail="Rule not found")
    save_rules(new_rules)
    return {"deleted": True} 