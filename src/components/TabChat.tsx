import { useState, useEffect, useRef } from 'react';
import { Send, ArrowLeft } from 'lucide-react';
import { createClient } from '../lib/supabase/client';
import { User } from '../store/useStore';

interface TabChatProps { user: User | null; activeChat: any | null; onSelectChat: (chat: any) => void; }

export function TabChat({ user, activeChat, onSelectChat }: TabChatProps) {
  const supabase = createClient();
  const [chats, setChats] = useState<any[]>([]);
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  useEffect(() => {
    if (!user || activeChat) return;
    const fetchChats = async () => {
      const { data } = await supabase.from('messages').select(`id, content, created_at, read, sender_id, receiver_id, sender:users!messages_sender_id_fkey(name), receiver:users!messages_receiver_id_fkey(name)`).or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`).order('created_at', { ascending: false });
      if (data) {
        const map = new Map();
        data.forEach((m: any) => {
          const otherId = m.sender_id === user.id ? m.receiver_id : m.sender_id;
          if (!map.has(otherId)) {
            const otherName = m.sender_id === user.id ? m.receiver?.name : m.sender?.name;
            map.set(otherId, { id: otherId, name: otherName || `Usuário #${otherId.slice(0, 4)}`, lastMessage: m.content, time: new Date(m.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), unread: !m.read && m.receiver_id === user.id });
          }
        });
        setChats(Array.from(map.values()));
      }
    };
    fetchChats();
  }, [user, activeChat]);

  useEffect(() => {
    if (!user || !activeChat) return;
    const fetchMessages = async () => {
      const { data } = await supabase.from('messages').select('*').or(`and(sender_id.eq.${user.id},receiver_id.eq.${activeChat.id}),and(sender_id.eq.${activeChat.id},receiver_id.eq.${user.id})`).order('created_at', { ascending: true });
      if (data) setMessages(data);
      await supabase.from('messages').update({ read: true }).eq('receiver_id', user.id).eq('sender_id', activeChat.id);
    };
    fetchMessages();
    const channel = supabase.channel('schema-db-changes').on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages' }, (payload) => {
      const m = payload.new;
      if ((m.sender_id === user.id && m.receiver_id === activeChat.id) || (m.sender_id === activeChat.id && m.receiver_id === user.id)) {
        setMessages((prev) => [...prev, m]);
        if (m.receiver_id === user.id) { supabase.from('messages').update({ read: true }).eq('id', m.id).then(); }
      }
    }).subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [user, activeChat]);

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !user || !activeChat) return;
    const content = newMessage.trim();
    setNewMessage('');
    setMessages((prev) => [...prev, { id: crypto.randomUUID(), sender_id: user.id, receiver_id: activeChat.id, content, created_at: new Date().toISOString() }]);
    await supabase.from('messages').insert({ sender_id: user.id, receiver_id: activeChat.id, content });
  };

  if (activeChat) {
    return (
      <div className="flex flex-col h-full absolute inset-0 z-50" style={{ background: 'var(--color-paper)' }}>
        <header className="px-5 safe-top pt-3 pb-3 flex items-center gap-3 sticky top-0 z-10" style={{ background: 'rgba(250,246,240,0.92)', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(26,22,18,0.08)' }}>
          <button onClick={() => onSelectChat(null)} className="w-10 h-10 flex items-center justify-center rounded-full" style={{ background: 'var(--color-paper-2)' }} aria-label="Voltar">
            <ArrowLeft size={18} strokeWidth={1.6} style={{ color: 'var(--color-ink)' }} />
          </button>
          <div className="flex-1">
            <span className="kicker" style={{ fontSize: '10px' }}>Correspondência</span>
            <h3 className="font-display text-lg leading-tight" style={{ color: 'var(--color-ink)' }}>{activeChat.name}</h3>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3 pb-28">
          {messages.map((msg) => {
            const isMe = msg.sender_id === user?.id;
            return (
              <div key={msg.id} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                <span className="text-xs mb-1" style={{ color: 'var(--color-ink-4)', fontFamily: 'var(--font-mono)', fontSize: '10px' }}>
                  {isMe ? 'eu' : '—'} · {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
                <div className="max-w-[82%] px-4 py-3" style={{ background: isMe ? 'var(--color-ink)' : 'var(--color-paper-2)', color: isMe ? 'var(--color-paper)' : 'var(--color-ink)', borderRadius: isMe ? '18px 18px 4px 18px' : '18px 18px 18px 4px' }}>
                  <p className="text-sm leading-relaxed" style={{ fontFamily: 'var(--font-display)' }}>{msg.content}</p>
                </div>
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>

        <div className="absolute bottom-0 left-0 right-0 px-4 py-3 safe-bottom flex items-center gap-3" style={{ background: 'rgba(250,246,240,0.92)', backdropFilter: 'blur(20px)', borderTop: '1px solid rgba(26,22,18,0.08)' }}>
          <input type="text" value={newMessage} onChange={(e) => setNewMessage(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()} placeholder="Escrever mensagem…" className="field-paper flex-1" style={{ padding: '10px 16px' }} />
          <button onClick={handleSendMessage} className="w-11 h-11 flex items-center justify-center shrink-0 rounded-full" style={{ background: 'var(--color-rust)', color: 'var(--color-paper)' }} aria-label="Enviar">
            <Send size={16} strokeWidth={1.8} />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="px-5 safe-top pt-4 pb-32">
      <header className="mb-5">
        <span className="kicker">Caixa postal</span>
        <h1 className="serif-display text-4xl mt-1" style={{ color: 'var(--color-ink)' }}><span className="italic" style={{ color: 'var(--color-rust)' }}>Cartas</span> trocadas.</h1>
      </header>

      {chats.length === 0 ? (
        <div className="rounded-2xl p-10 text-center" style={{ background: 'var(--color-paper-2)' }}>
          <span className="eye-mark text-4xl" style={{ color: 'var(--color-ink-4)' }}>—∅—</span>
          <p className="font-display italic mt-3 text-sm" style={{ color: 'var(--color-ink-3)' }}>Você ainda não tem mensagens.</p>
        </div>
      ) : (
        <ul className="space-y-2">
          {chats.map((chat) => (
            <li key={chat.id}>
              <button onClick={() => onSelectChat(chat)} className="w-full text-left p-4 rounded-xl flex items-center gap-4 group transition-colors" style={{ background: chat.unread ? 'var(--color-rust-bg)' : 'transparent' }}>
                <div className="w-12 h-12 rounded-full flex items-center justify-center shrink-0" style={{ background: chat.unread ? 'var(--color-rust)' : 'var(--color-paper-3)', color: chat.unread ? 'var(--color-paper)' : 'var(--color-ink-3)' }}>
                  <span className="font-display text-lg">{chat.name[0]?.toUpperCase()}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-0.5">
                    <h4 className="font-display text-base leading-tight" style={{ color: 'var(--color-ink)', fontWeight: chat.unread ? 600 : 400 }}>{chat.name}</h4>
                    <span className="text-xs" style={{ color: 'var(--color-ink-4)', fontFamily: 'var(--font-mono)', fontSize: '10px' }}>{chat.time}</span>
                  </div>
                  <p className="text-sm truncate" style={{ color: chat.unread ? 'var(--color-ink-2)' : 'var(--color-ink-3)' }}>{chat.lastMessage}</p>
                </div>
                {chat.unread && <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: 'var(--color-rust)' }} />}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
