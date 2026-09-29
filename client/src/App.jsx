import { useEffect, useMemo, useState } from 'react';

const API_BASE = 'http://localhost:5000/api';

const formatDate = (value) => new Date(value).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' });

function App() {
  const [token, setToken] = useState(localStorage.getItem('mentorhub_token') || '');
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('mentorhub_user') || 'null'));
  const [view, setView] = useState('dashboard');
  const [dashboard, setDashboard] = useState(null);
  const [mentors, setMentors] = useState([]);
  const [matches, setMatches] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [plans, setPlans] = useState([]);
  const [authForm, setAuthForm] = useState({ name: 'Amina Rahman', email: 'founder@mentorhub.com', password: 'password123' });

  const authHeaders = useMemo(() => ({
    'Content-Type': 'application/json',
    Authorization: token ? `Bearer ${token}` : '',
  }), [token]);

  const loadDashboardData = async () => {
    if (!token) return;

    const [dashboardRes, mentorsRes, matchesRes, sessionsRes, plansRes] = await Promise.all([
      fetch(`${API_BASE}/dashboard`, { headers: authHeaders }),
      fetch(`${API_BASE}/mentors`, { headers: authHeaders }),
      fetch(`${API_BASE}/matches`, { headers: authHeaders }),
      fetch(`${API_BASE}/sessions`, { headers: authHeaders }),
      fetch(`${API_BASE}/plans`, { headers: authHeaders }),
    ]);

    setDashboard(await dashboardRes.json());
    setMentors(await mentorsRes.json());
    setMatches(await matchesRes.json());
    setSessions(await sessionsRes.json());
    setPlans(await plansRes.json());
  };

  useEffect(() => {
    if (token) {
      loadDashboardData();
    }
  }, [token]);

  const handleAuth = async (type) => {
    const endpoint = type === 'login' ? '/auth/login' : '/auth/register';
    const payload = type === 'login'
      ? { email: authForm.email, password: authForm.password }
      : { name: authForm.name, email: authForm.email, password: authForm.password, role: 'entrepreneur' };

    const response = await fetch(`${API_BASE}${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    const data = await response.json();
    if (!response.ok) {
      alert(data.message || 'Authentication failed');
      return;
    }

    setToken(data.token);
    setUser(data.user);
    localStorage.setItem('mentorhub_token', data.token);
    localStorage.setItem('mentorhub_user', JSON.stringify(data.user));
  };

  const handleBookSession = async (mentorId) => {
    const title = prompt('Session title', 'Business strategy review');
    if (!title) return;

    const response = await fetch(`${API_BASE}/sessions`, {
      method: 'POST',
      headers: authHeaders,
      body: JSON.stringify({
        mentorId,
        title,
        date: new Date(Date.now() + 86400000).toISOString(),
        duration: 60,
        type: 'video',
      }),
    });

    if (response.ok) {
      const newSession = await response.json();
      setSessions((prev) => [newSession, ...prev]);
      alert('Session booked successfully');
    }
  };

  const logout = () => {
    setToken('');
    setUser(null);
    localStorage.removeItem('mentorhub_token');
    localStorage.removeItem('mentorhub_user');
  };

  if (!token || !user) {
    return (
      <div className="auth-shell">
        <div className="auth-card">
          <div className="badge">MentorHub</div>
          <h1>Build your startup with a trusted mentor</h1>
          <p>Get expert insights for growth, fundraising, product strategy, and business planning.</p>

          <div className="form-grid">
            {!user && (
              <input
                value={authForm.name}
                onChange={(e) => setAuthForm({ ...authForm, name: e.target.value })}
                placeholder="Full name"
              />
            )}
            <input
              value={authForm.email}
              onChange={(e) => setAuthForm({ ...authForm, email: e.target.value })}
              placeholder="Email"
            />
            <input
              type="password"
              value={authForm.password}
              onChange={(e) => setAuthForm({ ...authForm, password: e.target.value })}
              placeholder="Password"
            />
          </div>

          <div className="button-row">
            <button className="primary" onClick={() => handleAuth('login')}>Login</button>
            <button className="secondary" onClick={() => handleAuth('register')}>Create account</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="app-shell">
      <header className="topbar">
        <div>
          <div className="logo">MentorHub</div>
          <span className="muted">Hi, {user.name}</span>
        </div>
        <nav>
          {['dashboard', 'mentors', 'sessions', 'plans'].map((item) => (
            <button key={item} className={view === item ? 'nav active' : 'nav'} onClick={() => setView(item)}>
              {item}
            </button>
          ))}
          <button className="secondary" onClick={logout}>Logout</button>
        </nav>
      </header>

      <main className="content">
        {view === 'dashboard' && dashboard && (
          <>
            <section className="hero-card">
              <div>
                <span className="badge">Founder dashboard</span>
                <h2>Turn traction into sustainable growth</h2>
                <p>Use your mentor network to sharpen your roadmap, improve conversion, and build momentum.</p>
              </div>
              <button className="primary" onClick={() => setView('mentors')}>Find a mentor</button>
            </section>

            <section className="stats-grid">
              {Object.entries(dashboard.metrics).map(([label, value]) => (
                <div key={label} className="stat-card">
                  <span>{label}</span>
                  <strong>{value}</strong>
                </div>
              ))}
            </section>

            <section className="panel-grid">
              <div className="panel">
                <h3>Quick wins</h3>
                <ul className="checklist">
                  {dashboard.quickWins.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>

              <div className="panel">
                <h3>Top recommendations</h3>
                {matches.slice(0, 3).map((match) => (
                  <div key={match.id} className="recommendation-row">
                    <div>
                      <strong>{match.mentor?.name}</strong>
                      <small>{match.reason}</small>
                    </div>
                    <span>{match.score}% fit</span>
                  </div>
                ))}
              </div>
            </section>
          </>
        )}

        {view === 'mentors' && (
          <section className="panel">
            <h3>Mentor matching</h3>
            <div className="card-list">
              {mentors.map((mentor) => (
                <div key={mentor.id} className="profile-card">
                  <div className="profile-header">
                    <div>
                      <h4>{mentor.name}</h4>
                      <span>{mentor.role}</span>
                    </div>
                    <strong>{mentor.rating} ★</strong>
                  </div>
                  <p>{mentor.bio}</p>
                  <div className="tags">
                    {mentor.specialties.map((tag) => <span key={tag}>{tag}</span>)}
                  </div>
                  <div className="meta-row">
                    <span>{mentor.experience}</span>
                    <span>{mentor.availability}</span>
                    <span>{mentor.hourlyRate}</span>
                  </div>
                  <button className="primary" onClick={() => handleBookSession(mentor.id)}>Book session</button>
                </div>
              ))}
            </div>
          </section>
        )}

        {view === 'sessions' && (
          <section className="panel">
            <h3>Upcoming mentoring sessions</h3>
            <div className="timeline">
              {sessions.map((session) => (
                <div key={session.id} className="timeline-item">
                  <div className="timeline-badge" />
                  <div>
                    <strong>{session.title}</strong>
                    <p>{session.mentor?.name} • {session.type}</p>
                    <small>{formatDate(session.date)} • {session.duration} min</small>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {view === 'plans' && (
          <section className="panel">
            <h3>Business plan templates</h3>
            <div className="card-list">
              {plans.map((plan) => (
                <div key={plan.id} className="profile-card compact">
                  <div className="profile-header">
                    <div>
                      <h4>{plan.title}</h4>
                      <span>{plan.category}</span>
                    </div>
                  </div>
                  <p>{plan.description}</p>
                  <button className="secondary">Use template</button>
                </div>
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}

export default App;

