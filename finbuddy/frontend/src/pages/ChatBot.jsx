import { useState, useEffect } from 'react';
import { fetchAdvice, sendAdviceFeedback } from '../api';

const botAvatar = '🤖';
const userAvatar = '🧑';
const API_BASE = 'http://localhost:8000/api';

export default function AdvicePanel() {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState('');
  const [advice, setAdvice] = useState([]);
  const [subscriptions, setSubscriptions] = useState([]);
  const [reminders, setReminders] = useState([]);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState({});

  useEffect(() => {
    fetch(`${API_BASE}/ai/users`).then(res => res.json()).then(users => {
      setUsers(users);
      if (users.length > 0) {
        setSelectedUser(users[0]);
      }
    });
  }, []);

  useEffect(() => {
    if (selectedUser) {
      setLoading(true);
      fetchAdvice(selectedUser).then(data => {
        setAdvice(data.advice || []);
        setSubscriptions(data.subscriptions || []);
        setReminders(data.reminders || []);
        setProfile(data.profile || null);
        setLoading(false);
        setFeedback({});
      });
    }
  }, [selectedUser]);

  const handleFeedback = async (type, idx, kind) => {
    setFeedback(f => ({ ...f, [`${kind}-${idx}`]: type }));
    await sendAdviceFeedback(selectedUser, type);
  };

  return (
    <div className="max-w-xl mx-auto mt-8">
      <h1 className="text-3xl font-extrabold mb-4 text-center text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-green-400">FiBuddy Akıllı Öneriler</h1>
      <div className="mb-4 flex items-center gap-2 justify-center">
        <label className="font-semibold">Kullanıcı:</label>
        <select
          className="border rounded px-2 py-1 bg-gradient-to-r from-green-50 to-green-100 font-semibold"
          value={selectedUser}
          onChange={e => setSelectedUser(e.target.value)}
        >
          {users.map(u => <option key={u} value={u}>{u}</option>)}
        </select>
      </div>
      {loading ? <div className="text-blue-400">Yükleniyor...</div> : (
        <div className="flex flex-col gap-6">
          {advice.length > 0 && (
            <div>
              <h2 className="font-semibold mb-2 text-green-700">Dönemsel Harcama Önerileri</h2>
              {advice.map((a, i) => (
                <div key={i} className="bg-gradient-to-r from-green-100 to-green-200 rounded-xl p-3 flex justify-between items-center shadow mb-2">
                  <span className="text-sm text-gray-800">{a.text}</span>
                  <div className="flex gap-2">
                    <button className={`px-2 py-1 rounded ${feedback[`advice-${i}`]==='accept' ? 'bg-green-400 text-white' : 'bg-white border'}`} onClick={()=>handleFeedback('accept',i,'advice')}>Kabul</button>
                    <button className={`px-2 py-1 rounded ${feedback[`advice-${i}`]==='reject' ? 'bg-red-400 text-white' : 'bg-white border'}`} onClick={()=>handleFeedback('reject',i,'advice')}>Reddet</button>
                  </div>
                </div>
              ))}
            </div>
          )}
          {subscriptions.length > 0 && (
            <div>
              <h2 className="font-semibold mb-2 text-green-700">Abonelik Tespitleri</h2>
              {subscriptions.map((s, i) => (
                <div key={i} className="bg-gradient-to-r from-yellow-100 to-yellow-200 rounded-xl p-3 flex justify-between items-center shadow mb-2">
                  <span className="text-sm text-gray-800">{s.service} aboneliğin var. Son ödeme: {s.last_payment?.slice(0,10)} Ortalama: {Math.round(s.amount)} TL. Kullanıyor musun? İptal etmek ister misin?</span>
                  <div className="flex gap-2">
                    <button className={`px-2 py-1 rounded ${feedback[`subs-${i}`]==='accept' ? 'bg-green-400 text-white' : 'bg-white border'}`} onClick={()=>handleFeedback('accept',i,'subs')}>Kullanıyorum</button>
                    <button className={`px-2 py-1 rounded ${feedback[`subs-${i}`]==='reject' ? 'bg-red-400 text-white' : 'bg-white border'}`} onClick={()=>handleFeedback('reject',i,'subs')}>İptal Et</button>
                  </div>
                </div>
              ))}
            </div>
          )}
          {reminders.length > 0 && (
            <div>
              <h2 className="font-semibold mb-2 text-green-700">Hatırlatıcılar</h2>
              {reminders.map((r, i) => (
                <div key={i} className="bg-gradient-to-r from-blue-100 to-blue-200 rounded-xl p-3 flex justify-between items-center shadow mb-2">
                  <span className="text-sm text-gray-800">{r.text}</span>
                </div>
              ))}
            </div>
          )}
          {profile && (
            <div className="mt-4 text-xs text-gray-500">Öneri Kabul: {profile.accepted} | Ret: {profile.rejected}</div>
          )}
        </div>
      )}
    </div>
  );
} 