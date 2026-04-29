import { useState, useEffect, useRef } from 'react';
import { Send, ArrowLeft } from 'lucide-react';
import { createClient } from '../lib/supabase/client';
import { User } from '../store/useStore';

interface TabChatProps {
  user: User | null;
  activeChat: any | null;
  onSelectChat: (chat: any) => void;
}

export function TabChat({ user, activeChat, onSelectChat }: TabChatProps) {
  const supabase = createClient();
  const [chats, setChats] = useState<any[]>([]);
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (!user || activeChat) return;
    const fetchChats = async () => {
      const { data } = await supabase
        .from('messages')
        .select(`
          id, content, created_at, read, sender_id, receiver_id,
          sender:users!messages_sender_id_fkey(name),
          receiver:users!messages_receiver_id_fkey(name)
        `)
        .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`)
        .order('created_at', { ascending: false });

      if (data) {
        const map = new Map();
        data.forEach((m: any) => {
          const otherId = m.sender_id === user.id ? m.receiver_id : m.sender_id;
          if (!map.has(otherId)) {
            const otherName = m.sender_id === user.id ? m.receiver?.name : m.sender?.name;
            map.set(otherId, {
              id: otherId,
              name: otherName || `Usuário #${otherId.slice(0, 4)}`,
              lastMessage: m.content,
              time: new Date(m.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              unread: !m.read && m.receiver_id === user.id,
            });
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
      const { data } = await supabase
        .from('messages')
        .select('*')
        .or(`and(sender_id.eq.${user.id},receiver_id.eq.${activeChat.id}),and(sender_id.eq.${activeChat.id},receiver_id.eq.${user.id})`)
        .order('created_at', { ascending: true });
      if (data) setMessages(data);
      await supabase.from('messages').update({ read: true }).eq('receiver_id', user.id).eq('sender_id', activeChat.id);
    };
    fetchMessages();

    const channel = supabase
      .channel('schema-db-changes')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages' }, (payload) => {
        const m = payload.new;
        if ((m.sender_id === user.id && m.receiver_id === activeChat.id) ||
            (m.sender_id === activeChat.id && m.receiver_id === user.id)) {
          setMessages((prev) => [...prev, m]);
          if (m.receiver_id === user.id) {
            supabase.from('messages').update({ read: true }).eq('id', m.id).then();
          }
        }
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [user, activeChat]);

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !user || !activeChat) return;
    const content = newMessage.trim();
    setNewMessage('');
    const tempMsg = {
      id: crypto.randomUUID(),
      sender_id: user.id,
      receiver_id: activeChat.id,
      content,
      created_at: new Date().toISOString()
    };
    setMessages((prev) => [...prev, tempMsg]);
    await supabase.from('messages').insert({ sender_id: user.id, receiver_id: activeChat.id, content });
  };

  // ─── Conversation view ───
  if (activeChat) {
    return (
      <div className="flex flex-col h-full absolute inset-0 z-50 paper-grain" style={{ background: 'var(--color-paper)' }}>
        <header
          className="px-5 pt-10 pb-4 flex items-center gap-3 sticky top-0 z-10 relative"
          style={{ background: 'var(--color-paper)', borderBottom: '1px solid rgba(26,22,18,0.18)' }}
        >
          <button onClick={() => onSelectChat(null)} className="p-1 -ml-1" aria-label="Voltar">
            <ArrowLeft size={18} strokeWidth={1.5} style={{ color: 'var(--color-ink)' }} />
          </button>
          <div className="flex-1">
            <span className="kicker">Correspondência</span>
            <h3 className="font-display text-[20px] leading-tight mt-0.5" style={{ color: 'var(--color-ink)' }}>
              {activeChat.name}
            </h3>
          </div>
          <span className="numeral text-[10px]" style={{ color: 'var(--color-ink-4)' }}>
            #{String(activeChat.id || '').slice(0, 4).toUpperCase()}
          </span>
        </header>

        <div className="flex-1 overflow-y-auto px-5 py-6 space-y-5 pb-28 relative z-10">
          {messages.map((msg) => {
            const isMe = msg.sender_id === user?.id;
            return (
              <div key={msg.id} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                <span
                  className="font-mono text-[9px] tracking-[0.18em] uppercase mb-1"
                  style={{ color: 'var(--color-ink-4)' }}
                >
                  {isMe ? 'eu' : '— '}
                  · {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
                <div
                  className="max-w-[85%] px-4 py-3 paper-edge"
                  style={{
                    background: isMe ? 'var(--color-ink)' : 'var(--color-paper)',
                    color: isMe ? 'var(--color-paper)' : 'var(--color-ink)',
                    border: isMe ? 'none' : '1px solid rgba(26,22,18,0.15)',
                  }}
                >
                  <p className="font-display text-[15px] leading-snug">{msg.content}</p>
                </div>
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>

        <div
          className="absolute bottom-0 left-0 right-0 px-5 py-4 flex items-center gap-3"
          style={{ background: 'var(--color-paper)', borderTop: '1px solid rgba(26,22,18,0.18)' }}
        >
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder="Escrever mensagem…"
            className="field-paper flex-1"
            style={{ paddingTop: 8, paddingBottom: 8 }}
          />
          <button
            onClick={handleSendMessage}
            className="w-10 h-10 flex items-center justify-center shrink-0"
            style={{ background: 'var(--color-rust)', color: 'var(--color-paper)' }}
            aria-label="Enviar"
          >
            <Send size={14} strokeWidth={1.8} />
          </button>
        </div>
      </div>
    );
  }

  // ─── Inbox list ───
  return (
    <div className="px-6 pt-10 pb-28">
      <header className="mb-5">
        <span className="kicker">Caixa postal</span>
        <h1 className="serif-display text-[44px] mt-1" style={{ color: 'var(--color-ink)' }}>
          <span className="italic" style={{ color: 'var(--color-rust)' }}>Cartas</span>{' '}trocadas.
        </h1>
      </header>
      <div className="rule-double mb-6"></div>

      {chats.length === 0 ? (
        <div className="hairline p-10 text-center" style={{ background: 'var(--color-paper-2)' }}>
          <span className="eye-mark text-[42px]" style={{ color: 'var(--color-ink-4)' }}>—∅—</span>
          <p className="font-display italic mt-3" style={{ color: 'var(--color-ink-3)' }}>
            Você ainda não tem mensagens.
          </p>
        </div>
      ) : (
        <ul>
          {chats.map((chat, i) => (
            <li key={chat.id}>
              <button
                onClick={() => onSelectChat(chat)}
                className="w-full text-left py-5 grid grid-cols-[28px_1fr_auto] items-baseline gap-4 group transition-colors hover:bg-[var(--color-paper-2)]"
                style={{ borderBottom: '1px solid rgba(26,22,18,0.12)' }}
              >
                <span className="numeral text-[10px]" style={{ color: 'var(--color-ink-4)' }}>
                  {String(i + 1).padStart(2, '0')}
                </span>
                <div className="min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <h4 className="font-display text-[19px] leading-tight" style={{ color: 'var(--color-ink)' }}>
                      {chat.name}
                    </h4>
                    {chat.unread && (
                      <span className="w-1.5 h-1.5 rounded-full" style={{ background: 'var(--color-rust)' }} />
                    )}
                  </div>
                  <p
                    className="text-[13px] truncate"
                    style={{ color: chat.unread ? 'var(--color-ink-2)' : 'var(--color-ink-3)' }}
                  >
                    {chat.lastMessage}
                  </p>
                </div>
                <span className="numeral text-[10px] self-start" style={{ color: 'var(--color-ink-4)' }}>
                  {chat.time}
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
