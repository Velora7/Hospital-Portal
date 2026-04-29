import { useState, useEffect } from 'react';
import { Heart, Calendar, MessageSquare, FileText, LogOut, User, Shield, ChevronRight, X, Send, CheckCircle, Eye, Clock, Mail, Download } from 'lucide-react';
import { motion } from 'framer-motion';

const doctors = [
  { id: 1, name: "Dr. Kalkidan Belachew", specialty: "Cardiology", avatar: "❤️", available: true },
  { id: 2, name: "Dr. Atede Tadele", specialty: "Pediatrics", avatar: "🧸", available: true },
  { id: 3, name: "Dr. Minilik Minuye", specialty: "Internal Medicine", avatar: "🩺", available: true },
  { id: 4, name: "Dr. Hilina Gebeyew", specialty: "Gynecology", avatar: "🌸", available: true },
  { id: 5, name: "Dr. Melkamu Asrat", specialty: "Neurology", avatar: "🧠", available: true },
  { id: 6, name: "Dr. Mesfin Eyasu", specialty: "General Surgery", avatar: "🔪", available: true },
];

export default function PatientDashboard({ user, setUser, onShowDocs }) {
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [showAppointmentModal, setShowAppointmentModal] = useState(false);
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [messageText, setMessageText] = useState('');
  const [toast, setToast] = useState(null);
  const [appointmentDate, setAppointmentDate] = useState('');
  const [appointmentTime, setAppointmentTime] = useState('');
  
  const [showMedicalRecords, setShowMedicalRecords] = useState(false);
  const [showAppointmentsList, setShowAppointmentsList] = useState(false);
  const [showMessagesList, setShowMessagesList] = useState(false);
  const [showRecordDetails, setShowRecordDetails] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [myAppointments, setMyAppointments] = useState([]);
  const [myMessages, setMyMessages] = useState([]);

  const medicalRecords = [
    { 
      id: 1, date: "2024-03-15", type: "Complete Blood Count (CBC)", doctor: "Dr. Kalkidan Belachew", result: "Normal",
      details: "Hemoglobin: 14.2 g/dL (Normal: 13.5-17.5)\nWhite Blood Cells: 7.5 x10^3/uL (Normal: 4.5-11.0)\nPlatelets: 250 x10^3/uL (Normal: 150-450)\nAll values within normal reference range.",
      notes: "Blood work shows healthy levels. No signs of infection or anemia."
    },
    { 
      id: 2, date: "2024-02-10", type: "Chest X-Ray", doctor: "Dr. Mesfin Eyasu", result: "Normal",
      details: "Chest X-ray shows clear lung fields. Heart size is within normal limits. No pleural effusion or pneumothorax. Bony structures intact.",
      notes: "Normal chest X-ray. No abnormalities detected. Routine follow-up not required."
    },
    { 
      id: 3, date: "2024-01-20", type: "ECG/EKG", doctor: "Dr. Kalkidan Belachew", result: "Normal Sinus Rhythm",
      details: "Heart Rate: 72 bpm\nPR Interval: 0.16 sec\nQRS Duration: 0.08 sec\nQT Interval: 0.36 sec\nNormal sinus rhythm with no evidence of ischemia or arrhythmia.",
      notes: "ECG shows normal heart rhythm. No concerning findings. Patient is stable."
    },
    { 
      id: 4, date: "2024-03-01", type: "Lipid Profile", doctor: "Dr. Minilik Minuye", result: "Borderline",
      details: "Total Cholesterol: 210 mg/dL (Normal: <200)\nLDL: 135 mg/dL (Normal: <100)\nHDL: 55 mg/dL (Normal: >40)\nTriglycerides: 150 mg/dL (Normal: <150)",
      notes: "Slightly elevated cholesterol levels. Recommend dietary changes and exercise. Follow-up in 6 months."
    }
  ];

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = () => {
    const allAppointments = JSON.parse(localStorage.getItem('appointments') || '[]');
    const userAppointments = allAppointments.filter(a => a.patientEmail === user.email);
    setMyAppointments(userAppointments);
    
    const allMessages = JSON.parse(localStorage.getItem('messages') || '[]');
    const userMessages = allMessages.filter(m => m.patientEmail === user.email);
    setMyMessages(userMessages);
  };

  const handleLogout = () => {
    localStorage.removeItem('healthshield_user');
    setUser(null);
  };

  const showToastMessage = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleBookAppointment = (doctor) => {
    setSelectedDoctor(doctor);
    setShowAppointmentModal(true);
  };

  const confirmAppointment = () => {
    if (!appointmentDate || !appointmentTime) {
      showToastMessage('Please select date and time', 'error');
      return;
    }

    const appointment = {
      id: Date.now(),
      patientName: user.name,
      patientEmail: user.email,
      doctorName: selectedDoctor.name,
      doctorSpecialty: selectedDoctor.specialty,
      date: appointmentDate,
      time: appointmentTime,
      status: 'pending',
      createdAt: new Date().toISOString()
    };

    const appointments = JSON.parse(localStorage.getItem('appointments') || '[]');
    appointments.push(appointment);
    localStorage.setItem('appointments', JSON.stringify(appointments));
    
    loadUserData();
    showToastMessage(`Appointment booked with ${selectedDoctor.name} on ${appointmentDate} at ${appointmentTime}`);
    setShowAppointmentModal(false);
    setAppointmentDate('');
    setAppointmentTime('');
    setSelectedDoctor(null);
  };

  const handleSendMessage = (doctor) => {
    setSelectedDoctor(doctor);
    setShowMessageModal(true);
  };

  const confirmSendMessage = () => {
    if (!messageText.trim()) {
      showToastMessage('Please enter a message', 'error');
      return;
    }

    const message = {
      id: Date.now(),
      patientName: user.name,
      patientEmail: user.email,
      doctorName: selectedDoctor.name,
      message: messageText,
      timestamp: new Date().toISOString(),
      read: false
    };

    const messages = JSON.parse(localStorage.getItem('messages') || '[]');
    messages.push(message);
    localStorage.setItem('messages', JSON.stringify(messages));
    
    loadUserData();
    showToastMessage(`Message sent to ${selectedDoctor.name}`);
    setShowMessageModal(false);
    setMessageText('');
    setSelectedDoctor(null);
  };

  const downloadRecord = (record) => {
    const reportContent = `
HEALTHSHIELD PORTAL - MEDICAL RECORD
=====================================

Patient Name: ${user.name}
Patient ID: ${user.id?.toString().slice(-6) || 'N/A'}
Record ID: ${record.id}
Date of Report: ${new Date().toLocaleDateString()}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

RECORD DETAILS:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

• Test Type: ${record.type}
• Date Performed: ${record.date}
• Ordering Doctor: ${record.doctor}
• Result Status: ${record.result}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

DETAILED FINDINGS:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

${record.details}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

DOCTOR'S NOTES:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

${record.notes}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

This is an electronically generated medical record.
All data is encrypted and securely stored.

BITCYSEC Hospital - HealthShield Portal
    `;

    const blob = new Blob([reportContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Medical_Record_${record.type}_${record.date}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    showToastMessage(`Downloaded ${record.type} record successfully`, 'success');
  };

  return (
    <div className="min-h-screen bg-hospital-light">
      {toast && (
        <div className="fixed top-24 right-6 z-50 animate-slide-in">
          <div className={`flex items-center gap-2 px-4 py-3 rounded-xl shadow-lg ${toast.type === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}`}>
            <CheckCircle size={18} />
            {toast.message}
          </div>
        </div>
      )}

      <nav className="bg-white shadow-sm border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-5 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Heart className="text-hospital-primary heartbeat-icon" size={38} />
            <div>
              <h1 className="text-3xl font-bold text-hospital-dark">HealthShield</h1>
              <p className="text-xs text-gray-500 -mt-1">BITCYSEC HOSPITAL</p>
            </div>
          </div>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3 bg-white px-6 py-3 rounded-3xl shadow-sm border border-hospital-accent/30">
              <div className="text-3xl">{user?.avatar || "🧑‍⚕️"}</div>
              <div>
                <p className="font-semibold text-hospital-dark">{user?.name}</p>
                <p className="text-xs text-gray-500">Patient</p>
              </div>
            </div>
            <button onClick={handleLogout} className="text-gray-500 hover:text-red-600 transition-all p-2">
              <LogOut size={26} />
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-12">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-4xl font-bold text-hospital-dark mb-2">Welcome back, {user?.name?.split(" ")[0]} 👋</h1>
          <p className="text-lg text-hospital-dark/70">Your health is in safe hands. Everything is secure and private.</p>
        </motion.div>

        <div className="mt-14">
          <h2 className="text-3xl font-semibold mb-10 text-hospital-dark flex items-center gap-4">Meet Our Doctors <span className="text-4xl">👨‍⚕️👩‍⚕️</span></h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {doctors.map((doctor, index) => (
              <motion.div key={doctor.id} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.08 }} className="bg-white rounded-3xl p-8 card-hover border border-hospital-accent/20 hover:border-hospital-primary/30">
                <div className="text-7xl mb-6 flex justify-center">{doctor.avatar}</div>
                <h3 className="text-2xl font-semibold text-center text-hospital-dark mb-2">{doctor.name}</h3>
                <p className="text-hospital-accent text-center font-medium text-lg">{doctor.specialty}</p>
                <div className="mt-10 flex flex-col gap-3">
                  <button onClick={() => handleBookAppointment(doctor)} className="bg-hospital-primary text-white py-4 rounded-2xl font-semibold hover:bg-blue-700 transition-all flex items-center justify-center gap-2"><Calendar size={20} /> Book Appointment</button>
                  <button onClick={() => handleSendMessage(doctor)} className="border-2 border-hospital-primary text-hospital-primary py-4 rounded-2xl font-semibold hover:bg-hospital-light transition-all flex items-center justify-center gap-2"><MessageSquare size={20} /> Send Secure Message</button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
          <button onClick={() => setShowMedicalRecords(true)} className="bg-white p-8 rounded-3xl card-hover text-center border border-hospital-accent/20 hover:shadow-lg transition-all group">
            <FileText className="mx-auto text-hospital-primary mb-4 group-hover:scale-110 transition" size={48} />
            <h3 className="font-semibold text-xl mb-2">Medical Records</h3>
            <p className="text-gray-600">View your secure health history</p>
            <p className="text-xs text-hospital-primary mt-3">Click to view →</p>
          </button>
          <button onClick={() => setShowAppointmentsList(true)} className="bg-white p-8 rounded-3xl card-hover text-center border border-hospital-accent/20 hover:shadow-lg transition-all group">
            <Calendar className="mx-auto text-hospital-primary mb-4 group-hover:scale-110 transition" size={48} />
            <h3 className="font-semibold text-xl mb-2">My Appointments</h3>
            <p className="text-gray-600">Manage your schedule</p>
            {myAppointments.length > 0 && <p className="text-xs text-hospital-primary mt-3">{myAppointments.length} appointment(s) →</p>}
          </button>
          <button onClick={() => setShowMessagesList(true)} className="bg-white p-8 rounded-3xl card-hover text-center border border-hospital-accent/20 hover:shadow-lg transition-all group">
            <MessageSquare className="mx-auto text-hospital-primary mb-4 group-hover:scale-110 transition" size={48} />
            <h3 className="font-semibold text-xl mb-2">My Messages</h3>
            <p className="text-gray-600">Chat securely with doctors</p>
            {myMessages.length > 0 && <p className="text-xs text-hospital-primary mt-3">{myMessages.length} message(s) →</p>}
          </button>
        </div>

        <button onClick={onShowDocs} className="mt-12 w-full bg-gray-800 hover:bg-gray-900 py-4 rounded-2xl text-white font-semibold transition-all duration-300 flex items-center justify-center gap-2 group">
          <Shield size={20} className="group-hover:rotate-12 transition" />
          View S-SDLC Security Documentation
          <ChevronRight size={16} className="group-hover:translate-x-1 transition" />
        </button>
      </div>

      {/* Appointment Modal */}
      {showAppointmentModal && selectedDoctor && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-hospital-dark">Book Appointment</h2>
              <button onClick={() => setShowAppointmentModal(false)} className="p-2 hover:bg-gray-100 rounded-full"><X size={24} /></button>
            </div>
            <div className="mb-6 p-4 bg-hospital-light rounded-xl">
              <p className="font-semibold">{selectedDoctor.name}</p>
              <p className="text-sm text-gray-500">{selectedDoctor.specialty}</p>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Select Date</label>
                <input type="date" value={appointmentDate} onChange={(e) => setAppointmentDate(e.target.value)} className="w-full p-3 border border-gray-200 rounded-xl focus:border-hospital-primary outline-none" min={new Date().toISOString().split('T')[0]} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Select Time</label>
                <select value={appointmentTime} onChange={(e) => setAppointmentTime(e.target.value)} className="w-full p-3 border border-gray-200 rounded-xl focus:border-hospital-primary outline-none">
                  <option value="">Select time</option>
                  <option value="09:00 AM">09:00 AM</option>
                  <option value="10:00 AM">10:00 AM</option>
                  <option value="11:00 AM">11:00 AM</option>
                  <option value="02:00 PM">02:00 PM</option>
                  <option value="03:00 PM">03:00 PM</option>
                  <option value="04:00 PM">04:00 PM</option>
                </select>
              </div>
            </div>
            <div className="mt-8 flex gap-3">
              <button onClick={() => setShowAppointmentModal(false)} className="flex-1 py-3 border border-gray-300 rounded-xl font-semibold hover:bg-gray-50">Cancel</button>
              <button onClick={confirmAppointment} className="flex-1 bg-hospital-primary text-white py-3 rounded-xl font-semibold hover:bg-blue-700">Confirm Booking</button>
            </div>
          </div>
        </div>
      )}

      {/* Message Modal */}
      {showMessageModal && selectedDoctor && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-hospital-dark">Send Message</h2>
              <button onClick={() => setShowMessageModal(false)} className="p-2 hover:bg-gray-100 rounded-full"><X size={24} /></button>
            </div>
            <div className="mb-6 p-4 bg-hospital-light rounded-xl">
              <p className="font-semibold">To: {selectedDoctor.name}</p>
              <p className="text-sm text-gray-500">{selectedDoctor.specialty}</p>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Your Message</label>
              <textarea value={messageText} onChange={(e) => setMessageText(e.target.value)} rows={5} className="w-full p-3 border border-gray-200 rounded-xl focus:border-hospital-primary outline-none resize-none" placeholder="Type your message here... (Your health data is encrypted)" />
            </div>
            <div className="mt-8 flex gap-3">
              <button onClick={() => setShowMessageModal(false)} className="flex-1 py-3 border border-gray-300 rounded-xl font-semibold hover:bg-gray-50">Cancel</button>
              <button onClick={confirmSendMessage} className="flex-1 bg-hospital-primary text-white py-3 rounded-xl font-semibold flex items-center justify-center gap-2"><Send size={18} /> Send Message</button>
            </div>
          </div>
        </div>
      )}

      {/* Medical Records Modal */}
      {showMedicalRecords && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[85vh] overflow-y-auto">
            <div className="sticky top-0 bg-white p-6 border-b flex justify-between items-center">
              <h2 className="text-2xl font-bold text-hospital-dark flex items-center gap-2"><FileText className="text-hospital-primary" /> My Medical Records</h2>
              <button onClick={() => setShowMedicalRecords(false)} className="p-2 hover:bg-gray-100 rounded-full"><X size={24} /></button>
            </div>
            <div className="p-6">
              {medicalRecords.map((record) => (
                <div key={record.id} className="mb-4 p-4 bg-hospital-light rounded-xl border border-hospital-accent/20 hover:shadow-md transition">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold text-lg text-hospital-dark">{record.type}</h3>
                        <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${record.result === 'Normal' || record.result === 'Normal Sinus Rhythm' ? 'bg-green-100 text-green-600' : record.result === 'Borderline' ? 'bg-yellow-100 text-yellow-600' : 'bg-blue-100 text-blue-600'}`}>{record.result}</span>
                      </div>
                      <p className="text-sm text-gray-600">{record.doctor}</p>
                      <p className="text-xs text-gray-400 mt-1">📅 {record.date}</p>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => { setSelectedRecord(record); setShowRecordDetails(true); }} className="px-3 py-1.5 bg-hospital-primary text-white rounded-lg text-sm hover:bg-blue-700 transition flex items-center gap-1"><Eye size={14} /> View Details</button>
                      <button onClick={() => downloadRecord(record)} className="px-3 py-1.5 border border-hospital-primary text-hospital-primary rounded-lg text-sm hover:bg-hospital-light transition flex items-center gap-1"><Download size={14} /> Download</button>
                    </div>
                  </div>
                </div>
              ))}
              <div className="mt-6 p-4 bg-gradient-to-r from-hospital-primary/10 to-blue-500/10 rounded-xl border border-hospital-primary/20">
                <h4 className="font-semibold text-hospital-dark mb-2">📊 Health Summary</h4>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div><p className="text-gray-500">Total Records</p><p className="font-bold text-hospital-dark">{medicalRecords.length}</p></div>
                  <div><p className="text-gray-500">Last Checkup</p><p className="font-bold text-hospital-dark">{medicalRecords[0]?.date}</p></div>
                  <div><p className="text-gray-500">Normal Results</p><p className="font-bold text-green-600">{medicalRecords.filter(r => r.result === 'Normal' || r.result === 'Normal Sinus Rhythm').length}</p></div>
                  <div><p className="text-gray-500">Follow-up Needed</p><p className="font-bold text-yellow-600">{medicalRecords.filter(r => r.result === 'Borderline').length}</p></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Record Details Modal */}
      {showRecordDetails && selectedRecord && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="sticky top-0 bg-white p-6 border-b flex justify-between items-center">
              <h2 className="text-2xl font-bold text-hospital-dark flex items-center gap-2"><FileText className="text-hospital-primary" /> {selectedRecord.type} - Detailed Report</h2>
              <button onClick={() => setShowRecordDetails(false)} className="p-2 hover:bg-gray-100 rounded-full"><X size={24} /></button>
            </div>
            <div className="p-6">
              <div className="mb-6 p-4 bg-hospital-light rounded-xl">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div><p className="text-gray-500">Patient Name</p><p className="font-semibold">{user.name}</p></div>
                  <div><p className="text-gray-500">Patient ID</p><p className="font-semibold">{user.id?.toString().slice(-6) || 'N/A'}</p></div>
                  <div><p className="text-gray-500">Test Date</p><p className="font-semibold">{selectedRecord.date}</p></div>
                  <div><p className="text-gray-500">Ordering Doctor</p><p className="font-semibold">{selectedRecord.doctor}</p></div>
                </div>
              </div>
              <div className="mb-6"><h3 className="font-semibold text-hospital-dark mb-3 flex items-center gap-2"><span>🔬</span> Test Details</h3><div className="bg-gray-50 p-4 rounded-xl whitespace-pre-wrap text-sm">{selectedRecord.details}</div></div>
              <div className="mb-6"><h3 className="font-semibold text-hospital-dark mb-3 flex items-center gap-2"><span>📝</span> Doctor's Notes</h3><div className="bg-blue-50 p-4 rounded-xl text-sm">{selectedRecord.notes}</div></div>
              <div className="flex gap-3 pt-4 border-t">
                <button onClick={() => downloadRecord(selectedRecord)} className="flex-1 bg-hospital-primary text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition flex items-center justify-center gap-2"><Download size={18} /> Download Full Report</button>
                <button onClick={() => setShowRecordDetails(false)} className="flex-1 border border-gray-300 text-gray-600 py-3 rounded-xl font-semibold hover:bg-gray-50 transition">Close</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* My Appointments Modal */}
      {showAppointmentsList && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="sticky top-0 bg-white p-6 border-b flex justify-between items-center">
              <h2 className="text-2xl font-bold text-hospital-dark flex items-center gap-2"><Calendar className="text-hospital-primary" /> My Appointments</h2>
              <button onClick={() => setShowAppointmentsList(false)} className="p-2 hover:bg-gray-100 rounded-full"><X size={24} /></button>
            </div>
            <div className="p-6">
              {myAppointments.length === 0 ? (
                <div className="text-center py-12"><Calendar size={48} className="mx-auto text-gray-300 mb-3" /><p className="text-gray-500">No appointments yet</p><p className="text-sm text-gray-400 mt-1">Book an appointment with a doctor above</p></div>
              ) : (
                myAppointments.map((apt) => (
                  <div key={apt.id} className="mb-4 p-4 bg-hospital-light rounded-xl border border-hospital-accent/20">
                    <div className="flex justify-between items-start">
                      <div><p className="font-semibold text-hospital-dark">{apt.doctorName}</p><p className="text-sm text-gray-500">{apt.doctorSpecialty}</p><div className="flex items-center gap-4 mt-2"><p className="text-sm flex items-center gap-1">📅 {apt.date}</p><p className="text-sm flex items-center gap-1">⏰ {apt.time}</p></div></div>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${apt.status === 'confirmed' ? 'bg-green-100 text-green-600' : apt.status === 'cancelled' ? 'bg-red-100 text-red-600' : 'bg-yellow-100 text-yellow-600'}`}>{apt.status === 'pending' ? 'Pending' : apt.status}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* My Messages Modal */}
      {showMessagesList && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="sticky top-0 bg-white p-6 border-b flex justify-between items-center">
              <h2 className="text-2xl font-bold text-hospital-dark flex items-center gap-2"><MessageSquare className="text-hospital-primary" /> My Messages</h2>
              <button onClick={() => setShowMessagesList(false)} className="p-2 hover:bg-gray-100 rounded-full"><X size={24} /></button>
            </div>
            <div className="p-6">
              {myMessages.length === 0 ? (
                <div className="text-center py-12"><MessageSquare size={48} className="mx-auto text-gray-300 mb-3" /><p className="text-gray-500">No messages yet</p><p className="text-sm text-gray-400 mt-1">Send a message to a doctor above</p></div>
              ) : (
                myMessages.map((msg) => (
                  <div key={msg.id} className="mb-4 p-4 bg-hospital-light rounded-xl border border-hospital-accent/20">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2"><span className="font-semibold text-hospital-dark">To: {msg.doctorName}</span><span className="text-xs text-gray-400">{new Date(msg.timestamp).toLocaleString()}</span></div>
                        <p className="text-gray-700">{msg.message}</p>
                        <div className="mt-2"><span className={`inline-block px-2 py-0.5 rounded-full text-xs ${msg.read ? 'bg-gray-100 text-gray-500' : 'bg-green-100 text-green-600'}`}>{msg.read ? 'Read' : 'Sent'}</span></div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes slideIn { from { transform: translateX(100%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
        .animate-slide-in { animation: slideIn 0.3s ease-out; }
      `}</style>
    </div>
  );
}