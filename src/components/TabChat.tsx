import { User } from 'lucide-react';

interface TabChatProps {
  onSelectChat: (chat: any) => void;
}

export function TabChat({ onSelectChat }: TabChatProps) {
  const chats = [
    { id: '1', name: 'Ricardo Oliveira', lastMessage: 'Olá! Ainda está disponível?', time: '14:20', unread: true },
    { id: '2', name: 'Letícia Souza', lastMessage: 'Obrigada pela doação!', time: 'Ontem', unread: false },
    { id: '3', name: 'Marcos Santos', lastMessage: 'Podemos combinar a entrega?', time: 'Terça', unread: false },
  ];

  return (
    <div className="px-4 pt-12 space-y-6">
      <h1 className="text-2xl font-bold text-slate-800">Conversas</h1>
      <div className="space-y-1">
        {chats.map((chat) => (
          <button 
            key={chat.id}
            onClick={() => onSelectChat(chat)}
            className="w-full flex items-center p-4 hover:bg-slate-100 transition-colors rounded-2xl group"
          >
            <div className="w-14 h-14 bg-slate-200 rounded-full flex items-center justify-center relative overflow-hidden">
              <User size={28} className="text-slate-400" />
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
    </div>
  );
}
