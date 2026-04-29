import { useState, useEffect } from 'react';
import { Heart, Calendar, MessageSquare, FileText, LogOut, Users, Clock, Bell, Activity, Stethoscope, TrendingUp, ChevronRight, Shield, Mail, CheckCircle, X } from 'lucide-react';

export default function DoctorDashboard({ user, onLogout, onShowDocs }) {
  const [greeting, setGreeting] = useState(() => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  });

  const [appointments, setAppointments] = useState([]);
  const [messages, setMessages] = useState([]);
  const [showAppointments, setShowAppointments] = useState(false);
  const [showMessages, setShowMessages] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState(null);

  // Load appointments and messages from localStorage
  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 3000);
    return () => clearInterval(interval);
  }, []);

  const loadData = () => {
    const allAppointments = JSON.parse(localStorage.getItem('appointments') || '[]');
    const allMessages = JSON.parse(localStorage.getItem('messages') || '[]');
    setAppointments(allAppointments);
    setMessages(allMessages.filter(m => !m.read));
  };

  const markMessageAsRead = (messageId) => {
    const allMessages = JSON.parse(localStorage.getItem('messages') || '[]');
    const updated = allMessages.map(m => 
      m.id === messageId ? { ...m, read: true } : m
    );
    localStorage.setItem('messages', JSON.stringify(updated));
    loadData();
  };

  const updateAppointmentStatus = (appointmentId, status) => {
    const allAppointments = JSON.parse(localStorage.getItem('appointments') || '[]');
    const updated = allAppointments.map(a => 
      a.id === appointmentId ? { ...a, status: status } : a
    );
    localStorage.setItem('appointments', JSON.stringify(updated));
    loadData();
  };

  const pendingAppointments = appointments.filter(a => a.status === 'pending');
  const confirmedAppointments = appointments.filter(a => a.status === 'confirmed');
  const unreadMessages = messages.filter(m => !m.read);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-40 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-2 rounded-xl shadow-lg">
              <Heart className="text-white heartbeat-icon" size={28} />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">HealthShield</h1>
              <p className="text-xs text-gray-500">Doctor Portal</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="relative">
              <button 
                onClick={() => setShowMessages(!showMessages)} 
                className="p-2 hover:bg-gray-100 rounded-xl transition relative"
              >
                <Mail size={22} className="text-gray-500" />
                {unreadMessages.length > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full text-white text-xs flex items-center justify-center">
                    {unreadMessages.length}
                  </span>
                )}
              </button>
            </div>
            <div className="relative">
              <button 
                onClick={() => setShowAppointments(!showAppointments)} 
                className="p-2 hover:bg-gray-100 rounded-xl transition relative"
              >
                <Calendar size={22} className="text-gray-500" />
                {pendingAppointments.length > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-orange-500 rounded-full text-white text-xs flex items-center justify-center">
                    {pendingAppointments.length}
                  </span>
                )}
              </button>
            </div>
            <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-xl shadow-sm border border-gray-100">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white text-lg font-semibold shadow-md">
                {user.name?.charAt(0)}
              </div>
              <div className="hidden md:block">
                <p className="font-semibold text-gray-800">{user.name}</p>
                <p className="text-xs text-blue-600">Cardiology Department</p>
              </div>
            </div>
            <button onClick={onLogout} className="p-2 hover:bg-gray-100 rounded-xl transition">
              <LogOut size={22} className="text-gray-500" />
            </button>
          </div>
        </div>
      </header>

      {/* Appointments Modal */}
      {showAppointments && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="sticky top-0 bg-white p-6 border-b flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-800">Appointment Requests</h2>
              <button onClick={() => setShowAppointments(false)} className="p-2 hover:bg-gray-100 rounded-full">
                <X size={24} />
              </button>
            </div>
            <div className="p-6">
              {pendingAppointments.length === 0 && confirmedAppointments.length === 0 ? (
                <p className="text-center text-gray-500 py-8">No appointments yet</p>
              ) : (
                <>
                  {pendingAppointments.length > 0 && (
                    <>
                      <h3 className="font-semibold text-orange-600 mb-3">Pending Requests ({pendingAppointments.length})</h3>
                      {pendingAppointments.map((apt) => (
                        <div key={apt.id} className="mb-4 p-4 bg-orange-50 rounded-xl border border-orange-200">
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="font-semibold">{apt.patientName}</p>
                              <p className="text-sm text-gray-500">{apt.doctorName} - {apt.doctorSpecialty}</p>
                              <p className="text-sm mt-1">📅 {apt.date} at {apt.time}</p>
                            </div>
                            <div className="flex gap-2">
                              <button
                                onClick={() => updateAppointmentStatus(apt.id, 'confirmed')}
                                className="px-4 py-2 bg-green-500 text-white rounded-lg text-sm hover:bg-green-600"
                              >
                                Confirm
                              </button>
                              <button
                                onClick={() => updateAppointmentStatus(apt.id, 'cancelled')}
                                className="px-4 py-2 bg-red-500 text-white rounded-lg text-sm hover:bg-red-600"
                              >
                                Decline
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </>
                  )}
                  {confirmedAppointments.length > 0 && (
                    <>
                      <h3 className="font-semibold text-green-600 mt-4 mb-3">Confirmed Appointments ({confirmedAppointments.length})</h3>
                      {confirmedAppointments.map((apt) => (
                        <div key={apt.id} className="mb-4 p-4 bg-green-50 rounded-xl border border-green-200">
                          <p className="font-semibold">{apt.patientName}</p>
                          <p className="text-sm text-gray-500">{apt.doctorName} - {apt.doctorSpecialty}</p>
                          <p className="text-sm mt-1">📅 {apt.date} at {apt.time}</p>
                          <span className="inline-block mt-2 px-2 py-1 bg-green-100 text-green-600 rounded-full text-xs">
                            Confirmed
                          </span>
                        </div>
                      ))}
                    </>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Messages Modal */}
      {showMessages && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="sticky top-0 bg-white p-6 border-b flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-800">Patient Messages</h2>
              <button onClick={() => setShowMessages(false)} className="p-2 hover:bg-gray-100 rounded-full">
                <X size={24} />
              </button>
            </div>
            <div className="p-6">
              {unreadMessages.length === 0 ? (
                <p className="text-center text-gray-500 py-8">No new messages</p>
              ) : (
                unreadMessages.map((msg) => (
                  <div key={msg.id} className="mb-4 p-4 bg-blue-50 rounded-xl border border-blue-200">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-semibold">From: {msg.patientName}</p>
                        <p className="text-sm text-gray-500">To: {msg.doctorName}</p>
                        <p className="text-sm mt-2">{msg.message}</p>
                        <p className="text-xs text-gray-400 mt-1">
                          {new Date(msg.timestamp).toLocaleString()}
                        </p>
                      </div>
                      <button
                        onClick={() => markMessageAsRead(msg.id)}
                        className="px-4 py-2 bg-blue-500 text-white rounded-lg text-sm hover:bg-blue-600"
                      >
                        Mark as Read
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Welcome Banner */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-8 text-white mb-8 shadow-xl">
          <h1 className="text-3xl font-bold">{greeting}, Dr. {user.name?.split(' ')[1] || user.name}! 👨‍⚕️</h1>
          <p className="text-blue-100 mt-2">Here's your practice overview for today.</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
          <div className="bg-white rounded-xl p-5 shadow-sm hover:shadow-md transition-all duration-300 border-l-4 border-blue-500 group">
            <Calendar className="text-blue-500 mb-2 group-hover:scale-110 transition" size={28} />
            <h3 className="text-2xl font-bold text-gray-800">{pendingAppointments.length + confirmedAppointments.length}</h3>
            <p className="text-gray-500 text-sm">Total Appointments</p>
          </div>
          <div className="bg-white rounded-xl p-5 shadow-sm hover:shadow-md transition-all duration-300 border-l-4 border-orange-500 group">
            <Clock className="text-orange-500 mb-2 group-hover:scale-110 transition" size={28} />
            <h3 className="text-2xl font-bold text-gray-800">{pendingAppointments.length}</h3>
            <p className="text-gray-500 text-sm">Pending Requests</p>
          </div>
          <div className="bg-white rounded-xl p-5 shadow-sm hover:shadow-md transition-all duration-300 border-l-4 border-emerald-500 group">
            <MessageSquare className="text-emerald-500 mb-2 group-hover:scale-110 transition" size={28} />
            <h3 className="text-2xl font-bold text-gray-800">{unreadMessages.length}</h3>
            <p className="text-gray-500 text-sm">Unread Messages</p>
          </div>
          <div className="bg-white rounded-xl p-5 shadow-sm hover:shadow-md transition-all duration-300 border-l-4 border-indigo-500 group">
            <Users className="text-indigo-500 mb-2 group-hover:scale-110 transition" size={28} />
            <h3 className="text-2xl font-bold text-gray-800">124</h3>
            <p className="text-gray-500 text-sm">Total Patients</p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
          <button 
            onClick={() => setShowAppointments(true)}
            className="bg-white p-5 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 flex items-center justify-center gap-3 group"
          >
            <Calendar className="text-blue-500 group-hover:scale-110 transition" size={22} />
            <span className="font-semibold text-gray-700">View Appointments</span>
            {pendingAppointments.length > 0 && (
              <span className="px-2 py-0.5 bg-orange-500 text-white rounded-full text-xs">
                {pendingAppointments.length}
              </span>
            )}
          </button>
          <button 
            onClick={() => setShowMessages(true)}
            className="bg-white p-5 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 flex items-center justify-center gap-3 group"
          >
            <MessageSquare className="text-blue-500 group-hover:scale-110 transition" size={22} />
            <span className="font-semibold text-gray-700">Read Messages</span>
            {unreadMessages.length > 0 && (
              <span className="px-2 py-0.5 bg-red-500 text-white rounded-full text-xs">
                {unreadMessages.length}
              </span>
            )}
          </button>
          <button className="bg-white p-5 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 flex items-center justify-center gap-3 group">
            <Stethoscope className="text-blue-500 group-hover:rotate-12 transition" size={22} />
            <span className="font-semibold text-gray-700">Write Prescription</span>
          </button>
        </div>

        {/* Recent Appointments Preview */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-10">
          <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <Calendar className="text-blue-500" /> Recent Appointment Requests
          </h2>
          {pendingAppointments.length === 0 ? (
            <p className="text-center text-gray-500 py-6">No pending appointment requests</p>
          ) : (
            <div className="space-y-3">
              {pendingAppointments.slice(0, 3).map((apt) => (
                <div key={apt.id} className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                  <div>
                    <p className="font-semibold">{apt.patientName}</p>
                    <p className="text-sm text-gray-500">{apt.date} at {apt.time}</p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => updateAppointmentStatus(apt.id, 'confirmed')}
                      className="px-3 py-1 bg-green-500 text-white rounded-lg text-xs"
                    >
                      Accept
                    </button>
                    <button
                      onClick={() => updateAppointmentStatus(apt.id, 'cancelled')}
                      className="px-3 py-1 bg-red-500 text-white rounded-lg text-xs"
                    >
                      Decline
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Documentation Button */}
        <button
          onClick={onShowDocs}
          className="w-full bg-gray-800 hover:bg-gray-900 py-3 rounded-xl text-white font-semibold transition-all duration-300 flex items-center justify-center gap-2 group"
        >
          <Shield size={18} className="group-hover:rotate-12 transition" />
          View S-SDLC Security Documentation
          <ChevronRight size={16} className="group-hover:translate-x-1 transition" />
        </button>
      </main>
    </div>
  );
}