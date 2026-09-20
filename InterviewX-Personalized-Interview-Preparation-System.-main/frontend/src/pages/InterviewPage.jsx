import React, { useState, useEffect, useRef, Suspense, useCallback } from 'react';
import axios from 'axios';
import { Mic, MicOff, Send, Star, Loader2, Bot, User, Video, VideoOff, Circle, Volume2, VolumeX, Trophy, Brain, Flame, Smile, Rocket, Angry, Eye, Activity, ChevronRight, Zap, Camera, Sparkles } from 'lucide-react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import { useLocation, useNavigate } from 'react-router-dom';

const PERSONALITIES = [
  { key: 'strict_faang', name: 'Strict FAANG', icon: '🔥', desc: 'Cold, demanding, wants numbers', color: '#dc2626', bg: '#fef2f2' },
  { key: 'friendly_hr', name: 'Friendly HR', icon: '😊', desc: 'Warm, encouraging, supportive', color: '#059669', bg: '#ecfdf5' },
  { key: 'startup_founder', name: 'Startup Founder', icon: '🚀', desc: 'Fast-paced, tests ownership', color: '#7c3aed', bg: '#f5f3ff' },
  { key: 'aggressive_panelist', name: 'Aggressive Panelist', icon: '😤', desc: 'Confrontational, challenges all', color: '#ea580c', bg: '#fff7ed' }
];

const PERSONALITY_COLORS = {
  strict_faang: '#dc2626',
  friendly_hr: '#059669',
  startup_founder: '#7c3aed',
  aggressive_panelist: '#ea580c'
};

// --- 3D Human Interviewer ---
// --- 3D Luffy Interviewer ---
const HumanInterviewer = ({ personalityColor = '#6d28d9' }) => {
  const groupRef = useRef();
  const leftArmRef = useRef();
  const rightArmRef = useRef();
  const leftForearmRef = useRef();
  const rightForearmRef = useRef();
  const headRef = useRef();
  const mouthRef = useRef();
  const browLRef = useRef();
  const browRRef = useRef();

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    // Gentle body sway
    groupRef.current.rotation.y = Math.sin(t * 0.3) * 0.08;
    groupRef.current.position.y = Math.sin(t * 1.5) * 0.02;
    // Head nod / tilt
    headRef.current.rotation.x = Math.sin(t * 0.8) * 0.06;
    headRef.current.rotation.z = Math.sin(t * 0.5) * 0.04;
    
    // Gestures - Luffy holding a mic in his right hand
    // Left arm moves for emphasis
    leftArmRef.current.rotation.x = Math.sin(t * 1.2) * 0.3 - 0.1;
    leftArmRef.current.rotation.z = 0.15 + Math.sin(t * 0.9) * 0.1;
    leftForearmRef.current.rotation.x = Math.sin(t * 1.5 + 1) * 0.4 - 0.3;
    
    // Right arm holds the mic steady but with subtle movement
    rightArmRef.current.rotation.x = -0.8 + Math.sin(t * 0.5) * 0.05;
    rightArmRef.current.rotation.y = -0.3;
    rightArmRef.current.rotation.z = 0.2;
    rightForearmRef.current.rotation.x = -1.0;
    
    // Mouth — open/close for talking effect
    const mouthOpen = (Math.sin(t * 6) > 0.3) ? 0.04 : 0.015;
    mouthRef.current.scale.y = mouthOpen / 0.015;
    mouthRef.current.position.y = -0.12 - (mouthOpen > 0.02 ? 0.01 : 0);
    // Eyebrow raise
    const browRaise = Math.sin(t * 1.0) > 0.7 ? 0.03 : 0;
    browLRef.current.position.y = 0.15 + browRaise;
    browRRef.current.position.y = 0.15 + browRaise;
  });

  const skinColor = '#f4c49a';
  const suitColor = '#1a1a1a'; // Luffy's suit from image
  const vestColor = '#dc2626'; // Red vest
  const shirtColor = '#ffffff';
  const tieColor = '#1a1a1a';
  const hairColor = '#000000'; // Luffy's black hair
  const hatColor = '#fde047'; // Yellow straw hat
  const hatBandColor = '#ef4444'; // Red band

  return (
    <group ref={groupRef} position={[0, -0.3, 0]}>
      {/* Head */}
      <group ref={headRef} position={[0, 1.05, 0]}>
        {/* Skull */}
        <mesh><sphereGeometry args={[0.28, 32, 32]} /><meshStandardMaterial color={skinColor} roughness={0.6} /></mesh>
        
        {/* Luffy's Straw Hat */}
        <group position={[0, 0.2, 0]} rotation={[-0.1, 0, 0]}>
          {/* Brim */}
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.5, 0.5, 0.02, 32]} />
            <meshStandardMaterial color={hatColor} />
          </mesh>
          {/* Crown */}
          <mesh position={[0, 0.1, 0]}>
            <cylinderGeometry args={[0.22, 0.22, 0.2, 32]} />
            <meshStandardMaterial color={hatColor} />
          </mesh>
          {/* Red Band */}
          <mesh position={[0, 0.03, 0]}>
            <cylinderGeometry args={[0.225, 0.225, 0.06, 32]} />
            <meshStandardMaterial color={hatBandColor} />
          </mesh>
        </group>

        {/* Hair */}
        <mesh position={[0, 0.1, -0.05]}>
          <sphereGeometry args={[0.29, 32, 16, 0, Math.PI * 2, 0, Math.PI * 0.55]} />
          <meshStandardMaterial color={hairColor} roughness={0.9} />
        </mesh>
        
        {/* Eyes */}
        <mesh position={[-0.09, 0.04, 0.24]}><sphereGeometry args={[0.035, 16, 16]} /><meshBasicMaterial color="#ffffff" /></mesh>
        <mesh position={[0.09, 0.04, 0.24]}><sphereGeometry args={[0.035, 16, 16]} /><meshBasicMaterial color="#ffffff" /></mesh>
        {/* Pupils */}
        <mesh position={[-0.09, 0.04, 0.275]}><sphereGeometry args={[0.018, 12, 12]} /><meshBasicMaterial color="#000000" /></mesh>
        <mesh position={[0.09, 0.04, 0.275]}><sphereGeometry args={[0.018, 12, 12]} /><meshBasicMaterial color="#000000" /></mesh>
        
        {/* Luffy's Scar under left eye */}
        <mesh position={[0.09, -0.03, 0.26]} rotation={[0, 0, 0.2]}>
          <boxGeometry args={[0.04, 0.005, 0.01]} /><meshBasicMaterial color="#000000" opacity={0.6} transparent />
        </mesh>

        {/* Eyebrows */}
        <mesh ref={browLRef} position={[-0.09, 0.15, 0.25]} rotation={[0, 0, 0.1]}>
          <boxGeometry args={[0.08, 0.015, 0.01]} /><meshStandardMaterial color={hairColor} />
        </mesh>
        <mesh ref={browRRef} position={[0.09, 0.15, 0.25]} rotation={[0, 0, -0.1]}>
          <boxGeometry args={[0.08, 0.015, 0.01]} /><meshStandardMaterial color={hairColor} />
        </mesh>
        {/* Nose */}
        <mesh position={[0, -0.02, 0.27]}><boxGeometry args={[0.03, 0.05, 0.03]} /><meshStandardMaterial color={skinColor} roughness={0.6} /></mesh>
        {/* Mouth */}
        <mesh ref={mouthRef} position={[0, -0.12, 0.25]}>
          <boxGeometry args={[0.1, 0.015, 0.01]} /><meshStandardMaterial color="#c47070" />
        </mesh>
      </group>

      {/* Neck */}
      <mesh position={[0, 0.72, 0]}><cylinderGeometry args={[0.06, 0.07, 0.1, 12]} /><meshStandardMaterial color={skinColor} roughness={0.6} /></mesh>

      {/* Torso / Suit Jacket */}
      <mesh position={[0, 0.35, 0]}>
        <boxGeometry args={[0.55, 0.65, 0.3]} /><meshStandardMaterial color={suitColor} roughness={0.4} metalness={0.1} />
      </mesh>
      {/* Red Vest */}
      <mesh position={[0, 0.35, 0.01]}>
        <boxGeometry args={[0.5, 0.6, 0.3]} /><meshStandardMaterial color={vestColor} />
      </mesh>
      {/* Shirt V */}
      <mesh position={[0, 0.5, 0.161]}>
        <planeGeometry args={[0.15, 0.3]} /><meshStandardMaterial color={shirtColor} />
      </mesh>
      {/* Tie */}
      <mesh position={[0, 0.42, 0.162]}>
        <planeGeometry args={[0.04, 0.3]} /><meshStandardMaterial color={tieColor} />
      </mesh>

      {/* Left Arm (Gesturing) */}
      <group ref={leftArmRef} position={[-0.35, 0.6, 0]}>
        <mesh position={[0, -0.15, 0]}><boxGeometry args={[0.12, 0.3, 0.14]} /><meshStandardMaterial color={suitColor} /></mesh>
        <group ref={leftForearmRef} position={[0, -0.3, 0]}>
          <mesh position={[0, -0.13, 0]}><boxGeometry args={[0.1, 0.26, 0.12]} /><meshStandardMaterial color={shirtColor} /></mesh>
          <mesh position={[0, -0.3, 0]}><sphereGeometry args={[0.055, 12, 12]} /><meshStandardMaterial color={skinColor} /></mesh>
        </group>
      </group>

      {/* Right Arm (Holding Mic) */}
      <group ref={rightArmRef} position={[0.35, 0.6, 0]}>
        <mesh position={[0, -0.15, 0]}><boxGeometry args={[0.12, 0.3, 0.14]} /><meshStandardMaterial color={suitColor} /></mesh>
        <group ref={rightForearmRef} position={[0, -0.3, 0]}>
          <mesh position={[0, -0.13, 0]}><boxGeometry args={[0.1, 0.26, 0.12]} /><meshStandardMaterial color={shirtColor} /></mesh>
          {/* Hand holding mic */}
          <group position={[0, -0.3, 0]}>
            <mesh><sphereGeometry args={[0.055, 12, 12]} /><meshStandardMaterial color={skinColor} /></mesh>
            {/* Microphone */}
            <group position={[0, 0, 0.1]} rotation={[Math.PI / 2, 0, 0]}>
               {/* Stick */}
               <mesh position={[0, 0.15, 0]}>
                 <cylinderGeometry args={[0.02, 0.02, 0.3, 12]} />
                 <meshStandardMaterial color="#333333" />
               </mesh>
               {/* Mic Head */}
               <mesh position={[0, 0.32, 0]}>
                 <sphereGeometry args={[0.06, 16, 16]} />
                 <meshStandardMaterial color="#1a1a1a" metalness={0.8} roughness={0.2} />
               </mesh>
            </group>
          </group>
        </group>
      </group>
    </group>
  );
};

const InterviewerScene = ({ personalityColor }) => (
  <Canvas>
    <PerspectiveCamera makeDefault position={[0, 0.8, 2.5]} />
    <ambientLight intensity={0.6} />
    <pointLight position={[5, 5, 5]} intensity={0.8} />
    <spotLight position={[-3, 5, 5]} angle={0.2} penumbra={1} intensity={0.5} />
    <directionalLight position={[0, 3, 3]} intensity={0.3} />
    <HumanInterviewer personalityColor={personalityColor} />
    <OrbitControls enableZoom={false} target={[0, 0.7, 0]} />
  </Canvas>
);

const ScoreBadge = ({ score }) => {
  const color = score >= 7 ? 'bg-green-100 text-green-700' : score >= 4 ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700';
  return <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-bold ${color}`}><Star className="w-3.5 h-3.5" /> {score}/10</span>;
};

const InterviewPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const initialRole = location.state?.targetRole || 'SDE';
  const initialCompany = location.state?.company || '';

  const [role, setRole] = useState(initialRole);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [answer, setAnswer] = useState('');
  const [evaluation, setEvaluation] = useState(null);
  const [history, setHistory] = useState([]);
  const [loadingQ, setLoadingQ] = useState(false);
  const [loadingE, setLoadingE] = useState(false);
  const [started, setStarted] = useState(false);
  const [questionCount, setQuestionCount] = useState(0);
  const [isMuted, setIsMuted] = useState(false);

  // Personality Mode
  const [selectedPersonality, setSelectedPersonality] = useState(null);
  const [aiResponse, setAiResponse] = useState(null);
  const [loadingAI, setLoadingAI] = useState(false);
  const [activeTab, setActiveTab] = useState('personality'); // 'personality' | 'standard'

  // Video & Body Language
  const [cameraActive, setCameraActive] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const videoRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const [recordedChunks, setRecordedChunks] = useState([]);
  const [videoURL, setVideoURL] = useState(null);
  const [bodyLanguageMetrics, setBodyLanguageMetrics] = useState(null);
  const [blSummary, setBlSummary] = useState(null);
  const [recognition, setRecognition] = useState(null);

  useEffect(() => {
    if ('webkitSpeechRecognition' in window) {
      const sr = new window.webkitSpeechRecognition();
      sr.continuous = true; sr.interimResults = true; sr.lang = 'en-US';
      sr.onresult = (e) => {
        let ft = '';
        for (let i = e.resultIndex; i < e.results.length; ++i) {
          if (e.results[i].isFinal) ft += e.results[i][0].transcript;
        }
        setAnswer(prev => prev + ft);
      };
      sr.onend = () => setIsListening(false);
      setRecognition(sr);
    }
  }, []);

  // Voice settings per personality
  const VOICE_SETTINGS = {
    strict_faang: { rate: 1.1, pitch: 0.85, volume: 1.0 },
    friendly_hr: { rate: 0.95, pitch: 1.15, volume: 0.9 },
    startup_founder: { rate: 1.25, pitch: 1.05, volume: 1.0 },
    aggressive_panelist: { rate: 1.15, pitch: 0.75, volume: 1.0 }
  };

  const speakText = (text, personality = null) => {
    if (isMuted) return;
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    if (personality && VOICE_SETTINGS[personality]) {
      const vs = VOICE_SETTINGS[personality];
      u.rate = vs.rate;
      u.pitch = vs.pitch;
      u.volume = vs.volume;
    } else {
      u.rate = 1.0;
      u.pitch = 1.0;
    }
    window.speechSynthesis.speak(u);
  };

  const speakQuestion = (text) => speakText(text, selectedPersonality);

  const speakAIResponse = (aiData) => {
    if (isMuted || !aiData) return;
    const fullText = `${aiData.reaction} ... ${aiData.reason} ... ${aiData.followup}`;
    speakText(fullText, selectedPersonality);
  };

  const toggleCamera = async () => {
    if (cameraActive) {
      const stream = videoRef.current?.srcObject;
      if (stream) stream.getTracks().forEach(t => t.stop());
      if (videoRef.current) videoRef.current.srcObject = null;
      setCameraActive(false);
    } else {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        videoRef.current.srcObject = stream;
        setCameraActive(true);
      } catch (err) {
        alert("Could not access camera. Please check permissions.");
      }
    }
  };

  const startRecording = () => {
    if (!videoRef.current?.srcObject) return;
    setRecordedChunks([]);
    const mr = new MediaRecorder(videoRef.current.srcObject, { mimeType: 'video/webm;codecs=vp9,opus' });
    mr.ondataavailable = (e) => { if (e.data.size > 0) setRecordedChunks(p => [...p, e.data]); };
    mr.onstop = () => { const blob = new Blob(recordedChunks, { type: 'video/webm' }); setVideoURL(URL.createObjectURL(blob)); };
    mr.start(); mediaRecorderRef.current = mr; setIsRecording(true);
  };

  const stopRecording = () => { if (mediaRecorderRef.current) { mediaRecorderRef.current.stop(); setIsRecording(false); } };
  const toggleListening = () => { if (isListening) recognition.stop(); else { recognition.start(); setIsListening(true); } };

  const getQuestion = async () => {
    if (questionCount >= 8) { 
      // Finalize session
      setLoadingE(true);
      try {
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        localStorage.setItem('interview_history', JSON.stringify(history));
        const res = await axios.post('http://localhost:8000/api/interview/finalize', {
          user_id: user.id,
          qa_history: history
        });
        
        // Update user in localStorage
        const updatedUser = { 
          ...user, 
          readiness_score: res.data.analysis.readiness_score,
          score_history: res.data.analysis.score_history
        };
        localStorage.setItem('user', JSON.stringify(updatedUser));
        
        alert("Interview complete! Analysis updated.");
        navigate('/feedback');
      } catch (err) {
        console.error("Finalization error:", err);
      } finally {
        setLoadingE(false);
      }
      return; 
    }
    setLoadingQ(true); setEvaluation(null); setAiResponse(null); setAnswer('');
    try {
      const res = await axios.post('http://localhost:8000/api/interview/question', { role, context: history.map(h => h.question) });
      setCurrentQuestion(res.data.question); setStarted(true); setQuestionCount(p => p + 1);
      speakQuestion(res.data.question);
    } catch (err) { console.error(err); } finally { setLoadingQ(false); }
  };

  const submitAnswer = async () => {
    if (!answer.trim() || !currentQuestion) return;
    setLoadingE(true); setLoadingAI(true);

    // Get body language summary before submitting
    if (bodyLanguageMetrics?.getSessionSummary) {
      setBlSummary(bodyLanguageMetrics.getSessionSummary());
    }

    try {
      const [evalRes, aiRes] = await Promise.allSettled([
        axios.post('http://localhost:8000/api/interview/evaluate', { question: currentQuestion, user_answer: answer, role }),
        selectedPersonality
          ? axios.post('http://localhost:8000/api/interview/ai-followup', {
              question: currentQuestion, user_answer: answer,
              personality: selectedPersonality, role,
              conversation_history: history.slice(0, 3).map(h => ({ question: h.question, answer: h.answer }))
            })
          : Promise.resolve(null)
      ]);

      if (evalRes.status === 'fulfilled') {
        setEvaluation(evalRes.value.data);
        setHistory(p => [{ question: currentQuestion, answer, evaluation: evalRes.value.data }, ...p]);
      }
      if (aiRes.status === 'fulfilled' && aiRes.value?.data) {
        setAiResponse(aiRes.value.data);
        speakAIResponse(aiRes.value.data);
      }
    } catch (err) { console.error(err); } finally { setLoadingE(false); setLoadingAI(false); }
  };

  const handleBodyLanguageUpdate = useCallback((data) => { setBodyLanguageMetrics(data); }, []);
  const robotColor = selectedPersonality ? (PERSONALITY_COLORS[selectedPersonality] || '#6d28d9') : '#6d28d9';

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">AI Mock Interview</h1>
          <p className="mt-1 text-gray-500 font-medium italic">
            Experience the future of placement with our 3D AI Interviewer
            {initialCompany && <span className="text-purple-600 font-bold"> • Preparing for {initialCompany}</span>}
          </p>
        </div>
        
        {started && (
          <div className="flex-1 max-w-md mx-auto">
            <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-2xl px-4 py-2 flex items-center gap-3 animate-pulse">
              <div className="w-8 h-8 bg-amber-500 rounded-lg flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <div>
                <p className="text-[10px] font-black text-amber-800 uppercase tracking-widest">Adaptive Mode Active</p>
                <p className="text-xs font-bold text-amber-700">AI is adapting questions based on your weaknesses</p>
              </div>
            </div>
          </div>
        )}

        <div className="flex gap-3">
          <button onClick={() => setIsMuted(!isMuted)} className={`p-2.5 rounded-xl border transition-all ${isMuted ? 'bg-red-50 text-red-600' : 'bg-white text-gray-600'}`}>
            {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
          </button>
          <button onClick={toggleCamera} className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold transition-all ${cameraActive ? 'bg-red-50 text-red-600 border-red-200' : 'ts-btn-primary'}`}>
            {cameraActive ? <VideoOff className="w-5 h-5" /> : <Camera className="w-5 h-5" />}
            {cameraActive ? 'Stop Camera' : 'Start Video'}
          </button>
        </div>
      </div>

      {/* Mode Tabs */}
      <div className="interview-mode-tabs">
        <button className={`interview-mode-tab ${activeTab === 'personality' ? 'active' : ''}`} onClick={() => setActiveTab('personality')}>
          <Brain className="w-4 h-4" /> AI Personality Mode
        </button>
        <button className={`interview-mode-tab ${activeTab === 'standard' ? 'active' : ''}`} onClick={() => setActiveTab('standard')}>
          <Bot className="w-4 h-4" /> Standard Interview
        </button>
      </div>

      {/* Floating Video Camera — Top Right */}
      <video ref={videoRef} autoPlay muted playsInline style={{ position: 'fixed', top: '-9999px', left: '-9999px', width: 1, height: 1 }} />
      {cameraActive && (
        <div className="fixed top-20 right-8 z-50 flex flex-col items-end gap-3">
          <div className="w-72 aspect-video bg-black rounded-2xl overflow-hidden shadow-2xl border-4 border-white group relative">
            <video autoPlay muted playsInline ref={el => { if (el && videoRef.current?.srcObject) el.srcObject = videoRef.current.srcObject; }} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
              {!isRecording ? (
                <button onClick={startRecording} className="flex items-center gap-2 px-3 py-1.5 bg-red-600 text-white rounded-lg text-[10px] font-bold">
                  <Circle className="w-2 h-2 fill-current" /> REC
                </button>
              ) : (
                <button onClick={stopRecording} className="flex items-center gap-2 px-3 py-1.5 bg-white text-gray-900 rounded-lg text-[10px] font-bold">
                  <div className="w-2 h-2 bg-gray-900" /> STOP
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Sidebar */}
        <div className="lg:col-span-4 space-y-6">
          <div className="ts-card p-0 overflow-hidden bg-gradient-to-b from-[#0f172a] to-[#1e293b] aspect-square relative shadow-2xl">
            <Suspense fallback={<div className="flex items-center justify-center h-full text-white"><Loader2 className="animate-spin" /></div>}>
              <InterviewerScene personalityColor={robotColor} />
            </Suspense>
            <div className="absolute bottom-4 left-4 right-4 bg-white/10 backdrop-blur-md rounded-xl p-3 border border-white/10">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                <span className="text-[10px] font-bold text-white uppercase tracking-widest">
                  {selectedPersonality ? PERSONALITIES.find(p => p.key === selectedPersonality)?.name : 'AI Agent Active'}
                </span>
              </div>
            </div>
          </div>

          {/* Progress */}
          <div className="ts-card">
            <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2"><Trophy className="w-4 h-4 text-purple-600" /> Interview Progress</h3>
            <div className="space-y-4">
              <div className="flex justify-between text-xs font-bold uppercase tracking-widest text-gray-400"><span>Questions</span><span>{questionCount} / 8</span></div>
              <div className="w-full bg-gray-100 rounded-full h-2">
                <div className="bg-purple-600 h-2 rounded-full transition-all duration-500" style={{ width: `${(questionCount / 8) * 100}%` }} />
              </div>
            </div>
          </div>

          {/* Personality Selector (only in personality mode) */}
          {activeTab === 'personality' && !started && (
            <div className="ts-card">
              <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2"><Brain className="w-4 h-4 text-purple-600" /> Interviewer Personality</h3>
              <div className="space-y-2">
                {PERSONALITIES.map(p => (
                  <button key={p.key} onClick={() => setSelectedPersonality(p.key)}
                    className={`personality-card ${selectedPersonality === p.key ? 'selected' : ''}`}
                    style={selectedPersonality === p.key ? { borderColor: p.color, background: p.bg } : {}}>
                    <span className="text-2xl">{p.icon}</span>
                    <div className="flex-1 text-left">
                      <div className="font-bold text-sm text-gray-800">{p.name}</div>
                      <div className="text-[11px] text-gray-500">{p.desc}</div>
                    </div>
                    {selectedPersonality === p.key && <Zap className="w-4 h-4" style={{ color: p.color }} />}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Main Area */}
        <div className="lg:col-span-8 space-y-6">
          <div className="ts-card min-h-[500px] flex flex-col">
            {!started ? (
              <div className="flex-1 flex flex-col items-center justify-center text-center space-y-6">
                <div className="w-24 h-24 bg-purple-50 rounded-full flex items-center justify-center">
                  {activeTab === 'personality' ? <Brain className="w-12 h-12 text-purple-600" /> : <Bot className="w-12 h-12 text-purple-600" />}
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    {activeTab === 'personality' ? '🧠 AI Personality Interview' : 'Ready to begin?'}
                  </h2>
                  <p className="text-gray-500 mt-2 max-w-sm">
                    {activeTab === 'personality'
                      ? 'Select an interviewer personality, then begin your session. The AI will adapt its tone and pressure.'
                      : 'Our AI agent will conduct a full 8-question interview session for your role.'}
                  </p>
                </div>
                <div className="w-full max-w-xs space-y-4">
                  <select value={role} onChange={(e) => setRole(e.target.value)} className="ts-input text-center font-bold">
                    {['SDE', 'ML Engineer', 'Product Manager', 'Data Scientist', 'Frontend Dev', 'Backend Dev'].map(r => <option key={r} value={r}>{r}</option>)}
                  </select>
                  {activeTab === 'personality' && !selectedPersonality && (
                    <p className="text-xs text-amber-600 font-medium">← Select a personality from the sidebar first</p>
                  )}
                  <button onClick={getQuestion} disabled={activeTab === 'personality' && !selectedPersonality}
                    className="ts-btn-primary w-full py-3 uppercase tracking-widest disabled:opacity-40">
                    {loadingQ ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : 'Initialize Interview'}
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex-1 flex flex-col space-y-6">
                {/* Question */}
                <div className="p-6 bg-purple-50 rounded-2xl border border-purple-100 flex items-start gap-4" style={selectedPersonality ? { borderColor: PERSONALITY_COLORS[selectedPersonality] + '40', background: PERSONALITIES.find(p => p.key === selectedPersonality)?.bg } : {}}>
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: robotColor }}>
                    <Volume2 className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest mb-1" style={{ color: robotColor }}>
                      {selectedPersonality ? PERSONALITIES.find(p => p.key === selectedPersonality)?.name : 'Interviewer'}
                    </p>
                    <p className="text-lg font-bold text-gray-800 leading-snug">{currentQuestion}</p>
                  </div>
                </div>

                {/* Answer Input */}
                <div className="flex-1 relative">
                  <textarea value={answer} onChange={(e) => setAnswer(e.target.value)} rows={8}
                    placeholder="Speak or type your answer here..." className="ts-input h-full resize-none font-medium leading-relaxed" />
                  <div className="absolute bottom-4 right-4 flex gap-2">
                    <button onClick={toggleListening}
                      className={`p-3 rounded-xl transition-all ${isListening ? 'bg-red-500 text-white animate-pulse' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
                      {isListening ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
                    </button>
                    <button onClick={submitAnswer} disabled={!answer.trim() || loadingE}
                      className="flex items-center gap-2 px-8 py-3 bg-[#001f3f] text-white font-bold rounded-xl transition-all disabled:opacity-50">
                      {loadingE ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />} Submit
                    </button>
                  </div>
                </div>

                {/* AI Personality Response */}
                {loadingAI && selectedPersonality && (
                  <div className="ai-response-card" style={{ borderColor: robotColor + '40' }}>
                    <div className="flex items-center gap-3">
                      <Loader2 className="w-5 h-5 animate-spin" style={{ color: robotColor }} />
                      <span className="text-sm font-bold text-gray-500">AI is analyzing your response...</span>
                    </div>
                  </div>
                )}

                {aiResponse && !loadingAI && (
                  <div className="ai-response-card animate-in" style={{ borderColor: robotColor + '40' }}>
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-xl">{aiResponse.personality_icon}</span>
                      <span className="text-xs font-black uppercase tracking-widest" style={{ color: robotColor }}>{aiResponse.personality}</span>
                      <span className="ml-auto text-xs font-bold px-2 py-0.5 rounded-full" style={{ background: robotColor + '15', color: robotColor }}>
                        AI Rating: {aiResponse.ai_rating}/10
                      </span>
                    </div>
                    <p className="text-sm font-semibold text-gray-700 leading-relaxed mb-3">"{aiResponse.reaction}"</p>
                    <div className="mb-3 p-3 rounded-xl bg-blue-50 border border-blue-100">
                      <p className="text-[10px] font-black text-blue-700 uppercase tracking-widest mb-1">Why this follow-up?</p>
                      <p className="text-xs font-bold text-blue-800 leading-relaxed">{aiResponse.reason}</p>
                    </div>
                    <div className="p-3 rounded-xl" style={{ background: robotColor + '08' }}>
                      <p className="text-xs font-bold uppercase tracking-widest mb-1" style={{ color: robotColor }}>Follow-up</p>
                      <p className="text-sm font-bold text-gray-800">"{aiResponse.followup}"</p>
                    </div>
                  </div>
                )}

                {/* Standard Evaluation */}
                {evaluation && (
                  <div className="p-6 bg-gray-50 rounded-2xl border border-gray-100">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-bold text-gray-900">Technical Evaluation</h3>
                      <ScoreBadge score={evaluation.score} />
                    </div>
                    <p className="text-sm text-gray-600 font-medium leading-relaxed">{evaluation.feedback}</p>

                    {/* Body Language Report Removed */}

                    <button onClick={getQuestion} className="mt-4 w-full py-3 bg-white border border-purple-200 text-purple-600 font-bold rounded-xl hover:bg-purple-50 transition-all">
                      Continue to Next Question
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

    </div>
  );
};

export default InterviewPage;
