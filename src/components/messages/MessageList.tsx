import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAuthStore } from '../../store/authStore';
import { getMessages } from '../../services/messageService';

interface MessageListProps {
  recipientId: string;
}

export const MessageList: React.FC<MessageListProps> = ({ recipientId }) => {
  const { user } = useAuthStore();
  const messagesEndRef = React.useRef<HTMLDivElement>(null);

  const { data: messages = [] } = useQuery({
    queryKey: ['messages', recipientId],
    queryFn: () => getMessages(recipientId),
    refetchInterval: 5000,
  });

  React.useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4">
      {messages.map((message) => (
        <div
          key={message.id}
          className={`flex ${message.senderId === user?.id ? 'justify-end' : 'justify-start'}`}
        >
          <div
            className={`max-w-[70%] rounded-lg p-3 ${
              message.senderId === user?.id
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-100 text-gray-900'
            }`}
          >
            <p>{message.content}</p>
            <span className="text-xs opacity-75 mt-1 block">
              {new Date(message.createdAt).toLocaleTimeString()}
            </span>
          </div>
        </div>
      ))}
      <div ref={messagesEndRef} />
    </div>
  );
};