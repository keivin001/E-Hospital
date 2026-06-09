import React, { useState, useEffect } from 'react';
import ControlButton from '../components/ControlButton';
import AudioVisualizer from '../components/AudioVisualizer';
import { Camera, Mic, MicOff, Video, VideoOff, Phone, MessageSquare, Users, Settings, Monitor, MoreHorizontal, Clock, X, Headphones, Speaker, CircleDot, Hand, LayoutGrid } from 'lucide-react';
import Layout from '../components/Layout';
import { DOCTORS } from '../data/mockData';
import { useApp } from '../context/AppContext';

const formatDuration = (totalSeconds) => {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return [hours, minutes, seconds].map(v => String(v).padStart(2, '0')).join(':');
};

export default function VideoCall() {
  const { user, addToast } = useApp();
  const [callStatus, setCallStatus] = useState('idle'); // idle | calling | connecting | connected | disconnecting
  const [callDuration, setCallDuration] = useState(0);
  const [showChat, setShowChat] = useState(false);
  const [showParticipants, setShowParticipants] = useState(false);
  const [chatMsg, setChatMsg] = useState('');
  const [chatMessages, setChatMessages] = useState([]);
  const [screenShare, setScreenShare] = useState(false);
  const [inCall, setInCall] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [micOn, setMicOn] = useState(true);
  const [camOn, setCamOn] = useState(true);
  const [handRaised, setHandRaised] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [layoutMode, setLayoutMode] = useState('focus'); // focus | grid
  const [showSettings, setShowSettings] = useState(false);

  // Manage call status transitions
  useEffect(() => {
    if (callStatus === 'calling') {
      const timer = setTimeout(() => setCallStatus('connecting'), 1500);
      return () => clearTimeout(timer);
    }
    if (callStatus === 'connecting') {
      const timer = setTimeout(() => setCallStatus('connected'), 800);
      return () => clearTimeout(timer);
    }
  }, [callStatus]);

  // Automated doctor welcome message on connect
  useEffect(() => {
    if (callStatus === 'connected' && inCall && selectedDoctor) {
      const timer = setTimeout(() => {
        setChatMessages(prev => [
          ...prev,
          {
            id: 'doc-welcome',
            sender: 'doctor',
            text: `Hello ${user?.name || 'there'}! I am ${selectedDoctor.name}. How can I assist you today?`,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          }
        ]);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [callStatus, inCall, selectedDoctor, user]);

  // Settings selections
  const [selectedCam, setSelectedCam] = useState('FaceTime HD Camera (Built-in)');
  const [selectedMic, setSelectedMic] = useState('Internal Microphone (Built-in)');
  const [selectedSpk, setSelectedSpk] = useState('Internal Speakers (Built-in)');

  useEffect(() => {
    let interval;
    if (inCall) {
      interval = setInterval(() => setCallDuration(d => d + 1), 1000);
    } else {
      setCallDuration(0);
    }
    return () => clearInterval(interval);
  }, [inCall]);

  const startCall = (doc) => {
    setSelectedDoctor(doc);
    setCallStatus('connected');
    addToast(`Calling ${doc.name}...`, 'default');
    setInCall(true);
  };

  const endCall = () => {
    setCallStatus('disconnecting');
    setTimeout(() => {
      setInCall(false);
      setCallStatus('idle');
      setSelectedDoctor(null);
      setShowChat(false);
      setShowParticipants(false);
      setHandRaised(false);
      setIsRecording(false);
      setScreenShare(false);
      setLayoutMode('focus');
      setChatMessages([]);
      addToast('Call ended', 'default');
    }, 800);
  };

  const sendChatMsg = () => {
    if (!chatMsg.trim()) return;
    setChatMessages(prev => [...prev, { id: Date.now(), sender: 'me', text: chatMsg, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }]);
    setChatMsg('');
    setTimeout(() => {
      setChatMessages(prev => [...prev, { id: Date.now() + 1, sender: 'doctor', text: 'I understand. Let me check your records.', time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }]);
    }, 1500);
  };

  const onlineDoctors = DOCTORS.filter(d => d.online);


  if (inCall) {
    return (
      <Layout title="Video Consultation" fullScreen={true}>
        <style>{`
          .videocall-container {
            display: flex;
            gap: 16px;
            height: calc(100vh - 120px);
            overflow: hidden;
            position: relative;
            background: #0f172a;
            border-radius: var(--radius-xl);
            padding: 16px;
          }
          .video-area {
            flex: 1;
            display: flex;
            flex-direction: column;
            gap: 12px;
            min-width: 0;
            position: relative;
            height: 100%;
          }
          .video-display-wrapper {
            flex: 1;
            position: relative;
            border-radius: var(--radius-xl);
            overflow: hidden;
            background: #0b0f19;
            border: 1px solid rgba(255,255,255,0.05);
            min-height: 300px;
          }
          .focus-layout {
            width: 100%;
            height: 100%;
            position: relative;
          }
          .grid-layout {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 16px;
            padding: 16px;
            height: 100%;
            width: 100%;
          }
          .video-card {
            background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
            border-radius: var(--radius-xl);
            position: relative;
            overflow: hidden;
            display: flex;
            align-items: center;
            justify-content: center;
            height: 100%;
            width: 100%;
            border: 1px solid rgba(255, 255, 255, 0.05);
          }
          .self-pip-container {
            position: absolute;
            bottom: 16px;
            right: 16px;
            width: 160px;
            height: 110px;
            background: linear-gradient(135deg, #1d4ed8, #7c3aed);
            border-radius: var(--radius-lg);
            border: 2px solid rgba(255,255,255,0.25);
            display: flex;
            align-items: center;
            justify-content: center;
            overflow: hidden;
            box-shadow: var(--shadow-lg);
            z-index: 10;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          }
          .self-pip-container.cam-off {
            background: #374151;
          }
          .call-controls-bar {
            background: rgba(15, 23, 42, 0.85);
            backdrop-filter: blur(12px);
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: var(--radius-full);
            padding: 10px 24px;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 12px;
            margin: 0 auto;
            width: max-content;
            max-width: 95%;
            box-shadow: var(--shadow-xl);
            z-index: 100;
          }
          .drawers-container {
            display: flex;
            flex-direction: column;
            gap: 12px;
            width: 320px;
            flex-shrink: 0;
            height: 100%;
          }
          .drawer-card {
            background: #1e293b;
            border-radius: var(--radius-xl);
            border: 1px solid rgba(255,255,255,0.08);
            display: flex;
            flex-direction: column;
            overflow: hidden;
            flex: 1;
            height: 100%;
            color: #f1f5f9;
          }
          .drawer-header {
            padding: 16px;
            border-bottom: 1px solid rgba(255, 255, 255, 0.08);
            display: flex;
            align-items: center;
            justify-content: space-between;
            font-weight: 700;
            font-size: 0.95rem;
          }
          .drawer-body {
            flex: 1;
            overflow-y: auto;
            padding: 16px;
            display: flex;
            flex-direction: column;
            gap: 12px;
          }
          .drawer-footer {
            padding: 12px;
            border-top: 1px solid rgba(255, 255, 255, 0.08);
            display: flex;
            gap: 8px;
          }
          .chat-bubble {
            max-width: 80%;
            padding: 8px 12px;
            border-radius: 12px;
            font-size: 0.825rem;
            line-height: 1.4;
            box-shadow: var(--shadow-sm);
            margin-bottom: 8px;
          }
          .chat-bubble.me {
            background: var(--primary);
            color: white;
            align-self: flex-end;
            border-bottom-right-radius: 2px;
          }
          .chat-bubble.doctor {
            background: rgba(255, 255, 255, 0.08);
            color: #f1f5f9;
            align-self: flex-start;
            border-bottom-left-radius: 2px;
            border: 1px solid rgba(255, 255, 255, 0.05);
          }
          .participant-row {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 10px 12px;
            background: rgba(255,255,255,0.03);
            border-radius: var(--radius-lg);
            border: 1px solid rgba(255,255,255,0.02);
          }

          @media (max-width: 900px) {
            .videocall-container {
              flex-direction: column;
              height: calc(100vh - 120px);
              overflow-y: auto;
            }
            .drawers-container {
              width: 100%;
              height: 320px;
              margin-top: 12px;
            }
            .grid-layout {
              grid-template-columns: 1fr;
              grid-template-rows: 1fr 1fr;
              padding: 8px;
              gap: 8px;
            }
            .self-pip-container {
              width: 120px;
              height: 85px;
              bottom: 8px;
              right: 8px;
            }
            .call-controls-bar {
              padding: 8px 16px;
              gap: 8px;
            }
            .call-control-btn {
              width: 42px;
              height: 42px;
            }
          }
        `}</style>

        <div className="videocall-container">
          {/* Main video area */}
          <div className="video-area">
            <div className="video-display-wrapper">
              {layoutMode === 'focus' ? (
                <div className="focus-layout">
                  {/* Doctor Video Frame */}
                  <div className="video-card">
                    {screenShare && (
                      <div style={{ position: 'absolute', inset: 0, background: 'rgba(14, 165, 233, 0.95)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'white', zIndex: 10, padding: '20px', textAlign: 'center' }}>
                        <Monitor size={48} className="animate-pulse" style={{ marginBottom: '16px' }} />
                        <div style={{ fontWeight: 800, fontSize: '1.2rem', marginBottom: '4px' }}>Sharing Your Screen</div>
                        <div style={{ fontSize: '0.85rem', opacity: 0.85, marginBottom: '16px' }}>Other participants can see everything on your screen</div>
                        <button className="btn btn-danger btn-sm" style={{ background: 'white', color: 'var(--danger)', fontWeight: 'bold' }} onClick={() => setScreenShare(false)}>
                          Stop Sharing
                        </button>
                      </div>
                    )}
                    <div style={{ textAlign: 'center', color: 'white' }}>
                      <div className="avatar avatar-xl" style={{ margin: '0 auto 16px', background: 'rgba(255,255,255,0.1)', color: 'white', fontSize: '2rem', width: '100px', height: '100px' }}>
                        {selectedDoctor.initials}
                      </div>
                      <div style={{ fontWeight: 700, fontSize: '1.2rem', marginBottom: '4px' }}>{selectedDoctor.name}</div>
                      <div style={{ opacity: 0.7, fontSize: '0.875rem' }}>{selectedDoctor.specialty}</div>
                      <div style={{ marginTop: '12px', display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'center', opacity: 0.7 }}>
                        <span style={{ fontSize: '0.8rem' }}>Doctor (Host)</span>
                        <AudioVisualizer isActive={true} />
                      </div>
                    </div>

                    {/* Floating duration details */}
                    <div style={{ position: 'absolute', top: '16px', left: '16px', background: 'rgba(15, 23, 42, 0.6)', color: 'white', padding: '6px 12px', borderRadius: 'var(--radius-full)', fontSize: '0.8rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px', backdropFilter: 'blur(4px)' }}>
                      <Clock size={13} />
                      {formatDuration(callDuration)}
                    </div>

                    {/* Recording status overlay */}
                    {isRecording && (
                      <div style={{ position: 'absolute', top: '16px', right: '16px', background: 'rgba(239, 68, 68, 0.85)', color: 'white', padding: '6px 12px', borderRadius: 'var(--radius-full)', fontSize: '0.75rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <CircleDot size={12} className="animate-pulse" />
                        REC
                      </div>
                    )}

                    {/* Self video PIP frame */}
                    <div className={`self-pip-container ${!camOn ? 'cam-off' : ''}`}>
                      {camOn ? (
                        <div style={{ textAlign: 'center', color: 'white' }}>
                          <div className="avatar avatar-sm" style={{ margin: '0 auto 4px', background: 'rgba(255,255,255,0.2)', color: 'white' }}>{user?.initials || 'U'}</div>
                          <div style={{ fontSize: '0.65rem', opacity: 0.8, display: 'flex', alignItems: 'center', gap: '4px', justifyContent: 'center' }}>
                            <span>You</span>
                            {handRaised && <Hand size={10} style={{ color: '#f59e0b' }} />}
                            {!micOn && <MicOff size={10} style={{ color: 'var(--danger)' }} />}
                          </div>
                          {micOn && <div style={{ display: 'flex', justifyContent: 'center', marginTop: '2px' }}><AudioVisualizer isActive={true} /></div>}
                        </div>
                      ) : (
                        <div style={{ textAlign: 'center', color: 'rgba(255,255,255,0.5)' }}>
                          <VideoOff size={20} />
                          <div style={{ fontSize: '0.65rem', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '4px', justifyContent: 'center' }}>
                            <span>Camera off</span>
                            {handRaised && <Hand size={10} style={{ color: '#f59e0b' }} />}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="grid-layout">
                  {/* Doctor Video Frame */}
                  <div className="video-card">
                    <div style={{ textAlign: 'center', color: 'white' }}>
                      <div className="avatar avatar-xl" style={{ margin: '0 auto 16px', background: 'rgba(255,255,255,0.1)', color: 'white', fontSize: '2rem', width: '100px', height: '100px' }}>
                        {selectedDoctor.initials}
                      </div>
                      <div style={{ fontWeight: 700, fontSize: '1.2rem', marginBottom: '4px' }}>{selectedDoctor.name}</div>
                      <div style={{ opacity: 0.7, fontSize: '0.875rem' }}>{selectedDoctor.specialty}</div>
                      <div style={{ marginTop: '12px', display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'center', opacity: 0.7 }}>
                        <span style={{ fontSize: '0.8rem' }}>Doctor (Host)</span>
                        <AudioVisualizer isActive={true} />
                      </div>
                    </div>

                    <div style={{ position: 'absolute', top: '16px', left: '16px', background: 'rgba(15, 23, 42, 0.6)', color: 'white', padding: '6px 12px', borderRadius: 'var(--radius-full)', fontSize: '0.8rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px', backdropFilter: 'blur(4px)' }}>
                      <Clock size={13} />
                      {formatDuration(callDuration)}
                    </div>

                    {isRecording && (
                      <div style={{ position: 'absolute', top: '16px', right: '16px', background: 'rgba(239, 68, 68, 0.85)', color: 'white', padding: '6px 12px', borderRadius: 'var(--radius-full)', fontSize: '0.75rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <CircleDot size={12} className="animate-pulse" />
                        REC
                      </div>
                    )}
                  </div>

                  {/* Patient Video Frame */}
                  <div className="video-card">
                    {screenShare && (
                      <div style={{ position: 'absolute', inset: 0, background: 'rgba(14, 165, 233, 0.95)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'white', zIndex: 10, padding: '20px', textAlign: 'center' }}>
                        <Monitor size={48} className="animate-pulse" style={{ marginBottom: '16px' }} />
                        <div style={{ fontWeight: 800, fontSize: '1.2rem', marginBottom: '4px' }}>Sharing Your Screen</div>
                        <button className="btn btn-danger btn-sm" style={{ background: 'white', color: 'var(--danger)', fontWeight: 'bold' }} onClick={() => setScreenShare(false)}>
                          Stop Sharing
                        </button>
                      </div>
                    )}
                    {camOn ? (
                      <div style={{ textAlign: 'center', color: 'white' }}>
                        <div className="avatar avatar-xl" style={{ margin: '0 auto 16px', background: 'rgba(255,255,255,0.1)', color: 'white', fontSize: '2rem', width: '100px', height: '100px' }}>
                          {user?.initials || 'U'}
                        </div>
                        <div style={{ fontWeight: 700, fontSize: '1.2rem', marginBottom: '4px' }}>{user?.name || 'You'}</div>
                        <div style={{ opacity: 0.7, fontSize: '0.875rem' }}>Patient</div>
                        <div style={{ marginTop: '12px', display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'center', opacity: 0.7 }}>
                          <span style={{ fontSize: '0.8rem' }}>You</span>
                          {micOn ? <AudioVisualizer isActive={true} /> : <span style={{ color: 'var(--danger)', fontSize: '0.75rem' }}>(Muted)</span>}
                        </div>
                      </div>
                    ) : (
                      <div style={{ textAlign: 'center', color: 'rgba(255,255,255,0.5)' }}>
                        <VideoOff size={48} style={{ marginBottom: '16px' }} />
                        <div style={{ fontWeight: 700, fontSize: '1.2rem', marginBottom: '4px' }}>{user?.name || 'You'}</div>
                        <div style={{ opacity: 0.7, fontSize: '0.875rem' }}>Camera Stopped</div>
                      </div>
                    )}

                    {handRaised && (
                      <div style={{ position: 'absolute', top: '16px', right: '16px', background: '#f59e0b', color: 'white', padding: '6px 12px', borderRadius: 'var(--radius-full)', fontSize: '0.75rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <Hand size={12} />
                        Hand Raised
                      </div>
                    )}

                    {!micOn && (
                      <div style={{ position: 'absolute', top: '16px', left: '16px', background: 'rgba(239, 68, 68, 0.85)', color: 'white', padding: '6px 12px', borderRadius: 'var(--radius-full)', fontSize: '0.75rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <MicOff size={12} />
                        Muted
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Controls overlay bar */}
            <div className="call-controls-bar">
              <button
                className={`call-control-btn ${!micOn ? 'btn-danger' : ''}`}
                title={micOn ? 'Mute Microphone' : 'Unmute Microphone'}
                onClick={() => {
                  setMicOn(!micOn);
                  addToast(micOn ? 'Microphone muted' : 'Microphone unmuted', 'default');
                }}
              >
                {micOn ? <Mic size={20} /> : <MicOff size={20} />}
              </button>

              <button
                className={`call-control-btn ${!camOn ? 'btn-danger' : ''}`}
                title={camOn ? 'Stop Camera' : 'Start Camera'}
                onClick={() => {
                  setCamOn(!camOn);
                  addToast(camOn ? 'Camera stopped' : 'Camera started', 'default');
                }}
              >
                {camOn ? <Video size={20} /> : <VideoOff size={20} />}
              </button>

              <button
                className={`call-control-btn ${screenShare ? 'btn-active' : ''}`}
                title={screenShare ? 'Stop screen sharing' : 'Share screen'}
                onClick={() => {
                  setScreenShare(!screenShare);
                  addToast(screenShare ? 'Stopped screen sharing' : 'Sharing your screen...', 'default');
                }}
              >
                <Monitor size={20} />
              </button>

              <button
                className={`call-control-btn ${handRaised ? 'btn-active btn-warning' : ''}`}
                title={handRaised ? 'Lower Hand' : 'Raise Hand'}
                onClick={() => {
                  setHandRaised(!handRaised);
                  addToast(handRaised ? 'Hand lowered' : 'Hand raised', 'default');
                }}
              >
                <Hand size={20} />
              </button>

              <button
                className={`call-control-btn ${isRecording ? 'btn-active btn-danger' : ''}`}
                title={isRecording ? 'Stop recording' : 'Record call'}
                onClick={() => {
                  setIsRecording(!isRecording);
                  addToast(isRecording ? 'Recording saved to dashboard' : 'Recording started', isRecording ? 'success' : 'default');
                }}
              >
                <CircleDot size={20} className={isRecording ? 'animate-pulse' : ''} />
              </button>

              <button
                className={`call-control-btn ${layoutMode === 'grid' ? 'btn-active' : ''}`}
                title="Switch layout"
                onClick={() => {
                  const mode = layoutMode === 'focus' ? 'grid' : 'focus';
                  setLayoutMode(mode);
                  addToast(`Switched layout to ${mode}`, 'default');
                }}
              >
                <LayoutGrid size={20} />
              </button>

              <button
                className={`call-control-btn ${showParticipants ? 'btn-active' : ''}`}
                title="Participants list"
                onClick={() => setShowParticipants(!showParticipants)}
              >
                <Users size={20} />
              </button>

              <button
                className={`call-control-btn ${showChat ? 'btn-active' : ''}`}
                title="In-call chat"
                onClick={() => setShowChat(!showChat)}
              >
                <MessageSquare size={20} />
              </button>

              <button
                className="call-control-btn"
                title="Call settings"
                onClick={() => setShowSettings(true)}
              >
                <Settings size={20} />
              </button>

              <div style={{ width: '1px', height: '24px', background: 'rgba(255,255,255,0.15)', margin: '0 4px' }} />

              <button
                className="call-control-btn btn-danger"
                title="End call"
                onClick={endCall}
              >
                <Phone size={20} style={{ transform: 'rotate(135deg)' }} />
              </button>
            </div>
          </div>

          {/* Right Drawers */}
          {(showChat || showParticipants) && (
            <div className="drawers-container">
              {showParticipants && (
                <div className="drawer-card">
                  <div className="drawer-header">
                    <span>Participants (2)</span>
                    <button className="btn btn-ghost btn-sm btn-circle" onClick={() => setShowParticipants(false)}>
                      <X size={14} style={{ color: 'white' }} />
                    </button>
                  </div>
                  <div className="drawer-body">
                    {/* Doctor host row */}
                    <div className="participant-row">
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div className="avatar avatar-sm">{selectedDoctor.initials}</div>
                        <div>
                          <div style={{ fontWeight: 600, fontSize: '0.85rem' }}>{selectedDoctor.name}</div>
                          <div style={{ fontSize: '0.7rem', color: '#94a3b8' }}>Doctor (Host)</div>
                        </div>
                      </div>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <Mic size={14} style={{ color: '#10b981' }} />
                        <Video size={14} style={{ color: '#10b981' }} />
                      </div>
                    </div>

                    {/* Patient row */}
                    <div className="participant-row">
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div className="avatar avatar-sm">{user?.initials || 'U'}</div>
                        <div>
                          <div style={{ fontWeight: 600, fontSize: '0.85rem' }}>{user?.name || 'You'}</div>
                          <div style={{ fontSize: '0.7rem', color: '#94a3b8' }}>Patient</div>
                        </div>
                      </div>
                      <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                        {handRaised && <Hand size={14} style={{ color: '#f59e0b' }} />}
                        {micOn ? <Mic size={14} style={{ color: '#10b981' }} /> : <MicOff size={14} style={{ color: '#ef4444' }} />}
                        {camOn ? <Video size={14} style={{ color: '#10b981' }} /> : <VideoOff size={14} style={{ color: '#ef4444' }} />}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {showChat && (
                <div className="drawer-card">
                  <div className="drawer-header">
                    <span>In-call Chat</span>
                    <button className="btn btn-ghost btn-sm btn-circle" onClick={() => setShowChat(false)}>
                      <X size={14} style={{ color: 'white' }} />
                    </button>
                  </div>
                  <div className="drawer-body" style={{ background: '#111827' }}>
                    {chatMessages.length === 0 && (
                      <div style={{ textAlign: 'center', color: '#6b7280', fontSize: '0.8rem', marginTop: '20px' }}>
                        No messages yet. Start chatting!
                      </div>
                    )}
                    {chatMessages.map(m => (
                      <div key={m.id} className={`chat-bubble ${m.sender === 'me' ? 'me' : 'doctor'}`}>
                        <div style={{ fontWeight: 600, fontSize: '0.7rem', opacity: 0.8, marginBottom: '2px' }}>
                          {m.sender === 'me' ? 'You' : selectedDoctor.name}
                        </div>
                        <div>{m.text}</div>
                        <div style={{ fontSize: '0.6rem', opacity: 0.5, marginTop: '4px', textAlign: 'right' }}>{m.time}</div>
                      </div>
                    ))}
                  </div>
                  <div className="drawer-footer">
                    <input
                      className="form-input"
                      style={{ flex: 1, padding: '8px 12px', fontSize: '0.8rem', background: '#374151', color: 'white', border: '1px solid rgba(255,255,255,0.1)' }}
                      placeholder="Type a message..."
                      value={chatMsg}
                      onChange={e => setChatMsg(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && sendChatMsg()}
                    />
                    <button onClick={sendChatMsg} className="btn btn-primary btn-sm" style={{ padding: '8px 12px' }}>
                      <MessageSquare size={14} />
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
        {showSettings && (
          <div className="modal-overlay" onClick={() => setShowSettings(false)}>
            <div className="modal-glass" onClick={e => e.stopPropagation()}>
              <div className="modal-header">
                <h3 className="font-bold text-lg" style={{ color: 'var(--gray-900)' }}>Call Settings</h3>
                <button className="btn btn-ghost btn-sm btn-circle" onClick={() => setShowSettings(false)}>
                  <X size={16} />
                </button>
              </div>
              <div className="modal-body">
                <div className="form-group mb-4">
                  <label className="form-label flex items-center gap-2">
                    <Camera size={16} /> Camera (Video Input)
                  </label>
                  <select className="form-select" value={selectedCam} onChange={e => setSelectedCam(e.target.value)}>
                    {['FaceTime HD Camera (Built-in)', 'OBS Virtual Camera', 'Logitech StreamCam'].map(cam => (
                      <option key={cam} value={cam}>{cam}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group mb-4">
                  <label className="form-label flex items-center gap-2">
                    <Mic size={16} /> Microphone (Audio Input)
                  </label>
                  <select className="form-select" value={selectedMic} onChange={e => setSelectedMic(e.target.value)}>
                    {['Internal Microphone (Built-in)', 'External USB Microphone', 'Yeti Stereo Microphone'].map(mic => (
                      <option key={mic} value={mic}>{mic}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group mb-4">
                  <label className="form-label flex items-center gap-2">
                    <Headphones size={16} /> Speakers (Audio Output)
                  </label>
                  <select className="form-select" value={selectedSpk} onChange={e => setSelectedSpk(e.target.value)}>
                    {['Internal Speakers (Built-in)', 'Headphones (Bluetooth Audio)', 'External Stereo Jack'].map(spk => (
                      <option key={spk} value={spk}>{spk}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group flex items-center justify-between mb-2">
                  <label className="form-label flex items-center gap-2 mb-0">
                    <Speaker size={16} /> Test audio output settings
                  </label>
                  <button className="btn btn-outline btn-sm" onClick={() => addToast('🔊 Playing test sound via ' + selectedSpk + '...', 'default')}>
                    Test Sound
                  </button>
                </div>
              </div>
              <div className="modal-footer">
                <button className="btn btn-ghost" onClick={() => setShowSettings(false)}>Cancel</button>
                <button className="btn btn-primary" onClick={() => { setShowSettings(false); addToast('Call settings saved successfully!', 'success'); }}>
                  Save Preferences
                </button>
              </div>
            </div>
          </div>
        )}
      </Layout>
    );
  }

  return (
    <Layout title="Video Consultation">
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <div style={{ width: '64px', height: '64px', background: 'var(--primary-light)', borderRadius: 'var(--radius-xl)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 14px' }}>
            <Video size={28} color="var(--primary)" />
          </div>
          <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--gray-900)', marginBottom: '8px' }}>Video Consultation</h2>
          <p style={{ color: 'var(--gray-500)', fontSize: '0.9rem' }}>Connect face-to-face with your doctor from anywhere</p>
        </div>

        {/* Features */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '12px', marginBottom: '28px' }}>
          {[
            { icon: '🔒', title: 'Encrypted', desc: 'End-to-end encrypted' },
            { icon: '📱', title: 'HD Quality', desc: 'Crystal clear video' },
            { icon: '💊', title: 'Prescription', desc: 'Get prescriptions' },
          ].map(f => (
            <div key={f.title} style={{ textAlign: 'center', padding: '16px', background: 'white', borderRadius: 'var(--radius-lg)', border: '1px solid var(--gray-200)' }}>
              <div style={{ fontSize: '1.5rem', marginBottom: '6px' }}>{f.icon}</div>
              <div style={{ fontWeight: 700, color: 'var(--gray-900)', fontSize: '0.85rem', marginBottom: '2px' }}>{f.title}</div>
              <div style={{ fontSize: '0.7rem', color: 'var(--gray-400)' }}>{f.desc}</div>
            </div>
          ))}
        </div>

        {/* Available doctors */}
        <div className="card" style={{ padding: '20px' }}>
          <h3 style={{ fontWeight: 700, marginBottom: '14px', color: 'var(--gray-900)', fontSize: '1rem' }}>
            Available for Video Call
            <span className="badge badge-success" style={{ marginLeft: '10px' }}>{onlineDoctors.length} online</span>
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {onlineDoctors.map(doc => (
              <div key={doc.id} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', borderRadius: 'var(--radius-lg)', border: '1px solid var(--gray-200)', background: 'var(--gray-50)', flexWrap: 'wrap' }}>
                <div style={{ position: 'relative', flexShrink: 0 }}>
                  <div className="avatar avatar-md">{doc.initials}</div>
                  <div className="status-dot status-online" style={{ position: 'absolute', bottom: '2px', right: '2px', border: '2px solid white' }} />
                </div>
                <div style={{ flex: 1, minWidth: '150px' }}>
                  <div style={{ fontWeight: 700, color: 'var(--gray-900)', fontSize: '0.9rem' }}>{doc.name}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--primary)', fontWeight: 600 }}>{doc.specialty}</div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--gray-400)', marginTop: '2px' }}>{doc.hospital}</div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexShrink: 0 }}>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontWeight: 700, color: 'var(--primary)', fontSize: '0.9rem' }}>${doc.fee}</div>
                  </div>
                  <button type="button" className="btn btn-primary btn-sm" onClick={() => startCall(doc)} style={{ whiteSpace: 'nowrap', position: 'relative', zIndex: 10, cursor: 'pointer' }}>
                    <Video size={14} /> Start Call
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      {showSettings && (
        <div className="modal-overlay" onClick={() => setShowSettings(false)}>
          <div className="modal-glass" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="font-bold text-lg" style={{ color: 'var(--gray-900)' }}>Call Settings</h3>
              <button className="btn btn-ghost btn-sm btn-circle" onClick={() => setShowSettings(false)}>
                <X size={16} />
              </button>
            </div>
            <div className="modal-body">
              <div className="form-group mb-4">
                <label className="form-label flex items-center gap-2">
                  <Camera size={16} /> Camera (Video Input)
                </label>
                <select className="form-select" value={selectedCam} onChange={e => setSelectedCam(e.target.value)}>
                  {['FaceTime HD Camera (Built-in)', 'OBS Virtual Camera', 'Logitech StreamCam'].map(cam => (
                    <option key={cam} value={cam}>{cam}</option>
                  ))}
                </select>
              </div>
              <div className="form-group mb-4">
                <label className="form-label flex items-center gap-2">
                  <Mic size={16} /> Microphone (Audio Input)
                </label>
                <select className="form-select" value={selectedMic} onChange={e => setSelectedMic(e.target.value)}>
                  {['Internal Microphone (Built-in)', 'External USB Microphone', 'Yeti Stereo Microphone'].map(mic => (
                    <option key={mic} value={mic}>{mic}</option>
                  ))}
                </select>
              </div>
              <div className="form-group mb-4">
                <label className="form-label flex items-center gap-2">
                  <Headphones size={16} /> Speakers (Audio Output)
                </label>
                <select className="form-select" value={selectedSpk} onChange={e => setSelectedSpk(e.target.value)}>
                  {['Internal Speakers (Built-in)', 'Headphones (Bluetooth Audio)', 'External Stereo Jack'].map(spk => (
                    <option key={spk} value={spk}>{spk}</option>
                  ))}
                </select>
              </div>
              <div className="form-group flex items-center justify-between mb-2">
                <label className="form-label flex items-center gap-2 mb-0">
                  <Speaker size={16} /> Test audio output settings
                </label>
                <button className="btn btn-outline btn-sm" onClick={() => addToast('🔊 Playing test sound via ' + selectedSpk + '...', 'default')}>
                  Test Sound
                </button>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-ghost" onClick={() => setShowSettings(false)}>Cancel</button>
              <button className="btn btn-primary" onClick={() => { setShowSettings(false); addToast('Call settings saved successfully!', 'success'); }}>
                Save Preferences
              </button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}
