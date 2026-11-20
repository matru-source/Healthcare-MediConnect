import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Mic, 
  MicOff, 
  Video, 
  VideoOff, 
  PhoneOff, 
  MessageSquare, 
  Share2, 
  Settings, 
  ShieldCheck, 
  Clock, 
  Send, 
  User, 
  FileText,
  AlertCircle,
  Sparkles,
  Maximize2
} from 'lucide-react';
import { storageService } from '../../services/storageService';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../../components/common/Button';
import { ImageWithFallback } from '../../components/common/ImageWithFallback';

export const ConsultationRoomPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const appointments = storageService.getAppointments();
  const apt = appointments.find(a => a.id === id) || appointments[0];

  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [endCallModalOpen, setEndCallModalOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(true);
  const [consultationSeconds, setConsultationSeconds] = useState(0);

  // Chat state
  const [messages, setMessages] = useState([
    { sender: 'doctor', text: `Hello ${apt.patientName}, I have your ECG and resting blood pressure telemetry loaded on my monitor. How have you been feeling since yesterday?`, time: '14:30' },
    { sender: 'patient', text: `Hi Dr. ${apt.doctorName.split(' ')[1] || 'Doctor'}, thank you! The palpitations have been much milder today after taking the morning 25mg dose.`, time: '14:31' }
  ]);
  const [inputText, setInputText] = useState('');

  // Live timer
  useEffect(() => {
    const timer = setInterval(() => {
      setConsultationSeconds(prev => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTimer = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const newMsg = {
      sender: 'patient',
      text: inputText,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setMessages(prev => [...prev, newMsg]);
    setInputText('');

    // Mock doctor reply
    setTimeout(() => {
      setMessages(prev => [
        ...prev,
        {
          sender: 'doctor',
          text: 'Understood. I will document this in your post-consultation prescription and recommend continuing this dosage for the next 14 days.',
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    }, 1500);
  };

  const handleEndCall = () => {
    setEndCallModalOpen(true);
  };

  const handleConfirmEndCall = () => {
    storageService.updateAppointmentStatus(apt.id, 'completed');

    // Automatically generate real e-prescription record
    storageService.addPrescription({
      prescriptionNumber: `RX-${new Date().getFullYear()}-${Math.floor(10000 + Math.random() * 90000)}`,
      patientId: apt.patientId || user?.id || 'pat-1',
      patientName: apt.patientName || user?.name || 'Sarah Jenkins',
      patientAge: apt.patientAge || 32,
      patientGender: apt.patientGender || 'female',
      doctorId: apt.doctorId,
      doctorName: apt.doctorName,
      doctorSpecialty: apt.doctorSpecialty,
      doctorLicense: 'MED-NY-84920',
      hospitalName: apt.hospitalName,
      date: new Date().toISOString().split('T')[0],
      diagnosis: apt.reasonForVisit || 'Clinical consultation follow-up and symptom review',
      vitals: {
        bp: '120/78 mmHg',
        heartRate: '72 bpm',
        temperature: '98.6 °F',
        weight: '64 kg'
      },
      medications: [
        {
          name: 'Metoprolol Tartrate',
          dosage: '25 mg',
          frequency: 'Twice daily with meals',
          duration: '14 days',
          instructions: 'Take one tablet in the morning and one in the evening after meals.',
          timing: { morning: true, afternoon: false, evening: true, night: false }
        },
        {
          name: 'CoQ10 Cardiovascular Support',
          dosage: '100 mg',
          frequency: 'Once daily',
          duration: '30 days',
          instructions: 'Take with morning breakfast.',
          timing: { morning: true, afternoon: false, evening: false, night: false }
        }
      ],
      advice: 'Maintain regular hydration, limit sodium intake, and schedule follow-up telemetry checkup in 2 weeks.',
      followUpDate: new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0]
    });

    setEndCallModalOpen(false);
    navigate('/patient/prescriptions');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col justify-between overflow-hidden">
      {/* Top Telemedicine Navigation Bar */}
      <header className="h-16 px-6 bg-slate-900/80 backdrop-blur-md border-b border-slate-800 flex items-center justify-between z-20">
        <div className="flex items-center gap-3">
          <Link to="/patient/dashboard" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-[#146C94] to-[#19A7A1] flex items-center justify-center font-bold text-white">
              M
            </div>
            <span className="font-extrabold text-sm tracking-tight hidden sm:block">
              MediConnect Telehealth
            </span>
          </Link>
          <span className="text-slate-600">|</span>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-bold text-slate-200">Encrypted HD WebRTC Session</span>
          </div>
        </div>

        {/* Center Session Timer */}
        <div className="flex items-center gap-2 px-3 py-1 bg-slate-800/80 border border-slate-700 rounded-full text-xs font-mono font-bold text-[#72D6CB]">
          <Clock className="w-3.5 h-3.5" />
          <span>{formatTimer(consultationSeconds)}</span>
        </div>

        {/* Doctor & Hospital Info */}
        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <p className="text-xs font-bold text-white">{apt.doctorName}</p>
            <p className="text-[11px] text-[#72D6CB]">{apt.doctorSpecialty}</p>
          </div>
          <ImageWithFallback
            src={apt.doctorAvatar}
            alt={apt.doctorName}
            name={apt.doctorName}
            fallbackType="doctor"
            className="w-9 h-9 rounded-full object-cover ring-2 ring-[#19A7A1]"
          />
        </div>
      </header>

      {/* Emergency Advisory Banner */}
      <div className="bg-red-950/80 border-b border-red-800/60 px-4 py-1.5 text-center text-[11px] text-red-200 flex items-center justify-center gap-1.5 z-20">
        <AlertCircle className="w-3.5 h-3.5 text-red-400 shrink-0" />
        <span>EMERGENCY ADVISORY: If experiencing acute chest pain, severe dyspnea, or life-threatening symptoms, dial 911 immediately.</span>
      </div>

      {/* Main Video & Chat Split Area */}
      <div className="flex-1 flex overflow-hidden p-4 gap-4 relative">
        {/* Main Video Area */}
        <div className="flex-1 flex flex-col relative rounded-3xl overflow-hidden bg-slate-900 border border-slate-800 shadow-2xl">
          {/* Main Stream (Doctor) */}
          <div className="relative w-full h-full flex items-center justify-center bg-radial from-slate-800 to-slate-950">
            {/* Realistic Doctor Video Feed mockup */}
            <ImageWithFallback
              src="https://images.unsplash.com/photo-1594824813637-0245a4918e9d?auto=format&fit=crop&w=1200&q=80"
              alt="Doctor Stream"
              name={apt.doctorName}
              fallbackType="hero"
              className="w-full h-full object-cover opacity-90"
            />

            {/* Doctor Overlay Badge (like this 1.jpg) */}
            <div className="absolute top-4 left-4 bg-slate-900/70 backdrop-blur-md px-3.5 py-1.5 rounded-xl border border-white/10 flex items-center gap-2.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <div>
                <p className="text-xs font-bold text-white leading-tight">{apt.doctorName}</p>
                <p className="text-[10px] text-[#72D6CB]">{apt.doctorSpecialty} (Host)</p>
              </div>
            </div>

            {/* Screen Share Active Notice */}
            {isScreenSharing && (
              <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-[#146C94]/90 backdrop-blur-md px-4 py-1.5 rounded-full border border-sky-400/40 text-xs font-bold text-white flex items-center gap-2 shadow-lg z-20">
                <Share2 className="w-3.5 h-3.5 text-[#72D6CB] animate-pulse" />
                <span>Screen Sharing Active: Doctor is viewing your clinical documents</span>
                <button
                  onClick={() => setIsScreenSharing(false)}
                  className="ml-2 text-[10px] bg-white/20 hover:bg-white/30 px-2 py-0.5 rounded-md"
                >
                  Stop
                </button>
              </div>
            )}

            {/* Diagnostic Overlay / Telemetry HUD */}
            <div className="absolute bottom-4 left-4 hidden sm:flex items-center gap-3 bg-slate-900/80 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/10 text-xs">
              <div>
                <span className="text-[10px] text-slate-400 block">ECG Stream</span>
                <span className="font-bold text-emerald-400">74 bpm Normal</span>
              </div>
              <div className="w-px h-6 bg-slate-700" />
              <div>
                <span className="text-[10px] text-slate-400 block">Audio Quality</span>
                <span className="font-bold text-[#72D6CB]">Opus HD (48 kHz)</span>
              </div>
            </div>

            {/* Small Floating Patient Picture-in-Picture Video */}
            <motion.div
              drag
              dragConstraints={{ left: 0, right: 300, top: 0, bottom: 200 }}
              className="absolute top-4 right-4 w-40 sm:w-48 h-28 sm:h-36 rounded-2xl overflow-hidden border-2 border-white/30 shadow-2xl bg-slate-800 cursor-move"
            >
              {!isVideoOff ? (
                <ImageWithFallback
                  src={user?.avatar || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80'}
                  alt="Patient Video"
                  name={user?.name || 'Patient'}
                  fallbackType="avatar"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center bg-slate-800 text-slate-400 text-xs">
                  <VideoOff className="w-6 h-6 mb-1 text-slate-500" />
                  <span>Camera Off</span>
                </div>
              )}
              <div className="absolute bottom-2 left-2 bg-black/60 backdrop-blur-xs px-2 py-0.5 rounded text-[10px] font-bold text-white flex items-center gap-1">
                {isMuted && <MicOff className="w-2.5 h-2.5 text-red-400" />}
                <span>You</span>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Live Chat Panel (Collapsible) */}
        <AnimatePresence>
          {isChatOpen && (
            <motion.div
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: 340 }}
              exit={{ opacity: 0, width: 0 }}
              className="hidden lg:flex flex-col bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl"
            >
              <div className="p-4 border-b border-slate-800 flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-xs text-white">Live Consultation Chat</h4>
                  <p className="text-[10px] text-slate-400">Encrypted clinical messaging</p>
                </div>
                <button
                  onClick={() => setIsChatOpen(false)}
                  className="text-slate-400 hover:text-white text-xs font-bold"
                >
                  ✕
                </button>
              </div>

              {/* Messages list */}
              <div className="flex-1 p-4 overflow-y-auto space-y-3 text-xs">
                {messages.map((m, idx) => (
                  <div
                    key={idx}
                    className={`flex flex-col ${m.sender === 'patient' ? 'items-end' : 'items-start'}`}
                  >
                    <div
                      className={`max-w-[85%] p-3 rounded-2xl leading-relaxed ${
                        m.sender === 'patient'
                          ? 'bg-[#146C94] text-white rounded-br-xs'
                          : 'bg-slate-800 text-slate-200 rounded-bl-xs'
                      }`}
                    >
                      {m.text}
                    </div>
                    <span className="text-[9px] text-slate-500 mt-1">{m.time}</span>
                  </div>
                ))}
              </div>

              {/* Chat Input */}
              <form onSubmit={handleSendMessage} className="p-3 border-t border-slate-800 flex gap-2">
                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="Type symptoms or notes..."
                  className="flex-1 px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-[#19A7A1]"
                />
                <button
                  type="submit"
                  className="p-2 bg-[#19A7A1] hover:bg-[#148681] text-white rounded-xl transition-colors"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Floating Bottom Call Controls Bar (like this 1.jpg) */}
      <footer className="h-20 bg-slate-900/90 backdrop-blur-md border-t border-slate-800 px-6 flex items-center justify-between z-20">
        <div className="hidden sm:flex items-center gap-2 text-xs text-slate-400">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>HIPAA 256-bit WebRTC Encrypted</span>
        </div>

        {/* Center Control Pills */}
        <div className="flex items-center gap-3 mx-auto">
          {/* Mute button */}
          <button
            onClick={() => setIsMuted(!isMuted)}
            className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all shadow-lg ${
              isMuted ? 'bg-red-500/20 text-red-400 border border-red-500/40' : 'bg-slate-800 hover:bg-slate-700 text-white'
            }`}
            title={isMuted ? 'Unmute Mic' : 'Mute Mic'}
          >
            {isMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
          </button>

          {/* Video button */}
          <button
            onClick={() => setIsVideoOff(!isVideoOff)}
            className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all shadow-lg ${
              isVideoOff ? 'bg-red-500/20 text-red-400 border border-red-500/40' : 'bg-slate-800 hover:bg-slate-700 text-white'
            }`}
            title={isVideoOff ? 'Start Camera' : 'Stop Camera'}
          >
            {isVideoOff ? <VideoOff className="w-5 h-5" /> : <Video className="w-5 h-5" />}
          </button>

          {/* Screen Share button */}
          <button
            onClick={() => setIsScreenSharing(!isScreenSharing)}
            className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all shadow-lg ${
              isScreenSharing ? 'bg-[#19A7A1] text-white shadow-md' : 'bg-slate-800 hover:bg-slate-700 text-white'
            }`}
            title={isScreenSharing ? 'Stop Screen Share' : 'Share Screen'}
          >
            <Share2 className="w-5 h-5" />
          </button>

          {/* End Call button */}
          <button
            onClick={handleEndCall}
            className="px-6 h-12 rounded-2xl bg-[#E05252] hover:bg-red-700 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-red-500/30 transition-transform active:scale-95"
          >
            <PhoneOff className="w-5 h-5" />
            <span>End Call</span>
          </button>

          {/* Chat toggle */}
          <button
            onClick={() => setIsChatOpen(!isChatOpen)}
            className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${
              isChatOpen ? 'bg-[#146C94] text-white shadow-md' : 'bg-slate-800 hover:bg-slate-700 text-white'
            }`}
            title="Toggle Live Chat"
          >
            <MessageSquare className="w-5 h-5" />
          </button>

          {/* AV Settings toggle */}
          <button
            onClick={() => setIsSettingsOpen(!isSettingsOpen)}
            className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${
              isSettingsOpen ? 'bg-slate-700 text-white' : 'bg-slate-800 hover:bg-slate-700 text-white'
            }`}
            title="Audio / Video Settings"
          >
            <Settings className="w-5 h-5" />
          </button>
        </div>

        <div className="hidden sm:flex items-center gap-2">
          <Link to="/patient/records" target="_blank">
            <button className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-300 flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-[#19A7A1]" /> Patient Records
            </button>
          </Link>
        </div>
      </footer>

      {/* End Call Confirmation Modal */}
      {endCallModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl p-6 max-w-sm w-full space-y-4 text-xs">
            <div className="w-12 h-12 rounded-2xl bg-red-500/20 text-red-400 flex items-center justify-center mx-auto mb-2">
              <PhoneOff className="w-6 h-6" />
            </div>
            <div className="text-center">
              <h4 className="font-extrabold text-base text-white">End Consultation Session?</h4>
              <p className="text-slate-400 mt-1 text-xs">
                Your digital prescription, clinical notes, and session summary will be automatically generated and synced to your patient records.
              </p>
            </div>
            <div className="flex items-center gap-2 pt-2">
              <button
                onClick={() => setEndCallModalOpen(false)}
                className="flex-1 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold transition-colors"
              >
                Continue Call
              </button>
              <button
                onClick={handleConfirmEndCall}
                className="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold transition-colors shadow-lg shadow-red-600/30"
              >
                End & Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Settings Modal */}
      {isSettingsOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl p-6 max-w-sm w-full space-y-4 text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h4 className="font-bold text-sm text-white">Audio & Video Settings</h4>
              <button onClick={() => setIsSettingsOpen(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>
            <div>
              <label className="text-slate-400 block mb-1">Microphone Input</label>
              <select className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white">
                <option>Default - Integrated Microphone Array</option>
                <option>Studio USB Condenser Mic</option>
              </select>
            </div>
            <div>
              <label className="text-slate-400 block mb-1">Camera Source</label>
              <select className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white">
                <option>Integrated HD Webcam (1080p, 60fps)</option>
                <option>External Virtual Camera</option>
              </select>
            </div>
            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setIsSettingsOpen(false)}
                className="px-4 py-2 bg-[#146C94] text-white font-bold rounded-xl"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
