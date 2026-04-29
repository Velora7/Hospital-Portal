import { useState } from 'react';
import Login from './pages/Login';
import PatientDashboard from './pages/PatientDashboard';
import DoctorDashboard from './pages/DoctorDashboard';
import Documentation from './pages/Documentation';

function App() {
  const [user, setUser] = useState(null);
  const [showDocs, setShowDocs] = useState(false);

  if (showDocs) {
    return <Documentation onBack={() => setShowDocs(false)} />;
  }

  if (user) {
    if (user.role === 'doctor') {
      return <DoctorDashboard user={user} onLogout={() => setUser(null)} onShowDocs={() => setShowDocs(true)} />;
    }
    return <PatientDashboard user={user} onLogout={() => setUser(null)} onShowDocs={() => setShowDocs(true)} />;
  }

  return <Login onLogin={setUser} onShowDocs={() => setShowDocs(true)} />;
}

export default App;