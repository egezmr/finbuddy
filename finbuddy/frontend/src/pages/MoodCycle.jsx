import { useEffect, useState } from 'react';
import { fetchTransactions, fetchMonthlySummary } from '../api';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

const COLORS = ['#fbbf24', '#f472b6', '#60a5fa', '#34d399', '#a78bfa', '#f87171', '#38bdf8', '#facc15', '#a3a3a3'];
const API_BASE = 'http://localhost:8000/api';

export default function MoodCycle() {
  const [transactions, setTransactions] = useState([]);
  const [summary, setSummary] = useState(null);
  const [pieData, setPieData] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState('');
  const [calendarData, setCalendarData] = useState([]);
  const [hoveredDay, setHoveredDay] = useState(null);
  const [selectedDay, setSelectedDay] = useState(null);

  // Pie chart için gösterilecek veriyi seçili güne göre filtrele
  const filteredTransactions = selectedDay
    ? transactions.filter(t => t.date && t.date.slice(0, 10) === selectedDay)
    : transactions;

  const filteredPieData = Object.values(
    filteredTransactions.reduce((acc, t) => {
      if (!t.category) return acc;
      if (!acc[t.category]) acc[t.category] = { name: t.category, value: 0 };
      acc[t.category].value += Number(t.amount);
      return acc;
    }, {})
  );

  useEffect(() => {
    fetch(`${API_BASE}/ai/users`).then(res => res.json()).then(users => {
      setUsers(users);
      setSelectedUser(users[0] || '');
    });
  }, []);

  useEffect(() => {
    if (selectedUser) {
      fetch(`${API_BASE}/transactions`).then(res => res.json()).then(data => {
        setTransactions(data.filter(t => String(t.user_id) === String(selectedUser)));
      });
      fetch(`${API_BASE}/insights/monthly-summary`).then(res => res.json()).then(setSummary);
      fetch(`${API_BASE}/insights/pie-data/${selectedUser}`).then(res => res.json()).then(setPieData);
      fetch(`${API_BASE}/ai/calendar-data/${selectedUser}`).then(res => res.json()).then(setCalendarData);
    }
  }, [selectedUser]);

  // Toplam harcama (sadece seçili kullanıcı)
  const total = transactions.reduce((sum, t) => sum + Number(t.amount), 0);

  // Aylık harcama hesapları (sadece seçili kullanıcı)
  const now = new Date();
  const thisMonth = now.getMonth() + 1;
  const thisYear = now.getFullYear();
  const prevMonth = thisMonth === 1 ? 12 : thisMonth - 1;
  const prevYear = thisMonth === 1 ? thisYear - 1 : thisYear;

  const currentMonthTotal = transactions
    .filter(t => {
      const d = new Date(t.date);
      return d.getFullYear() === thisYear && (d.getMonth() + 1) === thisMonth;
    })
    .reduce((sum, t) => sum + Number(t.amount), 0);

  const previousMonthTotal = transactions
    .filter(t => {
      const d = new Date(t.date);
      return d.getFullYear() === prevYear && (d.getMonth() + 1) === prevMonth;
    })
    .reduce((sum, t) => sum + Number(t.amount), 0);

  const changePercent = previousMonthTotal
    ? Math.round(((currentMonthTotal - previousMonthTotal) / previousMonthTotal) * 100)
    : 0;

  // Takvimde işaretlenecek günler
  const tileContent = ({ date, view }) => {
    if (view !== 'month') return null;
    const dayStr = date.toISOString().slice(0, 10);
    const dayData = calendarData.find(d => d.day === dayStr);
    if (dayData) {
      return <div style={{ width: 8, height: 8, borderRadius: 4, background: '#34d399', margin: '0 auto', marginTop: 2 }}></div>;
    }
    return null;
  };

  const tileClassName = ({ date, view }) => {
    if (view !== 'month') return '';
    const dayStr = date.toISOString().slice(0, 10);
    const dayData = calendarData.find(d => d.day === dayStr);
    if (dayData) {
      // Kategoriye göre renk
      const cat = dayData.top_category || '';
      if (cat.includes('Yeme')) return 'bg-yellow-200';
      if (cat.includes('Ulaşım')) return 'bg-blue-200';
      if (cat.includes('Market')) return 'bg-green-200';
      if (cat.includes('Eğlence')) return 'bg-pink-200';
      return 'bg-green-100';
    }
    return '';
  };

  const handleActiveStartDateChange = () => {
    setHoveredDay(null);
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4 text-center text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-green-400">MoodCycle</h1>
      <div className="mb-4 flex items-center gap-2 justify-center">
        <label className="font-semibold">Kullanıcı:</label>
        <select
          className="border rounded px-2 py-1 bg-gradient-to-r from-green-50 to-green-100 font-semibold"
          value={selectedUser}
          onChange={e => setSelectedUser(Number(e.target.value))}
        >
          {users.map(u => <option key={u} value={u}>{u}</option>)}
        </select>
      </div>
      <div className="mb-8">
        <h2 className="font-semibold mb-2 text-green-700">Harcama Takvimi</h2>
        <div className="bg-white p-4 rounded-xl shadow flex flex-col items-center">
          <Calendar
            tileContent={tileContent}
            tileClassName={tileClassName}
            onClickDay={date => setSelectedDay(date.toISOString().slice(0, 10))}
            value={selectedDay ? new Date(selectedDay) : null}
            onActiveStartDateChange={handleActiveStartDateChange}
          />
          {selectedDay && (
            (() => {
              const dayData = calendarData.find(d => d.day === selectedDay);
              if (!dayData) return null;
              return (
                <div className="mt-2 p-2 bg-green-50 rounded shadow text-sm">
                  <div><b>{dayData.day}</b></div>
                  <div>Toplam: <b>{dayData.total} TL</b></div>
                  <div>En çok: <b>{dayData.top_category}</b></div>
                  <button className="ml-2 px-2 py-1 rounded bg-gray-200 text-xs" onClick={() => setSelectedDay(null)}>Tümünü Göster</button>
                </div>
              );
            })()
          )}
        </div>
      </div>
      <div className="mb-4 bg-white rounded-xl shadow p-4">
        <div className="font-semibold text-lg">Toplam Harcama: <span className="text-green-600">{total.toLocaleString(undefined, {minimumFractionDigits:2, maximumFractionDigits:2})} TL</span></div>
        <div className="mt-2 flex gap-4 flex-wrap">
          <div>Bu ay: <b>{currentMonthTotal.toLocaleString(undefined, {minimumFractionDigits:2, maximumFractionDigits:2})} TL</b></div>
          <div>Geçen ay: <b>{previousMonthTotal.toLocaleString(undefined, {minimumFractionDigits:2, maximumFractionDigits:2})} TL</b></div>
          <div>Değişim: <b>%{changePercent}</b></div>
        </div>
      </div>
      <div className="mb-8">
        <h2 className="font-semibold mb-2 text-green-700">Kategoriye Göre Harcama (Pie Chart)</h2>
        <div className="bg-white p-4 rounded-xl shadow flex justify-center">
          <ResponsiveContainer width={360} height={260}>
            <PieChart>
              <Pie
                data={filteredPieData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={90}
                label={({ name, percent }) => `${name} (${(percent * 100).toFixed(1)}%)`}
                isAnimationActive={false}
              >
                {filteredPieData.map((entry, idx) => (
                  <Cell key={`cell-${idx}`} fill={COLORS[idx % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value, name) => [`${value.toLocaleString()} TL`, name]} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
      <div className="bg-white rounded-xl shadow p-4">
        <h2 className="font-semibold mb-2 text-green-600">Son İşlemler</h2>
        <ul className="divide-y">
          {transactions.slice(0, 5).map((t, i) => (
            <li key={i} className="py-1 flex justify-between">
              <span>{t.date?.slice(0, 10)} - {t.merchant}</span>
              <span>{t.amount} TL</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
} 