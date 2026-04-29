import { useState } from 'react';
import { Heart, Stethoscope, Mail, Lock, Eye, EyeOff, Shield, ChevronRight, AlertCircle } from 'lucide-react';

export default function Login({ onLogin, onSwitchToRegister, onShowDocs }) {
  const [role, setRole] = useState('patient');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const API_URL = 'http://localhost:5002/api';

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, role })
      });

      const data = await response.json();

      if (data.success) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('healthshield_user', JSON.stringify(data.user));
        onLogin(data.user);
      } else {
        setError(data.message || 'Login failed');
      }
    } catch (err) {
      setError('Cannot connect to server. Make sure backend is running on port 5001');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-br from-hospital-light to-hospital-muted">
      <div className="bg-white rounded-3xl shadow-xl w-full max-w-md overflow-hidden border border-hospital-accent/30">
        <div className="bg-hospital-primary text-white p-8 text-center">
          <div className="flex justify-center mb-4">
            <div className="relative">
              <Stethoscope size={64} className="heartbeat-icon" />
              <Heart className="absolute -top-2 -right-2 text-white" size={28} fill="currentColor" />
            </div>
          </div>
          <h1 className="text-4xl font-bold tracking-tighter">HealthShield</h1>
          <p className="text-hospital-accent mt-1 text-xl">BITCYSEC HOSPITAL</p>
          <p className="mt-4 text-sm opacity-90">Secure • Caring • Trusted</p>
        </div>

        <div className="p-8">
          <h2 className="text-2xl font-semibold text-center mb-6 text-hospital-dark">Welcome Back</h2>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm flex items-center gap-2">
              <AlertCircle size={18} />
              {error}
            </div>
          )}

          <div className="flex gap-3 mb-6">
            <button
              type="button"
              onClick={() => setRole('patient')}
              className={`flex-1 py-2.5 rounded-xl font-semibold border-2 transition-all ${role === 'patient' ? 'bg-hospital-primary text-white border-hospital-primary' : 'border-gray-200 text-gray-600 hover:border-hospital-primary'}`}
            >
              👤 Patient
            </button>
            <button
              type="button"
              onClick={() => setRole('doctor')}
              className={`flex-1 py-2.5 rounded-xl font-semibold border-2 transition-all ${role === 'doctor' ? 'bg-hospital-primary text-white border-hospital-primary' : 'border-gray-200 text-gray-600 hover:border-hospital-primary'}`}
            >
              👨‍⚕️ Doctor
            </button>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-11 pr-4 py-3.5 border border-gray-200 rounded-xl focus:border-hospital-primary focus:ring-1 outline-none"
                placeholder="Email address"
                required
              />
            </div>

            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-11 pr-11 py-3.5 border border-gray-200 rounded-xl focus:border-hospital-primary focus:ring-1 outline-none"
                placeholder="Password"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-hospital-primary hover:bg-blue-700 py-3.5 rounded-xl text-white font-semibold transition-all"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Don't have an account?{' '}
              <button
                onClick={onSwitchToRegister}
                className="text-hospital-primary font-semibold hover:underline"
              >
                Create Account
              </button>
            </p>
          </div>

          <div className="mt-6 pt-4 border-t border-gray-100">
            <button
              onClick={onShowDocs}
              className="w-full bg-gray-800 hover:bg-gray-900 py-2.5 rounded-xl text-white text-sm font-semibold transition-all duration-300 flex items-center justify-center gap-2 group"
            >
              <Shield size={16} className="group-hover:rotate-12 transition" />
              View Security Documentation
              <ChevronRight size={14} className="group-hover:translate-x-1 transition" />
            </button>
          </div>

          <p className="text-center text-xs text-gray-400 mt-6">
            🔒 All communications are encrypted • Your health data is protected
          </p>
        </div>
      </div>

      <style>{`
        @keyframes heartbeat {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.1); }
        }
        .heartbeat-icon {
          animation: heartbeat 1.5s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}