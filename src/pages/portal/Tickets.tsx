import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import { 
  Ticket as TicketIcon, 
  Search, 
  Plus, 
  Send, 
  Paperclip,
  Clock,
  CheckCircle2,
  AlertCircle,
  ChevronLeft,
  X,
  Loader2,
  Filter
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface Message {
  id: string;
  sender_id: string;
  message: string;
  created_at: string;
  first_name: string;
  last_name: string;
  role: string;
}

interface Ticket {
  id: string;
  title: string;
  status: 'new' | 'open' | 'in_progress' | 'closed' | 'resolved';
  priority: 'low' | 'medium' | 'high' | 'critical';
  created_at: string;
  updated_at: string;
}

const Tickets = () => {
  const { user, token } = useAuth();
  const location = useLocation();
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // New Ticket Form State
  const [newTicket, setNewTicket] = useState({ title: '', description: '', priority: 'medium', type: 'support' });

  const fetchTickets = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/portal/tickets', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      if (data.success) setTickets(data.data);
    } catch (err) {
      console.error('Failed to fetch tickets');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchMessages = async (ticketId: string) => {
    try {
      // In the portal, we can use the detail endpoint which includes messages
      const response = await fetch(`/api/portal/tickets/${ticketId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      if (data.success) {
        setMessages(data.data.messages || []);
      }
    } catch (err) {
      console.error('Failed to fetch messages');
    }
  };

  useEffect(() => {
    fetchTickets();
    // Check if we should open the new ticket modal
    const params = new URLSearchParams(location.search);
    if (params.get('new') === 'true') {
      setShowCreateModal(true);
    }
  }, [location.search]);

  const handleSelectTicket = (ticket: Ticket) => {
    setSelectedTicket(ticket);
    setMessages([]); // Clear previous messages to show loader
    fetchMessages(ticket.id);
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedTicket) return;

    try {
      const response = await fetch(`/api/portal/tickets/${selectedTicket.id}/messages`, {
        method: 'POST',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json' 
        },
        body: JSON.stringify({ message: newMessage })
      });
      const data = await response.json();
      if (data.success) {
        const newMsg = {
          id: Date.now().toString(),
          sender_id: user?.id || '',
          message: newMessage,
          created_at: new Date().toISOString(),
          first_name: user?.firstName || '',
          last_name: user?.lastName || '',
          role: user?.role || ''
        };
        setMessages([...messages, newMsg]);
        setNewMessage('');
      }
    } catch (err) {
      console.error('Failed to send message');
    }
  };

  const handleCreateTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await fetch('/api/portal/tickets', {
        method: 'POST',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newTicket)
      });
      const data = await response.json();
      if (data.success) {
        setShowCreateModal(false);
        setNewTicket({ title: '', description: '', priority: 'medium', type: 'support' });
        fetchTickets();
      }
    } catch (err) {
      alert('Fehler beim Erstellen des Tickets.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !selectedTicket) return;

    const formData = new FormData();
    formData.append('file', file);

    try {
      setIsLoading(true);
      const response = await fetch(`/api/portal/tickets/${selectedTicket.id}/attachments`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData
      });
      const data = await response.json();
      if (data.success) {
        setMessages([...messages, data.data]);
      }
    } catch (err) {
      console.error('Upload failed');
    } finally {
      setIsLoading(false);
      if (e.target) e.target.value = '';
    }
  };

  const filteredTickets = tickets.filter(t => {
    const matchesStatus = statusFilter === 'all' || 
                         (statusFilter === 'open' && ['new', 'open'].includes(t.status)) ||
                         (statusFilter === 'progress' && t.status === 'in_progress') ||
                         (statusFilter === 'closed' && ['closed', 'resolved'].includes(t.status));
    const matchesSearch = t.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          t.id.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="portal-tickets">
      <div className="tickets-layout">
        
        {/* Sidebar: Ticket List */}
        <div className={`tickets-sidebar ${selectedTicket ? 'hidden-mobile' : ''}`}>
          <div className="sidebar-header">
            <h3>Support Tickets</h3>
            <button className="btn-icon primary" onClick={() => setShowCreateModal(true)}><Plus size={20} /></button>
          </div>

          <div className="filter-tabs">
            <button className={statusFilter === 'all' ? 'active' : ''} onClick={() => setStatusFilter('all')}>Alle</button>
            <button className={statusFilter === 'open' ? 'active' : ''} onClick={() => setStatusFilter('open')}>Offen</button>
            <button className={statusFilter === 'progress' ? 'active' : ''} onClick={() => setStatusFilter('progress')}>In Arbeit</button>
            <button className={statusFilter === 'closed' ? 'active' : ''} onClick={() => setStatusFilter('closed')}>Erledigt</button>
          </div>

          <div className="search-bar">
            <Search size={18} />
            <input 
              type="text" 
              placeholder="Tickets suchen..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="ticket-list">
            {isLoading && tickets.length === 0 ? (
              <div style={{ padding: 40, textAlign: 'center' }}><Loader2 className="animate-spin" /></div>
            ) : filteredTickets.length === 0 ? (
              <div className="no-tickets-found">Keine Tickets gefunden.</div>
            ) : (
              filteredTickets.map((ticket) => (
                <div 
                  key={ticket.id} 
                  className={`ticket-item ${selectedTicket?.id === ticket.id ? 'active' : ''}`}
                  onClick={() => handleSelectTicket(ticket)}
                >
                  <div className="ticket-item-header">
                    <span className={`status-pill ${['closed', 'resolved'].includes(ticket.status) ? 'closed' : 'open'}`}>
                      {['closed', 'resolved'].includes(ticket.status) ? <CheckCircle2 size={12} /> : <Clock size={12} />}
                      {ticket.status}
                    </span>
                    <span className="ticket-date">{new Date(ticket.created_at).toLocaleDateString()}</span>
                  </div>
                  <p className="ticket-subject">{ticket.title}</p>
                  <p className="ticket-preview">Letztes Update: {new Date(ticket.updated_at || ticket.created_at).toLocaleDateString()}</p>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Main: Chat Interface */}
        <div className={`chat-main ${!selectedTicket ? 'hidden-mobile' : ''}`}>
          {selectedTicket ? (
            <div className="chat-container">
              <div className="chat-header">
                <button className="back-btn" onClick={() => setSelectedTicket(null)}><ChevronLeft size={24} /></button>
                <div>
                  <h4>{selectedTicket.title}</h4>
                  <p className="chat-status">Ticket #{selectedTicket.id.slice(0, 8).toUpperCase()} • {selectedTicket.priority}</p>
                </div>
              </div>

              <div className="messages-area">
                {messages.length > 0 ? (
                  messages.map((msg: any, i: number) => (
                    <div key={i} className={`message-wrapper ${msg.sender_id === user?.id ? 'sent' : 'received'}`}>
                      <div className="message-bubble">
                        {msg.role !== 'customer' && <span className="sender-name">{msg.first_name} {msg.last_name} (HED-IT)</span>}
                        
                        {msg.attachment_url ? (
                          <div className="attachment-preview">
                            <FileText size={20} />
                            <div className="attachment-info">
                              <p className="attachment-name">{msg.attachment_name}</p>
                              <a href={msg.attachment_url} target="_blank" rel="noopener noreferrer" className="download-link">Ansehen</a>
                            </div>
                          </div>
                        ) : (
                          <p className="message-text">{msg.message}</p>
                        )}
                        
                        <span className="message-time">{new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="empty-chat">
                    <p>Keine Nachrichten vorhanden. Schreiben Sie etwas!</p>
                  </div>
                )}
              </div>

              <form className="chat-input" onSubmit={handleSendMessage}>
                <input 
                  type="file" 
                  id="chat-file-input" 
                  style={{ display: 'none' }} 
                  onChange={handleFileUpload} 
                />
                <button type="button" className="btn-icon" onClick={() => document.getElementById('chat-file-input')?.click()}>
                  <Paperclip size={20} />
                </button>
                <input 
                  type="text" 
                  placeholder="Nachricht schreiben..." 
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                />
                <button type="submit" className="btn-icon primary" disabled={isLoading}>
                  {isLoading ? <Loader2 className="animate-spin" size={20} /> : <Send size={20} />}
                </button>
              </form>
            </div>
          ) : (
            <div className="no-ticket-selected">
              <TicketIcon size={64} className="text-muted" opacity={0.2} />
              <h4>Wähle ein Ticket aus</h4>
              <p>Wähle ein Ticket aus der Liste oder erstelle ein neues.</p>
              <button className="btn btn-primary" style={{ marginTop: 20 }} onClick={() => setShowCreateModal(true)}>
                <Plus size={20} /> Neues Ticket erstellen
              </button>
            </div>
          )}
        </div>
      </div>

      <AnimatePresence>
        {showCreateModal && (
          <div className="modal-overlay">
            <motion.div 
              className="modal-content ticket-modal"
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
            >
              <div className="modal-header">
                <h3>Neues Support-Ticket</h3>
                <button className="close-btn" onClick={() => setShowCreateModal(false)}><X size={20} /></button>
              </div>

              <form onSubmit={handleCreateTicket} className="create-ticket-form">
                <div className="form-group">
                  <label>Betreff</label>
                  <input 
                    type="text" 
                    required 
                    placeholder="Worum geht es?"
                    value={newTicket.title}
                    onChange={(e) => setNewTicket({...newTicket, title: e.target.value})}
                  />
                </div>
                <div className="form-group">
                  <label>Kategorie</label>
                  <select 
                    value={newTicket.type} 
                    onChange={(e) => setNewTicket({...newTicket, type: e.target.value})}
                    style={{ color: 'var(--text-main)', background: 'var(--bg-section)' }}
                  >
                    <option value="support" style={{ color: 'black' }}>Allgemeiner Support</option>
                    <option value="incident" style={{ color: 'black' }}>Störung / Fehler</option>
                    <option value="request" style={{ color: 'black' }}>Änderungswunsch</option>
                    <option value="billing" style={{ color: 'black' }}>Rechnungsfrage</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Priorität</label>
                  <select 
                    value={newTicket.priority} 
                    onChange={(e) => setNewTicket({...newTicket, priority: e.target.value})}
                    style={{ color: 'var(--text-main)', background: 'var(--bg-section)' }}
                  >
                    <option value="low" style={{ color: 'black' }}>Niedrig</option>
                    <option value="medium" style={{ color: 'black' }}>Mittel</option>
                    <option value="high" style={{ color: 'black' }}>Hoch</option>
                    <option value="critical" style={{ color: 'black' }}>Kritisch (Notfall)</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Beschreibung</label>
                  <textarea 
                    rows={5} 
                    required 
                    placeholder="Bitte beschreiben Sie Ihr Anliegen so detailliert wie möglich..."
                    value={newTicket.description}
                    onChange={(e) => setNewTicket({...newTicket, description: e.target.value})}
                  />
                </div>
                <div className="modal-actions" style={{ marginTop: 24 }}>
                  <button type="button" className="btn btn-outline" onClick={() => setShowCreateModal(false)}>Abbrechen</button>
                  <button type="submit" className="btn btn-primary" disabled={isLoading}>
                    {isLoading ? <Loader2 className="animate-spin" /> : 'Ticket erstellen'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <style>{`
        .portal-tickets { height: calc(100vh - var(--nav-height) - 80px); }
        .tickets-layout { display: grid; grid-template-columns: 350px 1fr; height: 100%; background: var(--bg-card); border: 1px solid var(--border); border-radius: 24px; overflow: hidden; }
        
        .tickets-sidebar { border-right: 1px solid var(--border); display: flex; flex-direction: column; background: #08080a; }
        .sidebar-header { padding: 24px; display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid var(--border); }
        .sidebar-header h3 { font-size: 18px; margin: 0; }

        .filter-tabs { display: flex; padding: 12px; gap: 8px; border-bottom: 1px solid var(--border); }
        .filter-tabs button { flex: 1; padding: 8px; border-radius: 8px; background: none; border: 1px solid transparent; color: var(--text-muted); cursor: pointer; font-size: 13px; font-weight: 600; transition: all 0.2s; }
        .filter-tabs button.active { background: var(--primary-glow); color: var(--primary); border-color: var(--primary-border); }
        
        .search-bar { padding: 12px 16px; display: flex; align-items: center; gap: 12px; color: var(--text-muted); border-bottom: 1px solid var(--border); background: rgba(0,0,0,0.2); margin: 12px; border-radius: 12px; }
        .search-bar input { background: none; border: none; color: white; width: 100%; outline: none; font-size: 14px; }

        .ticket-list { flex: 1; overflow-y: auto; }
        .no-tickets-found { padding: 40px; text-align: center; color: var(--text-muted); font-size: 14px; }
        .ticket-item { padding: 20px 24px; border-bottom: 1px solid var(--border); cursor: pointer; transition: background 0.3s; }
        .ticket-item:hover { background: rgba(255,255,255,0.02); }
        .ticket-item.active { background: rgba(0, 242, 255, 0.05); border-left: 4px solid var(--primary); }
        
        .ticket-item-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; }
        .status-pill { display: flex; align-items: center; gap: 4px; padding: 4px 8px; border-radius: 6px; font-size: 10px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.5px; }
        .status-pill.open { background: rgba(0, 242, 255, 0.1); color: var(--primary); }
        .status-pill.closed { background: rgba(16, 185, 129, 0.1); color: #10b981; }
        .ticket-date { font-size: 11px; color: var(--text-muted); }
        .ticket-subject { font-weight: 700; font-size: 15px; margin: 0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .ticket-preview { font-size: 12px; color: var(--text-muted); margin: 4px 0 0; }

        .chat-main { display: flex; flex-direction: column; height: 100%; position: relative; background: #020204; }
        .chat-container { display: flex; flex-direction: column; height: 100%; }
        .chat-header { padding: 24px; border-bottom: 1px solid var(--border); display: flex; align-items: center; gap: 16px; background: #08080a; }
        .chat-header h4 { margin: 0; font-size: 18px; }
        .chat-status { font-size: 12px; color: var(--text-muted); margin: 4px 0 0; }
        .back-btn { background: none; border: none; color: white; cursor: pointer; display: none; }

        .messages-area { flex: 1; padding: 32px; overflow-y: auto; display: flex; flex-direction: column; gap: 24px; }
        .empty-chat { flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 12px; color: var(--text-muted); }
        .message-wrapper { display: flex; flex-direction: column; max-width: 80%; }
        .message-wrapper.sent { align-self: flex-end; align-items: flex-end; }
        .message-wrapper.received { align-self: flex-start; align-items: flex-start; }
        
        .message-bubble { padding: 16px 20px; border-radius: 20px; position: relative; }
        .sent .message-bubble { background: var(--primary); color: #000; border-bottom-right-radius: 4px; }
        .received .message-bubble { background: rgba(255,255,255,0.05); color: white; border-bottom-left-radius: 4px; border: 1px solid var(--border); }
        
        .sender-name { font-size: 10px; font-weight: 800; text-transform: uppercase; margin-bottom: 6px; display: block; opacity: 0.7; letter-spacing: 0.5px; }
        .message-text { margin: 0; font-size: 15px; line-height: 1.6; }
        .message-time { font-size: 10px; margin-top: 8px; display: block; opacity: 0.6; }

        .attachment-preview { 
          display: flex; 
          align-items: center; 
          gap: 12px; 
          background: rgba(0,0,0,0.1); 
          padding: 12px 16px; 
          border-radius: 12px; 
          border: 1px solid rgba(255,255,255,0.1); 
          margin: 4px 0;
          min-width: 200px;
        }
        .attachment-info { display: flex; flex-direction: column; gap: 2px; }
        .attachment-name { font-size: 13px; font-weight: 600; margin: 0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 150px; }
        .download-link { font-size: 11px; color: var(--primary); text-decoration: none; font-weight: 800; text-transform: uppercase; letter-spacing: 0.5px; }
        .download-link:hover { text-decoration: underline; }

        .chat-input { padding: 24px; border-top: 1px solid var(--border); display: flex; gap: 16px; align-items: center; background: #08080a; }
        .chat-input input { flex: 1; background: rgba(255,255,255,0.03); border: 1px solid var(--border); border-radius: 12px; padding: 14px 20px; color: white; outline: none; font-size: 15px; }
        .chat-input input:focus { border-color: var(--primary); background: rgba(0,242,255,0.02); }
        
        .no-ticket-selected { flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 16px; color: var(--text-muted); text-align: center; }

        .modal-overlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.85); backdrop-filter: blur(10px); z-index: 2000; display: flex; align-items: center; justify-content: center; padding: 20px; }
        .modal-content { background: #08080a; border: 1px solid var(--border); border-radius: 32px; padding: 40px; max-width: 600px; width: 100%; position: relative; }
        .form-group { margin-bottom: 20px; display: flex; flex-direction: column; gap: 8px; }
        .form-group label { font-size: 13px; font-weight: 700; color: var(--text-muted); text-transform: uppercase; letter-spacing: 1px; }
        .form-group input, .form-group select, .form-group textarea { background: rgba(255,255,255,0.03); border: 1px solid var(--border); border-radius: 12px; padding: 14px; color: white; outline: none; font-family: inherit; }
        .form-group input:focus, .form-group select:focus, .form-group textarea:focus { border-color: var(--primary); }

        .btn-icon { width: 44px; height: 44px; border-radius: 12px; border: 1px solid var(--border); background: none; color: white; display: flex; align-items: center; justify-content: center; cursor: pointer; transition: all 0.2s; }
        .btn-icon:hover { background: rgba(255,255,255,0.05); }
        .btn-icon.primary { background: var(--primary); color: #000; border: none; }
        .btn-icon.primary:hover { transform: scale(1.05); }

        @media (max-width: 768px) {
          .tickets-layout { grid-template-columns: 1fr; }
          .hidden-mobile { display: none; }
          .back-btn { display: block; }
        }
      `}</style>
    </div>
  );
};

export default Tickets;
