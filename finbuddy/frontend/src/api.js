const API_BASE = 'http://localhost:8000/api';

export async function fetchTransactions() {
  const res = await fetch(`${API_BASE}/transactions`);
  return res.json();
}

export async function fetchMonthlySummary() {
  const res = await fetch(`${API_BASE}/insights/monthly-summary`);
  return res.json();
}

export async function fetchSavingsRules() {
  const res = await fetch(`${API_BASE}/savings-rules`);
  return res.json();
}

export async function addSavingsRule(rule) {
  const res = await fetch(`${API_BASE}/savings-rules`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(rule)
  });
  return res.json();
}

export async function deleteSavingsRule(id) {
  await fetch(`${API_BASE}/savings-rules/${id}`, { method: 'DELETE' });
}

export async function fetchMonthlyTotals() {
  const res = await fetch(`${API_BASE}/insights/monthly-totals`);
  return res.json();
}

export async function fetchAdvice(userId) {
  const res = await fetch(`${API_BASE}/ai/advice/${userId}`);
  return res.json();
}

export async function sendAdviceFeedback(userId, action) {
  await fetch(`${API_BASE}/ai/advice-feedback/${userId}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ action })
  });
} 