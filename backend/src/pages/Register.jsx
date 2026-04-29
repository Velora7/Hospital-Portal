import { useState } from 'react';
import { Heart, Stethoscope, User, Mail, Lock, IdCard, Phone, Calendar, Eye, EyeOff, Shield, ChevronRight, AlertCircle, CheckCircle, ArrowLeft } from 'lucide-react';

export default function Register({ onRegister, onSwitchToLogin, onShowDocs }) {
  const [role, setRole] = useState('patient');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    hospitalId: '',
    phoneNumber: '',
    dateOfBirth: ''
  });

 const API_URL = 'http://localhost:5002/api';

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.fullName,
          email: formData.email,
          password: formData.password,
          role: role,
          hospitalId: formData.hospitalId,
          phoneNumber: formData.phoneNumber || '',
          dateOfBirth: formData.dateOfBirth || ''
        })
      });

      const data = await response.json();

      if (data.success) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('healthshield_user', JSON.stringify(data.user));
        onRegister(data.user);
      } else {
        setError(data.message || 'Registration failed');
      }
    } catch (err) {
      setError('Cannot connect to server. Make sure backend is running on port 5000');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-br from-hospital-light to-hospital-muted">
      <div className="bg-white rounded-3xl shadow-xl w-full max-w-md overflow-hidden border border-hospital-accent/30">
        {/* Header */}
        <div className="bg-hospital-primary text-white p-6 text-center">
          <div className="flex justify-center mb-3">
            <div className="relative">
              <Stethoscope size={50} className="heartbeat-icon" />
              <Heart className="absolute -top-2 -right-2 text-white" size={22} fill="currentColor" />
            </div>
          </div>
          <h1 className="text-3xl font-bold tracking-tighter">Create Account</h1>
          <p className="text-hospital-accent mt-1">Join HealthShield Portal</p>
        </div>

        <div className="p-6">
          {/* Back to Login */}
          <button
            onClick={onSwitchToLogin}
            className="mb-4 text-gray-500 hover:text-hospital-primary transition flex items-center gap-1 text-sm"
          >
            <ArrowLeft size={16} /> Back to Login
          </button>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm flex items-center gap-2">
              <AlertCircle size={18} />
              {error}
            </div>
          )}
          
          {success && (
            <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-xl text-green-600 text-sm flex items-center gap-2">
              <CheckCircle size={18} />
              {success}
            </div>
          )}

          {/* Role Selection */}
          <div className="flex gap-3 mb-5">
            <button
              type="button"
              onClick={() => setRole('patient')}
              className={`flex-1 py-2 rounded-xl font-semibold border-2 transition-all ${role === 'patient' ? 'bg-hospital-primary text-white border-hospital-primary' : 'border-gray-200 text-gray-600 hover:border-hospital-primary'}`}
            >
              👤 Patient
            </button>
            <button
              type="button"
              onClick={() => setRole('doctor')}
              className={`flex-1 py-2 rounded-xl font-semibold border-2 transition-all ${role === 'doctor' ? 'bg-hospital-primary text-white border-hospital-primary' : 'border-gray-200 text-gray-600 hover:border-hospital-primary'}`}
            >
              👨‍⚕️ Doctor
            </button>
          </div>

          <form onSubmit={handleRegister} className="space-y-3">
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl focus:border-hospital-primary focus:ring-1 outline-none"
                placeholder="Full Name *"
                required
              />
            </div>

            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl focus:border-hospital-primary focus:ring-1 outline-none"
                placeholder="Email Address *"
                required
              />
            </div>

            <div className="relative">
              <IdCard className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                name="hospitalId"
                value={formData.hospitalId}
                onChange={handleChange}
                className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl focus:border-hospital-primary focus:ring-1 outline-none"
                placeholder="Hospital ID * (HS-2024-12345)"
                required
              />
            </div>

            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full pl-11 pr-11 py-3 border border-gray-200 rounded-xl focus:border-hospital-primary focus:ring-1 outline-none"
                placeholder="Password * (min 6 characters)"
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

            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl focus:border-hospital-primary focus:ring-1 outline-none"
                placeholder="Confirm Password *"
                required
              />
            </div>

            <div className="relative">
              <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="tel"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl focus:border-hospital-primary focus:ring-1 outline-none"
                placeholder="Phone Number (Optional)"
              />
            </div>

            <div className="relative">
              <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="date"
                name="dateOfBirth"
                value={formData.dateOfBirth}
                onChange={handleChange}
                className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl focus:border-hospital-primary focus:ring-1 outline-none"
              />
            </div>

            <p className="text-xs text-gray-400">* Required fields</p>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-hospital-primary hover:bg-blue-700 py-3 rounded-xl text-white font-semibold transition-all mt-2"
            >
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>

          {/* Documentation Button */}
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