import { useState, useRef, useEffect } from 'react';
import {
  Send, Paperclip, Phone, Video, MoreVertical, Search,
  Image, Smile, ArrowLeft, CheckCheck, Check,
  BellOff, Bell, Ban, ShieldOff, X, Info, FileText,
} from 'lucide-react';
import Layout from '../components/Layout';
import { useApp } from '../context/AppContext';

/* ── Emoji categories ──────────────────────── */
const EMOJI_CATS = [
  { label: 'Smileys', emojis: ['😊','😂','🤣','😍','🥰','😘','😁','😄','😃','😀','😆','🤩','😎','🥳','😇','🙂','😉','😏','🤗','😌','😋','🤭','🤔','😐','😑','😶','🤫','😔','😒','🙁','😣','😖','😫','😩','😢','😭','😤'] },
  { label: 'Medical',  emojis: ['🏥','💊','💉','🩺','🩹','🩻','🧬','🔬','🩸','❤️','🫀','🫁','🧠','🤒','🤕','🤧','🤢','💪','🧘','✅','⚕️','🏃','🚶'] },
  { label: 'Gestures', emojis: ['👍','👎','👏','🙌','🤝','🙏','👌','✌️','🤞','🤙','💪','👋','☝️','👆','👇','👉','👈','🫶','❤️','💙','💚','💛','🧡','💜'] },
  { label: 'Objects',  emojis: ['📅','📋','📝','📌','📎','📁','📊','📈','💻','📱','☎️','⏰','🔔','🔕','💬','💭','📨','📩','🏆','⭐','✅','❌','⚠️'] },
];

const QUICK_REPLIES = [
  'I understand, thank you Doctor.',
  'I have been taking the medication.',
  'The symptoms are getting better.',
  'Should I visit in person?',
];

export default function Chat() {
  const {
    user, conversations, setConversations,
    messagesByConv, setMessagesByConv, addToast,
  } = useApp();

  const [activeConvId,  setActiveConvId]  = useState(conversations[0]?.id || null);
  const [input,         setInput]         = useState('');
  const [search,        setSearch]        = useState('');
  const [mobileView,    setMobileView]    = useState('list');
  const [showInfo,      setShowInfo]      = useState(false);
  const [showDropdown,  setShowDropdown]  = useState(false);
  const [showQuick,     setShowQuick]     = useState(false);
  const [showEmoji,     setShowEmoji]     = useState(false);
  const [emojiCat,      setEmojiCat]      = useState(0);
  const [attachments,   setAttachments]   = useState([]);

  const messagesEndRef = useRef(null);
  const inputRef       = useRef(null);
  const dropdownRef    = useRef(null);
  const emojiRef       = useRef(null);
  const fileInputRef   = useRef(null);
  const imageInputRef  = useRef(null);

  const activeConv = conversations.find(c => c.id === activeConvId) || conversations[0];
  const messages   = activeConv ? (messagesByConv[activeConv.id] || []) : [];

  /* Auto-scroll */
  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  /* Mark read */
  useEffect(() => {
    if (!activeConvId || !activeConv || activeConv.unread <= 0) return;
    setConversations(p => p.map(c => c.id === activeConvId ? { ...c, unread: 0 } : c));
    if (messagesByConv[activeConvId]) {
      setMessagesByConv(p => ({ ...p, [activeConvId]: p[activeConvId].map(m => ({ ...m, read: true })) }));
    }
  }, [activeConvId]);

  /* Close overlays on outside click */
  useEffect(() => {
    const handler = e => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setShowDropdown(false);
      if (emojiRef.current && !emojiRef.current.contains(e.target)) setShowEmoji(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  /* Insert emoji at cursor */
  const insertEmoji = emoji => {
    const el = inputRef.current;
    if (!el) { setInput(v => v + emoji); return; }
    const s = el.selectionStart ?? input.length;
    const e = el.selectionEnd   ?? input.length;
    const next = input.slice(0, s) + emoji + input.slice(e);
    setInput(next);
    requestAnimationFrame(() => { el.focus(); el.setSelectionRange(s + emoji.length, s + emoji.length); });
  };

  /* File handler */
  const handleFile = e => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    setAttachments(p => [...p, ...files.map(f => ({
      id: `att-${Date.now()}-${Math.random()}`,
      type: f.type.startsWith('image/') ? 'image' : 'file',
      name: f.name, size: (f.size / 1024).toFixed(1) + ' KB',
      url: f.type.startsWith('image/') ? URL.createObjectURL(f) : null,
    }))]);
    addToast(`${files.length} file${files.length > 1 ? 's' : ''} attached`, 'success');
    e.target.value = '';
  };

  /* Send message */
  const sendMessage = (text = input) => {
    const t = text.trim();
    const hasAtt = attachments.length > 0;
    if (!t && !hasAtt) return;
    if (!activeConv || activeConv.blocked) return;
    const msg = {
      id: `m${Date.now()}`, sender: 'patient', name: user?.name || 'You',
      text: t || (hasAtt ? `📎 ${attachments.length} attachment${attachments.length > 1 ? 's' : ''}` : ''),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      read: true, attachments: hasAtt ? [...attachments] : undefined,
    };
    setMessagesByConv(p => ({ ...p, [activeConv.id]: [...(p[activeConv.id] || []), msg] }));
    setConversations(p => p.map(c => c.id === activeConv.id ? { ...c, lastMessage: msg.text, lastTime: 'Just now' } : c));
    setInput(''); setAttachments([]); setShowQuick(false); setShowEmoji(false);
    inputRef.current?.focus();
    /* Simulate reply */
    setTimeout(() => {
      const replies = [
        'I understand. Let me check your file and get back to you.',
        'Thank you for the update. I\'ll review your information.',
        'Noted. Please continue the medication and rest well.',
        'I see. Can you describe the symptom in more detail?',
      ];
      const reply = {
        id: `m${Date.now() + 1}`, sender: 'doctor', name: activeConv.name,
        text: replies[Math.floor(Math.random() * replies.length)],
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), read: false,
      };
      setMessagesByConv(p => ({ ...p, [activeConv.id]: [...(p[activeConv.id] || []), reply] }));
      setConversations(p => p.map(c => c.id === activeConv.id
        ? { ...c, lastMessage: reply.text, lastTime: 'Just now', unread: activeConvId === c.id ? 0 : (c.unread || 0) + 1 } : c));
    }, 1400 + Math.random() * 600);
  };

  const handleKeyDown = e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); } };

  const toggleMute    = id => { const c = conversations.find(x => x.id === id); setConversations(p => p.map(x => x.id === id ? { ...x, muted: !x.muted } : x)); addToast(c?.muted ? 'Unmuted' : 'Muted', 'default'); setShowDropdown(false); };
  const toggleBlock   = id => { const c = conversations.find(x => x.id === id); setConversations(p => p.map(x => x.id === id ? { ...x, blocked: !x.blocked } : x)); addToast(c?.blocked ? 'Unblocked' : 'Blocked', 'warning'); setShowDropdown(false); };
  const clearChat     = id => { setMessagesByConv(p => ({ ...p, [id]: [] })); addToast('Chat cleared', 'default'); setShowDropdown(false); };
  const openConv      = id => { setActiveConvId(id); setMobileView('chat'); setShowInfo(false); };

  const filteredConvs = conversations.filter(c => !search || c.name.toLowerCase().includes(search.toLowerCase()));
  const totalUnread   = conversations.reduce((s, c) => s + (!c.muted && !c.blocked ? (c.unread || 0) : 0), 0);

  /* Group messages by date */
  const groupedMessages = messages.reduce((acc, msg) => {
    const key = 'Today';
    if (!acc[key]) acc[key] = [];
    acc[key].push(msg);
    return acc;
  }, {});

  return (
    <Layout title="Consultation Chat">
      <div className="ch-shell">

        {/* ══ SIDEBAR ══ */}
        <aside className={`ch-sidebar ${mobileView === 'list' ? 'ch-sb-show' : 'ch-sb-hide'}`}>

          {/* Header */}
          <div className="ch-sb-head">
            <div className="ch-sb-title-row">
              <h3 className="ch-sb-title">Messages</h3>
              {totalUnread > 0 && <span className="ch-total-badge">{totalUnread}</span>}
            </div>
            <div className="ch-sb-search">
              <Search size={14} className="ch-sb-search-icon" />
              <input className="ch-sb-search-input" placeholder="Search conversations..."
                value={search} onChange={e => setSearch(e.target.value)} />
              {search && <button className="ch-sb-search-clear" onClick={() => setSearch('')}><X size={12} /></button>}
            </div>
          </div>

          {/* Online summary strip */}
          <div className="ch-online-strip">
            <span className="ch-online-dot-sm" />
            <span>{conversations.filter(c => c.online).length} doctors online</span>
          </div>

          {/* List */}
          <div className="ch-conv-list">
            {filteredConvs.length === 0 && <div className="ch-no-results">No conversations found</div>}
            {filteredConvs.map(conv => {
              const isActive = activeConvId === conv.id;
              return (
                <button key={conv.id}
                  className={`ch-conv-item ${isActive ? 'ch-conv-active' : ''} ${conv.blocked ? 'ch-conv-blocked' : ''}`}
                  onClick={() => openConv(conv.id)}>
                  <div className="ch-conv-av-wrap">
                    <div className="ch-conv-av">{conv.initials}</div>
                    <span className={`ch-conv-dot ${conv.online ? 'ch-dot-on' : 'ch-dot-off'}`} />
                  </div>
                  <div className="ch-conv-info">
                    <div className="ch-conv-top">
                      <span className="ch-conv-name">{conv.name}</span>
                      <span className="ch-conv-time">{conv.lastTime}</span>
                    </div>
                    <div className="ch-conv-bottom">
                      <span className="ch-conv-spec">{conv.specialty}</span>
                    </div>
                    <div className="ch-conv-preview">
                      <span className="ch-conv-last">
                        {conv.muted && '🔇 '}{conv.blocked && '🚫 '}{conv.lastMessage}
                      </span>
                      {!conv.muted && !conv.blocked && conv.unread > 0 && (
                        <span className="ch-unread-pill">{conv.unread}</span>
                      )}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </aside>

        {/* ══ MAIN CHAT ══ */}
        <div className={`ch-main ${mobileView === 'chat' ? 'ch-main-show' : 'ch-main-hide'}`}>

          {/* Header */}
          <div className="ch-header">
            <button className="ch-back-btn" onClick={() => setMobileView('list')}><ArrowLeft size={18} /></button>
            <div className="ch-hdr-av-wrap" onClick={() => setShowInfo(s => !s)}>
              <div className="ch-hdr-av">{activeConv?.initials}</div>
              <span className={`ch-hdr-dot ${activeConv?.online ? 'ch-dot-on' : 'ch-dot-off'}`} />
            </div>
            <div className="ch-hdr-info" onClick={() => setShowInfo(s => !s)}>
              <div className="ch-hdr-name">{activeConv?.name}</div>
              <div className={`ch-hdr-status ${activeConv?.online ? 'ch-status-on' : 'ch-status-off'}`}>
                {activeConv?.online ? '● Online' : '○ Offline'}
                <span className="ch-hdr-spec"> · {activeConv?.specialty}</span>
              </div>
            </div>
            <div className="ch-hdr-actions">
              <button className="ch-hbtn" title="Voice call" onClick={() => addToast('Starting voice call...', 'default')}><Phone size={17} /></button>
              <button className="ch-hbtn" title="Video call" onClick={() => addToast('Starting video call...', 'default')}><Video size={17} /></button>
              <button className={`ch-hbtn ${showInfo ? 'ch-hbtn-on' : ''}`} onClick={() => setShowInfo(s => !s)}><Info size={17} /></button>
              <div className="ch-more-wrap" ref={dropdownRef}>
                <button className={`ch-hbtn ${showDropdown ? 'ch-hbtn-on' : ''}`} onClick={() => setShowDropdown(s => !s)}><MoreVertical size={17} /></button>
                {showDropdown && (
                  <div className="ch-dropdown">
                    <button className="ch-dd-item" onClick={() => toggleMute(activeConv?.id)}>{activeConv?.muted ? <><Bell size={13} /> Unmute</> : <><BellOff size={13} /> Mute</>}</button>
                    <button className="ch-dd-item ch-dd-danger" onClick={() => toggleBlock(activeConv?.id)}>{activeConv?.blocked ? <><ShieldOff size={13} /> Unblock</> : <><Ban size={13} /> Block</>}</button>
                    <div className="ch-dd-sep" />
                    <button className="ch-dd-item ch-dd-danger" onClick={() => clearChat(activeConv?.id)}><X size={13} /> Clear Chat</button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Blocked banner */}
          {activeConv?.blocked && (
            <div className="ch-blocked-bar">
              <Ban size={14} /> This conversation is blocked.
              <button onClick={() => toggleBlock(activeConv?.id)}>Unblock</button>
            </div>
          )}

          {/* Messages */}
          <div className="ch-msgs">
            {Object.entries(groupedMessages).map(([date, msgs]) => (
              <div key={date}>
                <div className="ch-date-sep"><span>{date}</span></div>
                {msgs.map((msg, idx) => {
                  const isMe   = msg.sender === 'patient';
                  const prev   = msgs[idx - 1];
                  const next   = msgs[idx + 1];
                  const isFirst= !prev || prev.sender !== msg.sender;
                  const isLast = !next || next.sender !== msg.sender;
                  return (
                    <div key={msg.id}
                      className={`ch-msg-row ${isMe ? 'ch-msg-me' : 'ch-msg-other'}`}
                      style={{ marginBottom: isLast ? '10px' : '2px' }}>
                      {!isMe && (
                        <div className={`ch-msg-av-slot ${isLast ? '' : 'ch-av-blank'}`}>
                          {isLast && <div className="ch-msg-av">{activeConv?.initials}</div>}
                        </div>
                      )}
                      <div className="ch-msg-content">
                        {!isMe && isFirst && <div className="ch-msg-sender">{msg.name}</div>}
                        <div className={`ch-bubble ${isMe ? 'ch-bbl-me' : 'ch-bbl-other'}
                          ${isFirst && isLast ? '' : isFirst ? (isMe ? 'ch-bbl-me-first' : 'ch-bbl-other-first') : isLast ? (isMe ? 'ch-bbl-me-last' : 'ch-bbl-other-last') : 'ch-bbl-mid'}`}>
                          {msg.text}
                          {msg.attachments && msg.attachments.length > 0 && (
                            <div className="ch-bbl-atts">
                              {msg.attachments.map(att => (
                                <div key={att.id} className="ch-bbl-att">
                                  {att.type === 'image' && att.url
                                    ? <img src={att.url} alt={att.name} className="ch-bbl-img" onClick={() => window.open(att.url, '_blank')} />
                                    : <div className="ch-bbl-file"><FileText size={15} /><div><span className="ch-bbl-fname">{att.name}</span><span className="ch-bbl-fsize">{att.size}</span></div></div>}
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                        {isLast && (
                          <div className={`ch-msg-meta ${isMe ? 'ch-meta-right' : ''}`}>
                            {msg.time}
                            {isMe && (msg.read ? <CheckCheck size={12} className="ch-read-ic" /> : <Check size={12} className="ch-sent-ic" />)}
                          </div>
                        )}
                      </div>
                      {isMe && (
                        <div className={`ch-msg-av-slot ${isLast ? '' : 'ch-av-blank'}`}>
                          {isLast && <div className="ch-msg-av ch-msg-av-me">{user?.initials || 'U'}</div>}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ))}
            {messages.length === 0 && (
              <div className="ch-empty">
                <div className="ch-empty-icon">💬</div>
                <h4>Start the conversation</h4>
                <p>Send a message to {activeConv?.name}</p>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick replies */}
          {showQuick && (
            <div className="ch-quick">
              {QUICK_REPLIES.map(r => (
                <button key={r} className="ch-quick-btn" onClick={() => sendMessage(r)}>{r}</button>
              ))}
            </div>
          )}

          {/* Attachment preview */}
          {attachments.length > 0 && (
            <div className="ch-att-preview">
              {attachments.map(att => (
                <div key={att.id} className="ch-att-item">
                  {att.type === 'image' && att.url
                    ? <img src={att.url} alt={att.name} className="ch-att-img" />
                    : <div className="ch-att-file-ic"><FileText size={16} /></div>}
                  <div className="ch-att-info"><span className="ch-att-name">{att.name}</span><span className="ch-att-size">{att.size}</span></div>
                  <button className="ch-att-rm" onClick={() => setAttachments(p => p.filter(a => a.id !== att.id))}><X size={12} /></button>
                </div>
              ))}
            </div>
          )}

          {/* Emoji picker */}
          <div className="ch-input-area" style={{ position: 'relative' }}>
            {showEmoji && (
              <div className="ch-emoji-picker" ref={emojiRef}>
                <div className="ch-emoji-cats">
                  {EMOJI_CATS.map((cat, i) => (
                    <button key={cat.label} className={`ch-emoji-cat-btn ${emojiCat === i ? 'ch-emoji-cat-on' : ''}`}
                      onClick={() => setEmojiCat(i)}>{cat.emojis[0]}</button>
                  ))}
                </div>
                <div className="ch-emoji-lbl">{EMOJI_CATS[emojiCat].label}</div>
                <div className="ch-emoji-grid">
                  {EMOJI_CATS[emojiCat].emojis.map(em => (
                    <button key={em} className="ch-emoji-btn" onClick={() => insertEmoji(em)}>{em}</button>
                  ))}
                </div>
              </div>
            )}

            {/* Input bar */}
            <div className="ch-input-bar">
              <input ref={fileInputRef} type="file" multiple accept=".pdf,.doc,.docx,.txt,.xls,.xlsx,.csv,.zip" style={{ display:'none' }} onChange={handleFile} />
              <input ref={imageInputRef} type="file" multiple accept="image/*" style={{ display:'none' }} onChange={handleFile} />
              <div className={`ch-input-wrap ${activeConv?.blocked ? 'ch-input-dis' : ''}`}>
                <button className={`ch-inp-btn ${showEmoji ? 'ch-inp-btn-on' : ''}`} title="Emoji" onClick={() => { setShowEmoji(s => !s); setShowQuick(false); }}><Smile size={19} /></button>
                <input ref={inputRef} className="ch-input"
                  placeholder={activeConv?.blocked ? 'Conversation blocked' : 'Type a message...'}
                  value={input} disabled={activeConv?.blocked}
                  onChange={e => setInput(e.target.value)} onKeyDown={handleKeyDown} />
                <button className="ch-inp-btn" title="Attach file" onClick={() => fileInputRef.current?.click()}><Paperclip size={19} /></button>
                <button className="ch-inp-btn" title="Send image" onClick={() => imageInputRef.current?.click()}><Image size={19} /></button>
              </div>
              <button
                className={`ch-send-btn ${(input.trim() || attachments.length > 0) && !activeConv?.blocked ? 'ch-send-on' : ''}`}
                onClick={() => sendMessage()}
                disabled={(!input.trim() && attachments.length === 0) || activeConv?.blocked}>
                <Send size={18} />
              </button>
            </div>
          </div>
        </div>

        {/* ══ INFO PANEL ══ */}
        {showInfo && (
          <aside className="ch-info-panel">
            <div className="ch-info-head">
              <h4>Doctor Info</h4>
              <button className="ch-info-close" onClick={() => setShowInfo(false)}><X size={15} /></button>
            </div>
            <div className="ch-info-body">
              <div className="ch-info-av">{activeConv?.initials}</div>
              <div className="ch-info-name">{activeConv?.name}</div>
              <div className="ch-info-spec">{activeConv?.specialty}</div>
              <div className={`ch-info-status ${activeConv?.online ? 'ch-info-on' : ''}`}>{activeConv?.online ? '● Online Now' : '○ Offline'}</div>
              <div className="ch-info-stats">
                <div className="ch-info-stat"><span className="ch-info-stat-v">{messages.length}</span><span className="ch-info-stat-l">Messages</span></div>
                <div className="ch-info-stat"><span className="ch-info-stat-v">{messages.filter(m => m.sender === 'patient').length}</span><span className="ch-info-stat-l">Sent</span></div>
                <div className="ch-info-stat"><span className="ch-info-stat-v">{messages.filter(m => m.sender === 'doctor').length}</span><span className="ch-info-stat-l">Received</span></div>
              </div>
              <div className="ch-info-actions">
                <button className="btn btn-outline btn-sm" style={{ width:'100%' }} onClick={() => addToast('Starting call...', 'default')}><Phone size={14} /> Call</button>
                <button className="btn btn-primary btn-sm" style={{ width:'100%' }} onClick={() => addToast('Starting video...', 'default')}><Video size={14} /> Video</button>
              </div>
              <div className="ch-info-prefs">
                <div className="ch-info-pref" onClick={() => toggleMute(activeConv?.id)}>
                  {activeConv?.muted ? <Bell size={14} /> : <BellOff size={14} />}
                  <span>{activeConv?.muted ? 'Unmute' : 'Mute'}</span>
                </div>
                <div className="ch-info-pref ch-pref-danger" onClick={() => toggleBlock(activeConv?.id)}>
                  {activeConv?.blocked ? <ShieldOff size={14} /> : <Ban size={14} />}
                  <span>{activeConv?.blocked ? 'Unblock' : 'Block'}</span>
                </div>
                <div className="ch-info-pref ch-pref-danger" onClick={() => clearChat(activeConv?.id)}>
                  <X size={14} /><span>Clear Chat</span>
                </div>
              </div>
            </div>
          </aside>
        )}
      </div>

      <style>{`
        /* ── Shell ─────────────────────────────── */
        .ch-shell {
          display: flex; height: calc(100vh - 128px);
          background: white; border-radius: 20px;
          border: 1px solid var(--gray-200); overflow: hidden;
          box-shadow: 0 4px 24px rgba(0,0,0,0.07);
        }

        /* ── Sidebar ───────────────────────────── */
        .ch-sidebar {
          width: 320px; flex-shrink: 0;
          display: flex; flex-direction: column;
          background: #fafbfc;
          border-right: 1px solid var(--gray-100);
        }
        .ch-sb-head {
          padding: 20px 18px 14px;
          border-bottom: 1px solid var(--gray-100);
        }
        .ch-sb-title-row { display: flex; align-items: center; gap: 10px; margin-bottom: 12px; }
        .ch-sb-title { font-size: 1.1rem; font-weight: 800; color: var(--gray-900); margin: 0; }
        .ch-total-badge {
          background: var(--primary); color: white;
          font-size: 0.68rem; font-weight: 700;
          padding: 2px 8px; border-radius: 20px; min-width: 20px; text-align: center;
        }
        .ch-sb-search {
          display: flex; align-items: center; gap: 8px;
          background: white; border: 1.5px solid var(--gray-200);
          border-radius: 12px; padding: 9px 13px;
          transition: border-color 0.18s;
        }
        .ch-sb-search:focus-within { border-color: var(--primary); box-shadow: 0 0 0 3px rgba(14,165,233,0.1); }
        .ch-sb-search-icon { color: var(--gray-400); flex-shrink: 0; }
        .ch-sb-search-input { flex: 1; border: none; background: transparent; outline: none; font-size: 0.85rem; color: var(--gray-800); font-family: inherit; }
        .ch-sb-search-input::placeholder { color: var(--gray-400); }
        .ch-sb-search-clear { background: none; border: none; cursor: pointer; color: var(--gray-400); display: flex; align-items: center; padding: 0; }

        /* Online strip */
        .ch-online-strip {
          display: flex; align-items: center; gap: 7px;
          padding: 8px 18px; font-size: 0.75rem; color: #16a34a; font-weight: 600;
          background: #f0fdf4; border-bottom: 1px solid #dcfce7;
        }
        .ch-online-dot-sm { width: 8px; height: 8px; border-radius: 50%; background: #22c55e; animation: pulse 2s infinite; }

        /* Conv list */
        .ch-conv-list { flex: 1; overflow-y: auto; scrollbar-width: thin; scrollbar-color: var(--gray-200) transparent; }
        .ch-conv-list::-webkit-scrollbar { width: 3px; }
        .ch-conv-list::-webkit-scrollbar-thumb { background: var(--gray-200); }
        .ch-no-results { padding: 28px 18px; text-align: center; font-size: 0.82rem; color: var(--gray-400); }

        .ch-conv-item {
          display: flex; align-items: flex-start; gap: 12px;
          padding: 13px 18px; width: 100%; background: none; border: none;
          cursor: pointer; text-align: left; font-family: inherit;
          border-bottom: 1px solid rgba(0,0,0,0.04);
          transition: background 0.15s; position: relative;
        }
        .ch-conv-item:hover  { background: #f0f9ff; }
        .ch-conv-active      { background: var(--primary-light) !important; }
        .ch-conv-active::before { content:''; position:absolute; left:0; top:0; bottom:0; width:3px; background:var(--primary); border-radius:0 3px 3px 0; }
        .ch-conv-blocked     { opacity: 0.5; }
        .ch-conv-av-wrap     { position: relative; flex-shrink: 0; }
        .ch-conv-av {
          width: 46px; height: 46px; border-radius: 50%;
          background: linear-gradient(135deg, var(--primary-light), #bae6fd);
          color: var(--primary); font-size: 0.82rem; font-weight: 800;
          display: flex; align-items: center; justify-content: center;
        }
        .ch-conv-dot  { width: 12px; height: 12px; border-radius: 50%; border: 2px solid #fafbfc; position: absolute; bottom: 1px; right: 1px; }
        .ch-dot-on    { background: #22c55e; }
        .ch-dot-off   { background: var(--gray-300); }
        .ch-conv-info { flex: 1; min-width: 0; }
        .ch-conv-top  { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1px; }
        .ch-conv-name { font-size: 0.875rem; font-weight: 700; color: var(--gray-900); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
        .ch-conv-time { font-size: 0.68rem; color: var(--gray-400); flex-shrink: 0; margin-left: 6px; }
        .ch-conv-spec { font-size: 0.72rem; color: var(--primary); font-weight: 600; margin-bottom: 3px; }
        .ch-conv-preview { display: flex; justify-content: space-between; align-items: center; gap: 6px; }
        .ch-conv-last { font-size: 0.75rem; color: var(--gray-400); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; flex: 1; }
        .ch-unread-pill {
          background: var(--primary); color: white;
          font-size: 0.62rem; font-weight: 700;
          min-width: 18px; height: 18px; padding: 0 5px;
          border-radius: 9px; display: flex; align-items: center; justify-content: center; flex-shrink: 0;
        }

        /* ── Main ──────────────────────────────── */
        .ch-main { flex: 1; display: flex; flex-direction: column; min-width: 0; background: white; }

        /* Header */
        .ch-header {
          display: flex; align-items: center; gap: 10px;
          padding: 12px 18px; border-bottom: 1px solid var(--gray-100);
          background: white; flex-shrink: 0; min-height: 66px;
        }
        .ch-back-btn { display:none; width:34px; height:34px; border-radius:50%; background:none; border:none; cursor:pointer; color:var(--gray-600); align-items:center; justify-content:center; flex-shrink:0; }
        .ch-back-btn:hover { background: var(--gray-100); }
        .ch-hdr-av-wrap { position: relative; flex-shrink: 0; cursor: pointer; }
        .ch-hdr-av {
          width: 42px; height: 42px; border-radius: 50%;
          background: linear-gradient(135deg, var(--primary-light), #bae6fd);
          color: var(--primary); font-size: 0.82rem; font-weight: 800;
          display: flex; align-items: center; justify-content: center;
        }
        .ch-hdr-dot { width: 12px; height: 12px; border-radius: 50%; border: 2px solid white; position: absolute; bottom: 1px; right: 1px; }
        .ch-hdr-info { flex: 1; min-width: 0; cursor: pointer; }
        .ch-hdr-name { font-size: 0.95rem; font-weight: 700; color: var(--gray-900); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
        .ch-hdr-status { font-size: 0.75rem; font-weight: 600; display: flex; align-items: center; gap: 4px; }
        .ch-status-on  { color: #16a34a; }
        .ch-status-off { color: var(--gray-400); }
        .ch-hdr-spec   { color: var(--gray-400); font-weight: 400; }
        .ch-hdr-actions { display: flex; gap: 4px; align-items: center; flex-shrink: 0; }
        .ch-hbtn { width:36px; height:36px; border-radius:10px; background:none; border:none; cursor:pointer; color:var(--gray-500); display:flex; align-items:center; justify-content:center; transition:all 0.15s; }
        .ch-hbtn:hover { background: var(--gray-100); color: var(--gray-800); }
        .ch-hbtn-on    { background: var(--primary-light); color: var(--primary); }
        .ch-more-wrap  { position: relative; }
        .ch-dropdown   { position:absolute; right:0; top:40px; z-index:100; background:white; border-radius:12px; box-shadow:0 8px 30px rgba(0,0,0,0.14); border:1px solid var(--gray-200); min-width:156px; overflow:hidden; animation:fadeIn 0.15s ease; }
        .ch-dd-item    { display:flex; align-items:center; gap:8px; padding:10px 14px; width:100%; background:none; border:none; font-size:0.84rem; font-weight:500; color:var(--gray-700); cursor:pointer; font-family:inherit; }
        .ch-dd-item:hover { background: var(--gray-50); }
        .ch-dd-danger  { color: var(--danger); }
        .ch-dd-sep     { height:1px; background:var(--gray-100); margin:2px 0; }

        /* Blocked banner */
        .ch-blocked-bar { display:flex; align-items:center; gap:8px; padding:8px 18px; background:var(--danger-light); color:#b91c1c; font-size:0.82rem; font-weight:600; border-bottom:1px solid #fecaca; }
        .ch-blocked-bar button { background:none; border:none; color:var(--primary); font-weight:700; cursor:pointer; margin-left:4px; text-decoration:underline; }

        /* Messages */
        .ch-msgs {
          flex: 1; overflow-y: auto; padding: 16px 18px;
          background: #f8fafc; display: flex; flex-direction: column;
          scrollbar-width: thin; scrollbar-color: var(--gray-200) transparent;
        }
        .ch-msgs::-webkit-scrollbar { width: 4px; }
        .ch-msgs::-webkit-scrollbar-thumb { background: var(--gray-200); border-radius: 2px; }
        .ch-date-sep { display:flex; align-items:center; margin:14px 0 10px; gap:10px; }
        .ch-date-sep::before,.ch-date-sep::after { content:''; flex:1; height:1px; background:var(--gray-200); }
        .ch-date-sep span { font-size:0.7rem; font-weight:700; color:var(--gray-400); padding:3px 12px; background:var(--gray-100); border-radius:20px; white-space:nowrap; }
        .ch-msg-row { display:flex; align-items:flex-end; gap:8px; }
        .ch-msg-me    { flex-direction: row-reverse; }
        .ch-msg-other { flex-direction: row; }
        .ch-msg-av-slot { width:28px; flex-shrink:0; display:flex; justify-content:center; }
        .ch-av-blank    { visibility: hidden; }
        .ch-msg-av { width:26px; height:26px; border-radius:50%; background:var(--primary-light); color:var(--primary); font-size:0.62rem; font-weight:800; display:flex; align-items:center; justify-content:center; }
        .ch-msg-av-me { background:var(--primary); color:white; }
        .ch-msg-content { display:flex; flex-direction:column; max-width:68%; }
        .ch-msg-me .ch-msg-content { align-items:flex-end; }
        .ch-msg-sender { font-size:0.68rem; color:var(--gray-400); font-weight:700; margin-bottom:3px; padding-left:4px; }
        .ch-bubble { padding:10px 14px; font-size:0.875rem; line-height:1.55; word-break:break-word; }
        .ch-bbl-me    { background:linear-gradient(135deg,#0ea5e9,#0284c7); color:white; border-radius:18px 18px 4px 18px; box-shadow:0 3px 10px rgba(14,165,233,0.28); }
        .ch-bbl-other { background:white; color:var(--gray-800); border-radius:18px 18px 18px 4px; border:1px solid var(--gray-200); box-shadow:0 2px 6px rgba(0,0,0,0.05); }
        .ch-bbl-me-first    { border-radius:18px 18px 4px 18px; }
        .ch-bbl-me-last     { border-radius:4px 18px 4px 4px; }
        .ch-bbl-other-first { border-radius:18px 18px 18px 4px; }
        .ch-bbl-other-last  { border-radius:4px 4px 18px 18px; }
        .ch-bbl-mid         { border-radius:4px; }
        .ch-bbl-atts { margin-top:6px; display:flex; flex-direction:column; gap:5px; }
        .ch-bbl-img  { max-width:200px; max-height:160px; border-radius:9px; object-fit:cover; display:block; cursor:pointer; }
        .ch-bbl-file { display:flex; align-items:center; gap:7px; padding:7px 10px; border-radius:8px; background:rgba(255,255,255,0.18); }
        .ch-bbl-fname{ display:block; font-size:0.75rem; font-weight:600; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; max-width:120px; }
        .ch-bbl-fsize{ display:block; font-size:0.62rem; opacity:0.65; }
        .ch-msg-meta { display:flex; align-items:center; gap:4px; font-size:0.62rem; color:var(--gray-400); margin-top:3px; padding:0 4px; }
        .ch-meta-right { justify-content:flex-end; }
        .ch-read-ic { color:var(--primary); }
        .ch-sent-ic { color:var(--gray-400); }
        .ch-empty { flex:1; display:flex; flex-direction:column; align-items:center; justify-content:center; gap:8px; color:var(--gray-400); padding:40px 20px; }
        .ch-empty-icon { font-size:3rem; opacity:0.35; }
        .ch-empty h4 { font-size:1rem; font-weight:700; color:var(--gray-600); margin:0; }
        .ch-empty p  { font-size:0.82rem; margin:0; }

        /* Quick replies */
        .ch-quick { display:flex; flex-wrap:wrap; gap:6px; padding:8px 18px; border-top:1px solid var(--gray-100); background:white; }
        .ch-quick-btn { padding:5px 12px; border-radius:20px; border:1.5px solid var(--primary); color:var(--primary); background:white; font-size:0.74rem; font-weight:600; cursor:pointer; transition:all 0.15s; font-family:inherit; white-space:nowrap; }
        .ch-quick-btn:hover { background:var(--primary); color:white; }

        /* Attachment preview */
        .ch-att-preview { display:flex; flex-wrap:wrap; gap:7px; padding:8px 18px; border-top:1px solid var(--gray-100); background:#fafafa; }
        .ch-att-item { display:flex; align-items:center; gap:8px; padding:6px 10px; background:white; border-radius:10px; border:1px solid var(--gray-200); max-width:200px; }
        .ch-att-img  { width:38px; height:38px; border-radius:7px; object-fit:cover; flex-shrink:0; }
        .ch-att-file-ic { width:34px; height:34px; border-radius:7px; background:var(--primary-light); color:var(--primary); display:flex; align-items:center; justify-content:center; flex-shrink:0; }
        .ch-att-info { flex:1; overflow:hidden; }
        .ch-att-name { display:block; font-size:0.72rem; font-weight:600; color:var(--gray-800); overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
        .ch-att-size { display:block; font-size:0.62rem; color:var(--gray-400); }
        .ch-att-rm   { background:none; border:none; cursor:pointer; color:var(--gray-400); padding:2px; border-radius:50%; display:flex; align-items:center; justify-content:center; }
        .ch-att-rm:hover { background:var(--danger-light); color:var(--danger); }

        /* Emoji picker */
        .ch-emoji-picker { position:absolute; bottom:calc(100% + 8px); left:0; width:290px; background:white; border-radius:16px; box-shadow:0 12px 40px rgba(0,0,0,0.14); border:1px solid var(--gray-200); z-index:200; overflow:hidden; animation:fadeIn 0.15s ease; }
        .ch-emoji-cats { display:flex; gap:2px; padding:10px 12px 8px; border-bottom:1px solid var(--gray-100); }
        .ch-emoji-cat-btn { width:32px; height:32px; border-radius:8px; border:none; background:none; cursor:pointer; font-size:1.05rem; display:flex; align-items:center; justify-content:center; transition:background 0.12s; }
        .ch-emoji-cat-btn:hover { background:var(--gray-100); }
        .ch-emoji-cat-on { background:var(--primary-light); }
        .ch-emoji-lbl  { font-size:0.65rem; font-weight:700; color:var(--gray-400); text-transform:uppercase; letter-spacing:0.06em; padding:5px 13px 3px; }
        .ch-emoji-grid { display:grid; grid-template-columns:repeat(8,1fr); gap:2px; padding:4px 8px 10px; max-height:190px; overflow-y:auto; }
        .ch-emoji-grid::-webkit-scrollbar { width:3px; }
        .ch-emoji-grid::-webkit-scrollbar-thumb { background:var(--gray-200); }
        .ch-emoji-btn { width:30px; height:30px; border-radius:7px; border:none; background:none; cursor:pointer; font-size:1.05rem; display:flex; align-items:center; justify-content:center; transition:all 0.1s; }
        .ch-emoji-btn:hover { background:var(--gray-100); transform:scale(1.18); }

        /* Input bar */
        .ch-input-area { flex-shrink:0; }
        .ch-input-bar { display:flex; align-items:center; gap:10px; padding:12px 18px; border-top:1px solid var(--gray-100); background:white; }
        .ch-input-wrap { flex:1; display:flex; align-items:center; gap:6px; background:#f1f5f9; border-radius:14px; padding:9px 14px; border:1.5px solid transparent; transition:all 0.18s; }
        .ch-input-wrap:focus-within { border-color:var(--primary); background:white; box-shadow:0 0 0 3px rgba(14,165,233,0.08); }
        .ch-input-dis { opacity:0.5; pointer-events:none; }
        .ch-inp-btn { background:none; border:none; cursor:pointer; color:var(--gray-400); padding:3px; display:flex; align-items:center; border-radius:7px; transition:all 0.15s; flex-shrink:0; }
        .ch-inp-btn:hover { color:var(--primary); }
        .ch-inp-btn-on { color:var(--primary); background:var(--primary-light); }
        .ch-input { flex:1; border:none; background:transparent; outline:none; font-size:0.9rem; color:var(--gray-800); font-family:inherit; }
        .ch-input::placeholder { color:var(--gray-400); }
        .ch-send-btn { width:44px; height:44px; border-radius:50%; flex-shrink:0; background:var(--gray-200); color:var(--gray-400); border:none; cursor:not-allowed; display:flex; align-items:center; justify-content:center; transition:all 0.2s; }
        .ch-send-on  { background:linear-gradient(135deg,var(--primary),var(--primary-dark)); color:white; cursor:pointer; box-shadow:0 4px 14px rgba(14,165,233,0.38); }
        .ch-send-on:hover { transform:scale(1.06); }

        /* Info panel */
        .ch-info-panel { width:230px; flex-shrink:0; border-left:1px solid var(--gray-100); display:flex; flex-direction:column; background:white; overflow-y:auto; }
        .ch-info-head  { display:flex; justify-content:space-between; align-items:center; padding:16px 16px 12px; border-bottom:1px solid var(--gray-100); }
        .ch-info-head h4 { font-size:0.88rem; font-weight:700; color:var(--gray-900); margin:0; }
        .ch-info-close { background:none; border:none; cursor:pointer; color:var(--gray-400); width:26px; height:26px; border-radius:7px; display:flex; align-items:center; justify-content:center; }
        .ch-info-close:hover { background:var(--gray-100); }
        .ch-info-body  { padding:16px; display:flex; flex-direction:column; gap:12px; align-items:center; }
        .ch-info-av    { width:62px; height:62px; border-radius:50%; background:linear-gradient(135deg,var(--primary-light),#bae6fd); color:var(--primary); font-size:1.1rem; font-weight:800; display:flex; align-items:center; justify-content:center; }
        .ch-info-name  { font-size:0.92rem; font-weight:700; color:var(--gray-900); text-align:center; }
        .ch-info-spec  { font-size:0.75rem; color:var(--primary); font-weight:600; }
        .ch-info-status{ font-size:0.73rem; color:var(--gray-400); font-weight:600; }
        .ch-info-on    { color:#16a34a; }
        .ch-info-stats { display:flex; gap:12px; padding:10px 0; border-top:1px solid var(--gray-100); border-bottom:1px solid var(--gray-100); width:100%; }
        .ch-info-stat  { flex:1; text-align:center; }
        .ch-info-stat-v{ display:block; font-size:1.05rem; font-weight:800; color:var(--gray-900); }
        .ch-info-stat-l{ display:block; font-size:0.62rem; color:var(--gray-400); margin-top:1px; }
        .ch-info-actions { display:flex; flex-direction:column; gap:7px; width:100%; }
        .ch-info-prefs { width:100%; display:flex; flex-direction:column; gap:1px; padding-top:4px; }
        .ch-info-pref  { display:flex; align-items:center; gap:9px; padding:8px 10px; border-radius:9px; font-size:0.78rem; font-weight:500; color:var(--gray-600); cursor:pointer; transition:background 0.15s; }
        .ch-info-pref:hover { background:var(--gray-50); }
        .ch-pref-danger{ color:var(--danger); }
        .ch-pref-danger:hover { background:var(--danger-light); }

        /* ── Responsive ─────────────────────────── */
        @media (max-width: 1024px) { .ch-info-panel { width: 200px; } }
        @media (max-width: 860px)  { .ch-info-panel { display: none; } }
        @media (max-width: 700px) {
          .ch-shell { border-radius: var(--radius-lg); position: relative; overflow: hidden; }
          .ch-sidebar { position: absolute; width: 100%; z-index: 10; height: 100%; transition: transform 0.25s ease; }
          .ch-sb-hide  { transform: translateX(-100%); pointer-events: none; }
          .ch-sb-show  { transform: translateX(0); }
          .ch-main     { width: 100%; transition: transform 0.25s ease; }
          .ch-main-hide{ transform: translateX(100%); pointer-events: none; position: absolute; width: 100%; }
          .ch-main-show{ transform: translateX(0); position: relative; }
          .ch-back-btn { display: flex !important; }
        }
        @media (max-width: 480px) {
          .ch-header    { padding: 10px 14px; }
          .ch-msgs      { padding: 12px 14px; }
          .ch-input-bar { padding: 10px 14px; }
          .ch-quick     { padding: 7px 14px; }
          .ch-msg-content { max-width: 80%; }
          .ch-hdr-actions .ch-hbtn:not(:last-child) { display: none; }
          .ch-emoji-picker { width: calc(100vw - 28px); left: -14px; }
        }
      `}</style>
    </Layout>
  );
}
