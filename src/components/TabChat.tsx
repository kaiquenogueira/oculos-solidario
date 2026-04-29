import { useState, useEffect, useRef } from 'react';
import { User as UserIcon, Send, ChevronLeft } from 'lucide-react';
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

  // Scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Fetch Chat List
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
        // Group by user
        const map = new Map();
        data.forEach((m: any) => {
          const otherId = m.sender_id === user.id ? m.receiver_id : m.sender_id;
          if (!map.has(otherId)) {
            const otherName = m.sender_id === user.id ? m.receiver?.name : m.sender?.name;
            map.set(otherId, {
              id: otherId,
              name: otherName || `Usuário #${otherId.slice(0, 4)}`,
              lastMessage: m.content,
              time: new Date(m.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
              unread: !m.read && m.receiver_id === user.id,
            });
          }
        });
        setChats(Array.from(map.values()));
      }
    };
    fetchChats();
  }, [user, activeChat]);

  // Fetch Messages for Active Chat & Setup Realtime
  useEffect(() => {
    if (!user || !activeChat) return;

    const fetchMessages = async () => {
      const { data } = await supabase
        .from('messages')
        .select('*')
        .or(`and(sender_id.eq.${user.id},receiver_id.eq.${activeChat.id}),and(sender_id.eq.${activeChat.id},receiver_id.eq.${user.id})`)
        .order('created_at', { ascending: true });
      if (data) setMessages(data);

      // Mark as read
      await supabase.from('messages').update({ read: true }).eq('receiver_id', user.id).eq('sender_id', activeChat.id);
    };

    fetchMessages();

    // Subscribe to realtime
    const channel = supabase
      .channel('schema-db-changes')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages' }, (payload) => {
        const newMessage = payload.new;
        // Se a mensagem pertence à conversa atual
        if (
          (newMessage.sender_id === user.id && newMessage.receiver_id === activeChat.id) ||
          (newMessage.sender_id === activeChat.id && newMessage.receiver_id === user.id)
        ) {
          setMessages((prev) => [...prev, newMessage]);
          if (newMessage.receiver_id === user.id) {
            supabase.from('messages').update({ read: true }).eq('id', newMessage.id).then();
          }
        }
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, activeChat]);

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !user || !activeChat) return;

    const content = newMessage.trim();
    setNewMessage('');

    // Optimistic UI (optional, realtime will echo back if not careful, but usually we just await or let realtime handle it)
    // Here we just insert and rely on realtime to append, or append manually and ignore realtime self-echo.
    // For simplicity, we'll append manually and let realtime handle the receiver.
    const tempMsg = {
      id: crypto.randomUUID(),
      sender_id: user.id,
      receiver_id: activeChat.id,
      content,
      created_at: new Date().toISOString()
    };
    setMessages((prev) => [...prev, tempMsg]);

    await supabase.from('messages').insert({
      sender_id: user.id,
      receiver_id: activeChat.id,
      content
    });
  };

  if (activeChat) {
    return (
      <div className="flex flex-col h-full bg-slate-50 absolute inset-0 z-50">
        {/* Header */}
        <div className="bg-white p-4 flex items-center border-b border-slate-100 sticky top-0 z-10">
          <button onClick={() => onSelectChat(null)} className="p-2 -ml-2 text-slate-400">
            <ChevronLeft size={24} />
          </button>
          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center ml-2">
            <UserIcon size={20} className="text-blue-600" />
          </div>
          <h3 className="font-bold text-slate-800 ml-3">{activeChat.name}</h3>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 pb-24">
          {messages.map((msg) => {
            const isMe = msg.sender_id === user?.id;
            return (
              <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] rounded-2xl px-4 py-3 ${isMe ? 'bg-blue-600 text-white rounded-tr-sm' : 'bg-white text-slate-800 shadow-sm border border-slate-100 rounded-tl-sm'}`}>
                  <p className="text-sm">{msg.content}</p>
                  <span className={`text-[10px] block mt-1 ${isMe ? 'text-blue-200' : 'text-slate-400'}`}>
                    {new Date(msg.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                  </span>
                </div>
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-4 bg-white border-t border-slate-100 absolute bottom-0 left-0 right-0">
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Digite sua mensagem..."
              className="flex-1 bg-slate-100 border-none rounded-full py-3 px-4 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
            />
            <button 
              onClick={handleSendMessage}
              className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center shrink-0 shadow-lg"
            >
              <Send size={18} className="ml-1" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 pt-12 space-y-6 pb-24 h-full">
      <h1 className="text-2xl font-bold text-slate-800">Conversas</h1>
      
      {chats.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-slate-500 text-sm">Você ainda não tem mensagens.</p>
        </div>
      ) : (
        <div className="space-y-1">
          {chats.map((chat) => (
            <button 
              key={chat.id}
              onClick={() => onSelectChat(chat)}
              className="w-full flex items-center p-4 hover:bg-slate-100 transition-colors rounded-2xl group"
            >
              <div className="w-14 h-14 bg-slate-200 rounded-full flex items-center justify-center relative overflow-hidden">
                <UserIcon size={28} className="text-slate-400" />
                {chat.unread && <div className="absolute top-0 right-0 w-3 h-3 bg-blue-500 border-2 border-white rounded-full" />}
              </div>
              <div className="ml-4 flex-1 text-left">
                <div className="flex justify-between items-center">
                  <h4 className="font-bold text-slate-800">{chat.name}</h4>
                  <span className="text-[10px] text-slate-400">{chat.time}</span>
                </div>
                <p className={`text-sm truncate mt-0.5 ${chat.unread ? 'text-slate-800 font-semibold' : 'text-slate-500'}`}>
                  {chat.lastMessage}
                </p>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
