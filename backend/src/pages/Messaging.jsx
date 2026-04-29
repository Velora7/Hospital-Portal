import { useState } from 'react';
import { ArrowLeft, Send, AlertTriangle } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Messaging({ user, selectedDoctor, onBack }) {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([
    { 
      id: 1, 
      from: "doctor", 
      text: `Hello ${user?.name || "Patient"}, how are you feeling today?`, 
      time: "10:32 AM" 
    },
  ]);

  // Quick message templates (including Emergency)
  const quickMessages = [
    "I have severe chest pain right now - Emergency!",
    "I'm having difficulty breathing",
    "My blood pressure is very high (160/100)",
    "I feel dizzy and nauseous",
    "The medicine is causing side effects",
    "When is my next appointment?",
    "I need a medical certificate",
    "Can I get a refill on my prescription?",
    "I'm feeling much better today, thank you",
    "I have a question about my test results",
  ];

  const sendMessage = (text = message) => {
    if (!text.trim() || !selectedDoctor) return;

    const newMsg = {
      id: Date.now(),
      from: "patient",
      text: text,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    // Save for Doctor notification
    if (!window.allMessages) window.allMessages = [];
    window.allMessages.unshift({
      patientName: user?.name || "Patient",
      doctorName: selectedDoctor.name,
      text: text,
      time: newMsg.time,
      isEmergency: text.toLowerCase().includes("emergency") || text.toLowerCase().includes("severe")
    });

    setMessages([...messages, newMsg]);
    setMessage('');

    // Auto doctor reply
    setTimeout(() => {
      const replies = [
        "Thank you for letting me know. Please monitor your symptoms closely.",
        "That's concerning. Can you tell me more details?",
        "Please come to the hospital as soon as possible if symptoms worsen.",
        "Noted. I will review your file and get back to you shortly.",
        "I'm glad to hear you're feeling better. Continue the medication.",
      ];
      const randomReply = replies[Math.floor(Math.random() * replies.length)];

      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        from: "doctor",
        text: randomReply,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
    }, 800);
  };

  return (
    <div className="min-h-screen bg-hospital-light flex flex-col">
      {/* Header */}
      <div className="bg-white border-b px-6 py-5 flex items-center gap-4 sticky top-0 z-50">
        <button onClick={onBack} className="text-hospital-primary">
          <ArrowLeft size={28} />
        </button>
        <div className="flex items-center gap-4">
          <div className="text-4xl">{selectedDoctor?.avatar}</div>
          <div>
            <h2 className="font-semibold text-xl text-hospital-dark">{selectedDoctor?.name}</h2>
            <p className="text-sm text-hospital-accent">{selectedDoctor?.specialty}</p>
          </div>
        </div>
        <div className="ml-auto text-green-500 text-sm font-medium">● Online</div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 p-6 overflow-y-auto max-w-4xl mx-auto w-full">
        {messages.map((msg) => (
          <motion.div
            key={msg.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`mb-6 flex ${msg.from === 'patient' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`max-w-[75%] rounded-3xl px-6 py-4 ${
              msg.from === 'patient' 
                ? 'bg-hospital-primary text-white rounded-br-none' 
                : 'bg-white border border-hospital-accent/30 text-hospital-dark rounded-bl-none'
            }`}>
              <p className="text-[15px] leading-relaxed">{msg.text}</p>
              <p className={`text-xs mt-2 opacity-70 ${msg.from === 'patient' ? 'text-right' : ''}`}>
                {msg.time}
              </p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Quick Messages + Input */}
      <div className="bg-white border-t p-6 max-w-4xl mx-auto w-full">
        {/* Quick Messages */}
        <div className="mb-6">
          <p className="text-sm text-gray-500 mb-3">Quick Messages:</p>
          <div className="grid grid-cols-2 gap-2">
            {quickMessages.map((qmsg, index) => (
              <button
                key={index}
                onClick={() => sendMessage(qmsg)}
                className={`text-left text-sm px-4 py-3 rounded-2xl border transition-all hover:bg-hospital-light ${
                  qmsg.toLowerCase().includes('emergency') || qmsg.toLowerCase().includes('severe')
                    ? 'border-red-400 bg-red-50 text-red-700 hover:bg-red-100'
                    : 'border-gray-200 hover:border-hospital-primary'
                }`}
              >
                {qmsg}
              </button>
            ))}
          </div>
        </div>

        {/* Manual Input */}
        <div className="flex gap-3">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
            placeholder="Type your own message..."
            className="flex-1 py-4 px-6 border border-gray-200 rounded-3xl focus:border-hospital-primary outline-none"
          />
          <button
            onClick={() => sendMessage()}
            disabled={!message.trim()}
            className="bg-hospital-primary hover:bg-blue-700 text-white px-8 rounded-3xl disabled:opacity-50 transition-all"
          >
            <Send size={24} />
          </button>
        </div>

        <p className="text-center text-xs text-gray-500 mt-4">
          🔒 All messages are encrypted and private
        </p>
      </div>
    </div>
  );
}