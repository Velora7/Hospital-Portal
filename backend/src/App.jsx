import { useState, useEffect } from 'react';
import Login from './pages/Login';
import Register from './pages/Register';
import PatientDashboard from './pages/PatientDashboard';
import DoctorDashboard from './pages/DoctorDashboard';
import Documentation from './pages/Documentation';

function App() {
  const [user, setUser] = useState(null);
  const [showDocs, setShowDocs] = useState(false);
  const [showRegister, setShowRegister] = useState(false);

  // Session timeout - 15 minutes
  useEffect(() => {
    let timer;
    
    const resetTimer = () => {
      if (timer) clearTimeout(timer);
      timer = setTimeout(() => {
        if (user) {
          localStorage.removeItem('healthshield_user');
          localStorage.removeItem('token');
          setUser(null);
          alert('Session expired due to inactivity. Please login again.');
          window.location.href = '/';
        }
      }, 15 * 60 * 1000); // 15 minutes
    };

    if (user) {
      window.addEventListener('mousemove', resetTimer);
      window.addEventListener('keypress', resetTimer);
      resetTimer();
    }

    return () => {
      if (timer) clearTimeout(timer);
      window.removeEventListener('mousemove', resetTimer);
      window.removeEventListener('keypress', resetTimer);
    };
  }, [user]);

  useEffect(() => {
    const savedUser = localStorage.getItem('healthshield_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  if (showDocs) {
    return <Documentation onBack={() => setShowDocs(false)} />;
  }

  if (user) {
    if (user.role === 'doctor') {
      return <DoctorDashboard user={user} setUser={setUser} onShowDocs={() => setShowDocs(true)} />;
    }
    return <PatientDashboard user={user} setUser={setUser} onShowDocs={() => setShowDocs(true)} />;
  }

  if (showRegister) {
    return <Register onRegister={setUser} onSwitchToLogin={() => setShowRegister(false)} onShowDocs={() => setShowDocs(true)} />;
  }

  return <Login onLogin={setUser} onSwitchToRegister={() => setShowRegister(true)} onShowDocs={() => setShowDocs(true)} />;
}

export default App;